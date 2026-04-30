import type { Prisma } from "@prisma/client";

const AUDITED_MODELS = [
  "Payment",
  "Enrollment",
  "Exam",
  "ExamAttempt",
  "Assignment",
  "AssignmentSubmission",
  "AttendanceRecord",
  "CenterMembership",
];

const AUDITED_ACTIONS = ["create", "update", "delete"];

interface AuditContext {
  userId?: string;
  centerId?: string;
  ipAddress?: string;
}

export function auditLogMiddleware(
  context: AuditContext,
  logFn: (entry: {
    userId?: string;
    centerId?: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, unknown>;
    ipAddress?: string;
  }) => Promise<void>,
): Prisma.Middleware {
  return async (params, next) => {
    if (
      !params.model ||
      !AUDITED_MODELS.includes(params.model) ||
      !AUDITED_ACTIONS.includes(params.action)
    ) {
      return next(params);
    }

    const result = await next(params);

    if (result?.id) {
      const actionMap: Record<string, string> = {
        create: "CREATE",
        update: "UPDATE",
        delete: "DELETE",
      };

      await logFn({
        userId: context.userId,
        centerId: context.centerId,
        action: actionMap[params.action] ?? params.action,
        entityType: params.model,
        entityId: result.id,
        changes: params.action === "update" ? params.args?.data : undefined,
        ipAddress: context.ipAddress,
      }).catch(() => {});
    }

    return result;
  };
}
