import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  GlassWater, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GraduationCap,
  ShoppingBag,
  Mail,
  Zap,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Booking, Cocktail, Course, Enrollment, InventoryItem, Order, Lead } from '@/types';
import { cn } from '@/lib/utils';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [cocktails, setCocktails] = React.useState<Cocktail[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, cocktailsRes, inventoryRes, ordersRes, leadsRes] = await Promise.all([
          supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          supabase.from('cocktails').select('*').order('rating', { ascending: false }).limit(5),
          supabase.from('inventory').select('*'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
        ]);

        if (bookingsRes.data) {
          const mapped = bookingsRes.data.map((b: any) => ({
            ...b,
            clientName: b.client_name,
            eventDate: b.event_date,
            eventType: b.event_type,
            guestCount: b.guest_count,
            totalAmount: b.total_amount,
            paymentStatus: b.payment_status,
            createdAt: b.created_at,
            updatedAt: b.updated_at,
          }));
          setBookings(mapped as Booking[]);
        }
        setCocktails(cocktailsRes.data || []);
        setInventory(inventoryRes.data || []);
        setOrders(ordersRes.data || []);
        setLeads(leadsRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const lowStockItems = inventory.filter(item => item.quantity < 5);

  const metrics = [
    { 
      title: 'Gross Revenue', 
      value: `KSh ${(totalRevenue / 1000).toFixed(1)}k`, 
      icon: CreditCard, 
      trend: '+12.5%', 
      color: 'text-amber-500',
      desc: 'Net from M-Pesa & Private bookings'
    },
    { 
      title: 'Active Bookings', 
      value: bookings.filter(b => b.status === 'pending').length.toString(), 
      icon: Zap, 
      trend: 'Action Req.', 
      color: 'text-amber-500',
      desc: 'Awaiting STK Push confirmation'
    },
    { 
      title: 'Conversion', 
      value: `${((leads.length / (bookings.length || 1)) * 10).toFixed(0)}%`, 
      icon: Users, 
      trend: '+5%', 
      color: 'text-amber-500',
      desc: 'Lead to booking ratio'
    },
    { 
      title: 'Inventory Health', 
      value: lowStockItems.length > 0 ? 'Alert' : 'Stable', 
      icon: ShieldCheck, 
      trend: lowStockItems.length > 0 ? `${lowStockItems.length} Low` : 'Optimal', 
      color: lowStockItems.length > 0 ? 'text-red-500' : 'text-green-500',
      desc: 'Bar supply & spirit levels'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 shadow-[0_0_20px_rgba(255,107,53,0.3)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            Command <span className="text-amber-500">Center</span>
          </h2>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">NJO Bar Operations • Nairobi v1.5.0</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Sync: Karen Server
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <metric.icon className="w-24 h-24" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{metric.title}</p>
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter">{metric.value}</h3>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", metric.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500')}>
                    {metric.trend}
                  </span>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Growth</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 rounded-[3rem] bg-white/5 border border-white/10 p-10 overflow-hidden relative">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Recent Reservs</h3>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Last 5 high-priority requests</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/5 px-6 rounded-2xl border border-amber-500/20"
              onClick={() => navigate('/admin/bookings')}
            >
              View Full List
            </Button>
          </div>
          
          <div className="space-y-6">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 font-black text-xl">
                    {booking.clientName?.charAt(0) || 'N'}
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">{booking.clientName}</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{booking.eventType} • {booking.eventDate}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xl font-black text-white">KSh {booking.totalAmount?.toLocaleString() || 'TBD'}</p>
                  <div className={cn(
                    "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border text-center",
                    booking.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                    booking.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                  )}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="text-center py-20 text-white/20 font-black uppercase tracking-widest italic border border-dashed border-white/10 rounded-[2rem]">
                No pending operations.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Inventory Pulse */}
          <div className="rounded-[3rem] bg-white/5 border border-white/10 p-10 relative overflow-hidden">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase italic mb-8 flex items-center gap-3">
              <AlertTriangle className="text-amber-500 w-6 h-6" /> Supply Pulse
            </h3>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="p-5 rounded-[1.5rem] bg-red-500/5 border border-red-500/10 flex items-center justify-between group hover:bg-red-500/10 transition-colors">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{item.name}</p>
                      <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-red-500">{item.quantity} {item.unit}</p>
                      <Progress value={(item.quantity / 20) * 100} className="h-1 w-12 bg-white/5 mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 leading-relaxed">
                    All inventory channels <br /> optimally pressurized.
                  </p>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-8 rounded-[1.5rem] border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5"
              onClick={() => navigate('/admin/inventory')}
            >
              Inventory Manager
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="rounded-[3rem] bg-amber-500 p-10 text-black">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black tracking-tighter uppercase italic">Bar Performance</h3>
              <TrendingUp className="w-6 h-6 opacity-40" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cocktail Rating</p>
                  <p className="text-xl font-black">4.92</p>
                </div>
                <Progress value={98} className="h-2 bg-black/10" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Service Speed</p>
                  <p className="text-xl font-black">94%</p>
                </div>
                <Progress value={94} className="h-2 bg-black/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
