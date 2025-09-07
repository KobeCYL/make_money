// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取所有历史记录 GET /api/records */
export async function getApiRecords(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/records", {
    method: "GET",
    ...(options || {}),
  });
}

/** 新加历史记录 POST /api/records */
export async function postApiRecords(
  body: {},
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>("/api/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
