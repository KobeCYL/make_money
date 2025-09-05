import { request } from '@umijs/max';

// 接口返回数据类型定义
export interface Student {
  id: string;
  name: string;
  avatar: string;
  jobSeekingCount: number;
  interviewCount: number;
  earnings: number;
}

export interface Interviewer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  interviewCount: number;
  successRate: number;
}

export interface PageParams {
  current?: number;
  pageSize?: number;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  success: boolean;
  pageSize: number;
  current: number;
}

// 获取学生列表
export async function getStudents(params: PageParams) {
  return request<PageResult<Student>>('/api/roll-call/students', {
    method: 'GET',
    params,
  });
}

// 获取面试官列表
export async function getInterviewers(params: PageParams) {
  return request<PageResult<Interviewer>>('/api/roll-call/interviewers', {
    method: 'GET',
    params,
  });
}

// 获取随机学生
export async function getRandomStudent() {
  return request<{ data: Student[]; success: boolean }>('/api/roll-call/random-student', {
    method: 'GET',
  });
}

// 获取排行榜数据
export async function getRankingList() {
  return request<{ data: Student[]; success: boolean }>('/api/roll-call/ranking', {
    method: 'GET',
  });
}
