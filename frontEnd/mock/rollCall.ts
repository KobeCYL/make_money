import { Request, Response } from 'express';
import { fakerZH_CN as faker } from '@faker-js/faker';

// 生成随机头像
const generateAvatar = () => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`;
};

// 生成随机学生数据
const generateStudent = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: generateAvatar(),
  jobSeekingCount: faker.number.int({ min: 1, max: 20 }),
  interviewCount: faker.number.int({ min: 0, max: 15 }),
  earnings: faker.number.int({ min: 1000, max: 50000 }),
});

// 生成随机面试官数据
const generateInterviewer = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: generateAvatar(),
  title: faker.helpers.arrayElement(['初级面试官', '资深面试官', '专家面试官']),
  interviewCount: faker.number.int({ min: 50, max: 500 }),
  successRate: faker.number.float({ min: 0.6, max: 0.95, fractionDigits: 2 }),
});

// 生成模拟数据
const students = Array.from({ length: 100 }, () => generateStudent());
const interviewers = Array.from({ length: 20 }, () => generateInterviewer());

// 获取学生列表
export const getStudents = (req: Request, res: Response) => {
  const { current = 1, pageSize = 10 } = req.query;
  const start = ((current as number) - 1) * (pageSize as number);
  const end = start + (pageSize as number);
  const data = students.slice(start, end);

  res.json({
    data,
    total: students.length,
    success: true,
    pageSize,
    current,
  });
};

// 获取面试官列表
export const getInterviewers = (req: Request, res: Response) => {
  const { current = 1, pageSize = 10 } = req.query;
  const start = ((current as number) - 1) * (pageSize as number);
  const end = start + (pageSize as number);
  const data = interviewers.slice(start, end);

  res.json({
    data,
    total: interviewers.length,
    success: true,
    pageSize,
    current,
  });
};

// 获取随机面试官
export const getRandomInterviewers = (req: Request, res: Response) => {
  const { count = 5 } = req.query;
  const shuffled = [...interviewers].sort(() => 0.5 - Math.random());
  const data = shuffled.slice(0, count as number);

  res.json({
    code: 200,
    data,
    success: true,
  });
};

// 获取随机学生
export const getRandomStudent = (req: Request, res: Response) => {
  const selectedStudents = [];
  const usedIndexes = new Set();

  while (selectedStudents.length < 3 && usedIndexes.size < students.length) {
    const randomIndex = Math.floor(Math.random() * students.length);
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      selectedStudents.push(students[randomIndex]);
    }
  }

  res.json({
    data: selectedStudents,
    success: true,
  });
};

// 获取排行榜数据
export const getRankingList = (req: Request, res: Response) => {
  const sortedStudents = [...students].sort((a, b) => b.earnings - a.earnings);
  const topStudents = sortedStudents.slice(0, 10);

  res.json({
    data: topStudents,
    success: true,
  });
};

// 提交面试结果
export const submitInterviewResult = (req: Request, res: Response) => {
  const { studentId, interviewerId, question, result, timestamp } = req.body;

  // 更新学生数据
  const studentIndex = students.findIndex(s => s.id === studentId);
  if (studentIndex !== -1) {
    students[studentIndex] = {
      ...students[studentIndex],
      interviewCount: students[studentIndex].interviewCount + 1,
      earnings: result === 'success' 
        ? students[studentIndex].earnings + faker.number.int({ min: 500, max: 2000 })
        : students[studentIndex].earnings
    };
  }

  // 更新面试官数据
  const interviewerIndex = interviewers.findIndex(i => i.id === interviewerId);
  if (interviewerIndex !== -1) {
    const currentSuccess = interviewers[interviewerIndex].successRate * interviewers[interviewerIndex].interviewCount;
    const newInterviewCount = interviewers[interviewerIndex].interviewCount + 1;
    const newSuccessCount = result === 'success' ? currentSuccess + 1 : currentSuccess;
    
    interviewers[interviewerIndex] = {
      ...interviewers[interviewerIndex],
      interviewCount: newInterviewCount,
      successRate: newSuccessCount / newInterviewCount
    };
  }

  res.json({
    success: true,
    message: '面试结果提交成功'
  });
};