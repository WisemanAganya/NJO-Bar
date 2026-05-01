import React from 'react';
import { motion } from 'motion/react';
import { 
  GlassWater, 
  PartyPopper, 
  Heart, 
  Cake, 
  GraduationCap, 
  Baby, 
  Briefcase, 
  Ghost, 
  Home, 
  HandCoins, 
  Music, 
  UtensilsCrossed, 
  HeartHandshake, 
  TreePine, 
  Star, 
  Users 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const EVENT_TYPES = [
  { icon: UtensilsCrossed, name: "Dinner Party", desc: "Intimate and elegant dining experiences." },
  { icon: GlassWater, name: "Cocktail Party", desc: "Sophisticated mixology for any social gathering." },
  { icon: Heart, name: "Wedding", desc: "Making your special day even more memorable." },
  { icon: Cake, name: "Birthday Party", desc: "Celebrate another year with premium drinks." },
  { icon: GraduationCap, name: "Graduation", desc: "Cheers to your academic achievements." },
  { icon: Baby, name: "Baby Shower", desc: "Celebrate new beginnings with style." },
  { icon: Briefcase, name: "Corporate Reception", desc: "Professional bar services for your business events." },
  { icon: Ghost, name: "Halloween Party", desc: "Spooky and creative cocktails for your theme." },
  { icon: Home, name: "House Warming", desc: "Welcome guests to your new home with a bar." },
  { icon: HandCoins, name: "Fundraisers", desc: "Support your cause with expert hospitality." },
  { icon: Music, name: "Club Event", desc: "High-energy bar services for nightlife." },
  { icon: UtensilsCrossed, name: "Banquet", desc: "Large-scale catering and bar management." },
  { icon: HeartHandshake, name: "Charity Event", desc: "Giving back with premium service." },
  { icon: TreePine, name: "Christmas Party", desc: "Festive cheer and seasonal spirits." },
  { icon: Star, name: "New Year's Eve", desc: "Ring in the new year with a bang." },
  { icon: Users, name: "Family Reunion", desc: "Quality time with quality drinks." },
  { icon: PartyPopper, name: "Bar Mitzvahs", desc: "Celebrating tradition and milestones." },
];

export function EventTypesSection() {
  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-[0.35em] text-amber-500 mb-4"
          >
            Our Expertise
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Events We Cater To
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            From intimate dinner parties to large-scale corporate receptions, NJO Bar provides 
            premium mobile bar and catering services for every occasion.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {EVENT_TYPES.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-amber-500/50 transition-all duration-300 h-full group">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                    <event.icon className="w-6 h-6 text-amber-500 group-hover:text-black" />
                  </div>
                  <h3 className="text-white font-bold text-sm tracking-tight group-hover:text-amber-500 transition-colors">
                    {event.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-center"
        >
          <p className="text-white/80 font-medium">
            Don't see your event listed? <span className="text-amber-500 underline cursor-pointer">Contact us</span> for a custom package tailored to your needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
