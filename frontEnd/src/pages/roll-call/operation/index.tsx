import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Button, Avatar, Space, Typography, Progress, Input, message, Modal, List, Badge, Spin } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { createStyles, keyframes } from 'antd-style';
import { request } from '@umijs/max';
import { CheckOutlined, CloseOutlined, TrophyOutlined } from '@ant-design/icons';
import { getStudents, getInterviewers, getRandomStudent, getRankingList } from '@/services/roll-call';
import { getApiRollCallRandomStudent } from '@/services/makeMoney/call';

// 抽奖动画
const rollAnimation = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const useStyles = createStyles(({ token }) => ({
  interviewerListCard: {
    borderRadius: token.borderRadiusLG,
    marginTop: '24px',
  },
  interviewerItem: {
    borderRadius: token.borderRadiusLG,
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  mainCard: {
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowTertiary,
  },
  rollCallCard: {
    height: '100%',
    borderRadius: token.borderRadiusLG,
    '.ant-card-body': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
    },
  },
  progressSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '.ant-progress': {
      width: '100%',
    },
  },
  rollButton: {
    width: '200px',
    height: '60px',
    fontSize: '20px',
    borderRadius: token.borderRadiusLG,
  },
  studentCard: {
    width: '100%',
    background: token.colorBgTextHover,
    borderRadius: token.borderRadiusLG,
    padding: '24px',
  },
  studentAvatar: {
    border: `3px solid #f5222d`, // 求职者红色边框
    transition: 'all 0.3s',
  },
  interviewerAvatar: {
    border: `3px solid #1890ff`, // 面试官蓝色边框
    transition: 'all 0.3s',
  },
  rollButtonAnimated: {
    animation: `${rollAnimation} 0.5s infinite`,
  },
  mainLayout: {
    minHeight: 'calc(100vh - 200px)',
  },
  leftColumn: {
    paddingRight: '12px',
  },
  rightColumn: {
    paddingLeft: '12px',
  },
  rankingCard: {
    height: '100%',
    borderRadius: token.borderRadiusLG,
    '.ant-card-head': {
      minHeight: '48px',
      padding: '0 16px',
      '.ant-card-head-title': {
        padding: '8px 0',
      },
    },
  },
  rankItem: {
    background: token.colorBgTextHover,
    borderRadius: token.borderRadiusLG,
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateX(4px)',
      background: token.colorBgTextActive,
    },
  },
  rankNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: token.colorPrimary,
    color: token.colorWhite,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  interviewerCard: {
    height: '100%',
    borderRadius: token.borderRadiusLG,
    '.ant-card-body': {
      padding: '24px',
    },
  },
  inviteSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '32px 0',
  },
  interviewerAvatar: {
    border: `2px solid ${token.colorPrimary}`,
  },
  questionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  questionInput: {
    '.ant-input': {
      fontSize: '14px',
      resize: 'none',
      '&::placeholder': {
        color: token.colorTextPlaceholder,
      },
    },
  },
  scoreSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '.anticon': {
      marginRight: '8px',
    },
  },
}));

interface Student {
  id: string;
  name: string;
  avatar: string;
  jobSeekingCount: number;
  interviewCount: number;
  earnings: number;
}

interface Interviewer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  interviewCount: number;
  successRate: number;
}

interface InterviewRecord {
  interviewerId: string;
  question: string;
  result: 'success' | 'fail' | null;
  reward: number;
}

interface StudentInterviewState {
  studentId: string;
  selectedInterviewers: Interviewer[];
  interviewRecords: InterviewRecord[];
  isCompleted: boolean;
}

