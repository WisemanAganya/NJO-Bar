import React from 'react';
import { motion } from 'motion/react';
import { Ticket, Plus, Search, Filter, Download, Trash2, CheckCircle, XCircle, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Voucher } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function VoucherManager() {
  const [vouchers, setVouchers] = React.useState<Voucher[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [redemptionCode, setRedemptionCode] = React.useState('');
  const [isRedeeming, setIsRedeeming] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(false);

  React.useEffect(() => {
    fetchVouchers();
  }, []);

  const handleRedeem = async () => {
    if (!redemptionCode) return;
    setIsRedeeming(true);
    try {
      // 1. Verify Voucher
      const { data: voucher, error: fetchError } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', redemptionCode.toUpperCase())
        .single();
      
      if (fetchError || !voucher) throw new Error('Invalid voucher code');
      if (voucher.status === 'REDEEMED') throw new Error('Voucher has already been redeemed');
      if (new Date(voucher.expires_at) < new Date()) throw new Error('Voucher has expired');

      // 2. Mark as Redeemed
      const { error: updateError } = await supabase
        .from('vouchers')
        .update({ status: 'REDEEMED' })
        .eq('id', voucher.id);
      
      if (updateError) throw updateError;

      // 3. Log Audit Trail
      await supabase.from('audit_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        admin_name: 'Staff Member',
        action: 'VOUCHER_REDEMPTION',
        details: { voucher_id: voucher.id, code: voucher.code, value: voucher.value }
      });

      toast.success(`Voucher KSh ${voucher.value} redeemed successfully!`);
      setRedemptionCode('');
      setShowScanner(false);
      fetchVouchers();
    } catch (err: any) {
      toast.error(err.message || 'Redemption failed');
    } finally {
      setIsRedeeming(false);
    }
  };

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const mapped = data.map((v: any) => ({
          ...v,
          expiresAt: v.expires_at,
          createdAt: v.created_at,
          issuedTo: v.issued_to
        }));
        setVouchers(mapped);
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('vouchers').delete().eq('id', id);
      if (error) throw error;
      setVouchers(vouchers.filter(v => v.id !== id));
      toast.success('Voucher deleted');
    } catch (err) {
      toast.error('Failed to delete voucher');
    }
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Voucher <span className="text-amber-500">Manager</span></h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Issue and track system access passes</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={showScanner} onOpenChange={setShowScanner}>
            <DialogTrigger asChild>
              <Button className="bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl h-12 px-8 flex gap-2 hover:bg-white/10">
                <QrCode size={18} /> Redeem Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-[3rem] p-0 overflow-hidden max-w-md">
              <div className="p-10 space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-black tracking-tighter uppercase italic">Voucher <span className="text-amber-500">Scanner</span></h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Verify and process redemption</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Voucher Code</Label>
                    <Input 
                      placeholder="ENTER-CODE-HERE" 
                      className="bg-white/5 border-white/10 h-14 rounded-2xl text-center font-black text-xl tracking-[0.2em] uppercase"
                      value={redemptionCode}
                      onChange={(e) => setRedemptionCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start">
                  <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
                  <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-wider">
                    Anti-fraud active. This system tracks redemption location and device fingerprinting.
                  </p>
                </div>

                <Button 
                  onClick={handleRedeem}
                  disabled={isRedeeming || !redemptionCode}
                  className="w-full h-16 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20"
                >
                  {isRedeeming ? 'Verifying...' : 'Redeem & Mark Used'} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button className="bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl h-12 px-8 flex gap-2">
            <Plus size={18} /> Issue Voucher
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search by code or type..." 
              className="bg-zinc-950 border-white/10 pl-12 h-12 rounded-xl text-xs font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-xl border-white/10 text-white/40"><Filter size={16} /></Button>
            <Button variant="outline" size="icon" className="rounded-xl border-white/10 text-white/40"><Download size={16} /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <th className="px-8 py-4">Code</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Value</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Expiry</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Ticket size={18} />
                        </div>
                        <span className="text-sm font-black text-white">{v.code}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="border-white/10 text-[9px] uppercase font-black">{v.type}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-amber-500">KSh {v.value.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${v.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black uppercase text-white/40">{v.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-white/60">{format(new Date(v.expiresAt), 'MMM dd, yyyy')}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(v.id!)}
                        className="text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVouchers.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <Ticket size={48} className="text-white/5 mx-auto" />
                <p className="text-xs font-black text-white/20 uppercase tracking-widest">No matching vouchers found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
