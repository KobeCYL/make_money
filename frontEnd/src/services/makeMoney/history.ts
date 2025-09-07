// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 获取所有历史记录 GET /api/records */
export async function getRecords(options?: { [key: string]: any }) {
  return request<{
    code?: number;
    data?: {
      candidate?: string;
      date?: number;
      id?: number;
      interviewer?: string;
      question?: string;
      reward_amount?: number;
      score_result?: string;
    }[];
    message?: string;
    total?: number;
  }>("/api/records", {
    method: "GET",
    ...(options || {}),
  });
}

/** 新加历史记录 POST /api/records */
export async function postRecords(body: {}, options?: { [key: string]: any }) {
  return request<{
    code?: number;
    data?: {
      candidate?: string;
      date?: string;
      id?: number;
      interviewer?: string;
      question?: string;
      reward_amount?: string;
      score_result?: string;
    };
    message?: string;
  }>("/api/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
