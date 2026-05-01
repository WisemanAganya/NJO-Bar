import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Heart, Award, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EVENT_HISTORY_IMAGES = [
  'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200',
];

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Miriam K.',
    role: 'Corporate Relations, Safaricom',
    message: 'NJO Bar transformed our product launch at Westlands with flawless execution and unforgettable artisanal cocktails.',
    eventType: 'Corporate Gala',
  },
  {
    id: 't2',
    name: 'Dr. Peter O.',
    role: 'Private Client, Karen',
    message: 'The team delivered a luxury bar experience that our guests are still talking about. Their professionalism is unmatched in Nairobi.',
    eventType: 'Private Wedding',
  },
  {
    id: 't3',
    name: 'Amina T.',
    role: 'Creative Director',
    message: 'Fast, professional and totally premium. The brand synchronization with our event theme was impeccable.',
    eventType: 'Lifestyle Launch',
  },
];

export function EventHistory() {
  return (
    <section className="py-32 bg-zinc-950 text-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mb-24">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-6"
          >
            Elite Portfolio
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8"
          >
            Signature <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-800">Moments.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed"
          >
            A chronicle of Kenya's most exclusive gatherings. From high-stakes corporate summits to intimate Karen estate celebrations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="lg:col-span-1 space-y-8">
            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-24 h-24 text-amber-500" />
              </div>
              <div className="relative z-10 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: 'Events', value: '450+' },
                    { label: 'Rating', value: '5.0' },
                    { label: 'Guests', value: '25k' },
                    { label: 'Cities', value: '4' },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <p className="text-4xl font-black text-white tracking-tighter">{metric.value}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-amber-500 text-black shadow-[0_20px_50px_rgba(255,107,53,0.3)]">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-60">Elite Brand Partners</h3>
              <div className="flex flex-wrap gap-2">
                {['Safaricom', 'EABL Premium', 'M-Pesa Luxe', 'Nairobi Polo Club', 'Karen Country Club'].map((brand) => (
                  <Badge key={brand} className="bg-black/10 text-black border-black/10 font-bold uppercase text-[9px] px-3 py-1 rounded-full">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {EVENT_HISTORY_IMAGES.map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 0.98 }}
                className="relative h-[300px] rounded-[3rem] overflow-hidden group cursor-pointer border border-white/5"
              >
                <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">View Project</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div 
              key={testimonial.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl relative flex flex-col justify-between group hover:border-amber-500/50 transition-colors"
            >
              <div className="absolute top-8 right-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                <Quote className="w-16 h-16 fill-current" />
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-lg text-white/70 font-medium italic leading-relaxed">
                  “{testimonial.message}”
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center text-amber-500 font-black text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-white">{testimonial.name}</p>
                  <p className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
