from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('CITY', 'City'),
        ('COMPANY', 'Company'),
        ('CITIZEN', 'Citizen'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    organization_name = models.CharField(max_length=100, blank=True)

class Tender(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    submission_deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('OPEN', 'Open'),
            ('CLOSED', 'Closed'),
            ('AWARDED', 'Awarded')
        ],
        default='OPEN'
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

class Bid(models.Model):
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE, related_name='bids')
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    bid_amount = models.DecimalField(max_digits=12, decimal_places=2)
    documents = models.FileField(upload_to='bid_documents/')
    submission_date = models.DateTimeField(auto_now_add=True)
    is_winner = models.BooleanField(default=False)
