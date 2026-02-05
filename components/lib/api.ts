export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3001/api").replace(
    /\/$/,
    ""
  );

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
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

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

export type SubmitExamPayload = {
  userId: string;
  categoryKey?: string;
  answers: Array<{ questionKey: string; choice: string }>;
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
