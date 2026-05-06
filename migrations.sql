-- Update enrollments table
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- Create vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ACTIVE',
  issued_to UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS for vouchers
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view their own vouchers" ON public.vouchers FOR SELECT USING (auth.uid() = issued_to OR issued_to IS NULL);
CREATE POLICY "Admins can manage vouchers" ON public.vouchers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
