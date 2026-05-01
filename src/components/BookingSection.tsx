import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Users, MapPin, Clock, CreditCard, CheckCircle2, AlertCircle, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { Phone } from 'lucide-react';

export function BookingSection({ user }: { user: any }) {
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const [formData, setFormData] = React.useState({
    eventType: '',
    guestCount: '',
    duration: '',
    location: '',
    notes: '',
    isRecurring: false,
    recurringPattern: '' as 'daily' | 'weekly' | 'monthly' | 'yearly' | ''
  });
  const [selectedPackage, setSelectedPackage] = React.useState('Standard');
  const [quoteEstimate, setQuoteEstimate] = React.useState(0);
  const [dateAvailability, setDateAvailability] = React.useState<number | null>(null);

  React.useEffect(() => {
    const guests = Number(formData.guestCount) || 20;
    const hours = Number(formData.duration) || 4;
    const base = selectedPackage === 'Premium' ? 9000 : selectedPackage === 'Wedding' ? 13500 : 6500;
    const multiplier = guests > 100 ? 1.4 : guests > 60 ? 1.2 : 1;
    const durationFactor = hours > 4 ? 1 + (hours - 4) * 0.1 : 1;
    setQuoteEstimate(Math.round(base * multiplier * durationFactor));
  }, [formData.guestCount, formData.duration, selectedPackage]);

  React.useEffect(() => {
    if (!selectedDate) {
      setDateAvailability(null);
      return;
    }

    const fetchAvailability = async () => {
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('event_date', dateString);
        if (error) throw error;
        setDateAvailability(data?.length ?? 0);
      } catch (error) {
        console.error('Availability error:', error);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book an event");
      return;
    }

    // Basic validation
    if (!formData.eventType || !selectedDate || !formData.guestCount || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setShowConfirm(true);
  };

  const handleFinalConfirm = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid M-Pesa phone number (e.g., 2547XXXXXXXX)");
      return;
    }

    setLoading(true);
    setShowConfirm(false);

    try {
      const bookingData = {
        client_id: user.id,
        client_name: user.user_metadata?.display_name || 'Anonymous',
        event_date: selectedDate?.toISOString().split('T')[0],
        event_type: formData.eventType,
        guest_count: parseInt(formData.guestCount),
        duration: parseInt(formData.duration) || null,
        location: formData.location,
        notes: formData.notes,
        status: 'pending',
        payment_status: 'unpaid',
        total_amount: 5000, // Placeholder deposit amount: 5000 KES
        is_recurring: formData.isRecurring,
        recurring_pattern: formData.recurringPattern || null,
        reminder_sent: false
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      // Initiate M-Pesa STK Push
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.startsWith('0') ? '254' + phoneNumber.slice(1) : phoneNumber,
          amount: 1, // Using 1 KES for testing
          bookingId: data.id,
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("M-Pesa prompt sent! Please check your phone to complete the payment.");

      setFormData({
        eventType: '',
        guestCount: '',
        duration: '',
        location: '',
        notes: '',
        isRecurring: false,
        recurringPattern: ''
      });
      setSelectedDate(null);
      setPhoneNumber('');
    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error(error.message || "Something went wrong with your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Reserve Your Experience</h2>
            <p className="text-white/50 text-lg">Tell us about your event, and we'll handle the rest.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription className="text-white/40">Fill in the information below to get a custom quote.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="event-type">Event Type</Label>
                        <Select 
                          value={formData.eventType} 
                          onValueChange={(val) => setFormData({...formData, eventType: val})}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dinner-party">Dinner Party</SelectItem>
                            <SelectItem value="cocktail-party">Cocktail Party</SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday-party">Birthday Party</SelectItem>
                            <SelectItem value="graduation">Graduation</SelectItem>
                            <SelectItem value="baby-shower">Baby Shower</SelectItem>
                            <SelectItem value="corporate-reception">Corporate Reception</SelectItem>
                            <SelectItem value="halloween-party">Halloween Party</SelectItem>
                            <SelectItem value="house-warming">House Warming</SelectItem>
                            <SelectItem value="fundraiser">Fundraiser</SelectItem>
                            <SelectItem value="club-event">Club Event</SelectItem>
                            <SelectItem value="banquet">Banquet</SelectItem>
                            <SelectItem value="charity-event">Charity Event</SelectItem>
                            <SelectItem value="christmas-party">Christmas Party</SelectItem>
                            <SelectItem value="new-years-eve">New Year's Eve</SelectItem>
                            <SelectItem value="bar-mitzvah">Bar Mitzvah</SelectItem>
                            <SelectItem value="family-reunion">Family Reunion</SelectItem>
                            <SelectItem value="other">Other Events</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Event Date</Label>
                        <div className="relative">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            className="w-full bg-white/5 border-white/10 pl-10 pr-3 py-2 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholderText="Select event date"
                          />
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guests">Estimated Guests</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="50" 
                            className="bg-white/5 border-white/10 pl-10" 
                            value={formData.guestCount}
                            onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                          />
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (Hours)</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="4" 
                            className="bg-white/5 border-white/10 pl-10" 
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          />
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="package">Package Style</Label>
                        <Select
                          value={selectedPackage}
                          onValueChange={(val) => setSelectedPackage(val)}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Choose package" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Wedding">Wedding</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Quote</Label>
                        <div className="rounded-3xl bg-white/5 border border-white/10 p-4 text-white text-lg font-semibold">
                          KES {quoteEstimate.toLocaleString()}
                        </div>
                        {dateAvailability !== null && (
                          <p className="text-sm text-white/60">
                            {dateAvailability >= 5
                              ? 'High demand on this date — availability may be limited.'
                              : 'This date currently has few bookings and good availability.'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location / Venue</Label>
                      <div className="relative">
                        <Input 
                          placeholder="Enter address or venue name" 
                          className="bg-white/5 border-white/10 pl-10" 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Special Requirements</Label>
                      <textarea
                        className="w-full min-h-[100px] rounded-md bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Tell us about specific cocktails, themes, or dietary requirements..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="recurring"
                          checked={formData.isRecurring}
                          onCheckedChange={(checked) => setFormData({...formData, isRecurring: checked as boolean})}
                        />
                        <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Recurring Event
                        </Label>
                      </div>

                      {formData.isRecurring && (
                        <div className="space-y-2">
                          <Label htmlFor="recurring-pattern">Recurring Pattern</Label>
                          <Select
                            value={formData.recurringPattern}
                            onValueChange={(val) => setFormData({...formData, recurringPattern: val as 'daily' | 'weekly' | 'monthly' | 'yearly'})}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold h-12"
                    >
                      {loading ? "Processing..." : "Submit Booking Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-amber-500 border-none text-black rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(255,107,53,0.3)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-black uppercase tracking-tighter">
                    <CreditCard className="w-5 h-5" /> Booking Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b border-black/10 pb-4">
                    <span className="font-bold text-sm uppercase tracking-wider">Base Rate</span>
                    <span className="font-black text-xl">KSh 15,000/hr</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-black/10 pb-4">
                    <span className="font-bold text-sm uppercase tracking-wider">Per Guest</span>
                    <span className="font-black text-xl">KSh 1,500 - 3,500</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-bold text-sm uppercase tracking-wider">Logistics</span>
                    <span className="font-black text-xl text-black/60">Included*</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-4 leading-relaxed">
                    * Final pricing depends on cocktail selection, guest volume, and premium spirit upgrades.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 text-white rounded-[2rem] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">What's Included?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-white/50">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
                      Professional Portable Bar Setup
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
                      Certified Kenyan Mixologists
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
                      Premium Glassware & Tools
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]" />
                      Custom Menu Design
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight flex items-center gap-3">
              <CheckCircle2 className="text-amber-500 w-8 h-8" /> Confirm Booking
            </DialogTitle>
            <DialogDescription className="text-white/40 text-base">
              Please review your event details before we initiate the M-Pesa prompt.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">Event Type</p>
                <p className="text-white font-bold capitalize">{formData.eventType.replace(/-/g, ' ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">Date</p>
                <p className="text-white font-bold">{selectedDate ? selectedDate.toLocaleDateString('en-KE') : 'TBD'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">Guests</p>
                <p className="text-white font-bold">{formData.guestCount} People</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">Duration</p>
                <p className="text-white font-bold">{formData.duration} Hours</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">Location</p>
              <p className="text-white font-bold">{formData.location}</p>
            </div>
            {formData.notes && (
              <div className="space-y-1">
                <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">Notes</p>
                <p className="text-white/60 text-xs italic leading-relaxed">"{formData.notes}"</p>
              </div>
            )}

            <div className="space-y-3 border-t border-white/5 pt-6">
              <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-amber-500">M-Pesa Phone Number</Label>
              <div className="relative">
                <Input 
                  id="phone"
                  placeholder="2547XXXXXXXX" 
                  className="bg-white/5 border-white/10 h-14 rounded-2xl pl-12 focus:ring-amber-500/50" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
              <p className="text-[10px] text-white/30 font-medium">Enter the number that will receive the STK push prompt.</p>
            </div>
            
            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex gap-4 items-start">
              <AlertCircle className="text-amber-500 w-6 h-6 shrink-0" />
              <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                Our Nairobi team will review your request and send a detailed quotation within 24 hours.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirm(false)}
              className="border-white/10 text-white hover:bg-white/5 h-14 rounded-2xl flex-1 font-bold"
            >
              Back
            </Button>
            <Button 
              onClick={handleFinalConfirm}
              className="bg-amber-500 text-black hover:bg-amber-600 font-black h-14 rounded-2xl flex-1 shadow-[0_10px_20px_rgba(255,107,53,0.2)]"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
