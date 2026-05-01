import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function SettingsManager() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'NJO Bar',
    contactEmail: 'hello@njobar.com',
    maintenanceMode: false,
    enableNotifications: true,
    accentColor: '#f59e0b',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, we'd save to cms_settings table
      // For now, we'll simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">CMS Settings</h2>
        <p className="text-white/50">Configure global application behavior and appearance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              <CardTitle>General Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName" 
                value={settings.siteName} 
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                value={settings.contactEmail} 
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-white/40">Disable public access during updates.</p>
              </div>
              <Switch 
                checked={settings.maintenanceMode} 
                onCheckedChange={checked => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-500" />
              <CardTitle>Appearance & Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accent">Accent Color (Amber)</Label>
              <Input 
                id="accent" 
                type="color" 
                value={settings.accentColor} 
                className="h-12 w-full bg-white/5 border-white/10 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-white/40">Notify admins of new bookings/orders.</p>
              </div>
              <Switch 
                checked={settings.enableNotifications} 
                onCheckedChange={checked => setSettings({...settings, enableNotifications: checked})}
              />
            </div>
            <div className="pt-4">
              <Button onClick={handleSave} disabled={loading} className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold">
                <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
