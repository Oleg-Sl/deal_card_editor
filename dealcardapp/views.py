from rest_framework import views, viewsets, filters, status
from django.views.decorators.clickjacking import xframe_options_exempt
from django.shortcuts import render
from rest_framework.response import Response
import re
from threading import Thread

from .service.bitrix24 import secrets
from .service import task_update_order

class InstallApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        return render(request, 'install.html')


# Обработчик установленного приложения
class IndexApiView(views.APIView):
    @xframe_options_exempt
    def post(self, request):
        r = request.data.get("PLACEMENT_OPTIONS", [])
        id_deal = re.search(r'\d+', r)[0]
        data = {"id": id_deal,}
        return render(request, 'index.html', context=data)

    @xframe_options_exempt
    def get(self, request):
        data = {"id": 999}
        return render(request, 'index.html', context=data)


class UpdateTaskOrderApiView(views.APIView):

    def post(self, request):
        task_id = request.query_params.get("task_id", None)
        deal_id = request.query_params.get("deal_id", None)
        application_token = request.query_params.get("token", None)

        if not task_id:
            return Response("Not transferred ID task", status=status.HTTP_400_BAD_REQUEST)

        if not deal_id:
            return Response("Not transferred ID deal", status=status.HTTP_400_BAD_REQUEST)

        if secrets.get_secrets_value("token") != application_token:
            return Response("Unverified request", status=status.HTTP_400_BAD_REQUEST)

        # task_update_order.update(task_id, deal_id)
        thr = Thread(target=task_update_order.run, args=(task_id, deal_id,))
        thr.start()

        return Response("Обновление задачи заказ началось", status=status.HTTP_200_OK)


# [2022-03-10 04:17:53,659] I <QueryDict:
# {
#     'DOMAIN': ['bits24.bitrix24.ru'],
#     'PROTOCOL': ['1'],
#     'LANG': ['ru'],
#     'APP_SID': ['604ecb7a560585cdf9b7560e84dc04b9']
# }>
# [2022-03-10 04:17:53,660] I <QueryDict:
# {
#     'AUTH_ID': ['018a2962005a10380054d65200000009403803660351dea407bb5d558171bb682ff064'],
#     'AUTH_EXPIRES': ['3600'],
#     'REFRESH_ID': ['f1085162005a10380054d6520000000940380340e011d5999468105b004ac445730927'],
#     'member_id': ['e7ea7834c1e27b4e529de3a7eb8e8b3b'],
#     'status': ['L'],
#     'PLACEMENT': ['CRM_DEAL_DETAIL_TAB'],
#     'PLACEMENT_OPTIONS': ['{"ID":"265"}']
# }>













