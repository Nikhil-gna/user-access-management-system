import type { ApiResponse } from "../types";

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  errors?: any[];

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    errors?: any[]
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export async function fetchWithHandling<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(input, init);
    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new ApiError(
        data.error.message || "Something went wrong",
        data.statusCode || res.status,
        data.code,
        data.errors
      );
    }

    return data as ApiResponse<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;

    throw new ApiError(
      err instanceof Error ? err.message : "Unknown error",
      500
    );
  }
}
