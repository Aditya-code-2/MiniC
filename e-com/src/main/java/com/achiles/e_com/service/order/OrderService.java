package com.achiles.e_com.service.order;

import com.achiles.e_com.dto.order.OrderRequest;
import com.achiles.e_com.dto.order.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrderFromCart(OrderRequest request);

    OrderResponse getOrderById(Long orderId);

    List<OrderResponse> getOrdersByUserId(Long userId);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(Long orderId, String status);

    OrderResponse cancelOrder(Long orderId);
}