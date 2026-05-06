import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, GraduationCap, Briefcase, Calendar, ShieldCheck, Zap, X, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';


const COURSES = [
  {
    id: '1',
    title: 'Nairobi Bar Fundamentals',
    description: 'Master the foundation of professional mixology with a focus on local and international favorites.',
    price: 25000,
    duration: '4 Weeks',
    period: 'Evenings (5:30 PM - 8:30 PM)',
    internships: 'Guaranteed 1-week placement at top-tier Nairobi partner bars.',
    jobOpportunities: 'Priority hiring for NJO Bar premium event circuit.',
    level: 'Beginner'
  },
  {
    id: '2',
    title: 'Advanced Safari Mixology',
    description: 'Master molecular techniques, craft infusions, and high-end presentation for the luxury hospitality sector.',
    price: 45000,
    duration: '6 Weeks',
    period: 'Weekends (9:00 AM - 4:00 PM)',
    internships: '2-week elite shadowing with our Head of Mixology at VIP events.',
    jobOpportunities: 'Direct placement assistance into senior roles at leading Nairobi hotels.',
    level: 'Advanced'
  },
  {
    id: '3',
    title: 'Bar Leadership & Ops',
    description: 'The business of beverage management. Learn cost control, inventory, and staff leadership in the Kenyan context.',
    price: 35000,
    duration: '3 Weeks',
    period: 'Mornings (8:30 AM - 11:30 AM)',
    internships: 'Operational management shadowing at major festival scale events.',
    jobOpportunities: 'Fast-track to Event Coordinator and Bar Manager positions.',
    level: 'Professional'
  }
];

export function CourseList() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = React.useState<typeof COURSES[0] | null>(null);
  const [enrollStep, setEnrollStep] = React.useState<'details' | 'payment'>('details');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all applicant details');
      return;
    }
    setEnrollStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      // 1. Create Enrollment in Supabase
      const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          course_id: selectedCourse.id,
          user_id: user?.id || null,
          user_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: 'pending',
          payment_status: 'unpaid',
          amount: selectedCourse.price * 0.1 // 10% Deposit to secure seat
        })
        .select()
        .single();

      if (enrollError) throw enrollError;

      // 2. Trigger M-Pesa STK Push
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formData.phone.startsWith('0') ? '254' + formData.phone.slice(1) : formData.phone,
          amount: 1, // KSh 1 for testing
          enrollmentId: enrollment.id
        })
      });

      if (!response.ok) throw new Error('Payment initialization failed');

      toast.success('M-Pesa prompt sent! Check your phone to secure your seat.');
      setSelectedCourse(null);
      setEnrollStep('details');
      setFormData({ name: '', email: '', phone: '' });
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error(error.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <GraduationCap className="w-3 h-3" /> NJO Mixology Academy
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            Professional Bar Careers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-lg max-w-2xl mx-auto font-medium"
          >
            Turn your passion for liquid art into a lucrative profession. Our curriculum is tailored for the high-end Kenyan hospitality market.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="bg-white/5 border-white/10 text-white h-full flex flex-col rounded-[2.5rem] backdrop-blur-xl hover:border-amber-500/50 transition-all duration-500 group overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 font-black px-4 py-1 rounded-full text-[10px] tracking-widest">{course.level}</Badge>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Enrollment Fee</p>
                      <p className="text-2xl font-black text-white">KSh {course.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black mb-3 tracking-tight group-hover:text-amber-500 transition-colors">{course.title}</CardTitle>
                  <CardDescription className="text-white/40 text-sm leading-relaxed">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-grow space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-xs">
                      <p className="text-white font-bold">{course.duration}</p>
                      <p className="text-white/40">{course.period}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-white/60 leading-relaxed">
                        <strong className="text-white">Internship:</strong> {course.internships}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Briefcase className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-white/60 leading-relaxed">
                        <strong className="text-white">Career Track:</strong> {course.jobOpportunities}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full bg-white/5 hover:bg-amber-500 hover:text-black text-white border border-white/10 h-14 rounded-2xl font-black transition-all group-hover:shadow-[0_10px_30px_rgba(255,107,53,0.1)]"
                  >
                    Secure Seat <Zap className="w-4 h-4 ml-2 fill-current" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-lg rounded-[3rem] p-0 overflow-hidden">
          <div className="h-32 bg-amber-500 flex flex-col justify-center px-10 relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={() => setSelectedCourse(null)} className="text-black hover:bg-black/10 rounded-full">
                <X size={20} />
              </Button>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Academy Enrollment</h3>
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase italic">{selectedCourse?.title}</h2>
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {enrollStep === 'details' ? (
                <motion.form 
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEnroll} 
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Full Applicant Name</Label>
                      <div className="relative">
                        <Input 
                          placeholder="John Doe" 
                          className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 font-bold"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">Email Address</Label>
                      <div className="relative">
                        <Input 
                          type="email"
                          placeholder="john@example.com" 
                          className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 font-bold"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/20">M-Pesa Phone Number</Label>
                      <div className="relative">
                        <Input 
                          placeholder="2547XXXXXXXX" 
                          className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 font-bold"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-16 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-500/20">
                    Next: Secure Seat <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-amber-500">
                      <span>Course Deposit (10%)</span>
                      <span>Security Fee</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-4xl font-black text-white italic">KSh {(selectedCourse!.price * 0.1).toLocaleString()}</p>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">M-Pesa STK Push</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-white/40 font-medium leading-relaxed">
                      By proceeding, you will receive a prompt on <span className="text-white">{formData.phone}</span>. Enter your PIN to confirm the enrollment deposit and secure your seat in the <span className="text-white italic">{selectedCourse?.title}</span>.
                    </p>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/20">
                      <ShieldCheck size={12} className="text-emerald-500" /> Secure Kenyan Payment Gateway
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setEnrollStep('details')} className="h-16 rounded-2xl px-8 border border-white/5 text-white/40 font-black uppercase text-[10px]">Back</Button>
                    <Button 
                      onClick={handlePayment} 
                      disabled={loading}
                      className="flex-1 h-16 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500 transition-colors"
                    >
                      {loading ? 'Initializing...' : 'Confirm & Pay'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
