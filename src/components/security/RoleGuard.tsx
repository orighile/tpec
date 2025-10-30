import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hasRole, Role } from '@/utils/rbac';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role | Role[];
  fallback?: React.ReactNode;
  requireOwnership?: boolean;
  ownerId?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null,
  requireOwnership = false,
  ownerId
}) => {
  const { profile, user } = useAuth();
  
  // Check role permission - profile is from AuthContext with role property
  const profileWithRole = profile ? {
    ...profile,
    role: profile.role || 'user'
  } : null;
  
  const hasRequiredRole = hasRole(profileWithRole, allowedRoles);
  
  // Check ownership if required
  const isOwner = requireOwnership ? user?.id === ownerId : true;
  
  // Grant access if user has required role or is owner
  const hasAccess = hasRequiredRole || isOwner;
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Helper component for admin-only content
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleGuard allowedRoles="admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

// Helper component for organizer+ content
export const OrganizerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleGuard allowedRoles={['admin', 'organizer']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Helper component for vendor+ content  
export const VendorOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => (
  <RoleGuard allowedRoles={['admin', 'vendor']} fallback={fallback}>
    {children}
  </RoleGuard>
);