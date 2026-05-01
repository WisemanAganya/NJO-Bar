import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, Search, Calendar, DollarSign, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types';

export function BookingManagerFull() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});

  useEffect(() => {
    fetchBookings();
    const subscription = supabase
      .channel('bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchBookings)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('event_date', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleUpdatePayment = async (id: string, paymentStatus: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ payment_status: paymentStatus }).eq('id', id);
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Cancel this booking?')) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      (statusFilter === 'all' || b.status === statusFilter) &&
      (b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.eventType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    revenue: bookings.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    unpaid: bookings.filter((b) => b.paymentStatus === 'unpaid').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Booking Manager</h2>
        <p className="text-white/50">Manage event bookings, payments, and client communications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-blue-500">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-green-500">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Paid Revenue</p>
            <p className="text-3xl font-bold text-green-400">${stats.revenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Unpaid</p>
            <p className="text-3xl font-bold text-red-400">${stats.unpaid.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search bookings..."
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center text-white/40">No bookings found.</CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <motion.div key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="bg-white/5 border-white/10 hover:border-amber-500/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-lg font-bold text-white">{booking.clientName}</p>
                        <p className="text-sm text-white/60">{booking.location || 'Location TBD'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="text-xs text-white/50">Event Date</p>
                          <p className="text-sm font-medium text-white">{booking.eventDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-white/50">Guests</p>
                          <p className="text-sm font-medium text-white">{booking.guestCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-xs text-white/50">Amount</p>
                          <p className="text-sm font-bold text-amber-500">${booking.totalAmount}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDelete(booking.id!)}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking.id!, e.target.value)}
                        className={`px-3 py-2 rounded text-xs font-bold border ${
                          booking.status === 'confirmed'
                            ? 'bg-green-500/20 border-green-500/30 text-green-400'
                            : booking.status === 'pending'
                              ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                              : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}
                      >
                        <option value="pending">Status: Pending</option>
                        <option value="confirmed">Status: Confirmed</option>
                        <option value="cancelled">Status: Cancelled</option>
                      </select>
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => handleUpdatePayment(booking.id!, e.target.value)}
                        className={`px-3 py-2 rounded text-xs font-bold border ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-green-500/20 border-green-500/30 text-green-400'
                            : booking.paymentStatus === 'partial'
                              ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                              : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}
                      >
                        <option value="unpaid">Payment: Unpaid</option>
                        <option value="partial">Payment: Partial</option>
                        <option value="paid">Payment: Paid</option>
                      </select>
                    </div>

                    {booking.notes && (
                      <p className="text-sm text-white/60 italic bg-white/5 p-2 rounded border border-white/10">
                        Notes: {booking.notes}
                      </p>
                    )}
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
