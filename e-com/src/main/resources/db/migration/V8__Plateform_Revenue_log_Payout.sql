-- 1. Platform Revenue Logs Table (Company Profit & Commission Ledger)
CREATE TABLE platform_revenue_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    gross_amount DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    gateway_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_company_profit DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Payouts Table (Seller Payout Settlements & UTR Tracking)
CREATE TABLE payouts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    total_sales_amount DECIMAL(10, 2) NOT NULL,
    platform_commission DECIMAL(10, 2) NOT NULL,
    net_payable_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    transaction_ref_number VARCHAR(255),
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    
    -- Foreign Key to link with users (sellers) table
    CONSTRAINT fk_payouts_seller FOREIGN KEY (seller_id) REFERENCES users(id)
);