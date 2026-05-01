import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ShoppingBag, CreditCard, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Booking, Order } from '@/types';
import { toast } from 'sonner';

export function CustomerDashboard({ user }: { user: any }) {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, ordersRes] = await Promise.all([
          supabase.from('bookings').select('*').eq('client_id', user?.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        ]);
        if (bookingsRes.error) throw bookingsRes.error;
        if (ordersRes.error) throw ordersRes.error;
        setBookings(bookingsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (error: any) {
        console.error('Dashboard fetch error:', error);
        toast.error('Unable to load your dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  const formatStatus = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]"><div className="text-white">Loading your dashboard...</div></div>
    );
  }

  return (
    <section className="py-24 bg-black text-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Your Account</p>
          <h2 className="text-4xl md:text-5xl font-bold">Booking and order history</h2>
          <p className="text-white/60 mt-4 max-w-3xl">Review upcoming events, order status, invoices, and repeat bookings all from your account page.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/5 border-white/10 p-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-amber-500" />
                <CardTitle>Your Bookings</CardTitle>
              </div>
              <CardDescription className="text-white/60">Track all your NJO Bar event requests and confirmed services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-6">
              {bookings.length === 0 ? (
                <p className="text-white/60">No bookings yet. Start your next event with a booking request.</p>
              ) : bookings.map((booking) => (
                <div key={booking.id} className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{booking.eventType}</p>
                      <p className="text-white/60 text-sm">{new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-500">{formatStatus(booking.status)}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-amber-500" /> {booking.guestCount} guests</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> {booking.duration || 'TBD'} hrs</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 p-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
                <CardTitle>Your Orders</CardTitle>
              </div>
              <CardDescription className="text-white/60">View purchase status for alcohol and event support items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-6">
              {orders.length === 0 ? (
                <p className="text-white/60">No orders yet. Shop our premium catalog to get started.</p>
              ) : orders.map((order) => (
                <div key={order.id} className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">Order #{order.id}</p>
                      <p className="text-white/60 text-sm">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-500">{order.paymentStatus}</Badge>
                  </div>
                  <div className="mt-3 text-sm text-white/60">
                    <p>Total paid: ${order.totalAmount.toFixed(2)}</p>
                    <p className="mt-2">{order.lineItems?.length ?? 0} items</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10 p-8">
            <CardHeader>
              <CardTitle>Support & Next Steps</CardTitle>
              <CardDescription className="text-white/60">Need changes or additional event support?</CardDescription>
            </CardHeader>
            <CardContent className="mt-6 space-y-4 text-white/70">
              <p>Contact our event team to update your booking, add cocktail upgrades, or confirm your guest list.</p>
              <Button className="bg-amber-500 text-black hover:bg-amber-600">Contact Support</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 p-8">
            <CardHeader>
              <CardTitle>Estimated next payment</CardTitle>
              <CardDescription className="text-white/60">Review deposit reminders and payment milestones.</CardDescription>
            </CardHeader>
            <CardContent className="mt-6 space-y-4">
              <p className="text-white/70">All confirmed bookings receive automated payment reminders and digital invoices.</p>
              <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Upcoming invoice</p>
                    <p className="text-2xl font-bold text-white">$250.00</p>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">View invoice</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
