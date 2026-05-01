import React from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Filter, MoreVertical, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const INVENTORY = [
  { id: '1', name: 'Grey Goose Vodka', category: 'Spirit', quantity: 12, unit: 'Bottles', price: 45, status: 'In Stock' },
  { id: '2', name: 'Hendrick\'s Gin', category: 'Spirit', quantity: 8, unit: 'Bottles', price: 52, status: 'In Stock' },
  { id: '3', name: 'Fresh Lime Juice', category: 'Mixer', quantity: 2, unit: 'Liters', price: 10, status: 'Low Stock' },
  { id: '4', name: 'Angostura Bitters', category: 'Other', quantity: 5, unit: 'Bottles', price: 15, status: 'In Stock' },
  { id: '5', name: 'Mint Leaves', category: 'Garnish', quantity: 0, unit: 'Packs', price: 5, status: 'Out of Stock' },
];

export function InventoryManager() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Inventory Management</h2>
          <p className="text-white/50">Track and manage your bar supplies in real-time.</p>
        </div>
        <Button className="bg-amber-500 text-black hover:bg-amber-600 font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> Needs attention
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-white/30 mt-1">Expected delivery: Tomorrow</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input placeholder="Search inventory..." className="bg-white/5 border-white/10 pl-10" />
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {INVENTORY.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 text-white/60">{item.category}</td>
                  <td className="px-6 py-4 text-white/60">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4 text-white/60">${item.price}</td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "font-bold",
                      item.status === 'In Stock' ? "bg-green-500/10 text-green-500" :
                      item.status === 'Low Stock' ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
