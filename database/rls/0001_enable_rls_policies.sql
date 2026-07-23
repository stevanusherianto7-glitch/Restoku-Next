-- ============================================================
-- RESTOKU SAAS POS: Multi-Tenant Row-Level Security
-- PostgreSQL 15+ Compatible
-- ============================================================

-- ============================================================
-- 1. Aktifkan RLS pada semua tabel utama
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlet_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wastage_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Buat role untuk aplikasi
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_role') THEN
        CREATE ROLE app_role;
    END IF;
END
$$;

GRANT CONNECT ON DATABASE restoku TO app_role;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_role;

-- ============================================================
-- 3. Fungsi untuk set tenant context
-- ============================================================
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_uuid UUID)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_uuid::TEXT, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. RLS Policies — tenants
-- ============================================================
CREATE POLICY tenant_isolation_tenants ON tenants
    FOR ALL
    TO app_role
    USING (id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 5. RLS Policies — users
-- ============================================================
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 6. RLS Policies — outlet_tables
-- ============================================================
CREATE POLICY tenant_isolation_outlet_tables ON outlet_tables
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 7. RLS Policies — menu_items
-- ============================================================
CREATE POLICY tenant_isolation_menu_items ON menu_items
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 8. RLS Policies — orders
-- ============================================================
CREATE POLICY tenant_isolation_orders ON orders
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 9. RLS Policies — order_items (via orders join)
-- ============================================================
CREATE POLICY tenant_isolation_order_items ON order_items
    FOR ALL
    TO app_role
    USING (
        order_id IN (
            SELECT id FROM orders
            WHERE tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

-- ============================================================
-- 10. RLS Policies — wastage_journals
-- ============================================================
CREATE POLICY tenant_isolation_wastage_journals ON wastage_journals
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 11. RLS Policies — payment_logs
-- ============================================================
CREATE POLICY tenant_isolation_payment_logs ON payment_logs
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 12. RLS Policies — audit_logs
-- ============================================================
CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    FOR ALL
    TO app_role
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ============================================================
-- 13. Cleanup job: hapus idempotency records yang expired
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_expired_idempotency()
RETURNS VOID AS $$
BEGIN
    DELETE FROM idempotency_records
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Jalankan cleanup setiap jam (via pg_cron atau application scheduler)
-- SELECT cron.schedule('cleanup-idempotency', '0 * * * *', 'SELECT cleanup_expired_idempotency()');
