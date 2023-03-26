from glob import glob
from os import system
from random import random
from time import sleep
dir = 'D:\Program Files\Piano\EveryonePiano\Music\\'
list = glob(dir+'*.eop')
l = len(list)
s = ''
while 1:
    s='EveryonePiano.exe "%s"' % (list[int(random()*l)])
    print(s)
    system(s)
    sleep(150)
