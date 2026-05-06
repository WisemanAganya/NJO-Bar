import React from 'react';
import { motion } from 'motion/react';
import { Ticket, Plus, Search, Filter, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Voucher } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function VoucherManager() {
  const [vouchers, setVouchers] = React.useState<Voucher[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVouchers(data || []);
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
        <Button className="bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl h-12 px-8 flex gap-2">
          <Plus size={18} /> Issue Voucher
        </Button>
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
