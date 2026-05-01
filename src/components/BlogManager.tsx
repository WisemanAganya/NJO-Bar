import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Eye, Pen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types';

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    published: false,
    featuredImageUrl: '',
  });

  useEffect(() => {
    fetchPosts();
    const subscription = supabase
      .channel('blog_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchPosts)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from('blog_posts').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([
          {
            ...formData,
            author_id: (await supabase.auth.getUser()).data.user?.id,
            published_at: formData.published ? new Date().toISOString() : null,
          },
        ]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: [],
        published: false,
        featuredImageUrl: '',
      });
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData(post);
    setEditingId(post.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) {
      try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Blog Manager</h2>
          <p className="text-white/50">Create and manage blog posts and articles.</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              slug: '',
              excerpt: '',
              content: '',
              category: '',
              tags: [],
              published: false,
              featuredImageUrl: '',
            });
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Total Posts</p>
            <p className="text-3xl font-bold text-blue-500">{posts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-white/50 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-500">{publishedCount}</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit' : 'Create'} Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <Input
                  placeholder="Slug (auto-generated)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Input
                placeholder="Excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Featured Image URL"
                value={formData.featuredImageUrl}
                onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-32"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <Input
                  placeholder="Tags (comma-separated)"
                  value={formData.tags?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((t) => t.trim()) })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-white">Publish Now</span>
              </label>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
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
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center text-white/40">No posts found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/5 border-white/10 hover:border-amber-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{post.title}</h3>
                        {post.published && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Published</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        {post.category && <span>📁 {post.category}</span>}
                        <span>👁️ {post.viewsCount} views</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-400"
                      >
                        <Pen className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(post.id!)}
                        className="bg-red-600/20 hover:bg-red-600/40 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
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
