import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Calendar, DollarSign, GlassWater, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertTriangle, 
  ShoppingBag, ShieldCheck, CreditCard, LayoutDashboard, FileText, ClipboardList, Ticket, History, Briefcase, 
  BarChart3, Wallet, UserCheck, Timer, Package, Search, Download, Filter, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Booking, InventoryItem, Order, Lead, Voucher, AuditLog, UserProfile } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type DashboardTab = 'summary' | 'financials' | 'operations' | 'crm' | 'vouchers' | 'audit';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('summary');
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [enrollments, setEnrollments] = React.useState<any[]>([]);
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [vouchers, setVouchers] = React.useState<Voucher[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const [members, setMembers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, inventoryRes, ordersRes, enrollmentsRes, leadsRes, vouchersRes, auditRes, membersRes] = await Promise.all([
          supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          supabase.from('inventory').select('*'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('enrollments').select('*').order('created_at', { ascending: false }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
          supabase.from('vouchers').select('*').order('created_at', { ascending: false }),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
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
        setEnrollments(enrollmentsRes.data || []);
        setLeads(leadsRes.data || []);
        setVouchers(vouchersRes.data || []);
        setAuditLogs(auditRes.data || []);
        setMembers(membersRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Calculations ---
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0) + 
                       orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0) +
                       enrollments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalCosts = totalRevenue * 0.4; // Mock cost calculation (40% margin)
  const netProfit = totalRevenue - totalCosts;
  const lowStockItems = inventory.filter(item => item.quantity < 5);

  const sidebarItems = [
    { id: 'summary', label: 'Executive Summary', icon: LayoutDashboard },
    { id: 'financials', label: 'Balanced Book & P&L', icon: Wallet },
    { id: 'operations', label: 'Operations & Events', icon: Briefcase },
    { id: 'crm', label: 'Members & CRM', icon: UserCheck },
    { id: 'vouchers', label: 'Voucher System', icon: Ticket },
    { id: 'audit', label: 'Audit & Compliance', icon: History },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 shadow-[0_0_20px_rgba(255,107,53,0.3)]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-white/5 bg-zinc-950/50 backdrop-blur-3xl p-8 flex flex-col gap-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">
            NJO <span className="text-amber-500">HQ.</span>
          </h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Executive Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
                activeTab === item.id 
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-black" : "text-amber-500/50 group-hover:text-amber-500")} />
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Admin Secure</span>
          </div>
          <p className="text-[10px] text-white/40 font-medium leading-relaxed">Logged in as Executive Admin. All actions are audited.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">Command Centre / {activeTab}</p>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                <Input 
                  placeholder="Global Audit Search..." 
                  className="w-64 bg-white/5 border-white/10 pl-12 rounded-2xl h-12 text-xs font-bold"
                />
              </div>
              <Button variant="outline" className="h-12 rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                <Download size={14} /> Export Report
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* SUMMARY TAB */}
            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Gross', value: `KSh ${(totalRevenue / 1000).toFixed(1)}k`, icon: CreditCard, trend: '+12.5%', color: 'text-amber-500' },
                    { title: 'Active Bookings', value: bookings.length, icon: Calendar, trend: 'Action Req.', color: 'text-amber-500' },
                    { title: 'New Leads', value: leads.length, icon: Users, trend: '+5%', color: 'text-amber-500' },
                    { title: 'Bar Health', value: lowStockItems.length > 0 ? 'Alert' : 'Optimal', icon: ShieldCheck, trend: 'Stable', color: 'text-green-500' },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all border-b-4 border-b-amber-500/20">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.title}</p>
                          <stat.icon size={16} className={stat.color} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter">{stat.value}</h2>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-black">{stat.trend}</Badge>
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Vs Month</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-white/5 border-white/10 p-10 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Recent Business Activities</h3>
                      <Filter size={16} className="text-white/20" />
                    </div>
                    <div className="space-y-4">
                      {bookings.slice(0, 4).map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-amber-500 font-black">
                              {b.eventType.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-tight">{b.clientName}</p>
                              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{b.eventType} • {format(new Date(b.eventDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black">KSh {b.totalAmount.toLocaleString()}</p>
                            <Badge className="bg-amber-500/10 text-amber-500 border-none text-[8px] uppercase">{b.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="bg-amber-500 p-10 rounded-[3rem] text-black space-y-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Performance Metrics</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Service & Conversion KPI</p>
                    </div>
                    <div className="space-y-6">
                      {[
                        { label: 'Booking Conv.', value: 88 },
                        { label: 'Inventory Opt.', value: 94 },
                        { label: 'Service Speed', value: 91 },
                      ].map((kpi, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>{kpi.label}</span>
                            <span>{kpi.value}%</span>
                          </div>
                          <Progress value={kpi.value} className="h-1.5 bg-black/10" />
                        </div>
                      ))}
                    </div>
                    <Button className="w-full h-14 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-900">
                      View Deep Insights
                    </Button>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* FINANCIALS TAB */}
            {activeTab === 'financials' && (
              <motion.div
                key="financials"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-zinc-900 border-white/5 p-10 rounded-[3rem] space-y-10">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-1">Balanced Book</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Fiscal Assets & Liability</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between p-6 rounded-2xl bg-white/5">
                        <span className="text-xs font-black uppercase text-white/40">Cash on Hand (M-Pesa)</span>
                        <span className="text-xl font-black text-emerald-500">KSh {(totalRevenue * 0.8).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-6 rounded-2xl bg-white/5">
                        <span className="text-xs font-black uppercase text-white/40">Accounts Receivable</span>
                        <span className="text-xl font-black text-amber-500">KSh {(totalRevenue * 0.2).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-6 rounded-2xl bg-white/5">
                        <span className="text-xs font-black uppercase text-white/40">Inventory Assets</span>
                        <span className="text-xl font-black text-white">KSh {(inventory.length * 1500).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex justify-between items-end">
                      <span className="text-xs font-black uppercase text-amber-500">Total Net Worth</span>
                      <span className="text-5xl font-black tracking-tighter italic">KSh {(totalRevenue + 50000).toLocaleString()}</span>
                    </div>
                  </Card>

                  <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem] flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-1 text-amber-500">Profit & Loss</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Operating Efficiency Report</p>
                    </div>

                    <div className="space-y-8 py-10">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black uppercase tracking-tight">Total Revenue</p>
                        <p className="text-xl font-black">KSh {totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between text-red-500">
                        <p className="text-sm font-black uppercase tracking-tight">Operational Costs</p>
                        <p className="text-xl font-black">- KSh {totalCosts.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between text-white/40">
                        <p className="text-sm font-black uppercase tracking-tight italic">Taxes (Estimated)</p>
                        <p className="text-xl font-black">- KSh {(totalRevenue * 0.16).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2">Current Net Profit</p>
                      <h2 className="text-5xl font-black text-emerald-400 tracking-tighter">KSh {netProfit.toLocaleString()}</h2>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* OPERATIONS TAB */}
            {activeTab === 'operations' && (
              <motion.div
                key="operations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-8">
                  <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Upcoming Events</h3>
                      <Button variant="outline" className="rounded-xl border-white/10 text-[9px] uppercase font-black">Calendar View</Button>
                    </div>
                    <div className="space-y-6">
                      {bookings.slice(0, 6).map((b, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-amber-500/20 transition-all">
                          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex flex-col items-center justify-center text-amber-500 shrink-0">
                            <span className="text-[10px] font-black uppercase">{format(new Date(b.eventDate), 'MMM')}</span>
                            <span className="text-2xl font-black">{format(new Date(b.eventDate), 'dd')}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-black uppercase tracking-tight">{b.eventType}</h4>
                            <p className="text-xs text-white/40 font-medium">{b.clientName} • {b.guestCount} Guests</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 rounded-lg bg-amber-500 text-black text-[9px] font-black uppercase">Assign Staff</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-8">
                  <Card className="bg-white/5 border-white/10 p-8 rounded-[2.5rem]">
                    <h3 className="text-lg font-black uppercase italic mb-6">Supply Status</h3>
                    <div className="space-y-4">
                      {inventory.slice(0, 5).map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-white/40">{item.name}</span>
                            <span>{item.quantity} {item.unit}</span>
                          </div>
                          <Progress value={(item.quantity / 20) * 100} className={cn("h-1.5 bg-white/5", item.quantity < 5 ? "text-red-500" : "text-amber-500")} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* CRM TAB */}
            {activeTab === 'crm' && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-white/5 border-white/10 p-10 rounded-[3rem]">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Member Directory</h3>
                        <div className="flex gap-3">
                          <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black">All</Button>
                          <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black text-amber-500">Premium</Button>
                          <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black text-white/40">Staff</Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {members.map((member, i) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-amber-500/20 flex items-center justify-center overflow-hidden">
                                {member.photoURL ? <img src={member.photoURL} className="w-full h-full object-cover" /> : <Users className="text-white/20 w-6 h-6" />}
                              </div>
                              <div>
                                <p className="text-sm font-black uppercase">{member.displayName || 'Anonymous User'}</p>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{member.email} • Joined {format(new Date(member.createdAt), 'MMM yyyy')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={cn("text-[9px] uppercase font-black", member.role === 'admin' ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/40')}>
                                {member.role}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-8">
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 p-10 rounded-[3rem] text-white space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xl">
                        <TrendingUp size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic">Club Status</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Membership & Growth</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-black/10 p-4 rounded-xl">
                          <span className="text-[10px] font-black uppercase">Active Members</span>
                          <span className="text-xl font-black">{members.length}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/10 p-4 rounded-xl">
                          <span className="text-[10px] font-black uppercase">Churn Rate</span>
                          <span className="text-xl font-black">2.4%</span>
                        </div>
                      </div>
                      <Button className="w-full h-14 bg-white text-indigo-600 font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-100">
                        Campaign Manager
                      </Button>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VOUCHERS TAB */}
            {activeTab === 'vouchers' && (
              <motion.div
                key="vouchers"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Active System Vouchers</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Issued gift cards & event passes</p>
                  </div>
                  <Button className="bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl h-14 px-8 flex gap-2">
                    <Plus size={18} /> Issue New Voucher
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vouchers.map((v, i) => (
                    <Card key={i} className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all">
                        <Ticket size={48} className="text-amber-500" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                          <Badge className="bg-amber-500/10 text-amber-500 border-none text-[8px] uppercase tracking-widest mb-2">{v.type}</Badge>
                          <h4 className="text-2xl font-black tracking-tighter text-white uppercase">{v.code}</h4>
                        </div>
                        <div className="flex justify-between items-end border-t border-white/5 pt-6">
                          <div>
                            <p className="text-[9px] font-black text-white/20 uppercase mb-1">Value</p>
                            <p className="text-2xl font-black text-amber-500">KSh {v.value.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-white/20 uppercase mb-1">Expires</p>
                            <p className="text-[11px] font-bold text-white/60 uppercase">{format(new Date(v.expiresAt), 'MMM yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
                          <div className={cn("w-1.5 h-1.5 rounded-full", v.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500')} />
                          {v.status}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {vouchers.length === 0 && (
                    <div className="col-span-full py-24 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-6">
                      <Ticket size={64} className="text-white/10" />
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-white/20">No vouchers currently circulation</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* AUDIT TAB */}
            {activeTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <Card className="bg-zinc-950 border border-white/5 p-10 rounded-[3.5rem] shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">System Audit Log</h3>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-xl border-white/10 text-[9px] font-black uppercase px-6">Filter Action</Button>
                      <Button variant="outline" className="rounded-xl border-white/10 text-[9px] font-black uppercase px-6">Select Date</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-6 p-5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                          <History size={18} />
                        </div>
                        <div className="flex-1 grid grid-cols-4 gap-6 items-center">
                          <div className="col-span-1">
                            <p className="text-xs font-black text-white uppercase">{log.adminName}</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">ID: {log.adminId.slice(0, 8)}</p>
                          </div>
                          <div className="col-span-1">
                            <Badge className="bg-zinc-900 text-white/60 border-white/10 text-[9px] font-black uppercase">{log.action}</Badge>
                          </div>
                          <div className="col-span-1">
                            <p className="text-[10px] text-white/40 font-medium italic line-clamp-1">{JSON.stringify(log.details)}</p>
                          </div>
                          <div className="col-span-1 text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase">{format(new Date(log.createdAt), 'MMM dd, HH:mm')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <div className="py-20 text-center space-y-6">
                        <ShieldCheck size={48} className="text-white/5 mx-auto" />
                        <p className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">All system channels clean • No recent logs</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
