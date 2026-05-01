import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Share2, Heart, MessageCircle, Plus, Send, Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, ListChecks, ChefHat } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Comment, Like, Rating, Cocktail } from '@/types';

// Fallback data for initial render if Supabase is empty
const FALLBACK_COCKTAILS: Cocktail[] = [
  {
    id: '1',
    name: 'Kilimanjaro Mist',
    category: 'Signature',
    creatorName: 'NJO Lead Mixologist',
    creatorId: 'system',
    rating: 5.0,
    ratingCount: 34,
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=400',
    ingredients: ['Premium Vodka', 'Blue Curacao', 'Coconut Cream', 'Fresh Pineapple Juice'],
    instructions: 'Shake all ingredients with ice. Strain into a chilled hurricane glass. Garnish with a pineapple wedge and a maraschino cherry.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Nairobi Sundowner',
    category: 'Classic',
    creatorName: 'Sarah J.',
    creatorId: 'system',
    rating: 4.9,
    ratingCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400',
    ingredients: ['Kenya Gold Coffee Liqueur', 'Premium Gin', 'Aromatic Bitters', 'Orange Zest'],
    instructions: 'Stir gin and coffee liqueur over large ice cubes. Add 2 dashes of bitters. Express orange oils over the glass.',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Diani Breeze',
    category: 'Mocktail',
    creatorName: 'Marcus T.',
    creatorId: 'system',
    rating: 4.8,
    ratingCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400',
    ingredients: ['Fresh Lime', 'Mint Leaves', 'Passion Fruit Puree', 'Soda Water'],
    instructions: 'Muddle mint and lime. Add passion fruit puree. Fill with crushed ice and top with soda. Garnish with a mint sprig.',
    createdAt: new Date().toISOString()
  }
];