const RollCallOperation: React.FC = () => {
  const { styles } = useStyles();

  // 状态定义
  const [isRolling, setIsRolling] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [activeStudentIndex, setActiveStudentIndex] = useState<number>(-1);
  const [progress, setProgress] = useState({ current: 0, total: 30 });
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [rankingList, setRankingList] = useState<Student[]>([]);

  // 面试官选择相关状态
  const [showInterviewerModal, setShowInterviewerModal] = useState(false);
  const [currentSelectingStudent, setCurrentSelectingStudent] = useState<Student | null>(null);
  const [studentInterviewStates, setStudentInterviewStates] = useState<StudentInterviewState[]>([]);

  // 面试记录状态
  const [activeInterviewerIndex, setActiveInterviewerIndex] = useState<number>(-1);
  const [currentInterviewerIndex, setCurrentInterviewerIndex] = useState<number>(-1);
  const [currentQuestion, setCurrentQuestion] = useState('');

  // 动画状态
  const [showCelebration, setShowCelebration] = useState(false);



  // 获取排行榜数据
  useEffect(() => {
    const fetchRankingList = async () => {
      try {
        const { data } = await getRankingList();
        setRankingList(data);
      } catch (error) {
        message.error('获取排行榜数据失败');
      }
    };
    fetchRankingList();
  }, []);

  // 随机选择学生（带抽奖动画）
  const handleRollCall = async () => {
    if (progress.current >= progress.total) {
      message.warning('今日点名已完成');
      return;
    }

    setIsRolling(true);
    setSelectedStudents([]);
    setActiveStudentIndex(-1);
    setStudentInterviewStates([]);

    try {
      // 3秒抽奖动画

      const { data } = await getApiRollCallRandomStudent({
        count: 3
      });

      // 逐个显示学生（每个间隔0.5秒）
      for (let i = 0; i < data.length; i++) {
        setSelectedStudents(prev => [...prev, data[i]]);
      }

      // 初始化学生面试状态
      const initialStates: StudentInterviewState[] = data.map(student => ({
        studentId: student.id,
        selectedInterviewers: [],
        interviewRecords: [],
        isCompleted: false
      }));
      setStudentInterviewStates(initialStates);

      setActiveStudentIndex(0);
      setProgress(prev => ({ ...prev, current: prev.current + 1 }));
      message.success('点名完成！');
    } catch (error) {
      message.error('随机选择学生失败');
    } finally {
      setIsRolling(false);
    }
  };

  // 打开面试官面试弹窗
  const handleOpenInterviewerModal = async (student: Student) => {
    setCurrentSelectingStudent(student);

    try {
      // 从API获取5位面试官
      const { data } = await request<{ data: Interviewer[] }>('/api/roll-call/random-interviewers', {
        method: 'GET',
        params: { count: 5 }
      });

      // 更新学生面试状态
      setStudentInterviewStates(prev =>
        prev.map(state =>
          state.studentId === student.id
            ? {
                ...state,
                selectedInterviewers: data,
                interviewRecords: data.map(interviewer => ({
                  interviewerId: interviewer.id,
                  question: '',
                  result: null,
                  reward: 0
                }))
              }
            : state
        )
      );

      setShowInterviewerModal(true);
    } catch (error) {
      message.error('获取面试官失败');
    }
  };

  // 关闭面试弹窗
  const handleCloseInterviewerModal = () => {
    setShowInterviewerModal(false);
    setCurrentSelectingStudent(null);
  };

  // 获取当前学生的面试状态
  const getCurrentStudentState = useCallback((studentId: string) => {
    return studentInterviewStates.find(state => state.studentId === studentId);
  }, [studentInterviewStates]);
const [rewardRecipient, setRewardRecipient] = useState<'student' | 'interviewer'>('student');
  // 提交评分（完整奖励计算）
  const handleSubmitScore = async (studentId: string, interviewerIndex: number, result: 'success' | 'fail') => {
    const studentState = getCurrentStudentState(studentId);
    if (!studentState || !studentState.interviewRecords[interviewerIndex]) {
      message.error('面试记录不存在');
      return;
    }

    const record = studentState.interviewRecords[interviewerIndex];
    if (!record.question.trim()) {
      message.error('请先输入面试问题');
      return;
    }

    try {
      // 计算奖励：会-给求职者300元，不会-给面试官300元
      const reward = 300;
      const rewardRecipient1 = result === 'success' ? 'student' : 'interviewer';
      setRewardRecipient(rewardRecipient1);
      await request<{ success: boolean }>('/api/roll-call/submit-result', {
        method: 'POST',
        data: {
          studentId,
          interviewerId: record.interviewerId,
          question: record.question,
          result,
          reward,
          rewardRecipient: rewardRecipient1,
          timestamp: Date.now(),
        },
      });

      // 更新面试记录
      setStudentInterviewStates(prev =>
        prev.map(state =>
          state.studentId === studentId
            ? {
                ...state,
                interviewRecords: state.interviewRecords.map((rec, idx) =>
                  idx === interviewerIndex
                    ? { ...rec, result, reward }
                    : rec
                )
              }
            : state
        )
      );

      // 更新当前面试官索引
      setCurrentInterviewerIndex(interviewerIndex);

      // 显示庆祝动画
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);

      // message.success(`${rewardRecipient === 'student' ? '求职者' : '面试官'}: ${rewardRecipient === 'student' ? currentSelectingStudent?.name : studentState.selectedInterviewers[currentInterviewerIndex].name}, 奖励300元`);

      // 刷新排行榜
      const { data } = await getRankingList();
      setRankingList(data);

    } catch (error) {
      message.error('评分提交失败');
    }
  };

  // 更新面试问题
  const handleQuestionChange = (studentId: string, interviewerIndex: number, question: string) => {
    setStudentInterviewStates(prev =>
      prev.map(state =>
        state.studentId === studentId
          ? {
              ...state,
              interviewRecords: state.interviewRecords.map((rec, idx) =>
                idx === interviewerIndex
                  ? { ...rec, question }
                  : rec
              )
            }
          : state
      )
    );
  };

  return (
    <PageContainer breadcrumb={false} style={{ padding: '24px 48px' }} title="赚钱喽" subTitle="求职奖励1000元,面试过程中,会 => 奖励求职者:300元,不会 => 奖励面试者:300元">
      <div className={styles.mainLayout} style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* 左栏：点名操作区域 */}
          <Col span={18} className={styles.leftColumn}>
            {/* 点名进度和操作区 */}
            {/* <Card className={styles.rollCallCard} style={{ marginBottom: '24px' }}> */}
              <div className={styles.progressSection}>

                <Progress
                  percent={(progress.current / progress.total) * 100}
                  format={() => `已点名 ${progress.current}/${progress.total} 总人数 ${progress.total}`}
                  status={progress.current >= progress.total ? 'success' : 'active'}
                  strokeWidth={12}
                  style={{ marginBottom: '32px' }}
                />
                <Button
                  type="primary"
                  size="large"
                  loading={isRolling}
                  onClick={handleRollCall}
                  className={`${styles.rollButton} ${isRolling ? styles.rollButtonAnimated : ''}`}
                  disabled={progress.current >= progress.total}
                >
                  {isRolling ? '随机选择中...' : '开始点名'}
                </Button>
              </div>
            {/* </Card> */}

            {/* 被点名学员展示区 */}
            {selectedStudents.length > 0 && (
              <Card title="今日被点名学员" style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                  {selectedStudents.map((student, index) => {
                    const studentState = getCurrentStudentState(student.id);
                    const hasSelectedInterviewers = studentState?.selectedInterviewers.length === 5;

                    return (
                      <Col span={8} key={student.id}>
                        <Card
                          className={styles.studentCard}
                          bordered={false}
                          style={{
                            border: index === activeStudentIndex ? '3px solid #1890ff' : '1px solid #f0f0f0',
                            cursor: 'pointer'
                          }}
                        onClick={() => setActiveStudentIndex(index)}
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Space align="center" size="middle">
                            <Badge count={index + 1} color="#1890ff">
                              <Avatar
                                size={64}
                                src={student.avatar}
                                className={styles.studentAvatar}
                              />
                            </Badge>
                            <Space direction="vertical" size={4}>
                              <Typography.Title level={4} style={{ margin: 0 }}>{student.name}</Typography.Title>
                              <Typography.Text type="secondary">求职次数：{student.jobSeekingCount}</Typography.Text>
                              <Typography.Text type="secondary">面试次数：{student.interviewCount}</Typography.Text>
                            </Space>
                          </Space>
                          <Button
                            type={hasSelectedInterviewers ? "default" : "primary"}
                            block
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenInterviewerModal(student);
                            }}
                            disabled={hasSelectedInterviewers}
                          >
                            {hasSelectedInterviewers ? '已选择面试官' : '邀请面试官'}
                          </Button>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}


           </Col>

           {/* 右栏：奖金排行榜 */}
           <Col span={6} className={styles.rightColumn}>
             <Card
               title={
                 <Space>
                   <TrophyOutlined style={{ color: '#faad14' }} />
                   <span>奖金排行榜</span>
                 </Space>
               }
               className={styles.rankingCard}
             >
               <List
                 dataSource={rankingList.slice(0, 10)}
                 renderItem={(student, index) => (
                   <List.Item className={styles.rankItem} style={{ padding: '12px', marginBottom: '8px' }}>
                     <Space style={{ width: '100%' }} align="center">
                       <div className={styles.rankNumber}>{index + 1}</div>
                       <Avatar size={40} src={student.avatar} />
                       <div style={{ flex: 1 }}>
                         <Typography.Text strong style={{ display: 'block' }}>{index === 0 ? '[首富] ' : index === 1 ? '[土豪] ' : index === 2 ? '[乡绅] ' : ''} {student.name} </Typography.Text>
                         <Typography.Text type="success" strong>¥{student.earnings.toLocaleString()}</Typography.Text>
                         <div>
                           <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                             求职:{student.jobSeekingCount} 面试:{student.interviewCount}
                           </Typography.Text>
                         </div>
                       </div>
                     </Space>
                   </List.Item>
                 )}
               />

               {/* 今日统计 */}
               <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                 <Typography.Title level={5}>今日奖金统计</Typography.Title>
                 <Space direction="vertical" style={{ width: '100%' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <Typography.Text>求职者奖金：</Typography.Text>
                     <Typography.Text type="success" strong>¥3,000</Typography.Text>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <Typography.Text>面试官奖金：</Typography.Text>
                     <Typography.Text type="success" strong>¥1,500</Typography.Text>
                   </div>
                 </Space>
               </div>

               {/* 本周统计 */}
               {/* <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                 <Typography.Title level={5}>本周奖金统计</Typography.Title>
                 <Space direction="vertical" style={{ width: '100%' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <Typography.Text>求职者奖金：</Typography.Text>
                     <Typography.Text type="success" strong>¥9,000</Typography.Text>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <Typography.Text>面试官奖金：</Typography.Text>
                     <Typography.Text type="success" strong>¥5,000</Typography.Text>
                   </div>
                 </Space>
               </div> */}
             </Card>
           </Col>
         </Row>
       </div>

       {/* 面试官面试弹窗 */}
        <Modal
          title={`${currentSelectingStudent?.name} 的面试环节`}
          open={showInterviewerModal}
          onCancel={handleCloseInterviewerModal}
          footer={null}
          width={1200}
          style={{ top: 20 }}
        >
          {currentSelectingStudent && (() => {
            const studentState = getCurrentStudentState(currentSelectingStudent.id);
            if (!studentState?.selectedInterviewers.length) return null;

            return (
              <div>
                <Typography.Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
                  系统已获取5位面试官，请依次进行面试
                </Typography.Text>

                <Row gutter={[16, 16]}>
                  {studentState.selectedInterviewers.map((interviewer, interviewerIndex) => {
                    const record = studentState.interviewRecords[interviewerIndex];

                    return (
                      <Col span={12} key={interviewer.id}>
                        <Card
                          size="small"
                          title={
                            <Space>
                              <Avatar size={32} src={interviewer.avatar} className={styles.interviewerAvatar} />
                              <span>{interviewer.name}</span>
                              <Typography.Text type="secondary">({interviewer.title})</Typography.Text>
                            </Space>
                          }
                          style={{ marginBottom: '16px' }}
                        >
                          <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                              <Typography.Text strong>面试问题：</Typography.Text>
                              <Input.TextArea
                                placeholder="请输入面试问题..."
                                value={record.question}
                                onChange={(e) => handleQuestionChange(currentSelectingStudent.id, interviewerIndex, e.target.value)}
                                rows={3}
                                disabled={record.result !== null}
                                style={{ marginTop: '8px' }}
                              />
                            </div>

                            <div>
                              <Typography.Text strong>评分结果：</Typography.Text>
                              <div style={{ marginTop: '8px' }}>
                                <Space>
                                  <Button
                                    type={record.result === 'success' ? 'primary' : 'default'}
                                    icon={<CheckOutlined />}
                                    onClick={() => handleSubmitScore(currentSelectingStudent.id, interviewerIndex, 'success')}
                                    disabled={record.result !== null || !record.question.trim()}
                                    style={{ backgroundColor: record.result === 'success' ? '#52c41a' : undefined }}
                                  >
                                    会 (+300元给求职者)
                                  </Button>
                                  <Button
                                    type={record.result === 'fail' ? 'primary' : 'default'}
                                    danger={record.result === 'fail'}
                                    icon={<CloseOutlined />}
                                    onClick={() => handleSubmitScore(currentSelectingStudent.id, interviewerIndex, 'fail')}
                                    disabled={record.result !== null || !record.question.trim()}
                                  >
                                    不会 (+300元给面试官)
                                  </Button>
                                </Space>
                              </div>

                              {record.result && (
                                <div style={{ marginTop: '8px' }}>
                                  <Typography.Text type="success">
                                    已评分：{record.result === 'success' ? '能力达标' : '需要提升'}
                                    （奖励：¥{record.reward}）
                                  </Typography.Text>
                                </div>
                              )}
                            </div>
                          </Space>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <Button type="primary" onClick={handleCloseInterviewerModal}>
                    完成面试
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>

       {/* 庆祝动画 */}
       {showCelebration && (
         <div style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           background: 'rgba(0,0,0,0.5)',
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           zIndex: 9999
         }}>
           <div style={{
             background: 'white',
             padding: '40px',
             borderRadius: '16px',
             textAlign: 'center',
             animation: `${rollAnimation} 1s ease-in-out`
           }}>
             <Typography.Title level={2} style={{ color: '#52c41a', margin: 0 }}>🎉 {rewardRecipient === 'student' ? '求职者: ' : '面试官: '}{rewardRecipient === 'student' ? currentSelectingStudent?.name : getCurrentStudentState(currentSelectingStudent?.id)?.selectedInterviewers[currentInterviewerIndex]?.name}, 奖励300元 🎉</Typography.Title>
           </div>
         </div>
       )}
    </PageContainer>
  );
};



export default RollCallOperation;
