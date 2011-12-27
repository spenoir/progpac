from django.db import models


class Level(models.Model):
    name = models.CharField(max_length=64)
    content = models.TextField()

    @property
    def lines(self):
        return self.content.split("\n")

    @property
    def next(self):
        n = False
        for level in Level.objects.all():
            if n == True:
                return level
            if level == self:
                n = True
        return None
    
    @models.permalink
    def get_absolute_url(self):
        return ('level', [str(self.name)])
