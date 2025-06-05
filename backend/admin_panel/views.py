from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.views.decorators.csrf import csrf_protect
from django.db.models import Q
from products.models import Product, Banner, ProductImage, Review
from carts.models import Order, Cart
from User.models import CustomUser
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from contacts.models import ContactSubmission
from django.http import JsonResponse

@csrf_protect
def admin_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None and user.is_staff:
            login(request, user)
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions')
    
    return render(request, 'admin_panel/login.html')

@login_required
def admin_logout(request):
    logout(request)
    return redirect('admin_login')

@login_required
def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    context = {
        'product_count': Product.objects.count(),
        'active_orders_count': Order.objects.filter(status__in=['Pending', 'Processing']).count(),
        'user_count': CustomUser.objects.count(),
        'active_banners_count': Banner.objects.filter(is_active=True).count(),
        'active_carts_count': Cart.objects.count(),
        'recent_orders': Order.objects.all().order_by('-created_at')[:5],
    }
    return render(request, 'admin_panel/dashboard.html', context)

@login_required
def product_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    search_query = request.GET.get('search', '')
    products = Product.objects.prefetch_related('images').order_by('-created_at')
    
    if search_query:
        products = products.filter(
            name__icontains=search_query
        )
    
    return render(request, 'admin_panel/product_list.html', {
        'products': products,
        'search_query': search_query
    })

