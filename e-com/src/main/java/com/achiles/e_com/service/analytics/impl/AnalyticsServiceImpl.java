package com.achiles.e_com.service.analytics.impl;

import com.achiles.e_com.dto.analytics.DashboardSummaryResponse;
import com.achiles.e_com.repository.OrderRepository;
import com.achiles.e_com.repository.ProductRepository;
import com.achiles.e_com.repository.UserRepository;
import com.achiles.e_com.service.analytics.AnalyticsService;
import com.achiles.e_com.entity.Order;
import com.achiles.e_com.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Override
    public DashboardSummaryResponse getAdminDashboardSummary() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();

        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();

        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING)
                .count();

        long completedOrders = allOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED)
                .count();

        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> "PAID".equalsIgnoreCase(o.getPaymentStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardSummaryResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .build();
    }

    @Override
    public DashboardSummaryResponse getSellerDashboardSummary(Long sellerId) {
        List<Order> sellerOrders = orderRepository.findByUserId(sellerId);
        long totalOrders = sellerOrders.size();

        long pendingOrders = sellerOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PENDING)
                .count();

        long completedOrders = sellerOrders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED)
                .count();

        BigDecimal totalRevenue = sellerOrders.stream()
                .filter(o -> "PAID".equalsIgnoreCase(o.getPaymentStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalProducts = productRepository.findBySellerId(sellerId).size();

        return DashboardSummaryResponse.builder()
                .totalUsers(null)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .build();
    }
}
