-- 1. Data Protection Compliance (Kenya DPA 2019 / GDPR)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_data_processing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_policy_accepted BOOLEAN DEFAULT false;

-- Create data_requests table for GDPR/DPA compliance
CREATE TABLE IF NOT EXISTS public.data_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    request_type TEXT CHECK (request_type IN ('ACCESS', 'PORTABILITY', 'ERASURE', 'RECTIFICATION')) NOT NULL,
    status TEXT CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')) DEFAULT 'PENDING',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS for data_requests
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data requests" ON public.data_requests
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own data requests" ON public.data_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all data requests" ON public.data_requests
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 2. Concurrency Optimization for Vouchers
-- Add indexes for faster lookup
CREATE INDEX IF NOT EXISTS vouchers_code_idx ON public.vouchers(code);
CREATE INDEX IF NOT EXISTS vouchers_status_idx ON public.vouchers(status);
CREATE INDEX IF NOT EXISTS vouchers_expires_at_idx ON public.vouchers(expires_at);

-- 3. Atomic Redemption Function
-- This function ensures that even if thousands of requests hit at once, 
-- only one succeeds per voucher code.
CREATE OR REPLACE FUNCTION public.redeem_voucher_v1(
    p_code TEXT,
    p_admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_voucher RECORD;
    v_admin_name TEXT;
BEGIN
    -- Get admin name for audit trail
    SELECT display_name INTO v_admin_name FROM public.profiles WHERE id = p_admin_id;
    IF v_admin_name IS NULL THEN
        v_admin_name := 'System Admin';
    END IF;

    -- Lock the row for update to prevent concurrent redemptions
    SELECT * INTO v_voucher 
    FROM public.vouchers 
    WHERE UPPER(code) = UPPER(p_code)
    FOR UPDATE;

    -- 1. Check if voucher exists
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Voucher not found');
    END IF;

    -- 2. Check if voucher is active
    IF v_voucher.status != 'ACTIVE' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Voucher is ' || v_voucher.status);
    END IF;

    -- 3. Check expiry
    IF v_voucher.expires_at < NOW() THEN
        UPDATE public.vouchers SET status = 'EXPIRED' WHERE id = v_voucher.id;
        RETURN jsonb_build_object('success', false, 'error', 'Voucher has expired');
    END IF;

    -- 4. Mark as redeemed
    UPDATE public.vouchers 
    SET 
        status = 'REDEEMED',
        updated_at = NOW() -- Assuming updated_at exists or using created_at for simplicity
    WHERE id = v_voucher.id;

    -- 5. Log audit trail
    INSERT INTO public.audit_logs (admin_id, admin_name, action, details)
    VALUES (
        p_admin_id, 
        v_admin_name, 
        'VOUCHER_REDEMPTION', 
        jsonb_build_object(
            'voucher_id', v_voucher.id, 
            'code', v_voucher.code, 
            'value', v_voucher.value,
            'redeemed_at', NOW()
        )
    );

    RETURN jsonb_build_object(
        'success', true, 
        'voucher', jsonb_build_object(
            'id', v_voucher.id,
            'code', v_voucher.code,
            'value', v_voucher.value,
            'type', v_voucher.type
        )
    );
END;
$$;

-- Add updated_at to vouchers if not present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vouchers' AND column_name='updated_at') THEN
        ALTER TABLE public.vouchers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
        
        CREATE TRIGGER handle_updated_at_vouchers
          BEFORE UPDATE ON public.vouchers
          FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;
