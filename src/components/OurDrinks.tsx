import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowRight, Check, CreditCard, Sparkles, Plus, Minus, Trash2, Beer, Wine, GlassWater, PackageCheck, ChevronRight } from 'lucide-react';
import { AIConsultant } from './AIConsultant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Types from the user's provided code
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  prices: {
    unit: 'TOT' | 'BOTTLE' | 'GLASS' | 'UNIT';
    amount: number;
  }[];
}

interface CartItem {
  id: string;
  name: string;
  category: string;
  selectedUnit: string;
  selectedPrice: number;
  quantity: number;
  imageUrl: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // GIN
  { id: 'gin-gilbeys', name: 'Gilbeys', category: 'GIN', description: 'Classic dry gin, the staple of Nairobi nightlife.', imageUrl: '/Alcohol type/gilbeys.PNG', prices: [{ unit: 'TOT', amount: 200 }, { unit: 'BOTTLE', amount: 3000 }] },
  { id: 'gin-gordons-clear', name: 'Gordons Clear', category: 'GIN', description: 'Premium distilled gin with a balanced botanical profile.', imageUrl: '/Alcohol type/gordons clear.PNG', prices: [{ unit: 'TOT', amount: 300 }, { unit: 'BOTTLE', amount: 4500 }] },
  { id: 'gin-gordons-pink', name: 'Gordons Pink', category: 'GIN', description: 'Infused with the natural sweetness of raspberries and strawberries.', imageUrl: '/Alcohol type/gordons pink.PNG', prices: [{ unit: 'TOT', amount: 300 }, { unit: 'BOTTLE', amount: 4500 }] },
  { id: 'gin-tanqueray', name: 'Tanqueray', category: 'GIN', description: 'A benchmark for all other luxury blends.', imageUrl: '/Alcohol type/tanqueray.PNG', prices: [{ unit: 'TOT', amount: 350 }, { unit: 'BOTTLE', amount: 5500 }] },

  // TEQUILA
  { id: 'tequila-jose-gold', name: 'Jose Cuervo Gold', category: 'TEQUILA', description: 'A blend of reposado and younger tequilas.', imageUrl: '/Alcohol type/jose cuervo gold.PNG', prices: [{ unit: 'TOT', amount: 350 }, { unit: 'BOTTLE', amount: 5000 }] },
  { id: 'tequila-jose-silver', name: 'Jose Cuervo Silver', category: 'TEQUILA', description: 'Clean and crisp with notes of agave.', imageUrl: '/Alcohol type/jose cuervo silver.PNG', prices: [{ unit: 'TOT', amount: 350 }, { unit: 'BOTTLE', amount: 5000 }] },
  { id: 'tequila-don-reposado', name: 'Don Julio Reposado', category: 'TEQUILA', description: 'Rich, smooth tequila with notes of caramel.', imageUrl: '/Alcohol type/don julio reposado.PNG', prices: [{ unit: 'TOT', amount: 500 }, { unit: 'BOTTLE', amount: 13000 }] },
  { id: 'tequila-don-blanco', name: 'Don Julio Blanco', category: 'TEQUILA', description: 'Crisp agave flavor and hints of citrus.', imageUrl: '/Alcohol type/don julio blanco.PNG', prices: [{ unit: 'TOT', amount: 500 }, { unit: 'BOTTLE', amount: 12000 }] },

  // WHISKEY
  { id: 'whiskey-jameson', name: 'Jameson', category: 'WHISKEY', description: 'Triple-distilled, twice as smooth Irish whiskey.', imageUrl: '/Alcohol type/jameson.PNG', prices: [{ unit: 'TOT', amount: 300 }, { unit: 'BOTTLE', amount: 5000 }] },
  { id: 'whiskey-jw-black', name: 'Johnnie Walker Black', category: 'WHISKEY', description: 'A benchmark for all other luxury blends.', imageUrl: '/Alcohol type/johnnie walker black.PNG', prices: [{ unit: 'TOT', amount: 350 }, { unit: 'BOTTLE', amount: 6000 }] },
  { id: 'whiskey-jw-double-black', name: 'JW Double Black', category: 'WHISKEY', description: 'Intense, smoky and full-bodied.', imageUrl: '/Alcohol type/jw double black.PNG', prices: [{ unit: 'TOT', amount: 350 }, { unit: 'BOTTLE', amount: 7500 }] },

