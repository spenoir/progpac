import hashlib
import time

from django.db import models


class Level(models.Model):
    hash = models.CharField(max_length=40, unique=True, primary_key=True)
    name = models.CharField(max_length=64)
    content = models.TextField()
    points = models.IntegerField()
    maxsize = models.IntegerField()

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
        return ('level', [self.hash])

    def save(self, *args, **kwargs):
        if not self.pk:
            self.hash = hashlib.sha1(str(time.time())).hexdigest()[:10]
        super(Level, self).save(*args, **kwargs)
        
