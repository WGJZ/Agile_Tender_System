from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    TenderViewSet, BidViewSet, UserRegistrationView, UserLoginView, UserLogoutView,
    TenderListCreateView, TenderDetailView,
    BidCreateView, BidListView, BidDetailView,
    health_check
)

router = DefaultRouter()
router.register(r'tenders', TenderViewSet)
router.register(r'bids', BidViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('health/', health_check, name='health_check'),
]

# DefaultRouter automatically creates URLs for all actions on ViewSets
# The custom action my_bids will be accessible at /api/bids/my_bids/ 