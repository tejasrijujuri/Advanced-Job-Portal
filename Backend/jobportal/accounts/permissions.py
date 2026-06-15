from rest_framework.permissions import BasePermission


class IsRecruiter(BasePermission):

    def has_permission(self, request, view):
        return True


class IsJobSeeker(BasePermission):

    def has_permission(self, request, view):
        return True