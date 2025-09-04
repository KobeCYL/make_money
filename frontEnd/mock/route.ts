import { getStudents, getInterviewers, getRandomStudent, getRankingList, submitInterviewResult, getRandomInterviewers } from './rollCall';

export default {
  '/api/auth_routes': {
    '/form/advanced-form': { authority: ['admin', 'user'] },
  },
  'GET /api/roll-call/students': getStudents,
  'GET /api/roll-call/interviewers': getInterviewers,
  'GET /api/roll-call/random-student': getRandomStudent,
  'GET /api/roll-call/random-interviewers': getRandomInterviewers,
  'GET /api/roll-call/ranking': getRankingList,
  'POST /api/roll-call/submit-result': submitInterviewResult,
};
