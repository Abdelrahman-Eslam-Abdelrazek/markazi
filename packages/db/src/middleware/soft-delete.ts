import type { Prisma } from "@prisma/client";

const SOFT_DELETE_MODELS = ["User", "Center", "Course"];

export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    if (!params.model || !SOFT_DELETE_MODELS.includes(params.model)) {
      return next(params);
    }

    if (params.action === "delete") {
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === "deleteMany") {
      params.action = "updateMany";
      params.args.data = { deletedAt: new Date() };
    }

    if (
      params.action === "findMany" ||
      params.action === "findFirst" ||
      params.action === "findUnique" ||
      params.action === "count"
    ) {
      params.args = params.args ?? {};
      params.args.where = {
        ...params.args.where,
        deletedAt: params.args.where?.deletedAt ?? null,
      };
    }

    return next(params);
  };
}
