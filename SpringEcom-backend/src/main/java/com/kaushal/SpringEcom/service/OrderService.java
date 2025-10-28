package com.kaushal.SpringEcom.service;

import com.kaushal.SpringEcom.model.Order;
import com.kaushal.SpringEcom.model.OrderItem;
import com.kaushal.SpringEcom.model.Product;
import com.kaushal.SpringEcom.model.dto.OrderItemRequest;
import com.kaushal.SpringEcom.model.dto.OrderItemResponse;
import com.kaushal.SpringEcom.model.dto.OrderRequest;
import com.kaushal.SpringEcom.model.dto.OrderResponse;
import com.kaushal.SpringEcom.repo.OrderRepo;
import com.kaushal.SpringEcom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {


    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private OrderRepo orderRepo;

    public OrderResponse placeOrder(OrderRequest orderRequest) {

        Order order = new Order();
//        order.getOrderId();
        String orderId = "ORD"+ UUID.randomUUID().toString().substring(0,8).toUpperCase();
        order.setOrderId(orderId);

        order.setCustomerName(orderRequest.customerName());

        order.setEmail(orderRequest.email());

        order.setStatus("PLACED");

        order.setOrderDate(LocalDate.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest itemRequest: orderRequest.items()){
            Product product = productRepo.findById(itemRequest.productId()).orElseThrow(()-> new RuntimeException("Product not found"));
            product.setStockQuantity(product.getStockQuantity()- itemRequest.quantity());
            productRepo.save(product);

            // replaced Lombok builder usage with explicit construction + setters
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
            orderItem.setOrder(order);

            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepo.save(order);

        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem item: order.getOrderItems()){
            OrderItemResponse orderItemResponse = new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            );
            itemResponses.add(orderItemResponse);
        }

        OrderResponse orderResponse = new OrderResponse(
                savedOrder.getOrderId(),
                savedOrder.getCustomerName(),
                savedOrder.getEmail(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate(),
                itemResponses
        );
        return orderResponse;
    }

    public List<OrderResponse> getAllOrderResponses() {
        List<Order> orders = orderRepo.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();

        for (Order order: orders){
            List<OrderItemResponse> itemResponses = new ArrayList<>();
            for (OrderItem item: order.getOrderItems()){
                OrderItemResponse orderItemResponse = new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalPrice()
                );
                itemResponses.add(orderItemResponse);
            }

            OrderResponse orderResponse = new OrderResponse(
                    order.getOrderId(),
                    order.getCustomerName(),
                    order.getEmail(),
                    order.getStatus(),
                    order.getOrderDate(),
                    itemResponses
            );
            orderResponses.add(orderResponse);
        }
        return orderResponses;
    }
}
