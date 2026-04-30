import { UserRole, isRoleAtLeast } from "./roles";
import { defineAbilitiesFor } from "./abilities";
import type { AppAbility } from "./abilities";

export function checkPermission(
  role: UserRole,
  action: Parameters<AppAbility["can"]>[0],
  subject: Parameters<AppAbility["can"]>[1],
  context?: { centerId?: string; userId?: string },
): boolean {
  const ability = defineAbilitiesFor(role, context);
  return ability.can(action, subject);
}

export function requireRole(userRole: UserRole, requiredRole: UserRole): void {
  if (!isRoleAtLeast(userRole, requiredRole)) {
    throw new Error(`Access denied: requires ${requiredRole}, got ${userRole}`);
  }
}
