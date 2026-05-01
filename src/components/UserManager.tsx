import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Shield, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    email: '',
    displayName: '',
    role: 'client',
  });

  useEffect(() => {
    fetchUsers();
    const subscription = supabase
      .channel('profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const mapped = data.map((d: any) => ({
          ...d,
          displayName: d.display_name,
          photoURL: d.photo_url,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        setUsers(mapped as UserProfile[]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Delete this user? This action cannot be undone.')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    staff: users.filter((u) => u.role === 'staff').length,
    clients: users.filter((u) => u.role === 'client').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">User Manager</h2>
        <p className="text-white/50">Manage team members and customer accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, color: 'text-blue-500' },
          { label: 'Admins', value: stats.admins, color: 'text-purple-500' },
          { label: 'Staff', value: stats.staff, color: 'text-amber-500' },
          { label: 'Clients', value: stats.clients, color: 'text-green-500' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <p className="text-sm text-white/50 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 font-bold text-white/60">User</th>
                <th className="text-left py-3 px-4 font-bold text-white/60">Email</th>
                <th className="text-left py-3 px-4 font-bold text-white/60">Role</th>
                <th className="text-left py-3 px-4 font-bold text-white/60">Joined</th>
                <th className="text-right py-3 px-4 font-bold text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-white font-medium">{user.displayName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/60">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className={`px-3 py-1 rounded text-xs font-bold border ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                          : user.role === 'staff'
                            ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                            : 'bg-green-500/20 border-green-500/30 text-green-400'
                      }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="client">Client</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-white/60 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-white/40">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
