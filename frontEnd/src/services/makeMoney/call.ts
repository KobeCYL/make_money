// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取点名学生状态 GET /api/roll-call/get-call-status */
export async function getApiRollCallGetCallStatus(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/roll-call/get-call-status", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取随机求职者 GET /api/roll-call/random-student */
export async function getApiRollCallRandomStudent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiRollCallRandomStudentParams,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/api/roll-call/random-student", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 保存面试记录 POST /api/roll-call/submit-result */
export async function postApiRollCallSubmitResult(
  body: {
    timestamp: string;
    interviewerId: string;
    question: string;
    result: "sucess" | "fail";
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

/** 获取随机面试官 GET /random-interviewers */
export async function getRandomInterviewers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRandomInterviewersParams,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/random-interviewers", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
