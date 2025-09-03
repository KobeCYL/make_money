import { faker } from '@faker-js/faker/locale/zh_CN';
import type { Student, Interviewer, PageParams, PageResult } from '@/services/roll-call';

// 生成随机头像
const generateAvatar = () => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`;
};

// 生成学生数据
const generateStudent = (): Student => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: generateAvatar(),
  jobSeekingCount: faker.number.int({ min: 1, max: 20 }),
  interviewCount: faker.number.int({ min: 0, max: 15 }),
  earnings: faker.number.int({ min: 1000, max: 50000 }),
});

// 生成面试官数据
const generateInterviewer = (): Interviewer => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: generateAvatar(),
  title: faker.helpers.arrayElement(['初级面试官', '资深面试官', '专家面试官']),
  interviewCount: faker.number.int({ min: 50, max: 500 }),
  successRate: faker.number.float({ min: 0.6, max: 0.95, precision: 0.01 }),
});

// 生成学生列表
const students = Array.from({ length: 100 }, generateStudent);

// 生成面试官列表
const interviewers = Array.from({ length: 20 }, generateInterviewer);

// 获取学生列表（分页）
export async function getStudents({ current, pageSize }: PageParams): Promise<PageResult<Student>> {
  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: students.slice(start, end),
    total: students.length,
    success: true,
  };
}

// 获取面试官列表（分页）
export async function getInterviewers({ current, pageSize }: PageParams): Promise<PageResult<Interviewer>> {
  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: interviewers.slice(start, end),
    total: interviewers.length,
    success: true,
  };
}

// 获取随机学生
export async function getRandomStudent(): Promise<{ data: Student }> {
  const randomIndex = Math.floor(Math.random() * students.length);
  return {
    data: students[randomIndex],
  };
}

// 获取学生排行榜
export async function getRankingList(): Promise<{ data: Student[] }> {
  const sortedStudents = [...students]
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 10);

  return {
    data: sortedStudents,
  };
}