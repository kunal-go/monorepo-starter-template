export const enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export class CoreError extends Error {
  isCoreError: boolean;
  code: ErrorCode;
  name: string;

  constructor(message: string) {
    super(message);

    this.isCoreError = true;
    this.code = ErrorCode.INTERNAL_SERVER_ERROR;
    this.name = "CoreError";

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "InternalServerError";
    if (stack) this.stack = stack;
  }
}

export class BadRequestError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "BadRequestError";
    this.code = ErrorCode.BAD_REQUEST;
    if (stack) this.stack = stack;
  }
}

export class UnauthorisedError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "UnauthorisedError";
    this.code = ErrorCode.UNAUTHORIZED;
    if (stack) this.stack = stack;
  }
}

export class ForbiddenError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "ForbiddenError";
    this.code = ErrorCode.FORBIDDEN;
    if (stack) this.stack = stack;
  }
}

export class NotFoundError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "NotFoundError";
    this.code = ErrorCode.NOT_FOUND;
    if (stack) this.stack = stack;
  }
}

export class ConflictError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "ConflictError";
    this.code = ErrorCode.CONFLICT;
    if (stack) this.stack = stack;
  }
}

export class UnprocessableEntityError extends CoreError {
  constructor(message: string, stack?: Error["stack"]) {
    super(message);
    this.name = "UnprocessableEntityError";
    this.code = ErrorCode.UNPROCESSABLE_ENTITY;
    if (stack) this.stack = stack;
  }
}

export function isCoreError(err: unknown | any): err is CoreError {
  return err?.isCoreError ?? false;
}
