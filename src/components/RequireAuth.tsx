import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from './Spinner';

type Props = {
  children: React.ReactElement;
  // optional array of allowed roles; if provided, user.role must be one of these to access
  allowedRoles?: string[];
};

const RequireAuth: React.FC<Props> = ({ children, allowedRoles }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.checking) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size={48} />
      </div>
    );
  }

  if (!auth.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles provided, enforce role membership. Auth user may be stored locally as any shape,
  // so we defensively read the `role` property.
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (auth.user && (auth.user.role || auth.user.type || auth.user.roleName)) || null;
    const normalized = typeof userRole === 'string' ? userRole.toLowerCase() : null;
    const allowed = normalized ? allowedRoles.map(r => r.toLowerCase()).includes(normalized) : false;
    if (!allowed) {
      // Logged in but unauthorized for this route
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md p-6 bg-white rounded shadow text-center">
            <h2 className="text-lg font-semibold">Không có quyền truy cập</h2>
            <p className="text-sm text-muted-foreground mt-2">Tài khoản của bạn không có quyền xem trang này.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default RequireAuth;
