import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function ContactSection() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error('Please complete the contact form.');
      return;
    }

    setLoading(true);
    try {
      await supabase.from('leads').insert({
        name,
        email,
        phone,
        message,
        source: 'website',
        status: 'new',
        created_at: new Date().toISOString(),
      });
      toast.success('Thanks! Your message has been submitted.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error: any) {
      console.error('Lead submission error:', error);
      toast.error(error.message || 'Unable to submit message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-500 mb-4">Contact</p>
              <h2 className="text-4xl md:text-5xl font-bold">Book a consultation or ask about packages.</h2>
              <p className="text-white/60 mt-4 max-w-2xl">Send a message, request a quote, or reach us instantly on WhatsApp and email.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">Phone</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  <div className="flex flex-col gap-1">
                    <span>+254 713136565</span>
                    <span>+254 759115697</span>
                  </div>
                </CardDescription>
              </Card>
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">Email</CardTitle>
                </div>
                <CardDescription className="text-white/60">barnjo20@gmail.com</CardDescription>
              </Card>
              <Card className="bg-white/5 border-white/10 p-6 col-span-1 sm:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">Location</CardTitle>
                </div>
                <CardDescription className="text-white/60">Serving Nairobi and surrounding premium event venues.</CardDescription>
              </Card>
            </div>

              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">Social Media</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">Instagram: <span className="text-amber-500">@njo_bar</span></span>
                    <span className="flex items-center gap-2">TikTok: <span className="text-amber-500">@njo-bar</span></span>
                  </div>
                </CardDescription>
              </Card>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-8">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                className="bg-white/5 border-white/10 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-white/5 border-white/10 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="2547XXXXXXXX"
                className="bg-white/5 border-white/10 text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your event or ask a question..."
                className="bg-white/5 border-white/10 text-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-amber-500 text-black hover:bg-amber-600">
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
            <div className="text-sm text-white/50">Or chat with us on WhatsApp for instant booking support.</div>
          </form>
        </div>
      </div>
    </section>
  );
}
