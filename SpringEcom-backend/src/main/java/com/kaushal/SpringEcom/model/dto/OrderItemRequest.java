package com.kaushal.SpringEcom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {
}
