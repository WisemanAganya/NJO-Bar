import React from 'react';
import { motion } from 'motion/react';
import { History, Search, Filter, Download, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { AuditLog } from '@/types';
import { format } from 'date-fns';

export function AuditManager() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Audit <span className="text-amber-500">Logs</span></h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Full transparency of administrative operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={12} className="mr-2 inline" /> System Integrity: Optimal
          </Badge>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search by admin or action..." 
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
          <div className="space-y-1">
            {filteredLogs.map((log, i) => (
              <div key={log.id} className="flex items-center gap-6 p-6 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-amber-500/50 group-hover:text-amber-500 transition-colors">
                  <History size={18} />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="col-span-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase">{log.adminName}</p>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">ID: {log.adminId.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Badge className="bg-zinc-950 text-amber-500/80 border-white/10 text-[9px] font-black uppercase px-3 py-1">{log.action}</Badge>
                  </div>
                  <div className="col-span-1">
                    <p className="text-[11px] text-white/40 font-medium italic line-clamp-1 group-hover:text-white/60 transition-colors">
                      {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                    </p>
                  </div>
                  <div className="col-span-1 text-right">
                    <p className="text-[10px] font-black text-white/20 uppercase">{format(new Date(log.createdAt), 'MMM dd, yyyy • HH:mm')}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="py-24 text-center space-y-6">
                <History size={64} className="text-white/5 mx-auto" />
                <p className="text-sm font-black text-white/20 uppercase tracking-[0.4em]">No audit logs recorded</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
