from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    TenderViewSet, BidViewSet, UserRegistrationView, login,
    health_check, public_tenders
)

router = DefaultRouter()
router.register(r'tenders', TenderViewSet)
router.register(r'bids', BidViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', login, name='login'),
    path('health/', health_check, name='health_check'),
    path('tenders/public/', public_tenders, name='public_tenders'),
]

# DefaultRouter automatically creates URLs for all actions on ViewSets
# The custom action my_bids will be accessible at /api/bids/my_bids/ 