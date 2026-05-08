import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Users, 
  Clock, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function MeetingManager() {
  const [meetings, setMeetings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const [newMeeting, setNewMeeting] = React.useState({
    title: '',
    description: '',
    meeting_type: 'PROGRAM',
    start_time: '',
    end_time: '',
    location: '',
    virtual_link: '',
    agenda: [] as string[]
  });

  React.useEffect(() => {
    fetchMeetings();
    
    const channel = supabase
      .channel('meetings-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => {
        fetchMeetings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('start_time', { ascending: true });
      if (error) throw error;
      setMeetings(data || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { error } = await supabase.from('meetings').insert(newMeeting);
      if (error) throw error;
      toast.success('Meeting scheduled successfully');
      setShowNewDialog(false);
      setNewMeeting({ title: '', description: '', meeting_type: 'PROGRAM', start_time: '', end_time: '', location: '', virtual_link: '', agenda: [] });
    } catch (err) {
      toast.error('Failed to schedule meeting');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Programs <span className="text-amber-500">&</span> Meetings
          </h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Manage AGMs, social events, and club activities</p>
        </div>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl h-12 px-8 flex gap-2">
              <Plus size={18} /> Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-[3rem] p-10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">New <span className="text-amber-500">Event</span></DialogTitle>
              <DialogDescription className="text-white/40">Define the agenda and logistics for the upcoming activity.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Event Title</Label>
                <Input 
                  placeholder="e.g. Annual General Meeting 2026" 
                  className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Type</Label>
                <select 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold focus:border-amber-500 outline-none"
                  value={newMeeting.meeting_type}
                  onChange={(e) => setNewMeeting({...newMeeting, meeting_type: e.target.value as any})}
                >
                  <option value="AGM">AGM</option>
                  <option value="COMMITTEE">Committee Meeting</option>
                  <option value="SOCIAL">Social Event</option>
                  <option value="PROGRAM">Program/Activity</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Start Time</Label>
                <Input 
                  type="datetime-local"
                  className="bg-white/5 border-white/10 h-12 rounded-xl font-bold"
                  value={newMeeting.start_time}
                  onChange={(e) => setNewMeeting({...newMeeting, start_time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Location (Physical)</Label>
                <Input 
                  placeholder="e.g. Main Lounge" 
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Virtual Link (Optional)</Label>
                <Input 
                  placeholder="https://zoom.us/..." 
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  value={newMeeting.virtual_link}
                  onChange={(e) => setNewMeeting({...newMeeting, virtual_link: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} className="w-full h-16 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-500/20">
                Create Event <ArrowRight size={18} className="ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {meetings.map((meeting) => (
          <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <Badge className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    meeting.meeting_type === 'AGM' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    meeting.meeting_type === 'SOCIAL' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {meeting.meeting_type}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-white/20 hover:text-white"><MoreVertical size={16} /></Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{meeting.title}</h3>
                  <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={12} className="text-amber-500" />
                    {format(new Date(meeting.start_time), 'PPP p')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Attendees</p>
                    <p className="text-sm font-black text-white">{meeting.attendees_count || 0} Members</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Status</p>
                    <p className="text-sm font-black text-emerald-500 uppercase italic">Upcoming</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {meeting.location && (
                    <div className="flex items-center gap-3 text-xs text-white/60 font-bold">
                      <MapPin size={14} className="text-amber-500" /> {meeting.location}
                    </div>
                  )}
                  {meeting.virtual_link && (
                    <div className="flex items-center gap-3 text-xs text-blue-400 font-bold">
                      <Video size={14} /> Virtual Link Available
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Button className="flex-1 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl h-12 hover:bg-white/10">
                    <ClipboardList size={14} className="mr-2" /> Agenda
                  </Button>
                  <Button className="flex-1 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl h-12 hover:bg-white/10">
                    <UserPlus size={14} className="mr-2" /> Invite
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {meetings.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <Calendar size={48} className="text-white/5 mx-auto mb-4" />
            <p className="text-xs font-black text-white/20 uppercase tracking-widest">No upcoming programs scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
