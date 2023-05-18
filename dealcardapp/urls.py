from django.urls import include, path
from rest_framework import routers


from .views import (InstallApiView, IndexApiView)


app_name = 'dealcardapp'
router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    path('install/', InstallApiView.as_view()),                     # установка приложения
    path('index/', IndexApiView.as_view()),                         # обработчик приложения

]


urlpatterns += router.urls


