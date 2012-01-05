import hashlib

from django.db import models

class Bug(object):

    def __init__(self, level):
        self.level = level
        self.dots = level.dots
        self.position = level.start
        self.direction = 0

    @property
    def real_direction(self):
        return self.direction % 4

    def move(self, move):
        if move == "s":
            return self.step_forward()
        elif move == "r":
            return self.turn_right()
        elif move == "l":
            return self.turn_left()
        
    def step_forward(self):
        moves = (
            (-1, 0), (0, 1), (1, 0), (0, -1)
        )
        next_move = moves[self.real_direction]
        next_step = self.level.get(
            self.position[0] + next_move[0],
            self.position[1] + next_move[1]
        )

        if next_step in (".", "o"):
            
            self.position = (
                self.position[0] + next_move[0],
                self.position[1] + next_move[1]
            )
            if next_step == "o":
                self.level.lines[self.position[0]][self.position[1]] = "."
                self.dots.remove(self.position)
                if not self.dots:
                    return "s@"
            return "s"
            
        else:
            return "x"

    def turn_left(self):
        self.direction-=1
        return "l"

    def turn_right(self):
        self.direction+=1
        return "r"


class Level(models.Model):
    hash = models.CharField(max_length=40, unique=True, db_index=True)
    name = models.CharField(max_length=64)
    content = models.TextField()
    points = models.IntegerField()
    maxsize = models.IntegerField()

    def __init__(self, *args, **kwargs):
        super(Level, self).__init__(*args, **kwargs)
        self.lines = [map(str, line) for line in self.content.split("\n")]

    def get(self, x, y):
        if x >= 0 and y >= 0:
            try:
                return self.lines[x][y]
            except IndexError:
                pass
        return None
        
    @property
    def start(self):
        for i, line in enumerate(self.lines):
            try:
                index = line.index("u")
                return (i, index)
            except ValueError:
                pass

    @property
    def dots(self):
        dots = []
        for y, line in enumerate(self.lines):
            for x, element in enumerate(line):
                if element == "o":
                    dots.append((y, x))
        return dots

    @property
    def next(self):
        n = False
        for level in Level.objects.all():
            if n == True:
                return level
            if level == self:
                n = True
        return None

    def all_previous(self):
        return Level.objects.filter(id__lte=self.pk)
        
    @models.permalink
    def get_absolute_url(self):
        return ('level', [self.hash])

    def save(self, *args, **kwargs):
        if not self.pk:
            self.hash = hashlib.sha1(self.content).hexdigest()[:10]
        super(Level, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.name

    def best_result(self):
        try:
            return Result.objects.filter(level=self).order_by('program_length')[0]
        except IndexError:
            return None

class Result(models.Model):
    level = models.ForeignKey('Level')
    program = models.TextField()
    program_length = models.IntegerField()

    username = models.CharField(max_length=16, blank=True)
    email = models.EmailField(blank=True)
    commited = models.DateTimeField(auto_now_add=True)

    def gravatar(self):
        if self.email:
            import hashlib
            return hashlib.md5(self.email).hexdigest()
        return ""
    
    def __unicode__(self):
        return "%s:%s" % (self.level.name, self.program_length)
