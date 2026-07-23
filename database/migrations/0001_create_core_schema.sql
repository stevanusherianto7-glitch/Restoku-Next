-- ============================================================
-- RESTOKU SAAS POS: Core Schema Migration
-- PostgreSQL 15+ Compatible
-- ============================================================

-- Enum Types
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'cancelled');
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'cooking', 'ready', 'served', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'expired');
CREATE TYPE cooking_status_type AS ENUM ('pending', 'cooking', 'ready', 'served');
CREATE TYPE order_source AS ENUM ('pos', 'qr', 'online');
CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway', 'delivery');

-- ============================================================
-- TABLE: tenants (restoran / tenant utama)
-- ============================================================
CREATE TABLE tenants (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    slug          VARCHAR(100) NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(20),
    address       TEXT,
    logo_url      VARCHAR(500),
    timezone      VARCHAR(50) DEFAULT 'Asia/Jakarta',
    currency      VARCHAR(3) DEFAULT 'IDR',
    subscription  subscription_plan DEFAULT 'free',
    status        tenant_status DEFAULT 'active',
    settings      JSONB DEFAULT '{}',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_email ON tenants(email);
CREATE INDEX idx_tenants_status ON tenants(status);

-- ============================================================
-- TABLE: users (kasir, manager, owner)
-- ============================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    role          VARCHAR(50) NOT NULL DEFAULT 'cashier',
    pin           VARCHAR(10),
    is_active     BOOLEAN DEFAULT true,
    avatar_url    VARCHAR(500),
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(tenant_id, role);

-- ============================================================
-- TABLE: outlet_tables (meja restoran)
-- ============================================================
CREATE TABLE outlet_tables (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    number            VARCHAR(10) NOT NULL,
    capacity          INTEGER NOT NULL CHECK (capacity > 0),
    qr_code_token     VARCHAR(255) NOT NULL UNIQUE,
    status            table_status DEFAULT 'available',
    current_order_id  UUID,
    is_queue          BOOLEAN DEFAULT false,
    qr_type           VARCHAR(20) DEFAULT 'table',
    last_scan_token   VARCHAR(255),
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (tenant_id, number)
);

CREATE INDEX idx_outlet_tables_tenant_id ON outlet_tables(tenant_id);
CREATE INDEX idx_outlet_tables_status ON outlet_tables(tenant_id, status);
CREATE INDEX idx_outlet_tables_qr_token ON outlet_tables(qr_code_token);
CREATE INDEX idx_outlet_tables_current_order ON outlet_tables(current_order_id);

-- ============================================================
-- TABLE: menu_items
-- ============================================================
CREATE TABLE menu_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id     UUID,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    price           DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    image_url       VARCHAR(500),
    image_public_id VARCHAR(255),
    is_available    BOOLEAN DEFAULT true,
    is_popular      BOOLEAN DEFAULT false,
    stock_quantity  INTEGER DEFAULT NULL,
    stock_reserved  INTEGER DEFAULT 0,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX idx_menu_items_category ON menu_items(tenant_id, category_id);
CREATE INDEX idx_menu_items_available ON menu_items(tenant_id, is_available);

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    table_id         UUID REFERENCES outlet_tables(id) ON DELETE SET NULL,
    user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number     VARCHAR(50) NOT NULL,
    status           order_status DEFAULT 'pending',
    payment_status   payment_status DEFAULT 'pending',
    source           order_source DEFAULT 'pos',
    order_type       order_type DEFAULT 'dine_in',
    subtotal         DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_amount       DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_amount  DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount     DECIMAL(12, 2) NOT NULL DEFAULT 0,
    customer_name    VARCHAR(255),
    notes            TEXT,
    idempotency_key  VARCHAR(255) UNIQUE,
    paid_at          TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),

    CHECK (total_amount >= 0)
);

CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_orders_payment_status ON orders(tenant_id, payment_status);
CREATE INDEX idx_orders_created_at ON orders(tenant_id, created_at DESC);
CREATE INDEX idx_orders_idempotency_key ON orders(idempotency_key);
CREATE INDEX idx_orders_order_number ON orders(tenant_id, order_number);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE order_items (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id   UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    name           VARCHAR(255) NOT NULL,
    quantity       INTEGER NOT NULL CHECK (quantity > 0),
    unit_price     DECIMAL(12, 2) NOT NULL,
    total_price    DECIMAL(12, 2) NOT NULL,
    variant        VARCHAR(100),
    notes          TEXT,
    cooking_status cooking_status_type DEFAULT 'pending',
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),

    CHECK (total_price = quantity * unit_price)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_order_items_cooking_status ON order_items(cooking_status);

-- ============================================================
-- TABLE: wastage_journals (pencatatan kerugian pembatalan)
-- ============================================================
CREATE TABLE wastage_journals (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id  UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    item_name     VARCHAR(255) NOT NULL,
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost     DECIMAL(12, 2) NOT NULL,
    total_loss    DECIMAL(12, 2) NOT NULL,
    reason        TEXT NOT NULL,
    confirmed_by  UUID NOT NULL REFERENCES users(id),
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wastage_journals_tenant_id ON wastage_journals(tenant_id);
CREATE INDEX idx_wastage_journals_order_id ON wastage_journals(order_id);

-- ============================================================
-- TABLE: payment_logs (audit trail pembayaran)
-- ============================================================
CREATE TABLE payment_logs (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway_transaction_id  VARCHAR(255),
    status                  VARCHAR(50) NOT NULL,
    amount                  DECIMAL(12, 2) NOT NULL,
    payment_type            VARCHAR(50),
    raw_payload             JSONB,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_logs_tenant_id ON payment_logs(tenant_id);
CREATE INDEX idx_payment_logs_order_id ON payment_logs(order_id);
CREATE INDEX idx_payment_logs_gateway_txn ON payment_logs(gateway_transaction_id);

-- ============================================================
-- TABLE: idempotency_records (cegah double processing)
-- ============================================================
CREATE TABLE idempotency_records (
    key             VARCHAR(255) PRIMARY KEY,
    request_path    VARCHAR(500) NOT NULL,
    request_method  VARCHAR(10) NOT NULL,
    request_hash    VARCHAR(64) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'processing',
    response_body   JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX idx_idempotency_records_expires ON idempotency_records(expires_at);

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id     UUID,
    action      VARCHAR(100) NOT NULL,
    entity      VARCHAR(100) NOT NULL,
    entity_id   UUID,
    details     JSONB DEFAULT '{}',
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(tenant_id, action);

-- ============================================================
-- FUNCTION: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_outlet_tables_updated_at
    BEFORE UPDATE ON outlet_tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
