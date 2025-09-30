import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold font-mulish">
            <span className="bg-gradient-to-r from-mint-pastel to-pink-pastel bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-gray-600">Quản lý hệ thống HAP MEDBUDDY</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Thông báo
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/profile')}>
          <User className="h-4 w-4 mr-2" />
          {auth.user?.name ? auth.user.name.split(' ')[0] : 'Profile'}
        </Button>
        <Button variant="ghost" size="sm" onClick={async () => { await auth.logout(); navigate('/login'); }}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Header;
