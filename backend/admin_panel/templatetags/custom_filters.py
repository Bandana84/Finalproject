from django import template
from django.db.models import Q
from django.db.models import Sum, F

register = template.Library()

@register.filter
def filter_in_stock(queryset):
    """Filter queryset to only include items with in_stock products."""
    if hasattr(queryset, 'filter'):
        return queryset.filter(product__in_stock=True)
    return queryset

@register.filter
def calculate_total(queryset):
    if hasattr(queryset, 'aggregate'):
        total = queryset.aggregate(
            total=Sum(F('quantity') * F('price'))
        )['total']
        return total or 0
    return 0

@register.filter
@template.defaultfilters.stringfilter
def subtract(value, arg):
    try:
        return int(value) - int(arg)
    except (ValueError, TypeError):
        return 0
