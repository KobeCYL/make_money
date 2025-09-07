// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取所有学生信息接口 GET /api/students */
export async function getApiStudents(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/students", {
    method: "GET",
    ...(options || {}),
  });
}

/** 新增学生接口 POST /api/students */
export async function postApiStudents(
  body: {},
  options?: { [key: string]: any }
) {
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
export async function putApiStudentsPinyin2025001(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/students/2025001", {
    method: "PUT",
    ...(options || {}),
  });
}

/** 删除学生信息接口 DELETE /api/students/2025001 */
export async function deleteApiStudentsPinyin2025001(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/students/2025001", {
    method: "DELETE",
    ...(options || {}),
  });
}

/** 按字段搜索接口 GET /api/students/search */
export async function getApiStudentsSearch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiStudentsSearchParams,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/api/students/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 按资金升序排列接口 GET /api/students/sort/funds */
export async function getApiStudentsSortFunds(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>("/api/students/sort/funds", {
    method: "GET",
    ...(options || {}),
  });
}
