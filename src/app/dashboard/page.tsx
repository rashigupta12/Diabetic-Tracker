'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Pill, Weight, Heart } from 'lucide-react';

interface DashboardStats {
  bloodSugar: {
    stats: {
      totalReadings: number;
      avgGlucose: number;
      minGlucose: number;
      maxGlucose: number;
    };
    recent: {
      glucose: number;
      readingTime: string;
      mealType: string;
    };
  };
  medications: {
    totalActive: number;
    compliance: number;
  };
  weight: {
    recent: {
      weight: string;
      recordedAt: string;
    };
    change: number;
  };
  bloodPressure: {
    recent: {
      systolic: number;
      diastolic: number;
      pulse: number;
    };
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your health metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Sugar Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blood Sugar
            </CardTitle>
            <Droplets className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.bloodSugar?.recent?.glucose || '--'} mg/dL
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {stats?.bloodSugar?.stats?.avgGlucose || '--'} mg/dL
            </p>
          </CardContent>
        </Card>

        {/* Medications Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medications
            </CardTitle>
            <Pill className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.medications?.totalActive || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.medications?.compliance || 0}% compliance
            </p>
          </CardContent>
        </Card>

        {/* Weight Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weight
            </CardTitle>
            <Weight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.weight?.recent?.weight || '--'} kg
            </div>
            <p className="text-xs text-muted-foreground">
              {(stats?.weight?.change ?? 0) > 0 ? '+' : ''}{stats?.weight?.change ?? 0} kg this week
            </p>
          </CardContent>
        </Card>

        {/* Blood Pressure Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blood Pressure
            </CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.bloodPressure?.recent?.systolic || '--'}/
              {stats?.bloodPressure?.recent?.diastolic || '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Pulse: {stats?.bloodPressure?.recent?.pulse || '--'} bpm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest health recordings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for health tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-md text-sm">
              Record Blood Sugar
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-md text-sm">
              Log Medication
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-md text-sm">
              Update Weight
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}