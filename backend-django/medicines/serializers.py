from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):
    """Serializer for the Medicine model."""
    
    class Meta:
        model = Medicine
        fields = [
            'id', 'medicine_id', 'name', 'manufacturer', 'batch_number', 
            'type', 'dosage', 'manufactured_date', 'expiry_date', 
            'price', 'stock', 'reorder_level', 'clinic', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'medicine_id', 'created_at', 'updated_at']


class MedicineCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new medicine."""
    
    class Meta:
        model = Medicine
        fields = [
            'name', 'manufacturer', 'batch_number', 'type', 
            'dosage', 'manufactured_date', 'expiry_date', 
            'price', 'stock', 'reorder_level', 'clinic'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class MedicineUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a medicine."""
    
    class Meta:
        model = Medicine
        fields = [
            'name', 'manufacturer', 'batch_number', 'type', 
            'dosage', 'manufactured_date', 'expiry_date', 
            'price', 'stock', 'reorder_level', 'is_active'
        ]


class MedicineStockUpdateSerializer(serializers.Serializer):
    """Serializer for updating medicine stock."""
    
    quantity = serializers.IntegerField(required=True, min_value=1)
    is_addition = serializers.BooleanField(required=True)
    
    def update(self, instance, validated_data):
        quantity = validated_data.get('quantity')
        is_addition = validated_data.get('is_addition')
        
        if is_addition:
            instance.stock += quantity
        else:
            if instance.stock < quantity:
                raise serializers.ValidationError({"quantity": "Not enough stock available."})
            instance.stock -= quantity
        
        instance.save()
        return instance