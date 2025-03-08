from rest_framework import serializers
from .models import User, Tender, Bid

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'user_type', 'organization_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            user_type=validated_data['user_type'],
            organization_name=validated_data.get('organization_name', '')
        )
        return user

class TenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tender
        fields = '__all__'

class BidSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.organization_name', read_only=True)
    
    class Meta:
        model = Bid
        fields = '__all__' 