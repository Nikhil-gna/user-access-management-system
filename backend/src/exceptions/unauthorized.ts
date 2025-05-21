import { ErrorCode } from "./root";

export class UnauthorizedException extends Error {
  statusCode: number;
  code: ErrorCode;

  constructor(message = "Unauthorized", code = ErrorCode.UNAUTHORIZED) {
    super(message);
    this.statusCode = 401;
    this.code = code;
  }
}
