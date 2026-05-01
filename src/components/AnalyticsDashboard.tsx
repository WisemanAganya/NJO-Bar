import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { AnalyticsMetric, Booking, Order } from '@/types';

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const [metricsRes, bookingsRes, ordersRes] = await Promise.all([
        supabase.from('analytics').select('*').order('date', { ascending: false }).limit(30),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);

      setMetrics(metricsRes.data || []);
      setBookings(bookingsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const totalCustomers = new Set([...bookings.map((b) => b.clientId), ...orders.map((o) => o.userId)]).size;

  const revenueByMonth = bookings.reduce(
    (acc, booking) => {
      const month = new Date(booking.eventDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + (booking.totalAmount || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const bookingsByStatus = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h2>
        <p className="text-white/50">Track your business metrics and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">+12.5% vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{confirmedBookings}</p>
              <div className="flex items-center gap-1 mt-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-white/40">Out of {bookings.length} total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">{totalOrders}</p>
              <div className="flex items-center gap-1 mt-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-white/40">E-commerce orders</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-500">{totalCustomers}</p>
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-white/40">Unique customers</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(revenueByMonth)
                  .sort((a, b) => b[1] - a[1])
                  .map(([month, revenue]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm text-white/60">{month}</span>
                      <div className="flex-1 mx-4 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{
                            width: `${
                              (revenue / Math.max(...Object.values(revenueByMonth))) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-amber-500">${revenue.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(bookingsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          status === 'confirmed'
                            ? 'bg-green-500'
                            : status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm capitalize text-white">{status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{count}</span>
                      <span className="text-xs text-white/40">
                        {((count / bookings.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[
                ...bookings.slice(0, 5).map((b) => ({
                  type: 'booking',
                  name: b.clientName,
                  amount: b.totalAmount,
                  date: b.eventDate,
                  status: b.status,
                })),
                ...orders.slice(0, 5).map((o) => ({
                  type: 'order',
                  name: o.userName,
                  amount: o.totalAmount,
                  date: o.createdAt,
                  status: o.status,
                })),

              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-white/40">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-500">${item.amount.toFixed(2)}</p>
                      <p className={`text-xs font-bold capitalize ${
                        item.status === 'confirmed' ? 'text-green-400' :
                        item.status === 'pending' ? 'text-amber-400' : 'text-white/40'
                      }`}>
                        {item.status}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
