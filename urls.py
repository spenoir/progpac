from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from . import views

urlpatterns = patterns('',
    url(r'^$', views.Home.as_view(), name='home')
)
urlpatterns += staticfiles_urlpatterns()
