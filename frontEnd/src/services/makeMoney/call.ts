// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 奖励面试者 POST /api/roll-call/add-call_score */
export async function postRollCallAddCallScore(
  body: {
    studentId: string;
    money: string;
  },
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/api/roll-call/add-call_score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 清空点名历史 GET /api/roll-call/clear-call-history */
export async function getRollCallClearCallHistory(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/roll-call/clear-call-history", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取点名学生状态 GET /api/roll-call/get-call-status */
export async function getRollCallGetCallStatus(options?: {
  [key: string]: any;
}) {
  return request<{
    data: { called_count: number; total: number };
    status: string;
  }>("/api/roll-call/get-call-status", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取随机面试官 GET /api/roll-call/random-interviewers */
export async function getRollCallRandomInterviewers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRollCallRandomInterviewersParams,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/api/roll-call/random-interviewers", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取随机求职者 GET /api/roll-call/random-student */
export async function getRollCallRandomStudent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRollCallRandomStudentParams,
  options?: { [key: string]: any }
) {
  return request<{
    code: number;
    data: {
      address?: null;
      applicant_count?: number;
      avatar?: string;
      birth_date?: null;
      created_at?: string;
      email?: null;
      enrollment_year?: number;
      funds?: number;
      gender?: string;
      id?: string;
      interviewCount?: number;
      interviewer_count?: number;
      jobSeekingCount?: number;
      major?: string;
      name?: string;
      phone?: null;
      ranking?: number;
      status?: string;
      student_id?: string;
      updated_at?: string;
    }[];
    message: string;
  }>("/api/roll-call/random-student", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 保存面试记录 POST /api/roll-call/submit-result */
export async function postRollCallSubmitResult(
  body: {
    timestamp: string;
    interviewerId: string;
    question: string;
    result: "success" | "fail";
    reward: string;
    studentId: string;
  },
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/api/roll-call/submit-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
