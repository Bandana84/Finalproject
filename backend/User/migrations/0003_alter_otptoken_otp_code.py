# Generated by Django 5.2 on 2025-04-29 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0002_otptoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otptoken',
            name='otp_code',
            field=models.CharField(default='4e5b38', max_length=6),
        ),
    ]
