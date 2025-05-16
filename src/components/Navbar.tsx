
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <div className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <span className="font-bold text-lg">Mon Application</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block">{user.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="text-white hover:text-primary hover:bg-white flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
