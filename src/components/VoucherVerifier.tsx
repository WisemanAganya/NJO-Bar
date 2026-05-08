import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Ticket, 
  User, 
  Calendar,
  Loader2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function VoucherVerifier() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [verifying, setVerifying] = React.useState(false);
  const [voucher, setVoucher] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);

  const fetchVoucherDetails = React.useCallback(async () => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('vouchers')
        .select(`
          *,
          profiles:issued_to (
            display_name,
            email
          )
        `)
        .eq('code', code.toUpperCase())
        .single();

      if (fetchError) throw new Error('Voucher not found or invalid code.');
      setVoucher(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [code]);

  React.useEffect(() => {
    fetchVoucherDetails();
  }, [fetchVoucherDetails]);

  const handleRedeem = async () => {
    if (!code) return;
    setVerifying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in as staff to verify vouchers.');

      // Call the atomic RPC function
      const { data, error: rpcError } = await supabase.rpc('redeem_voucher_v1', {
        p_code: code.toUpperCase(),
        p_admin_id: user.id
      });

      if (rpcError) throw rpcError;

      if (!data.success) {
        throw new Error(data.error);
      }

      setResult(data.voucher);
      toast.success('Voucher redeemed successfully!');
      // Refresh details to show REDEEMED status
      fetchVoucherDetails();
    } catch (err: any) {
      toast.error(err.message || 'Redemption failed.');
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">Fetching Secure Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </button>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] p-10 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto text-red-500">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase italic">Invalid Voucher</h2>
                <p className="text-red-500/80 text-sm font-bold uppercase tracking-wider">{error}</p>
              </div>
              <Button 
                onClick={fetchVoucherDetails}
                className="bg-white/5 border border-white/10 text-white rounded-2xl w-full h-14 font-black uppercase tracking-widest hover:bg-white/10"
              >
                <RefreshCw size={16} className="mr-2" /> Try Again
              </Button>
            </motion.div>
          ) : result ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-10 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase italic">Redeemed!</h2>
                <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em]">Access Granted</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Voucher Code</span>
                  <span className="text-sm font-black text-white">{result.code}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Value</span>
                  <span className="text-sm font-black text-amber-500">KSh {result.value.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-emerald-500 text-black rounded-2xl w-full h-14 font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
              >
                Done
              </Button>
            </motion.div>
          ) : (
            <Card className="bg-white/5 border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
              <CardContent className="p-10 space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={12} /> Secure Verification
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Verify <span className="text-amber-500">Voucher</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Voucher Code</p>
                      <p className="text-lg font-black text-white tracking-widest">{voucher?.code}</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        voucher?.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {voucher?.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Value</p>
                      <p className="text-xl font-black text-white">KSh {voucher?.value.toLocaleString()}</p>
                    </div>
                    <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Category</p>
                      <p className="text-xl font-black text-white">{voucher?.type}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-white/20" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Issued To</p>
                        <p className="text-sm font-bold text-white/80">{voucher?.profiles?.display_name || 'Guest'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                      <Calendar size={16} className="text-white/20" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Expires On</p>
                        <p className="text-sm font-bold text-white/80">{new Date(voucher?.expires_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={handleRedeem}
                    disabled={verifying || voucher?.status !== 'ACTIVE'}
                    className="w-full h-16 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-500/20 flex gap-3"
                  >
                    {verifying ? (
                      <>Verifying... <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Grant Entry / Redeem <Zap size={16} /></>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Double-Redemption Protection Active
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
