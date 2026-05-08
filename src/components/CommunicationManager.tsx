import React from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  Megaphone, 
  FileText, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Clock,
  Mail,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function CommunicationManager() {
  const [comms, setComms] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const [newComm, setNewComm] = React.useState({
    title: '',
    content: '',
    type: 'ANNOUNCEMENT',
    target_roles: ['client'],
    published: true
  });

  React.useEffect(() => {
    fetchComms();
    
    // Real-time updates
    const channel = supabase
      .channel('communications-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'communications' }, () => {
        fetchComms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComms = async () => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComms(data || []);
    } catch (err) {
      console.error('Error fetching communications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newComm.title || !newComm.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('communications').insert({
        ...newComm,
        sender_id: user?.id
      });
      if (error) throw error;
      
      toast.success(`${newComm.type} sent successfully!`);
      setShowNewDialog(false);
      setNewComm({ title: '', content: '', type: 'ANNOUNCEMENT', target_roles: ['client'], published: true });
    } catch (err) {
      toast.error('Failed to send communication');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('communications').delete().eq('id', id);
      if (error) throw error;
      toast.success('Communication deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredComms = comms.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Command <span className="text-amber-500">Center</span> Comms
          </h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Broadcast memos and official announcements</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl h-12 px-8 flex gap-2">
                <Plus size={18} /> New Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-[3rem] p-10 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">New <span className="text-amber-500">Broadcast</span></DialogTitle>
                <DialogDescription className="text-white/40">Select your broadcast type and compose your message.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-6 py-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Type</Label>
                    <select 
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold focus:border-amber-500 outline-none"
                      value={newComm.type}
                      onChange={(e) => setNewComm({...newComm, type: e.target.value})}
                    >
                      <option value="ANNOUNCEMENT">Announcement</option>
                      <option value="MEMO">Official Memo</option>
                      <option value="URGENT">Urgent Alert</option>
                      <option value="NEWSLETTER">Newsletter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Target Audience</Label>
                    <div className="flex gap-2">
                      <Badge 
                        onClick={() => setNewComm({...newComm, target_roles: ['client']})}
                        className={`cursor-pointer ${newComm.target_roles.includes('client') ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/40'}`}
                      >Members</Badge>
                      <Badge 
                        onClick={() => setNewComm({...newComm, target_roles: ['staff', 'admin']})}
                        className={`cursor-pointer ${newComm.target_roles.includes('staff') ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/40'}`}
                      >Internal</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Subject Line</Label>
                  <Input 
                    placeholder="Enter broadcast title..." 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold"
                    value={newComm.title}
                    onChange={(e) => setNewComm({...newComm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Message Content</Label>
                  <textarea 
                    placeholder="Compose your message here..." 
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-bold focus:border-amber-500 outline-none resize-none"
                    value={newComm.content}
                    onChange={(e) => setNewComm({...newComm, content: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} className="w-full h-16 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-500/20">
                  Broadcast Now <Send size={18} className="ml-2" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between bg-white/5">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Search communications..." 
                className="bg-zinc-950 border-white/10 pl-12 h-12 rounded-xl text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {filteredComms.map((comm) => (
                <div key={comm.id} className="p-8 hover:bg-white/5 transition-all group">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                        comm.type === 'URGENT' ? 'bg-red-500/10 text-red-500' : 
                        comm.type === 'MEMO' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {comm.type === 'ANNOUNCEMENT' ? <Megaphone size={24} /> : 
                         comm.type === 'URGENT' ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-white/10 text-[8px] font-black uppercase">{comm.type}</Badge>
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{format(new Date(comm.created_at), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{comm.title}</h4>
                        <p className="text-sm text-white/40 line-clamp-2">{comm.content}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-white/20 hover:text-white"><Eye size={18} /></Button>
                      <Button onClick={() => handleDelete(comm.id)} variant="ghost" size="icon" className="text-white/20 hover:text-red-500"><Trash2 size={18} /></Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredComms.length === 0 && (
                <div className="py-20 text-center">
                  <MessageSquare size={48} className="text-white/5 mx-auto mb-4" />
                  <p className="text-xs font-black text-white/20 uppercase tracking-widest">No communications found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg font-black uppercase italic tracking-tighter">Broadcast <span className="text-amber-500">Stats</span></CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Reached</p>
                <p className="text-4xl font-black text-white">2,840</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Open Rate</p>
                  <p className="text-2xl font-black text-emerald-500">84%</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Avg Click</p>
                  <p className="text-2xl font-black text-amber-500">32%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500 text-black rounded-[2.5rem] p-8 overflow-hidden relative">
            <Megaphone size={120} className="absolute -bottom-8 -right-8 opacity-10 rotate-12" />
            <div className="relative z-10 space-y-6">
              <h4 className="text-xl font-black uppercase italic tracking-tighter leading-tight">Sync Across <br/> All Platforms</h4>
              <p className="text-xs font-bold leading-relaxed opacity-80">Your broadcasts are instantly synchronized with the member dashboard, mobile apps, and email/SMS channels.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"><Mail size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"><Smartphone size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"><MessageSquare size={18} /></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
