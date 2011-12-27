from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from progpac import views

urlpatterns = patterns('',
    url(r'^$', views.Home.as_view(), name='home'),
    url(r'^help/$', views.Help.as_view(), name='help'),
    url(r'^(?P<level_hash>\w+)/$', views.Level.as_view(), name='level')
)
urlpatterns += staticfiles_urlpatterns()
