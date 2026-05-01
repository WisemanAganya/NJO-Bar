import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Course, Enrollment } from '@/types';

export function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    period: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    const courseSub = supabase
      .channel('courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, fetchCourses)
      .subscribe();

    const enrollmentSub = supabase
      .channel('enrollments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, fetchEnrollments)
      .subscribe();

    return () => {
      courseSub.unsubscribe();
      enrollmentSub.unsubscribe();
    };
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from('courses').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').insert([formData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', price: 0, duration: '', period: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setFormData(course);
    setEditingId(course.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this course? Associated enrollments will also be deleted.')) {
      try {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) throw error;
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const updateEnrollmentStatus = async (enrollmentId: string, status: string) => {
    try {
      const { error } = await supabase.from('enrollments').update({ status }).eq('id', enrollmentId);
      if (error) throw error;
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
  };

  const filteredCourses = courses.filter(
    (c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const courseEnrollments = selectedCourse ? enrollments.filter((e) => e.courseId === selectedCourse) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Course Manager</h2>
          <p className="text-white/50">Manage mixology courses and student enrollments.</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: '', description: '', price: 0, duration: '', period: '' });
          }}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> New Course
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit' : 'Create'} Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <Input
                  placeholder="Duration (e.g., 8 weeks)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <Input
                  placeholder="Period (e.g., Jan-Mar 2026)"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Input
                placeholder="Internship Opportunities"
                value={formData.internships}
                onChange={(e) => setFormData({ ...formData, internships: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Job Opportunities"
                value={formData.jobOpportunities}
                onChange={(e) => setFormData({ ...formData, jobOpportunities: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredCourses.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center text-white/40">No courses found.</CardContent>
              </Card>
            ) : (
              filteredCourses.map((course) => (
                <motion.div key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card
                    className={`bg-white/5 border-white/10 cursor-pointer hover:border-amber-500/30 transition-colors ${
                      selectedCourse === course.id ? 'border-amber-500/50 bg-white/10' : ''
                    }`}
                    onClick={() => setSelectedCourse(course.id!)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription className="text-white/40">{course.period}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-500">${course.price}</p>
                          <p className="text-xs text-white/40">{course.duration}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/60 mb-4">{course.description}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(course);
                          }}
                          className="flex-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(course.id!);
                          }}
                          className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {selectedCourse && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/5 border-white/10 sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" /> Enrollments
                  </CardTitle>
                  <CardDescription>{courseEnrollments.length} students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courseEnrollments.length === 0 ? (
                      <p className="text-sm text-white/40 text-center py-4">No enrollments yet.</p>
                    ) : (
                      courseEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-sm font-medium text-white">{enrollment.userName}</p>
                          <select
                            value={enrollment.status}
                            onChange={(e) => updateEnrollmentStatus(enrollment.id!, e.target.value)}
                            className="w-full mt-2 text-xs bg-white/10 border border-white/10 text-white rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
