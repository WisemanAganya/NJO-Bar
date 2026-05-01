import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { InventoryItem } from '@/types';

export function InventoryManagerFull() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Spirit',
    quantity: 0,
    unit: 'ml',
    price: 0,
  });

  useEffect(() => {
    fetchInventory();
    const subscription = supabase
      .channel('inventory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, fetchInventory)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase.from('inventory').select('*').order('name');
      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from('inventory').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('inventory').insert([formData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Spirit', quantity: 0, unit: 'ml', price: 0 });
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData(item);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this inventory item?')) {
      try {
        const { error } = await supabase.from('inventory').delete().eq('id', id);
        if (error) throw error;
        fetchInventory();
      } catch (error) {
        console.error('Error deleting inventory:', error);
      }
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter((item) => item.quantity < 5);
  const totalValue = inventory.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Inventory Control</h2>
          <p className="text-white/40 font-medium">Spirits, mixers, and premium garnishes for the Kenyan market.</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', category: 'Spirit', quantity: 0, unit: 'ml', price: 0 });
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-black px-8 h-12 rounded-2xl shadow-[0_10px_30px_rgba(255,107,53,0.2)]"
        >
          <Plus className="w-5 h-5 mr-2 stroke-[3px]" /> Add Stock Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white/30">Stock Value</CardTitle>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-white">KSh {totalValue.toLocaleString()}</p>
            <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-widest">Total Estimated Value</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white/30">Health Status</CardTitle>
            <Package className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-white">{inventory.length}</p>
            <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-widest">Active SKUs</p>
          </CardContent>
        </Card>

        <Card className={`rounded-[2rem] overflow-hidden transition-all duration-500 ${lowStockItems.length > 0 ? 'bg-red-500 text-black' : 'bg-white/5 border-white/10'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-black uppercase tracking-widest ${lowStockItems.length > 0 ? 'text-black/40' : 'text-white/30'}`}>Low Stock</CardTitle>
            <AlertTriangle className={`w-5 h-5 ${lowStockItems.length > 0 ? 'text-black' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-black ${lowStockItems.length > 0 ? 'text-black' : 'text-white'}`}>{lowStockItems.length}</p>
            <p className={`text-[10px] mt-1 uppercase font-bold tracking-widest ${lowStockItems.length > 0 ? 'text-black/40' : 'text-white/30'}`}>Items below threshold</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black">{editingId ? 'Refine' : 'Register'} Stock Item</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Item Name (e.g. Gilbeys Gin 750ml)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-2"
                  >
                    <option value="Spirit" className="bg-zinc-900">Spirit</option>
                    <option value="Mixer" className="bg-zinc-900">Mixer</option>
                    <option value="Garnish" className="bg-zinc-900">Garnish</option>
                    <option value="Beer" className="bg-zinc-900">Beer</option>
                    <option value="Other" className="bg-zinc-900">Other</option>
                  </select>
                  <Input
                    placeholder="Unit (ml, bottle)"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  placeholder="Available Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-white"
                />
                <Input
                  type="number"
                  placeholder="Cost per Unit (KSh)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="bg-white/5 border-white/10 h-14 rounded-2xl text-white"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-black font-black px-8 rounded-2xl flex-1 h-14 shadow-lg shadow-emerald-500/10">
                  Save Changes
                </Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" className="text-white/60 hover:text-white rounded-2xl px-8 h-14">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/30">Item Description</th>
                  <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/30">Category</th>
                  <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/30 text-right">Stock</th>
                  <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/30 text-right">Unit Price</th>
                  <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/30 text-right">Total Value</th>
                  <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="py-6 px-8">
                      <p className="font-bold text-white group-hover:text-amber-500 transition-colors">{item.name}</p>
                    </td>
                    <td className="py-6 px-8">
                      <Badge variant="outline" className="border-white/10 text-white/50 rounded-lg">{item.category}</Badge>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <span className={`font-mono font-bold ${item.quantity < 5 ? 'text-red-500' : 'text-white'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right font-mono text-white/60">
                      KSh {item.price.toLocaleString()}
                    </td>
                    <td className="py-6 px-8 text-right">
                      <p className="font-black text-amber-500">KSh {(item.quantity * item.price).toLocaleString()}</p>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInventory.length === 0 && (
              <div className="text-center py-20 text-white/20 italic">No inventory records match your search.</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