@login_required
def product_add(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    if request.method == 'POST':
        # Handle product creation
        name = request.POST.get('name')
        price = request.POST.get('price')
        offer_price = request.POST.get('offer_price', price)  # Default to regular price if not provided
        category = request.POST.get('category')
        description = request.POST.get('description')
        in_stock = request.POST.get('in_stock') == 'on'
        
        product = Product.objects.create(
            name=name,
            price=price,
            offer_price=offer_price,
            category=category,
            description=description,
            in_stock=in_stock
        )
        
        # Handle multiple images
        images = request.FILES.getlist('images')
        for image in images:
            ProductImage.objects.create(product=product, image=image)
        
        messages.success(request, 'Product created successfully!')
        return redirect('admin_products')
    
    # Pass category choices to the template
    categories = [{'id': choice[0], 'name': choice[1]} for choice in Product.CATEGORY_CHOICES]
    return render(request, 'admin_panel/product_form.html', {'categories': categories, 'action': 'Add'})

@login_required
def reviews_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', '')
    rating_filter = request.GET.get('rating', '')
    
    reviews = Review.objects.select_related('product', 'user').order_by('-created_at')
    
    if search_query:
        reviews = reviews.filter(
            Q(product__name__icontains=search_query) |
            Q(user__username__icontains=search_query) |
            Q(text__icontains=search_query)
        )
    
    if status_filter:
        reviews = reviews.filter(status=status_filter)
    
    if rating_filter:
        reviews = reviews.filter(rating=rating_filter)
    
    return render(request, 'admin_panel/reviews.html', {
        'reviews': reviews,
        'search_query': search_query,
        'status_filter': status_filter,
        'rating_filter': rating_filter
    })



@login_required
def export_reviews(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    reviews = Review.objects.select_related('product', 'user').all()
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reviews_export.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Product', 'User', 'Rating', 'Review Text', 'Status', 'Created At'])
    
    for review in reviews:
        writer.writerow([
            review.product.name,
            review.user.username,
            review.rating,
            review.text,
            review.status,
            review.created_at.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    return response

@login_required
def delete_review(request, review_id):
    if not request.user.is_staff:
        return JsonResponse(
            {'success': False, 'error': 'Unauthorized'}, 
            status=403,
            safe=False
        )
    
    if request.method != 'POST':
        return JsonResponse(
            {'success': False, 'error': 'Invalid request method'}, 
            status=405,
            safe=False
        )
    
    try:
        # Get the review
        review = Review.objects.get(id=review_id)
        
        # Delete the review
        review.delete()
        
        # Return success response
        return JsonResponse(
            {'success': True, 'message': 'Review deleted successfully'},
            safe=False
        )
    except Review.DoesNotExist:
        return JsonResponse(
            {'success': False, 'error': 'Review not found'}, 
            status=404,
            safe=False
        )
    except Exception as e:
        return JsonResponse(
            {'success': False, 'error': str(e)}, 
            status=500,
            safe=False
        )

@login_required
def reviews_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    status_filter = request.GET.get('status', '')
    rating_filter = request.GET.get('rating', '')
    search_query = request.GET.get('search', '')
    
    reviews = Review.objects.all()
    
    # Apply filters
    if status_filter:
        reviews = reviews.filter(status=status_filter)
    if rating_filter:
        reviews = reviews.filter(rating=rating_filter)
    if search_query:
        reviews = reviews.filter(
            Q(product__name__icontains=search_query) |
            Q(user__username__icontains=search_query) |
            Q(text__icontains=search_query)
        )
    
    context = {
        'reviews': reviews,
        'status_filter': status_filter,
        'rating_filter': rating_filter
    }
    return render(request, 'admin_panel/reviews.html', context)

@login_required
def product_edit(request, product_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        # Handle product update
        product.name = request.POST.get('name')
        product.price = request.POST.get('price')
        product.offer_price = request.POST.get('offer_price')
        product.category = request.POST.get('category')
        product.description = request.POST.get('description')
        product.in_stock = request.POST.get('in_stock') == 'on'
        product.unit = request.POST.get('unit')
        
        try:
            # Validate price and offer price
            product.price = float(product.price)
            product.offer_price = float(product.offer_price)
            
            # Handle multiple images
            images = request.FILES.getlist('images')
            if images:
                # Delete existing images if requested
                if request.POST.get('clear_images') == 'on':
                    product.images.all().delete()
                
                # Add new images
                for image in images:
                    ProductImage.objects.create(product=product, image=image)
            
            product.save()
            messages.success(request, 'Product updated successfully!')
            return redirect('admin_products')
            
        except ValueError:
            messages.error(request, 'Please enter valid numbers for price and offer price')
        except Exception as e:
            messages.error(request, f'Error updating product: {str(e)}')
    
    # Pass category choices to the template
    categories = [{'id': choice[0], 'name': choice[1]} for choice in Product.CATEGORY_CHOICES]
    return render(request, 'admin_panel/product_form.html', {'product': product, 'categories': categories})

@login_required
def product_delete(request, product_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        # Delete all associated images first
        product.images.all().delete()
        product.delete()
        messages.success(request, 'Product deleted successfully!')
        return redirect('admin_products')
    
    return render(request, 'admin_panel/product_confirm_delete.html', {'product': product})

@login_required
def user_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    search_query = request.GET.get('search', '')
    role_filter = request.GET.get('role', '')
    status_filter = request.GET.get('status', '')
    
    users = CustomUser.objects.all().order_by('-date_joined')
    
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    if role_filter:
        users = users.filter(is_staff=role_filter == 'admin')
    
    if status_filter:
        users = users.filter(is_active=status_filter == 'active')
    
    return render(request, 'admin_panel/user_list.html', {
        'users': users,
        'search_query': search_query,
        'role_filter': role_filter,
        'status_filter': status_filter
    })

@login_required
def user_edit(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    user = get_object_or_404(CustomUser, id=user_id)
    
    if request.method == 'POST':
        user.username = request.POST.get('username')
        user.email = request.POST.get('email')
        user.is_staff = request.POST.get('is_staff') == 'on'
        user.is_active = request.POST.get('is_active') == 'on'
        
        # Only allow password change if provided
        if request.POST.get('password'):
            user.set_password(request.POST.get('password'))
        
        user.save()
        messages.success(request, 'User updated successfully!')
        return redirect('admin_users')
    
    return render(request, 'admin_panel/user_form.html', {'user': user})

@login_required
def user_delete(request, user_id):
    if not request.user.is_staff:
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
    try:
        user = get_object_or_404(CustomUser, id=user_id)
        user.delete()
        return JsonResponse({'success': True, 'message': 'User deleted successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@login_required
def toggle_user_status(request, user_id):
    if not request.user.is_staff:
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)
    
    try:
        user = get_object_or_404(CustomUser, id=user_id)
        user.is_active = not user.is_active
        user.save()
        return JsonResponse({'success': True, 'is_active': user.is_active})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


def order_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    # Get search and filter parameters
    search_query = request.GET.get('search', '').strip()
    status = request.GET.get('status', '')
    time_filter = request.GET.get('time', '')
    
    # Get all orders
    orders = Order.objects.all()
    
    # Apply filters
    if search_query:
        orders = orders.filter(
            Q(id__icontains=search_query) |
            Q(user__username__icontains=search_query) |
            Q(user__email__icontains=search_query)
        )
    
    if status:
        orders = orders.filter(status=status.capitalize())
    
    if time_filter:
        now = timezone.now()
        if time_filter == 'today':
            orders = orders.filter(created_at__date=now.date())
        elif time_filter == 'week':
            start_of_week = now - timedelta(days=now.weekday())
            orders = orders.filter(created_at__gte=start_of_week)
        elif time_filter == 'month':
            orders = orders.filter(created_at__month=now.month, created_at__year=now.year)
    
    # Sort orders by creation date
    orders = orders.order_by('-created_at')
    
    # Add search query to context for maintaining state
    context = {
        'orders': orders,
        'search_query': search_query,
        'status_filter': status,
        'time_filter': time_filter,
    }
    
    return render(request, 'admin_panel/order_list.html', context)

@login_required
def order_detail(request, order_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    order = get_object_or_404(Order, id=order_id)
    
    if request.method == 'POST':
        # Handle order status update
        new_status = request.POST.get('status')
        if new_status in ['Pending', 'Processing', 'Delivered', 'Cancelled']:
            order.status = new_status
            order.save()
            messages.success(request, 'Order status updated successfully!')
            return redirect('admin_orders')
    
    return render(request, 'admin_panel/order_detail.html', {'order': order})

@login_required
def order_update_status(request, order_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    order = get_object_or_404(Order, id=order_id)
    
    if request.method == 'POST':
        new_status = request.POST.get('status')
        if new_status in ['Pending', 'Processing', 'Delivered', 'Cancelled']:
            order.status = new_status
            order.save()
            messages.success(request, 'Order status updated successfully!')
    
    return redirect('admin_order_detail', order_id=order_id)

@login_required
def order_delete(request, order_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    order = get_object_or_404(Order, id=order_id)
    
    if request.method == 'POST':
        order.delete()
        messages.success(request, 'Order deleted successfully!')
        return redirect('admin_orders')
    
    return render(request, 'admin_panel/order_confirm_delete.html', {'order': order})

@login_required
def user_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    # Get search and filter parameters
    search_query = request.GET.get('search', '').strip()
    role = request.GET.get('role', '')
    status = request.GET.get('status', '')
    
    # Get all users
    users = CustomUser.objects.all()
    
    # Apply filters
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )
    
    if role == 'admin':
        users = users.filter(is_staff=True)
    elif role == 'user':
        users = users.filter(is_staff=False)
    
    if status == 'active':
        users = users.filter(is_active=True)
    elif status == 'inactive':
        users = users.filter(is_active=False)
    
    # Add search query to context for maintaining state
    context = {
        'users': users,
        'search_query': search_query,
        'role_filter': role,
        'status_filter': status,
    }
    
    return render(request, 'admin_panel/user_list.html', context)

@login_required
def user_add(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        is_staff = request.POST.get('is_staff') == 'on'
        is_active = request.POST.get('is_active') == 'on'
        
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
            is_active=is_active
        )
        messages.success(request, 'User created successfully!')
        return redirect('admin_users')
    
    return render(request, 'admin_panel/user_form.html')

@login_required
def user_edit(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    user = get_object_or_404(CustomUser, id=user_id)
    
    if request.method == 'POST':
        user.username = request.POST.get('username')
        user.email = request.POST.get('email')
        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.is_staff = request.POST.get('is_staff') == 'on'
        user.is_active = request.POST.get('is_active') == 'on'
        
        if request.POST.get('password'):
            user.set_password(request.POST.get('password'))
        
        user.save()
        messages.success(request, 'User updated successfully!')
        return redirect('admin_users')
    
    return render(request, 'admin_panel/user_form.html', {'target_user': user})


@login_required
def user_delete(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    user = get_object_or_404(CustomUser, id=user_id)
    
    if request.method == 'POST':
        user.delete()
        messages.success(request, 'User deleted successfully!')
        return redirect('admin_users')
    
    return render(request, 'admin_panel/user_confirm_delete.html', {'user': user})

@login_required
def banner_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    banners = Banner.objects.all()
    return render(request, 'admin_panel/banner_list.html', {'banners': banners})

@login_required
def banner_add(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    if request.method == 'POST':
        title = request.POST.get('title')
        subtitle = request.POST.get('subtitle')
        image = request.FILES.get('image')
        is_active = request.POST.get('is_active') == 'on'
        order = request.POST.get('order', 0)
        
        if title and image:
            banner = Banner.objects.create(
                title=title,
                subtitle=subtitle,
                image=image,
                is_active=is_active,
                order=order
            )
            messages.success(request, 'Banner added successfully!')
            return redirect('admin_banners')
        else:
            messages.error(request, 'Title and image are required!')
    
    return render(request, 'admin_panel/banner_form.html', {'action': 'Add'})

@login_required
def banner_edit(request, banner_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    banner = get_object_or_404(Banner, id=banner_id)
    
    if request.method == 'POST':
        title = request.POST.get('title')
        subtitle = request.POST.get('subtitle')
        image = request.FILES.get('image')
        is_active = request.POST.get('is_active') == 'on'
        order = request.POST.get('order', 0)
        
        if title:
            banner.title = title
            banner.subtitle = subtitle
            if image:
                banner.image = image
            banner.is_active = is_active
            banner.order = order
            banner.save()
            messages.success(request, 'Banner updated successfully!')
            return redirect('admin_banners')
        else:
            messages.error(request, 'Title is required!')
    
    return render(request, 'admin_panel/banner_form.html', {
        'banner': banner,
        'action': 'Edit'
    })

@login_required
def banner_delete(request, banner_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    banner = get_object_or_404(Banner, id=banner_id)
    banner.delete()
    messages.success(request, 'Banner deleted successfully!')
    return redirect('admin_banners')

@login_required
def cart_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    carts = Cart.objects.all().order_by('-created_at')
    return render(request, 'admin_panel/cart_list.html', {'carts': carts})

@login_required
def cart_detail(request, cart_id):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    cart = get_object_or_404(Cart, id=cart_id)
    return render(request, 'admin_panel/cart_detail.html', {'cart': cart})

@login_required
def contact_list(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    # Get all contact submissions
    contact_submissions = ContactSubmission.objects.all().order_by('-created_at')
    
    # Handle status updates
    if request.method == 'POST':
        submission_id = request.POST.get('submission_id')
        if submission_id:
            try:
                submission = ContactSubmission.objects.get(id=submission_id)
                submission.is_processed = not submission.is_processed
                submission.save()
                messages.success(request, 'Contact status updated successfully')
            except ContactSubmission.DoesNotExist:
                messages.error(request, 'Contact submission not found')
    
    return render(request, 'admin_panel/contact_list.html', {
        'contact_submissions': contact_submissions
    }) 