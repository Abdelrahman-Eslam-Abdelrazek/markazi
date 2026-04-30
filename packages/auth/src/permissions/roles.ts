export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CENTER_OWNER = "CENTER_OWNER",
  BRANCH_MANAGER = "BRANCH_MANAGER",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  ACCOUNTANT = "ACCOUNTANT",
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.CENTER_OWNER]: 80,
  [UserRole.BRANCH_MANAGER]: 60,
  [UserRole.INSTRUCTOR]: 40,
  [UserRole.ACCOUNTANT]: 30,
  [UserRole.PARENT]: 20,
  [UserRole.STUDENT]: 10,
};

export function isRoleAtLeast(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
