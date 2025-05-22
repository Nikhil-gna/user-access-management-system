export type Role = "Admin" | "Manager" | "Employee";

export interface ApiResponse<T> {
  json(): ApiResponse<null> | PromiseLike<ApiResponse<null>>;
  ok: boolean;
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
  token: string;
}

export interface Software {
  id: number;
  name: string;
  description: string;
  accessLevels: string[];
}

export interface AccessRequest {
  id: number;
  accessType: string;
  reason: string;
  status: string;
  software: Software;
  user: AuthUser;
}
