// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogoutButton } from '@/components/Logout-button';


export default async function DashboardPage() {
  const { user } = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Diabetes Tracker
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back, {user.name}!
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Blood Sugar</CardTitle>
                <CardDescription>Track your glucose readings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 mb-4">--</p>
                <Button asChild className="w-full">
                  <Link href="/readings/blood-sugar">View Readings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
                <CardDescription>Manage your medications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 mb-4">--</p>
                <Button asChild className="w-full">
                  <Link href="/medications">Manage Meds</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight</CardTitle>
                <CardDescription>Track your weight</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600 mb-4">--</p>
                <Button asChild className="w-full">
                  <Link href="/readings/weight">View Weight</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure</CardTitle>
                <CardDescription>Monitor your blood pressure</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600 mb-4">--/--</p>
                <Button asChild className="w-full">
                  <Link href="/readings/blood-pressure">View BP</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Email: {user.email}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

