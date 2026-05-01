import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Bell, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { EventReminder, Booking } from '@/types';

export function ReminderManager() {
  const [reminders, setReminders] = useState<EventReminder[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<EventReminder>>({
    reminderType: 'email',
    message: '',
    scheduledFor: '',
  });

  useEffect(() => {
    fetchData();
    const reminderSub = supabase
      .channel('event_reminders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_reminders' }, fetchData)
      .subscribe();

    return () => {
      reminderSub.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      const [remindersRes, bookingsRes] = await Promise.all([
        supabase.from('event_reminders').select('*').order('scheduled_for'),
        supabase.from('bookings').select('*').order('event_date'),
      ]);

      if (remindersRes.data) {
        const mappedReminders = remindersRes.data.map((r: any) => ({
          ...r,
          reminderType: r.reminder_type,
          scheduledFor: r.scheduled_for,
          bookingId: r.booking_id,
          sentAt: r.sent_at,
          createdAt: r.created_at,
        }));
        setReminders(mappedReminders as EventReminder[]);
      }

      if (bookingsRes.data) {
        const mappedBookings = bookingsRes.data.map((b: any) => ({
          ...b,
          clientName: b.client_name,
          eventDate: b.event_date,
        }));
        setBookings(mappedBookings as Booking[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!formData.bookingId || !formData.message || !formData.scheduledFor) {
        alert('Please fill in all fields');
        return;
      }

      const { error } = await supabase.from('event_reminders').insert([{
        booking_id: formData.bookingId,
        reminder_type: formData.reminderType,
        scheduled_for: formData.scheduledFor,
        message: formData.message,
        sent: false
      }]);
      if (error) throw error;

      setShowForm(false);
      setFormData({ reminderType: 'email', message: '', scheduledFor: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this reminder?')) {
      try {
        const { error } = await supabase.from('event_reminders').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    }
  };

  const handleMarkSent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error marking as sent:', error);
    }
  };

  const upcomingReminders = reminders.filter((r) => !r.sent);
  const sentReminders = reminders.filter((r) => r.sent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Reminder Manager</h2>
          <p className="text-white/50">Schedule and manage event reminders and notifications.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Schedule Reminder
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Create New Reminder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={formData.bookingId}
                onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
              >
                <option value="">Select Booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.clientName} - {booking.eventDate}
                  </option>
                ))}
              </select>

              <select
                value={formData.reminderType}
                onChange={(e) => setFormData({ ...formData, reminderType: e.target.value as any })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="notification">Notification</option>
              </select>

              <Input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />

              <Textarea
                placeholder="Reminder Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />

              <div className="flex gap-2">
                <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
                  Schedule
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Upcoming Reminders
          </h3>
          {upcomingReminders.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-8 text-center text-white/40">No upcoming reminders.</CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <motion.div key={reminder.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="bg-white/5 border-white/10 hover:border-amber-500/30">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-white capitalize">{reminder.reminderType}</p>
                          <p className="text-xs text-white/40">{new Date(reminder.scheduledFor).toLocaleString()}</p>
                        </div>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Pending</span>
                      </div>
                      <p className="text-sm text-white/70 mb-3">{reminder.message}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleMarkSent(reminder.id!)}
                          className="flex-1 bg-green-600/20 hover:bg-green-600/40 text-green-400"
                        >
                          Mark Sent
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(reminder.id!)}
                          className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-500" /> Sent Reminders
          </h3>
          {sentReminders.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-8 text-center text-white/40">No sent reminders yet.</CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sentReminders.slice(0, 10).map((reminder) => (
                <motion.div key={reminder.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs text-white/40">
                          {new Date(reminder.sentAt || '').toLocaleString()}
                        </p>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Sent</span>
                      </div>
                      <p className="text-sm text-white/70">{reminder.message.substring(0, 80)}...</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
