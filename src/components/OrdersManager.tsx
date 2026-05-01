import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Eye, CheckCircle2, XCircle, Truck, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
          const mapped = data.map((d: any) => ({
              ...d,
              userId: d.customer_id,
              userName: d.customer_name,
              totalAmount: d.total_amount,
              paymentStatus: d.payment_status,
              lineItems: d.items,
              createdAt: d.created_at,
              updatedAt: d.updated_at
          }));
          setOrders(mapped as Order[]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Orders Manager</h2>
          <p className="text-white/50">Manage alcohol and event supply orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-amber-500">{orders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Pending</p>
            <p className="text-3xl font-bold text-blue-500">{orders.filter(o => o.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-500">${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search by customer name, email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center text-white/40">No orders found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/5 border-white/10 hover:border-amber-500/30">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{order.userName}</h3>
                        <Badge className={`${
                          order.status === 'pending' ? 'bg-blue-500/10 text-blue-400' :
                          order.status === 'shipped' ? 'bg-amber-500/10 text-amber-400' :
                          order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 mb-2">{order.email} • {order.phone || 'No phone'}</p>
                      <div className="text-xs text-white/40">
                         {order.lineItems?.length || 0} items • ${order.totalAmount.toLocaleString()} • {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                        {order.status === 'pending' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id!, 'shipped')} className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-400">
                                <Truck className="w-4 h-4 mr-2" /> Mark Shipped
                            </Button>
                        )}
                        {order.status === 'shipped' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id!, 'completed')} className="bg-green-600/20 hover:bg-green-600/40 text-green-400">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
                            </Button>
                        )}
                      <Button size="sm" variant="outline" className="border-white/10 h-9">
                        <Eye className="w-4 h-4 mr-2" /> Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
