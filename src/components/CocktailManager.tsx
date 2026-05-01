import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Cocktail } from '@/types';

export function CocktailManager() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Cocktail>>({
    name: '',
    category: 'Signature',
    ingredients: [],
    instructions: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchCocktails();
    const subscription = supabase
      .channel('cocktails')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cocktails' }, () => {
        fetchCocktails();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCocktails = async () => {
    try {
      const { data, error } = await supabase.from('cocktails').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCocktails(data || []);
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('cocktails')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cocktails').insert([
          {
            ...formData,
            creator_id: (await supabase.auth.getUser()).data.user?.id,
            creator_name: (await supabase.auth.getUser()).data.user?.email,
          },
        ]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Signature', ingredients: [], instructions: '', imageUrl: '' });
      fetchCocktails();
    } catch (error) {
      console.error('Error saving cocktail:', error);
    }
  };

  const handleEdit = (cocktail: Cocktail) => {
    setFormData(cocktail);
    setEditingId(cocktail.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this cocktail?')) {
      try {
        const { error } = await supabase.from('cocktails').delete().eq('id', id);
        if (error) throw error;
        fetchCocktails();
      } catch (error) {
        console.error('Error deleting cocktail:', error);
      }
    }
  };

  const filteredCocktails = cocktails.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Cocktail Manager</h2>
          <p className="text-white/50">Manage your signature cocktail collection and recipes.</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', category: 'Signature', ingredients: [], instructions: '', imageUrl: '' });
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> New Cocktail
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit' : 'Create'} Cocktail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Cocktail Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2"
                >
                  <option value="Classic">Classic</option>
                  <option value="Signature">Signature</option>
                  <option value="Mocktail">Mocktail</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              <Input
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Textarea
                placeholder="Instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Ingredients (comma-separated)"
                value={formData.ingredients?.join(', ')}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value.split(',').map((i) => i.trim()) })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search cocktails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : filteredCocktails.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center text-white/40">No cocktails found.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCocktails.map((cocktail) => (
            <motion.div key={cocktail.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/5 border-white/10 h-full hover:border-amber-500/30 transition-colors">
                {cocktail.imageUrl && (
                  <div className="h-40 bg-white/5 overflow-hidden rounded-t-lg">
                    <img src={cocktail.imageUrl} alt={cocktail.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-base">{cocktail.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {cocktail.category} • ⭐ {cocktail.rating}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-white/50 mb-3">{cocktail.instructions.substring(0, 80)}...</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(cocktail)}
                      className="flex-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(cocktail.id!)}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
