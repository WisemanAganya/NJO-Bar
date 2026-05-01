import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';

export function LeadManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
    const subscription = supabase
      .channel('leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchLeads)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const mapped = data.map((d: any) => ({
          ...d,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          leadType: d.lead_type,
        }));
        setLeads(mapped as Lead[]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (id: string) => {
    if (confirm('Delete this lead?')) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (statusFilter === 'all' || lead.status === statusFilter) &&
      (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  };

  const statusColors = {
    new: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    contacted: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    qualified: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    closed: { bg: 'bg-green-500/20', text: 'text-green-400' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Lead Manager</h2>
        <p className="text-white/50">Manage and track customer inquiries and contacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-blue-500">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">New</p>
            <p className="text-3xl font-bold text-blue-400">{stats.new}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Contacted</p>
            <p className="text-3xl font-bold text-amber-400">{stats.contacted}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Qualified</p>
            <p className="text-3xl font-bold text-purple-400">{stats.qualified}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Closed</p>
            <p className="text-3xl font-bold text-green-400">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center text-white/40">No leads found.</CardContent>
            </Card>
          ) : (
            filteredLeads.map((lead) => (
              <motion.div key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="bg-white/5 border-white/10 hover:border-amber-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{lead.name}</p>
                          <a href={`mailto:${lead.email}`} className="text-sm text-amber-400 hover:text-amber-300">
                            {lead.email}
                          </a>
                          {lead.phone && <p className="text-sm text-white/40">{lead.phone}</p>}
                          <div className="mt-2 space-y-1">
                            {lead.subject && (
                              <p className="text-sm font-medium text-white">
                                Subject: <span className="text-white/70">{lead.subject}</span>
                              </p>
                            )}
                            <p className="text-sm text-white/60">{lead.message}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id!, e.target.value)}
                          className={`px-3 py-1 rounded text-xs font-bold border mb-3 ${
                            statusColors[lead.status as keyof typeof statusColors].bg
                          } ${statusColors[lead.status as keyof typeof statusColors].text} border-transparent`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                        </select>
                        <p className="text-xs text-white/40">{new Date(lead.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `mailto:${lead.email}`}
                        className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400"
                      >
                        <Mail className="w-3 h-3 mr-1" /> Reply
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteLead(lead.id!)}
                        className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
