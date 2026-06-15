from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializers import UserSerializer


@api_view(['GET'])
def home(request):
    return Response({"message": "Accounts Module Working"})


@api_view(['POST'])
def register(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Registration Successful"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def users(request):

    data = User.objects.all()

    serializer = UserSerializer(data, many=True)

    return Response(serializer.data)
# Create your views here.
