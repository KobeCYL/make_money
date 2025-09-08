// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取所有学生信息接口 GET /api/students */
export async function getStudents(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/students", {
    method: "GET",
    ...(options || {}),
  });
}

/** 新增学生接口 POST /api/students */
export async function postStudents(body: {}, options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 学生信息更新接口 PUT /api/students/2025001 */
export async function putStudentsPinyin2025001(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/students/2025001", {
    method: "PUT",
    ...(options || {}),
  });
}

/** 删除学生信息接口 DELETE /api/students/2025001 */
export async function deleteStudentsPinyin2025001(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/students/2025001", {
    method: "DELETE",
    ...(options || {}),
  });
}

/** 初始化学生列表 GET /api/students/refresh-data */
export async function getStudentsRefreshData(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/students/refresh-data", {
    method: "GET",
    ...(options || {}),
  });
}

/** 按字段搜索接口 GET /api/students/search */
export async function getStudentsSearch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStudentsSearchParams,
  options?: { [key: string]: any }
) {
  return request<{
    code: number;
    data: {
      applicant_count?: number;
      created_at?: string;
      funds?: number;
      id?: number;
      interviewer_count?: number;
      is_active?: boolean;
      name?: string;
      ranking?: number;
      student_id?: string;
    }[];
    message: string;
  }>("/api/students/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 按资金升序排列接口 GET /api/students/sort/funds */
export async function getStudentsSortFunds(options?: { [key: string]: any }) {
  return request<{
    code?: number;
    data?: {
      applicant_count?: number;
      created_at?: string;
      funds?: number;
      id?: number;
      interviewer_count?: number;
      is_active?: boolean;
      name?: string;
      ranking?: number;
      student_id?: string;
    }[];
    message?: string;
  }>("/api/students/sort/funds", {
    method: "GET",
    ...(options || {}),
  });
}
