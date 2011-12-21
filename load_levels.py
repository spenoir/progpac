import os
import sys
import re
from django.core.management import setup_environ
import settings

setup_environ(settings)

from progpac.models import Level

def sorted_nicely( l ): 
    """ Sort the given iterable in the way that humans expect.""" 
    convert = lambda text: int(text) if text.isdigit() else text 
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ] 
    return sorted(l, key = alphanum_key)

if len(sys.argv) > 1:
    directory = sys.argv[1]
    Level.objects.all().delete()
    for f in sorted_nicely(os.listdir(sys.argv[1])):
        level_lines = open(os.path.join(directory, f)).readlines()[:25]
        content = [line.rstrip() for line in level_lines]
        name = f.rstrip(".txt")
        content = "\n".join(content)


        
        Level.objects.create(
            name=name,
            content=content
        )