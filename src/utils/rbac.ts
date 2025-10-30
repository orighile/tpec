export type Role = 'admin' | 'organizer' | 'vendor' | 'user';

interface ProfileWithRole {
  role?: Role;
  [key: string]: any;
}

export function hasRole(profile: ProfileWithRole | null | undefined, roles: Role | Role[]): boolean {
  if (!profile?.role) return false;
  const want = Array.isArray(roles) ? roles : [roles];
  return want.includes(profile.role);
}

export function isOwner(userId: string | undefined | null, ownerId: string | undefined | null): boolean {
  return Boolean(userId && ownerId && userId === ownerId);
}

export function canManageEvent(profile: ProfileWithRole | null | undefined, userId: string | null | undefined, ownerId: string | null | undefined) {
  // Admin, Organizer, or owner can manage events
  return hasRole(profile, ['admin', 'organizer']) || isOwner(userId, ownerId);
}

export function canManageVendor(profile: ProfileWithRole | null | undefined, userId: string | null | undefined, ownerId: string | null | undefined) {
  // Admin, Vendor role, or owner can manage vendors
  return hasRole(profile, ['admin', 'vendor']) || isOwner(userId, ownerId);
}

export function canViewAdminPanel(profile: ProfileWithRole | null | undefined): boolean {
  return hasRole(profile, 'admin');
}

export function canModerateContent(profile: ProfileWithRole | null | undefined): boolean {
  return hasRole(profile, ['admin', 'organizer']);
}
