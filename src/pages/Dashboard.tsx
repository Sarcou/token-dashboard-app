
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard = () => {
  const { user } = useAuth();
  const [createdDate, setCreatedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user?.createdAt) {
      setCreatedDate(new Date(user.createdAt));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Tableau de bord</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations utilisateur</CardTitle>
              <CardDescription>Vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Email</h3>
                <p className="text-lg">{user.email}</p>
              </div>
              
              {createdDate && (
                <div>
                  <h3 className="font-medium text-gray-500">Compte créé le</h3>
                  <p className="text-lg">
                    {format(createdDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Options disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Voir tous les utilisateurs</span>
              </Button>
              <p className="mt-2 text-sm text-gray-500">Cette fonctionnalité sera disponible prochainement.</p>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              API Endpoint: /api/auth/users
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