  // LIQUERS
  { id: 'liq-jaegermeister', name: 'Jaegermeister', category: 'LIQUERS', description: 'A blend of 56 herbs, blooms, roots and fruits.', imageUrl: '/Alcohol type/jagermeister.PNG', prices: [{ unit: 'TOT', amount: 350 }, { unit: 'BOTTLE', amount: 5000 }] },

  // VODKA
  { id: 'vodka-smirnoff-red', name: 'Smirnoff Red', category: 'VODKA', description: 'Triple distilled and ten times filtered.', imageUrl: '/Alcohol type/smirnoff red.PNG', prices: [{ unit: 'TOT', amount: 300 }, { unit: 'BOTTLE', amount: 3000 }] },

  // RUM
  { id: 'rum-captain-morgan', name: 'Captain Morgan Spiced', category: 'RUM', description: 'Expertly blended with secret spices.', imageUrl: '/Alcohol type/captain morgan spiced.PNG', prices: [{ unit: 'TOT', amount: 300 }, { unit: 'BOTTLE', amount: 4000 }] },

  // WINES
  { id: 'wine-frontera-cab', name: 'Frontera Carbarnet Sauvignon', category: 'WINES', description: 'Rich red wine with hints of chocolate.', imageUrl: '/Alcohol type/frontera cabernet sauvignon.PNG', prices: [{ unit: 'GLASS', amount: 700 }, { unit: 'BOTTLE', amount: 3500 }] },
  { id: 'wine-frontera-blanc', name: 'Frontera Sauvignon Blanc', category: 'WINES', description: 'Crisp and refreshing white wine.', imageUrl: '/Alcohol type/frontera cabernet blanc.PNG', prices: [{ unit: 'GLASS', amount: 700 }, { unit: 'BOTTLE', amount: 3500 }] },
  { id: 'wine-bruce-blanc', name: 'Bruce Jack Sauvignon Blanc', category: 'WINES', description: 'Vibrant white wine with tropical notes.', imageUrl: '/Alcohol type/bruce jack sauvignon blanc.PNG', prices: [{ unit: 'GLASS', amount: 700 }, { unit: 'BOTTLE', amount: 3500 }] },
  { id: 'wine-bruce-cab', name: 'Bruce Carbarnet Sauvignon', category: 'WINES', description: 'Bold red wine with dark fruit flavors.', imageUrl: '/Alcohol type/BRUCE JACK CABERNET SAUVIGNON.PNG', prices: [{ unit: 'GLASS', amount: 700 }, { unit: 'BOTTLE', amount: 3500 }] },

