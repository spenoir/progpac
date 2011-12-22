from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from progpac import views

urlpatterns = patterns('',
    url(r'^(?P<level_name>\w+)/$', views.Home.as_view(), name='home')
)
urlpatterns += staticfiles_urlpatterns()