function CocktailDetails({ cocktail, user }: { cocktail: any, user: any }) {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [likes, setLikes] = React.useState<Like[]>([]);
  const [ratings, setRatings] = React.useState<Rating[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [userRating, setUserRating] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('cocktail_id', cocktail.id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);

        // Fetch likes
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('*')
          .eq('cocktail_id', cocktail.id);

        if (likesError) throw likesError;
        setLikes(likesData || []);

        // Fetch ratings
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('*')
          .eq('cocktail_id', cocktail.id);

        if (ratingsError) throw ratingsError;
        setRatings(ratingsData || []);

        if (user) {
          const myRating = ratingsData?.find(r => r.user_id === user.id);
          if (myRating) setUserRating(myRating.value);
        }
      } catch (error) {
        console.error('Error fetching cocktail data:', error);
        toast.error('Failed to load cocktail details');
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const commentsSubscription = supabase
      .channel(`comments-${cocktail.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `cocktail_id=eq.${cocktail.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => [payload.new as Comment, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    const likesSubscription = supabase
      .channel(`likes-${cocktail.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `cocktail_id=eq.${cocktail.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLikes(prev => [...prev, payload.new as Like]);
        } else if (payload.eventType === 'DELETE') {
          setLikes(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    const ratingsSubscription = supabase
      .channel(`ratings-${cocktail.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ratings', filter: `cocktail_id=eq.${cocktail.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newRating = payload.new as Rating;
          setRatings(prev => [...prev, newRating]);
          if (user && newRating.userId === user.id) {
            setUserRating(newRating.value);
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedRating = payload.new as Rating;
          setRatings(prev => prev.map(r => r.id === updatedRating.id ? updatedRating : r));
          if (user && updatedRating.userId === user.id) {
            setUserRating(updatedRating.value);
          }
        } else if (payload.eventType === 'DELETE') {
          setRatings(prev => prev.filter(r => r.id !== payload.old.id));
          if (user && payload.old.user_id === user.id) {
            setUserRating(null);
          }
        }
      })
      .subscribe();

    return () => {
      commentsSubscription.unsubscribe();
      likesSubscription.unsubscribe();
      ratingsSubscription.unsubscribe();
    };
  }, [cocktail.id, user?.id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    const existingLike = likes.find(l => l.userId === user.id);
    try {
      if (existingLike) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
        toast.info("Removed from favorites");
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({
            cocktail_id: cocktail.id,
            user_id: user.id
          });

        if (error) throw error;
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleRate = async (value: number) => {
    if (!user) {
      toast.error("Please login to rate");
      return;
    }

    try {
      const existingRating = ratings.find(r => r.userId === user.id);

      if (existingRating) {
        const { error } = await supabase
          .from('ratings')
          .update({ value })
          .eq('id', existingRating.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ratings')
          .insert({
            cocktail_id: cocktail.id,
            user_id: user.id,
            value
          });

        if (error) throw error;
      }

      setUserRating(value);
      toast.success(`Rated ${value} stars!`);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const avgRating = ratings.length > 0 
    ? (ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length).toFixed(1)
    : cocktail.rating;

  const isLiked = user && likes.some(l => l.userId === user.id);

  // Split instructions into steps if they contain periods
  const steps = cocktail.instructions.split('.').filter((s: string) => s.trim().length > 0);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          cocktail_id: cocktail.id,
          user_id: user.id,
          user_name: user.user_metadata?.display_name || 'Anonymous',
          text: newComment.trim()
        });

      if (error) throw error;
      setNewComment('');
      toast.success("Comment added!");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh]">
      <div className="space-y-6">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
          <img 
            src={cocktail.image} 
            alt={cocktail.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary"
              onClick={handleLike}
              className={`rounded-full shadow-lg transition-all ${isLiked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg font-bold">{avgRating}</span>
              <span className="text-xs text-white/40 ml-1">({ratings.length || cocktail.ratingCount || 0})</span>
            </div>
            <div className="flex items-center gap-1 text-white/40">
              <Heart className="w-5 h-5" />
              <span className="text-lg font-bold">{likes.length || cocktail.likes}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`transition-colors ${userRating && star <= userRating ? 'text-amber-500' : 'text-white/10 hover:text-amber-500/50'}`}
              >
                <Star className={`w-5 h-5 ${userRating && star <= userRating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        <Accordion defaultValue={["ingredients"]} className="w-full">
          <AccordionItem value="ingredients" className="border-white/10">
            <AccordionTrigger className="text-amber-500 hover:text-amber-400 py-4">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                <span className="uppercase tracking-widest text-xs font-bold">Ingredients</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 pt-2">
                {cocktail.ingredients.map((ing: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500/50" />
                    <span className="text-sm text-white/80">{ing}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="instructions" className="border-white/10">
            <AccordionTrigger className="text-amber-500 hover:text-amber-400 py-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                <span className="uppercase tracking-widest text-xs font-bold">Preparation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {steps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-500">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{step.trim()}.</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col h-full min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white">Comments ({comments.length})</h4>
        </div>
        
        <ScrollArea className="flex-grow pr-4 mb-6">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-500">{comment.userName}</span>
                    <span className="text-[10px] text-white/30">
                      {comment.createdAt ? new Date((comment.createdAt as any).seconds * 1000).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{comment.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {comments.length === 0 && (
              <div className="text-center py-12 text-white/20 italic">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="bg-white/10 mb-4" />

        <form onSubmit={handleAddComment} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Add a comment..." : "Login to comment"}
            disabled={!user || isSubmitting}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!user || isSubmitting || !newComment.trim()}
            className="bg-amber-500 text-black hover:bg-amber-600 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export function CocktailGallery({ user }: { user: any }) {
  const [cocktails, setCocktails] = React.useState<Cocktail[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');

  React.useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const { data, error } = await supabase
          .from('cocktails')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCocktails(data && data.length > 0 ? data : FALLBACK_COCKTAILS);
      } catch (error) {
        console.error("Error fetching cocktails:", error);
        setCocktails(FALLBACK_COCKTAILS);
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, []);

  const filteredCocktails = cocktails.filter(cocktail => {
    const matchesSearch = 
      cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cocktail.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cocktail.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || cocktail.category === categoryFilter;
    
    const matchesRating = ratingFilter === 'all' || cocktail.rating >= parseFloat(ratingFilter);

    return matchesSearch && matchesCategory && matchesRating;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setRatingFilter('all');
  };

  return (
    <section className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Mixology Community</h2>
            <p className="text-white/50 text-lg">Share your creations, rate bespoke recipes, and discover new flavors from around the world.</p>
          </div>
          <Button className="bg-amber-500 text-black hover:bg-amber-600 font-bold h-12 px-6 rounded-full">
            <Plus className="w-5 h-5 mr-2" /> Share Creation
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Search Cocktails</label>
              <div className="relative">
                <Input 
                  placeholder="Search by name, ingredient, or creator..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-amber-500/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Signature">Signature</SelectItem>
                  <SelectItem value="Mocktail">Mocktail</SelectItem>
                  <SelectItem value="Seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Minimum Rating</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.0">3.0+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFilters}
                className="h-11 w-full border border-white/10 hover:bg-white/5 text-white/40 hover:text-white"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCocktails.map((cocktail, i) => (
              <motion.div
                key={cocktail.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 text-white overflow-hidden group hover:border-amber-500/50 transition-all duration-500 h-full flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={cocktail.imageUrl} 
                      alt={cocktail.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded bg-amber-500 text-black">
                        {cocktail.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6 border border-white/20">
                          <AvatarFallback className="bg-amber-500 text-black text-[10px] font-bold">
                            {cocktail.creatorName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-white/80">{cocktail.creatorName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight">{cocktail.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{cocktail.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/40">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{cocktail.ratingCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cocktail.ingredients.slice(0, 4).map((ing, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/5 text-white/40">
                          {ing}
                        </span>
                      ))}
                      {cocktail.ingredients.length > 4 && (
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/5 text-white/40">
                          +{cocktail.ingredients.length - 4} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-grow border-white/10 text-white hover:bg-white/5">
                          View Recipe & Comments
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-zinc-950 border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold tracking-tight">{cocktail.name}</DialogTitle>
                        </DialogHeader>
                        <CocktailDetails cocktail={cocktail} user={user} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon" className="border-white/10 text-white hover:bg-white/5">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredCocktails.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No cocktails found</h3>
            <p className="text-white/40">Try adjusting your search or filters to find what you're looking for.</p>
            <Button 
              variant="link" 
              onClick={clearFilters}
              className="text-amber-500 hover:text-amber-400 mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
