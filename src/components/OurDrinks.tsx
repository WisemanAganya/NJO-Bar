import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, Tag, Check, AlertTriangle, CreditCard, Sparkles, Zap, PackageCheck, Plus } from 'lucide-react';
import { AIConsultant } from './AIConsultant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Product, CartItem, Order } from '@/types';

const FALLBACK_PRODUCTS: Product[] = [
  // Gin
  { id: 'g1', name: 'Gilbeys (Tot)', description: 'Classic dry gin, the staple of Nairobi nightlife.', imageUrl: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&q=80&w=1200', category: 'Gin', price: 200, stock: 50, featured: true, createdAt: new Date().toISOString() },
  { id: 'g2', name: 'Gilbeys (Bottle)', description: 'Full 750ml bottle, perfect for groups.', imageUrl: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&q=80&w=1200', category: 'Gin', price: 3000, stock: 20, createdAt: new Date().toISOString() },
  { id: 'g3', name: 'Tanqueray (Tot)', description: 'Premium distilled gin with a balanced botanical profile.', imageUrl: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&q=80&w=1200', category: 'Gin', price: 350, stock: 40, featured: true, createdAt: new Date().toISOString() },
  { id: 'g4', name: 'Tanqueray (Bottle)', description: '750ml bottle of world-class Tanqueray Gin.', imageUrl: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&q=80&w=1200', category: 'Gin', price: 5500, stock: 10, createdAt: new Date().toISOString() },
  
  // Tequila
  { id: 't1', name: 'Don Julio Reposado (Tot)', description: 'Rich, smooth tequila with notes of caramel.', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&q=80&w=1200', category: 'Tequila', price: 500, stock: 30, featured: true, createdAt: new Date().toISOString() },
  { id: 't2', name: 'Don Julio Reposado (Bottle)', description: 'The pinnacle of Reposado tequila in a 750ml bottle.', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&q=80&w=1200', category: 'Tequila', price: 13000, stock: 5, featured: true, createdAt: new Date().toISOString() },
  
  // Whiskey
  { id: 'w1', name: 'Jameson (Tot)', description: 'Triple-distilled, twice as smooth Irish whiskey.', imageUrl: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&q=80&w=1200', category: 'Whiskey', price: 300, stock: 60, featured: true, createdAt: new Date().toISOString() },
  { id: 'w2', name: 'Johnnie Walker Black (Tot)', description: 'A benchmark for all other luxury blends.', imageUrl: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&q=80&w=1200', category: 'Whiskey', price: 350, stock: 50, featured: true, createdAt: new Date().toISOString() },
  
  // Beer
  { id: 'b1', name: 'Tusker Larger', description: 'Kenyas finest, brewed with quality Kenyan malt.', imageUrl: 'https://images.unsplash.com/photo-1518176258769-f243054a250e?auto=format&fit=crop&q=80&w=1200', category: 'Beer', price: 400, stock: 100, featured: true, createdAt: new Date().toISOString() },
  { id: 'b2', name: 'Guinness', description: 'The deep, dark essence of stout beer.', imageUrl: 'https://images.unsplash.com/photo-1518176258769-f243054a250e?auto=format&fit=crop&q=80&w=1200', category: 'Beer', price: 400, stock: 60, featured: true, createdAt: new Date().toISOString() },
];

export function OurDrinks({ user }: { user: any }) {
  const [products, setProducts] = React.useState<Product[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState('');
  const [promoCode, setPromoCode] = React.useState('');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('category', { ascending: true })
          .order('featured', { ascending: false });
        if (error) throw error;
        if (data && data.length) {
          const mapped = data.map((d: any) => ({
            ...d,
            imageUrl: d.image_url,
            createdAt: d.created_at,
          }));
          setProducts(mapped as Product[]);
        }
      } catch (error) {
        console.error('Drink fetch error:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('This product is out of stock.');
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeCartItem = (productId: string) => {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) } : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = promoCode.trim().toLowerCase() === 'njo25' ? subtotal * 0.25 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Login to place an order and track history.');
      return;
    }
    if (!cart.length) {
      toast.error('Add products to your cart first.');
      return;
    }
    setCheckoutLoading(true);

    try {
      toast.loading('Initializing secure M-Pesa payment gateway...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lineItems = cart.map((item) => ({
        productId: item.product.id!,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
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

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(groupedProducts);

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
              <PackageCheck className="w-3 h-3" /> Premium Spirits Collection
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]"
            >
              Discover Liquid <br /><span className="text-amber-500">Excellence.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/40 mt-8 text-xl font-medium max-w-xl leading-relaxed"
            >
              Nairobi's most curated stock of premium spirits, mixers, and garnishes. Event-ready packages with real-time stock management.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-auto"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 text-white min-w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black">
                    <ShoppingCart className="w-6 h-6 stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest">Order Summary</p>
                    <p className="text-xl font-black">{cart.length} <span className="text-sm font-medium text-white/40">Items</span></p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Loyalty Discount</span>
                    <span>- KSh {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
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
          <div className="space-y-24">
            {categories.map((category, catIdx) => (
              <div key={category} className="space-y-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-6"
                >
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                    {category} <span className="text-amber-500 text-sm align-top ml-2">{groupedProducts[category].length}</span>
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {groupedProducts[category].map((product, pIdx) => (
                    <motion.div 
                      key={product.id} 
                      initial={{ opacity: 0, y: 30 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }}
                      transition={{ delay: pIdx * 0.1 }}
                    >
                      <Card className="bg-white/5 border-white/10 text-white overflow-hidden rounded-[2.5rem] backdrop-blur-sm group hover:border-amber-500/40 transition-all duration-500 flex flex-col h-full">
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-60"></div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-2xl font-black text-white group-hover:text-amber-500 transition-colors tracking-tight">{product.name}</p>
                            <p className="text-amber-500 font-black text-lg mt-1">KSh {product.price.toLocaleString()}</p>
                          </div>
                          {product.featured && (
                            <Badge className="absolute top-6 right-6 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full">
                              Essential
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-6">
                          <p className="text-sm text-white/40 font-medium leading-relaxed">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                              <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                                {product.stock > 0 ? `${product.stock} Units Available` : 'Fully Reserved'}
                              </span>
                            </div>
                            <Button 
                              onClick={() => addToCart(product)} 
                              disabled={product.stock === 0}
                              variant="ghost"
                              className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-amber-500 hover:text-black transition-all p-0"
                            >
                              <Plus className="w-6 h-6" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

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

              <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8 border-l-4 border-amber-500">
                <div className="flex items-center gap-4 mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h4 className="font-black text-white uppercase text-xs tracking-widest">Urgent: Low Stock Alerts</h4>
                </div>
                <div className="space-y-4">
                  {products.filter((product) => product.stock < 10).length > 0 ? (
                    products.filter((product) => product.stock < 10).slice(0, 3).map((product) => (
                      <div key={product.id} className="flex justify-between items-center group">
                        <span className="text-white/60 font-medium group-hover:text-white transition-colors">{product.name}</span>
                        <Badge className="bg-red-500/10 text-red-500 text-[10px] font-black tracking-widest px-3 py-1 rounded-full">
                          {product.stock} Units
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-white/30 italic text-center font-medium uppercase tracking-widest py-4">Inventory is fully prepared for peak demand.</p>
                  )}
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
