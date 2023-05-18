from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('deal-card-editor/admin/', admin.site.urls),
    path('deal-card-editor/dealcardapp/', include('dealcardapp.urls', namespace='dealcardapp')),
]
