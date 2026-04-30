import { ErrorCode, ERROR_MESSAGES_AR } from "./error-codes";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly messageAr: string;

  constructor(code: ErrorCode, statusCode = 400) {
    super(code);
    this.code = code;
    this.statusCode = statusCode;
    this.messageAr = ERROR_MESSAGES_AR[code];
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        messageAr: this.messageAr,
      },
    };
  }
}

export class NotFoundError extends AppError {
  constructor(code: ErrorCode = ErrorCode.NOT_FOUND) {
    super(code, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCode.UNAUTHORIZED, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super(ErrorCode.FORBIDDEN, 403);
  }
}
