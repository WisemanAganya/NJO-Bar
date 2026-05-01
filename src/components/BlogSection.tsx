import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types';

const POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: '5 Cocktail Trends for Nairobi Events',
    slug: '5-cocktail-trends-nairobi-events',
    excerpt: 'Explore the latest premium drink trends that make corporate and lifestyle events memorable.',
    content: 'Premium cocktail trends are evolving and NJO Bar stays ahead with bespoke presentations and aromatic blends.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=1200',
    category: 'Events',
    tags: ['cocktails', 'trends', 'events'],
    authorId: 'system',
    published: true,
    publishedAt: '2026-04-01',
    viewsCount: 245,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'b2',
    title: 'How to Choose the Perfect Event Bar Package',
    slug: 'choose-perfect-event-bar-package',
    excerpt: 'A guide to selecting the right bar service for your guest list, venue, and budget.',
    content: 'Selecting the perfect package starts with defining your event mood, guest expectations and service level.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200',
    category: 'Planning',
    tags: ['packages', 'planning', 'services'],
    authorId: 'system',
    published: true,
    publishedAt: '2026-03-01',
    viewsCount: 189,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 'b3',
    title: 'Responsible Alcohol Service for Corporate Events',
    slug: 'responsible-alcohol-service-corporate',
    excerpt: 'How NJO Bar ensures safe, legal, and elevated service for every gathering.',
    content: 'Responsible service is core to our premium brand. We train staff and manage portion control for every event.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200',
    category: 'Safety',
    tags: ['safety', 'responsibility', 'service'],
    authorId: 'system',
    published: true,
    publishedAt: '2026-02-01',
    viewsCount: 312,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
  },
];

export function BlogSection() {
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubscribe = async () => {
    if (!email.includes('@')) {
      toast.error('Enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email,
        source: 'website',
        subscribed_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success('Subscribed successfully. Expect event updates and promotions.');
      setEmail('');
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Unable to subscribe right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-500 mb-4">Insights</p>
            <h2 className="text-4xl md:text-5xl font-bold">Cocktail knowledge, event strategy, and marketing ideas.</h2>
            <p className="text-white/60 mt-4 max-w-2xl">Stay inspired with our blog for planners, hosts, and corporate brand teams.</p>
          </div>
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Newsletter</p>
                <p className="text-white/60 text-sm">Get weekly event tips and offers.</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-white/5 border-white/10 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSubscribe} disabled={submitting} className="w-full bg-amber-500 text-black hover:bg-amber-600">
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-amber-500/40 transition-colors">
                <img src={post.featuredImageUrl} alt={post.title} className="h-56 w-full object-cover" />
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-2 text-sm text-amber-500 uppercase tracking-[0.35em]">
                    <Sparkles className="w-4 h-4" />
                    <span>{post.category}</span>
                  </div>
                  <CardTitle className="text-2xl text-white">{post.title}</CardTitle>
                  <CardDescription className="text-white/60">{post.excerpt}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-white/50">
                    <span>{post.authorId || 'NJO Bar Team'}</span>
                    <span>{post.publishedAt}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="ghost" className="text-amber-500 hover:bg-white/5 w-full justify-between">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
