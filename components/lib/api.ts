import Constants from "expo-constants";
import { Platform } from "react-native";

const extractHost = (uri?: string | null) => {
  if (!uri || typeof uri !== "string") return null;
  const cleaned = uri.replace(/^https?:\/\//, "");
  const host = cleaned.split("/")[0]?.split(":")[0];
  return host || null;
};

const getDevServerHost = () => {
  const manifest = (Constants as { manifest?: { hostUri?: string; debuggerHost?: string } })
    .manifest;
  const manifest2 = (Constants as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } })
    .manifest2;
  const expoConfig = Constants.expoConfig as { hostUri?: string } | null;

  const hostUri =
    expoConfig?.hostUri ??
    manifest?.hostUri ??
    manifest?.debuggerHost ??
    manifest2?.extra?.expoClient?.hostUri;

  return extractHost(hostUri);
};

const getDefaultApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  if (__DEV__) {
    const host = getDevServerHost();
    if (host) {
      return `http://${host}:3001/api`;
    }

    if (Platform.OS === "android") {
      return "http://10.0.2.2:3001/api";
    }

    return "http://localhost:3001/api";
  }

  // Production fallback (prefer setting EXPO_PUBLIC_API_BASE_URL)
  return "http://localhost:3001/api";
};

export const API_BASE_URL = getDefaultApiBaseUrl().replace(/\/$/, "");

type ApiErrorPayload = {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
};

export class ApiError extends Error {
  code?: string;
  details?: Record<string, unknown>;

  constructor(message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.code = payload?.code;
    this.details = payload?.details;
  }
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: ApiErrorPayload;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (err) {
    throw new ApiError("ارتباط با سرور برقرار نشد. اتصال شبکه یا آدرس سرور را بررسی کن.", {
      code: "NETWORK_ERROR",
    });
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch (err) {
    payload = null;
  }

  if (!res.ok) {
    const message = payload?.error?.message || `Request failed (${res.status})`;
    throw new ApiError(message, payload?.error);
  }

  if (!payload || typeof payload !== "object") {
    throw new ApiError("Invalid server response");
  }

  return payload.data;
};

export type RegisterUserPayload = {
  fullName: string;
  fieldOfStudy: string;
  phone: string;
};

export type User = {
  id: string;
  fullName: string;
  fieldOfStudy: string;
  phone: string;
  createdAt: string;
};

export const registerUser = (payload: RegisterUserPayload) =>
  request<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getUserByPhone = (phone: string) =>
  request<User | null>(`/users/by-phone/${encodeURIComponent(phone)}`, {
    method: "GET",
  });

export type SubmitExamPayload = {
  userId: string;
  categoryKey?: string;
  answers: Array<{ questionKey: string; choice: string }>;
};

export type DraftExamPayload = {
  userId: string;
  categoryKey?: string;
  answers: Array<{ questionKey: string; choice: string }>;
  progressIndex?: number;
  total?: number;
};

export type ExamResult = {
  id: string;
  userId: string;
  categoryKey?: string | null;
  answers: Array<{ questionKey: string; choice: string }>;
  score: number;
  total: number;
  result: string;
  analysis?: {
    mode: "choice" | "correct";
    topChoice?: string | null;
    counts?: Record<string, number>;
  };
  createdAt: string;
};

export const submitExam = (payload: SubmitExamPayload) =>
  request<ExamResult>("/exams", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export type ExamDraft = {
  id: string;
  userId: string;
  categoryKey?: string | null;
  answers: Array<{ questionKey: string; choice: string }>;
  progressIndex?: number | null;
  total?: number | null;
  createdAt: string;
  updatedAt: string;
};

export const saveExamDraft = (payload: DraftExamPayload) =>
  request<ExamDraft>("/exams/draft", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getExamDraft = (userId: string) =>
  request<ExamDraft | null>(`/exams/draft/${userId}`, {
    method: "GET",
  });

export const clearExamDraft = (userId: string) =>
  request<{ success: true }>(`/exams/draft/${userId}`, {
    method: "DELETE",
  });
