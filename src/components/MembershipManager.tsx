import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  CreditCard,
  TrendingUp,
  Award,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function MembershipManager() {
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    pending: 0,
    revenue: 0
  });

  React.useEffect(() => {
    fetchMembers();
    
    const channel = supabase
      .channel('memberships-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMembers(data || []);
      
      // Calculate basic stats
      const activeCount = data?.filter(m => m.membership_status === 'ACTIVE').length || 0;
      const pendingCount = data?.filter(m => m.membership_status === 'PENDING').length || 0;
      
      setStats({
        total: data?.length || 0,
        active: activeCount,
        pending: pendingCount,
        revenue: activeCount * 12500 // Mock revenue calc
      });
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ membership_status: status })
        .eq('id', id);
      if (error) throw error;
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredMembers = members.filter(m => 
    m.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.membership_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
          Member <span className="text-amber-500">Registry</span>
        </h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Lifecycle management for NJO Bar community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Registry', value: stats.total, icon: Users, color: 'text-amber-500' },
          { label: 'Active Members', value: stats.active, icon: UserCheck, color: 'text-emerald-500' },
          { label: 'Pending Apps', value: stats.pending, icon: Clock, color: 'text-blue-500' },
          { label: 'Annual Revenue', value: `KSh ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-white' }
        ].map((kpi, i) => (
          <Card key={i} className="bg-white/5 border-white/10 rounded-[2.5rem] p-8">
            <kpi.icon className={`w-8 h-8 ${kpi.color} mb-4`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{kpi.label}</p>
            <p className="text-2xl font-black text-white mt-1">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between bg-white/5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search by name, email or member ID..." 
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
                  <th className="px-8 py-4">Member</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Joined At</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">
                          {m.display_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{m.display_name}</p>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="border-white/10 text-[9px] font-black uppercase tracking-widest">{m.account_type}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          m.membership_status === 'ACTIVE' ? 'bg-emerald-500' : 
                          m.membership_status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{m.membership_status || 'PENDING'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-white/60">
                      {format(new Date(m.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {m.membership_status !== 'ACTIVE' && (
                          <Button onClick={() => updateStatus(m.id, 'ACTIVE')} variant="ghost" size="icon" className="text-emerald-500 hover:bg-emerald-500/10 rounded-lg">
                            <UserCheck size={16} />
                          </Button>
                        )}
                        {m.membership_status === 'ACTIVE' && (
                          <Button onClick={() => updateStatus(m.id, 'INACTIVE')} variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 rounded-lg">
                            <UserX size={16} />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-white/20 hover:text-white rounded-lg">
                          <ArrowUpRight size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
