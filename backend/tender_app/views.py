from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Tender, Bid
from .serializers import UserSerializer, TenderSerializer, BidSerializer
from django.db import transaction

# Create your views here.

class IsCityUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'CITY'

class IsCompanyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'COMPANY'

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    try:
        # 获取请求数据
        username = request.data.get('username')
        password = request.data.get('password')
        user_type = request.data.get('user_type')

        # 验证数据
        if not all([username, password, user_type]):
            return Response(
                {'message': 'Please provide username, password and user type'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 检查用户名是否已存在
        if User.objects.filter(username=username).exists():
            return Response(
                {'message': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 创建用户
        user = User.objects.create_user(
            username=username,
            password=password,
            user_type=user_type.upper()  # 确保使用大写
        )

        # 创建 JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Registration error: {str(e)}")  # 添加调试日志
        return Response(
            {'message': str(e)},  # 返回具体错误信息以便调试
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': user.user_type
            })
        return Response(
            {'message': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        print(f"Login error: {str(e)}")  # 添加调试日志
        return Response(
            {'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            })
        return Response({'error': 'Invalid credentials'}, 
                      status=status.HTTP_401_UNAUTHORIZED)

class TenderViewSet(viewsets.ModelViewSet):
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsCityUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsCompanyUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[IsCityUser])
    def select_winner(self, request, pk=None):
        bid = self.get_object()
        tender = bid.tender
        
        # 将所有投标设置为非中标
        tender.bids.all().update(is_winner=False)
        
        # 设置当前投标为中标
        bid.is_winner = True
        bid.save()
        
        # 更新招标状态
        tender.status = 'AWARDED'
        tender.save()
        
        return Response({'status': 'winner selected'})
