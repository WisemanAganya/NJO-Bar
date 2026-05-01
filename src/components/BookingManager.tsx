import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit,
  Filter,
  Search,
  Repeat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function BookingManager() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<Date | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<string>('all');

  React.useEffect(() => {
    fetchBookings();
  }, []);

  React.useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter, typeFilter]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split('T')[0];
      filtered = filtered.filter(booking => booking.eventDate === filterDate);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.eventType === typeFilter);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ));

      toast.success(`Booking ${status}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const updateBookingNotes = async (bookingId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, notes } : b
      ));

      toast.success('Notes updated');
      setShowEditDialog(false);
      setEditingBooking(null);
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Booking Management</h2>
          <p className="text-white/60">Manage and track all event bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/10 text-white">
            {filteredBookings.length} bookings
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search bookings..."
                  className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Event Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="private">Private Party</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Event Date</Label>
              <DatePicker
                selected={dateFilter}
                onChange={(date) => setDateFilter(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full bg-white/5 border-white/10 px-3 py-2 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholderText="Select date"
                isClearable
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter(null);
                  setTypeFilter('all');
                }}
                className="w-full border-white/10 text-white hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(booking.status)} text-black flex items-center gap-1`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        {booking.isRecurring && (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            <Repeat className="w-3 h-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-white/40">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">{booking.clientName}</h3>
                      <p className="text-amber-500 font-medium">{booking.eventType}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-white/40" />
                        <span>{booking.guestCount} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span>{booking.duration || 'TBD'} hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/40" />
                        <span className="truncate">{booking.location || 'TBD'}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-white/5 rounded-md p-3">
                        <p className="text-sm text-white/60 line-clamp-2">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-white/40" />
                      <span className="font-medium">${booking.totalAmount}</span>
                      <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'} className="ml-2">
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id!, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id!, 'cancelled')}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingBooking(booking);
                        setShowEditDialog(true);
                      }}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredBookings.length === 0 && (
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p className="text-white/60">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Notes Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Booking Notes</DialogTitle>
            <DialogDescription className="text-white/40">
              Update notes for {editingBooking?.clientName}'s booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this booking..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
                defaultValue={editingBooking?.notes || ''}
                onChange={(e) => {
                  if (editingBooking) {
                    setEditingBooking({ ...editingBooking, notes: e.target.value });
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingBooking) {
                  updateBookingNotes(editingBooking.id!, editingBooking.notes || '');
                }
              }}
              className="bg-amber-500 text-black hover:bg-amber-600"
            >
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
