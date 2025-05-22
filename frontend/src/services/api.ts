import type { Software, AccessRequest, ApiResponse, AuthUser } from "../types";
import { fetchWithHandling } from "../utils/fetchWithHandling";

const API = import.meta.env.VITE_BACKEND_API_URL;

const headers = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const signup = (body: object): Promise<ApiResponse<null>> =>
  fetchWithHandling(`${API}/auth/signup`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

export const login = (body: object): Promise<ApiResponse<AuthUser>> =>
  fetchWithHandling(`${API}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

export const getAllSoftware = (
  token: string
): Promise<ApiResponse<Software[]>> =>
  fetchWithHandling(`${API}/software`, {
    headers: headers(token),
  });

export const createSoftware = (
  body: object,
  token: string
): Promise<ApiResponse<Software>> =>
  fetchWithHandling(`${API}/software`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });

export const submitRequest = (
  body: object,
  token: string
): Promise<ApiResponse<AccessRequest>> =>
  fetchWithHandling(`${API}/requests`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });

export const getRequests = (
  token: string
): Promise<ApiResponse<AccessRequest[]>> =>
  fetchWithHandling(`${API}/requests`, {
    headers: headers(token),
  });

export const updateRequestStatus = (
  id: number,
  status: string,
  token: string
): Promise<ApiResponse<AccessRequest>> =>
  fetchWithHandling(`${API}/requests/${id}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ status }),
  });
