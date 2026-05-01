import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCocktailRecommendation } from '@/lib/gemini';
import { cn } from '@/lib/utils';

export function AIConsultant() {
  const [query, setQuery] = React.useState('');
  const [messages, setMessages] = React.useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Salutations. I am your Digital Sommelier. Describe the essence of your gathering, and I shall architect the perfect beverage selection for you.' }
  ]);
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConsult = async () => {
    if (!query.trim() || loading) return;
    
    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
    setLoading(true);

    const recommendation = await getCocktailRecommendation(userMessage);
    setMessages(prev => [...prev, { role: 'ai', text: recommendation }]);
    setLoading(false);
  };

  return (
    <div className="rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden flex flex-col h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="p-8 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,53,0.3)]">
            <BrainCircuit className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-tighter text-xl">Digital Sommelier</h3>
            <p className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-black">Powered by Artisanal AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">Premium Mode</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[90%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                m.role === 'ai' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-white/5 border-white/10 text-white/40"
              )}>
                {m.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-xl",
                m.role === 'ai' 
                  ? "bg-zinc-900/80 border border-white/5 text-white/80" 
                  : "bg-amber-500 text-black font-black uppercase tracking-tight"
              )}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-amber-500 animate-spin-slow" />
              </div>
              <div className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem] flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-2xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleConsult(); }}
          className="relative flex items-center"
        >
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Architecture of your evening..."
            className="bg-white/5 border-white/10 pr-16 h-16 rounded-2xl text-white placeholder:text-white/20 focus:border-amber-500/50 transition-all font-medium text-base"
          />
          <Button 
            type="submit"
            disabled={loading || !query.trim()}
            size="icon"
            className="absolute right-2 bg-amber-500 text-black hover:bg-amber-600 w-12 h-12 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_5px_15px_rgba(255,107,53,0.3)]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