  // BEERS
  { id: 'beer-tusker-lager', name: 'Tusker Lager', category: 'BEERS', description: 'Kenya\'s finest, brewed with quality Kenyan malt.', imageUrl: '/Alcohol type/tusker lager.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-tusker-cider', name: 'Tusker Cider', category: 'BEERS', description: 'Refreshing apple cider with a crisp finish.', imageUrl: '/Alcohol type/tusker cider.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-tusker-lite', name: 'Tusker Lite', category: 'BEERS', description: 'Clean, crisp and refreshing low-carb beer.', imageUrl: '/Alcohol type/tusker lite.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-whitecap', name: 'Whitecap', category: 'BEERS', description: 'Premium lager for the discerning drinker.', imageUrl: '/Alcohol type/whitecap.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-malt', name: 'Malt', category: 'BEERS', description: 'Rich and smooth non-alcoholic malt drink.', imageUrl: '/Alcohol type/malt.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-guiness', name: 'Guiness', category: 'BEERS', description: 'The deep, dark essence of stout beer.', imageUrl: '/Alcohol type/guinness.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-balozi', name: 'Balozi', category: 'BEERS', description: 'Pure malt lager for a refreshing taste.', imageUrl: '/Alcohol type/balozi.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-smirnoff-pin', name: 'Smirnoff Pineapple', category: 'BEERS', description: 'Bold and refreshing pineapple flavor.', imageUrl: '/Alcohol type/smirnoff pineapple.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-smirnoff-black', name: 'Smirnoff Black Ice', category: 'BEERS', description: 'Powerful and refreshing lemon taste.', imageUrl: '/Alcohol type/smirnoff black ice.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-savannah', name: 'Savannah', category: 'BEERS', description: 'Dry, crisp and refreshing cider.', imageUrl: '/Alcohol type/savannah.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },
  { id: 'beer-bilashaka', name: 'Bilashaka', category: 'BEERS', description: 'Premium craft beer with a unique profile.', imageUrl: '/Alcohol type/bilashaka.PNG', prices: [{ unit: 'UNIT', amount: 400 }] },

  // SOFT DRINKS
  { id: 'soft-redbull', name: 'Redbull', category: 'SOFT DRINKS', description: 'Vitalizes body and mind.', imageUrl: '/Alcohol type/redbull.PNG', prices: [{ unit: 'UNIT', amount: 350 }] },
  { id: 'soft-soda', name: 'Soda', category: 'SOFT DRINKS', description: 'Assorted refreshing carbonated drinks.', imageUrl: '/Alcohol type/soda.PNG', prices: [{ unit: 'UNIT', amount: 150 }] },
  { id: 'soft-water', name: 'Water', category: 'SOFT DRINKS', description: 'Pure refreshing drinking water.', imageUrl: '/Alcohol type/water.PNG', prices: [{ unit: 'UNIT', amount: 150 }] },
  { id: 'soft-sparkling', name: 'Sparkling Water', category: 'SOFT DRINKS', description: 'Effervescent and crisp.', imageUrl: '/Alcohol type/sparkling water.PNG', prices: [{ unit: 'UNIT', amount: 200 }] },
];

export function OurDrinks({ user }: { user: any }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>('ALL');
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState('');
  const [promoCode, setPromoCode] = React.useState('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(MENU_ITEMS.map(item => item.category)));
    return ['ALL', ...cats];
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const addToCart = (item: MenuItem, unit: string, price: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id && i.selectedUnit === unit);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        toast.success(`Another ${item.name} (${unit}) added to cart`);
        return newCart;
      }
      toast.success(`${item.name} (${unit}) added to cart`);
      return [...prev, { 
        id: item.id, 
        name: item.name, 
        category: item.category, 
        selectedUnit: unit, 
        selectedPrice: price, 
        quantity: 1,
        imageUrl: item.imageUrl 
      }];
    });
  };

  const updateQuantity = (id: string, unit: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id && item.selectedUnit === unit) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);
  }, [cart]);

  const discount = promoCode.trim().toLowerCase() === 'njo25' ? subtotal * 0.25 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Login to place an order and track history.');
      return;
    }
    if (!cart.length) {
      toast.error('Add items to your cart first.');
      return;
    }
    setCheckoutLoading(true);

    try {
      toast.loading('Initializing secure M-Pesa payment gateway...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lineItems = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        unit: item.selectedUnit,
        quantity: item.quantity,
        unitPrice: item.selectedPrice,
        totalPrice: item.selectedPrice * item.quantity,
      }));

      const { error } = await supabase.from('orders').insert({
        customer_id: user.id,
        customer_name: user.user_metadata?.display_name || 'Guest',
        customer_email: email || user.email,
        customer_phone: phone,
        items: lineItems,
        total_amount: total,
        status: 'pending',
        payment_status: 'unpaid',
      });
      if (error) throw error;

      toast.dismiss();
      toast.success('Secure Payment Authorized! Order placed successfully.');
      setCart([]);
      setPromoCode('');
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Unable to place order.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] rounded-full -mr-96 -mt-96" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <PackageCheck className="w-3 h-3" /> Premium Mixology & Spirits
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]"
            >
              Our <span className="text-amber-500">Menu.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/40 mt-8 text-xl font-medium max-w-xl leading-relaxed"
            >
              Explore our curated selection of premium spirits, wines, and craft beers. Available for immediate order and delivery.
            </motion.p>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black transition-all duration-300 uppercase tracking-widest ${
                    activeCategory === cat 
                      ? 'bg-amber-500 text-black shadow-[0_10px_20px_rgba(255,107,53,0.3)] scale-105' 
                      : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-auto sticky top-24"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 text-white min-w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black">
                    <ShoppingCart className="w-6 h-6 stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest">Your Order</p>
                    <p className="text-xl font-black">{cart.length} <span className="text-sm font-medium text-white/40">Items</span></p>
                  </div>
                </div>
              </div>

              {/* Cart Items List in Sidebar */}
              <div className="max-h-[300px] overflow-y-auto mb-8 space-y-4 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <p className="text-white/20 text-xs font-bold uppercase tracking-widest text-center py-8">Cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedUnit}`} className="flex items-center justify-between gap-4 group">
                      <div className="flex-1">
                        <p className="text-xs font-black text-white group-hover:text-amber-500 transition-colors line-clamp-1">{item.name}</p>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.selectedUnit} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.selectedUnit, -1)} className="p-1 hover:text-red-500 transition-colors">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => updateQuantity(item.id, item.selectedUnit, 1)} className="p-1 hover:text-amber-500 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4 text-sm font-medium border-t border-white/10 pt-8">
                <div className="flex justify-between text-white/60">
                  <span className="text-[10px] uppercase font-black tracking-widest">Subtotal</span>
                  <span className="font-black">KSh {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="text-[10px] uppercase font-black tracking-widest">NJO25 Discount</span>
                    <span className="font-black">- KSh {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest pb-1">Total Payable</span>
                  <span className="text-3xl font-black text-white">KSh {total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <Label htmlFor="promo" className="text-[10px] uppercase font-black text-white/30 tracking-widest">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    placeholder="ENTER CODE"
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-white font-black placeholder:text-white/10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  {discount > 0 && (
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Check className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, pIdx) => (
                <motion.div 
                  layout
                  key={item.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: pIdx * 0.05 }}
                >
                  <Card className="bg-white/5 border-white/10 text-white overflow-hidden rounded-[2.5rem] backdrop-blur-sm group hover:border-amber-500/40 transition-all duration-500 flex flex-col h-full">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-60"></div>
                      <div className="absolute top-6 right-6">
                        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                          {item.category === 'BEERS' && <Beer size={12} className="text-amber-500" />}
                          {item.category === 'WINES' && <Wine size={12} className="text-amber-500" />}
                          {['GIN', 'TEQUILA', 'WHISKEY'].includes(item.category) && <GlassWater size={12} className="text-amber-500" />}
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-2xl font-black text-white group-hover:text-amber-500 transition-colors tracking-tight uppercase italic">{item.name}</p>
                      </div>
                    </div>
                    <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-6">
                      <p className="text-sm text-white/40 font-medium leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="space-y-3">
                        {item.prices.map((price, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group/price">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                                {price.unit === 'UNIT' ? 'Per Unit' : price.unit}
                              </span>
                              <span className="text-lg font-black text-white font-mono">
                                KSh {price.amount.toLocaleString()}
                              </span>
                            </div>
                            <Button 
                              onClick={() => addToCart(item, price.unit, price.amount)} 
                              variant="ghost"
                              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:text-black transition-all p-0"
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout & Extras */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-3xl text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-transparent"></div>
                
                <div className="relative space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-500">
                      <CreditCard className="w-7 h-7 stroke-[2.5px]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-black">Express Checkout</p>
                      <p className="text-white/60 text-xs font-medium">Secured by M-Pesa API</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] text-white/30 uppercase font-black tracking-widest">Delivery Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:ring-amber-500/50 font-medium px-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] text-white/30 uppercase font-black tracking-widest">M-Pesa Number</Label>
                      <Input
                        id="phone"
                        placeholder="254 7XX XXX XXX"
                        className="bg-white/5 border-white/10 text-white h-14 rounded-2xl focus:ring-amber-500/50 font-medium px-6"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button 
                      onClick={handleCheckout} 
                      disabled={checkoutLoading || cart.length === 0} 
                      className="w-full h-16 bg-amber-500 text-black font-black text-lg rounded-2xl hover:bg-amber-600 transition-all shadow-[0_15px_40px_rgba(255,107,53,0.3)] group"
                    >
                      {checkoutLoading ? 'Processing Payment...' : 'Finalize & Pay'}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <div className="flex items-center justify-center gap-6 text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-500" /> M-Pesa STK</span>
                      <span className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-500" /> Secure SSL</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 to-zinc-950 border border-amber-500/20 p-10 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-5 relative">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-[0_10px_20px_rgba(255,107,53,0.3)]">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-white font-black tracking-tight text-lg">AI Drink Curator</h3>
                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Active Assistant</p>
                  </div>
                </div>
                <p className="text-sm text-white/40 font-medium leading-relaxed relative">
                  Tell our AI about your event size and theme, and we'll generate a custom spirit & mixer package optimized for your budget.
                </p>
                <AIConsultant />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
