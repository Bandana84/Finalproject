# Generated by Django 5.2 on 2025-04-29 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0003_alter_otptoken_otp_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otptoken',
            name='otp_code',
            field=models.CharField(default='7226bd', max_length=6),
        ),
    ]
