import React from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types';

export function EventReminders() {
  const [upcomingBookings, setUpcomingBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sendingReminder, setSendingReminder] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'confirmed')
        .eq('reminder_sent', false)
        .gte('event_date', today.toISOString().split('T')[0])
        .lte('event_date', nextWeek.toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (error) throw error;
      setUpcomingBookings(data || []);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      toast.error('Failed to load upcoming events');
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (booking: Booking) => {
    setSendingReminder(booking.id!);

    try {
      // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
      // For now, we'll simulate sending a reminder and update the database

      // Simulate API call to send reminder
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update the booking to mark reminder as sent
      const { error } = await supabase
        .from('bookings')
        .update({
          reminder_sent: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;

      // Update local state
      setUpcomingBookings(prev =>
        prev.map(b =>
          b.id === booking.id ? { ...b, reminderSent: true } : b
        )
      );

      toast.success(`Reminder sent to ${booking.clientName}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    } finally {
      setSendingReminder(null);
    }
  };

  const getDaysUntilEvent = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 1) return 'text-red-500';
    if (daysUntil <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUrgencyBadge = (daysUntil: number) => {
    if (daysUntil <= 1) return { color: 'bg-red-500', text: 'Urgent' };
    if (daysUntil <= 3) return { color: 'bg-yellow-500', text: 'Soon' };
    return { color: 'bg-green-500', text: 'Upcoming' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Reminders</h2>
          <p className="text-white/60">Send reminders for upcoming confirmed bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/10 text-white">
            {upcomingBookings.length} upcoming events
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {upcomingBookings.filter(b => getDaysUntilEvent(b.eventDate) <= 1).length}
                </p>
                <p className="text-sm text-white/60">Urgent (≤1 day)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {upcomingBookings.filter(b => getDaysUntilEvent(b.eventDate) <= 3 && getDaysUntilEvent(b.eventDate) > 1).length}
                </p>
                <p className="text-sm text-white/60">Soon (2-3 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {upcomingBookings.filter(b => getDaysUntilEvent(b.eventDate) > 3).length}
                </p>
                <p className="text-sm text-white/60">Upcoming (4-7 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {upcomingBookings.map((booking) => {
          const daysUntil = getDaysUntilEvent(booking.eventDate);
          const urgency = getUrgencyBadge(daysUntil);

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${urgency.color} text-black`}>
                            {urgency.text}
                          </Badge>
                          {booking.isRecurring && (
                            <Badge variant="outline" className="border-amber-500 text-amber-500">
                              Recurring
                            </Badge>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${getUrgencyColor(daysUntil)}`}>
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold">{booking.clientName}</h3>
                        <p className="text-amber-500 font-medium">{booking.eventType}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/40" />
                          <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-white/40" />
                          <span>{booking.duration || 'TBD'} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white/40" />
                          <span className="truncate">Client email needed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-white/40" />
                          <span>Reminder {booking.reminderSent ? 'sent' : 'pending'}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="bg-white/5 rounded-md p-3">
                          <p className="text-sm text-white/60">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {booking.reminderSent ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">Sent</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => sendReminder(booking)}
                          disabled={sendingReminder === booking.id}
                          className="bg-amber-500 text-black hover:bg-amber-600"
                        >
                          {sendingReminder === booking.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Reminder
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        View Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {upcomingBookings.length === 0 && (
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No upcoming reminders</h3>
              <p className="text-white/60">All confirmed events within the next week have been reminded.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reminder Templates */}
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Reminder Templates
          </CardTitle>
          <CardDescription className="text-white/40">
            Customize reminder messages sent to clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/5 rounded-md p-4">
            <h4 className="font-medium mb-2">Event Reminder (3 days before)</h4>
            <p className="text-sm text-white/60">
              Dear [Client Name],<br /><br />
              This is a friendly reminder that your [Event Type] is scheduled for [Event Date] at [Location].<br /><br />
              We're excited to serve you and your [Guest Count] guests. Please don't hesitate to contact us if you have any questions or need to make changes.<br /><br />
              Best regards,<br />
              NJO Bar Team
            </p>
          </div>

          <div className="bg-white/5 rounded-md p-4">
            <h4 className="font-medium mb-2">Day Before Reminder</h4>
            <p className="text-sm text-white/60">
              Dear [Client Name],<br /><br />
              Just a quick reminder that your [Event Type] is tomorrow! We're preparing everything for an amazing experience.<br /><br />
              See you at [Location] for your special event.<br /><br />
              Best regards,<br />
              NJO Bar Team
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
