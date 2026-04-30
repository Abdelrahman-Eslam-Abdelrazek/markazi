import type { Prisma } from "@prisma/client";

const TENANT_SCOPED_MODELS = [
  "Course",
  "Branch",
  "CenterMembership",
  "Payment",
  "Invoice",
  "AttendanceSession",
  "ScheduleSlot",
  "AuditLog",
  "ReportSnapshot",
  "NotificationConfig",
  "PaymentConfig",
];

export function tenantScopeMiddleware(centerId: string): Prisma.Middleware {
  return async (params, next) => {
    if (!params.model || !TENANT_SCOPED_MODELS.includes(params.model)) {
      return next(params);
    }

    if (params.action === "findMany" || params.action === "findFirst" || params.action === "count") {
      params.args = params.args ?? {};
      params.args.where = {
        ...params.args.where,
        centerId,
      };
    }

    if (params.action === "create") {
      params.args = params.args ?? {};
      params.args.data = {
        ...params.args.data,
        centerId,
      };
    }

    return next(params);
  };
}
