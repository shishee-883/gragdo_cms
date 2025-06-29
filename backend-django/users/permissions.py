from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """
    Permission to only allow super admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SUPER_ADMIN'


class IsAdmin(permissions.BasePermission):
    """
    Permission to only allow admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['SUPER_ADMIN', 'ADMIN']


class IsStaff(permissions.BasePermission):
    """
    Permission to only allow staff to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['SUPER_ADMIN', 'ADMIN', 'STAFF']


class IsDoctor(permissions.BasePermission):
    """
    Permission to only allow doctors to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'DOCTOR'


class IsClinicAdmin(permissions.BasePermission):
    """
    Permission to only allow admins of a specific clinic to access the view.
    """
    def has_object_permission(self, request, view, obj):
        # Check if user is authenticated and is an admin
        if not request.user.is_authenticated or request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return False
        
        # Super admins can access any clinic
        if request.user.role == 'SUPER_ADMIN':
            return True
        
        # Check if the user is admin of the clinic
        if hasattr(obj, 'clinic'):
            return obj.clinic == request.user.clinic
        
        # If the object is a clinic itself
        if hasattr(obj, 'id'):
            return obj == request.user.clinic
        
        return False


class IsClinicStaff(permissions.BasePermission):
    """
    Permission to only allow staff of a specific clinic to access the view.
    """
    def has_object_permission(self, request, view, obj):
        # Check if user is authenticated and is staff or higher
        if not request.user.is_authenticated or request.user.role not in ['SUPER_ADMIN', 'ADMIN', 'STAFF']:
            return False
        
        # Super admins can access any clinic
        if request.user.role == 'SUPER_ADMIN':
            return True
        
        # Check if the user is staff of the clinic
        if hasattr(obj, 'clinic'):
            return obj.clinic == request.user.clinic
        
        # If the object is a clinic itself
        if hasattr(obj, 'id'):
            return obj == request.user.clinic
        
        return False


class IsClinicDoctor(permissions.BasePermission):
    """
    Permission to only allow doctors of a specific clinic to access the view.
    """
    def has_object_permission(self, request, view, obj):
        # Check if user is authenticated and is a doctor
        if not request.user.is_authenticated or request.user.role != 'DOCTOR':
            return False
        
        # Check if the user is a doctor of the clinic
        if hasattr(obj, 'clinic'):
            return obj.clinic == request.user.clinic
        
        # If the object is a clinic itself
        if hasattr(obj, 'id'):
            return obj == request.user.clinic
        
        return False


class IsOwner(permissions.BasePermission):
    """
    Permission to only allow owners of an object to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Check if the object has a created_by field
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        
        return False


class ReadOnly(permissions.BasePermission):
    """
    Permission to only allow read-only access.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS