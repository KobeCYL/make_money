import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Button, Avatar, Space, Typography, Progress, Input, message } from 'antd';
import { useState, useEffect } from 'react';
import { createStyles } from 'antd-style';
import { request } from '@umijs/max';
import { getStudents, getInterviewers, getRandomStudent, getRankingList } from '@/services/roll-call';

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
    border: `2px solid ${token.colorPrimary}`,
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

const RollCallOperation: React.FC = () => {
  const { styles } = useStyles();
  
  // 状态定义
  const [isRolling, setIsRolling] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [activeStudentIndex, setActiveStudentIndex] = useState<number>(-1);
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [question, setQuestion] = useState('');
  const [score, setScore] = useState<'success' | 'fail' | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 30 });
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [rankingList, setRankingList] = useState<Student[]>([]);

  // 获取面试官列表
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const { data } = await getInterviewers({ current: 1, pageSize: 10 });
        setInterviewers(data);
      } catch (error) {
        message.error('获取面试官列表失败');
      }
    };
    fetchInterviewers();
  }, []);

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

  // 随机选择学生
  const handleRollCall = async () => {
    if (progress.current >= progress.total) {
      message.warning('今日点名已完成');
      return;
    }
    
    setIsRolling(true);
    try {
      const { data } = await getRandomStudent();
      setSelectedStudents(data);
      setActiveStudentIndex(0); // 默认选中第一个学生
      setProgress(prev => ({ ...prev, current: prev.current + 1 }));
    } catch (error) {
      message.error('随机选择学生失败');
    } finally {
      setIsRolling(false);
    }
  };

  // 选择面试官
  const handleSelectInterviewer = () => {
    if (interviewers.length === 0) {
      message.warning('暂无可用面试官');
      return;
    }
    const randomIndex = Math.floor(Math.random() * interviewers.length);
    setSelectedInterviewer(interviewers[randomIndex]);
  };

  // 提交评分
  const handleSubmitScore = async (result: 'success' | 'fail') => {
    if (activeStudentIndex === -1 || !selectedStudents[activeStudentIndex] || !selectedInterviewer || !question) {
      message.error('请完善面试信息');
      return;
    }

    setScore(result);
    try {
      await request<{ success: boolean }>('/api/roll-call/submit-result', {
        method: 'POST',
        data: {
          studentId: selectedStudents[activeStudentIndex].id,
          interviewerId: selectedInterviewer.id,
          question,
          result,
          timestamp: Date.now(),
        },
      });
      message.success('评分提交成功');
      
      // 移动到下一个学生或重置状态
      if (activeStudentIndex < selectedStudents.length - 1) {
        setActiveStudentIndex(activeStudentIndex + 1);
        setSelectedInterviewer(null);
        setQuestion('');
        setScore(null);
      } else {
        setSelectedStudents([]);
        setActiveStudentIndex(-1);
        setSelectedInterviewer(null);
        setQuestion('');
        setScore(null);
      }
    } catch (error) {
      message.error('评分提交失败');
      setScore(null);
    }
  };

  return (
    <PageContainer>
      <Card className={styles.mainCard}>
        <Row gutter={[24, 24]}>
          {/* 随机点名区域 */}
          <Col span={24}>
            <Card className={styles.rollCallCard}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row justify="center">
                  <Col span={8}>
                    <div className={styles.progressSection}>
                      <Progress
                        percent={(progress.current / progress.total) * 100}
                        format={() => `${progress.current}/${progress.total}`}
                        status={progress.current >= progress.total ? 'success' : 'active'}
                      />
                      <Button
                        type="primary"
                        size="large"
                        loading={isRolling}
                        onClick={handleRollCall}
                        className={styles.rollButton}
                      >
                        {isRolling ? '随机选择中...' : '开始点名'}
                      </Button>
                    </div>
                  </Col>
                </Row>
                
                {selectedStudents.length > 0 && (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Typography.Title level={4}>已选中的学生</Typography.Title>
                    <Row gutter={[16, 16]} style={{ width: '100%' }}>
                      {selectedStudents.map((student, index) => (
                        <Col span={8} key={student.id} style={{ display: 'flex', justifyContent: 'center' }}>
                          <Card 
                            className={styles.studentCard} 
                            bordered={false}
                            style={{
                              border: index === activeStudentIndex ? '2px solid #1890ff' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setActiveStudentIndex(index)}
                          >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                              <Space align="center" size="middle">
                                <Avatar
                                  size={64}
                                  src={student.avatar}
                                  className={styles.studentAvatar}
                                />
                                <Space direction="vertical">
                                  <Typography.Title level={4} style={{ margin: 0 }}>{student.name}</Typography.Title>
                                  <Space size="small">
                                    <Typography.Text>求职次数：{student.jobSeekingCount}</Typography.Text>
                                    <Typography.Text>面试次数：{student.interviewCount}</Typography.Text>
                                  </Space>
                                </Space>
                              </Space>
                              <Button 
                                type="primary" 
                                block 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectInterviewer();
                                }}
                                disabled={selectedInterviewer !== null}
                              >
                                邀请面试官
                              </Button>
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Space>
                )}
              </Space>
            </Card>
          </Col>

          {/* 面试官区域 */}
          {selectedStudents[activeStudentIndex] && selectedInterviewer && (
            <Col span={24}>
              <Card className={styles.interviewerCard} title="当前面试">
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Space align="center" size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                        <Avatar
                          size={80}
                          src={selectedInterviewer.avatar}
                          className={styles.interviewerAvatar}
                        />
                        <Space direction="vertical" size={4}>
                          <Typography.Title level={3} style={{ margin: 0 }}>{selectedInterviewer.name}</Typography.Title>
                          <Typography.Text type="secondary">{selectedInterviewer.title}</Typography.Text>
                        </Space>
                      </Space>
                      <Card bordered={false} className={styles.scoreSection}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Typography.Text strong>面试结果</Typography.Text>
                          <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                            <Button
                              type="primary"
                              size="large"
                              icon={<span className="anticon">✓</span>}
                              onClick={() => handleSubmitScore('success')}
                              disabled={score !== null}
                            >
                              能力达标
                            </Button>
                            <Button
                              danger
                              size="large"
                              icon={<span className="anticon">✗</span>}
                              onClick={() => handleSubmitScore('fail')}
                              disabled={score !== null}
                            >
                              需要提升
                            </Button>
                          </Space>
                        </Space>
                      </Card>
                    </Space>
                  </Col>
                  <Col span={16}>
                    <Card bordered={false} className={styles.questionSection}>
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Typography.Text strong>面试问题</Typography.Text>
                        <Input.TextArea
                          placeholder="请输入本次面试的问题内容..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={4}
                          className={styles.questionInput}
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}

          {/* 已选择的面试官列表 */}
          {selectedStudents.length > 0 && (
            <Col span={24}>
              <Card title="已选择的面试官" className={styles.interviewerListCard}>
                <Row gutter={[16, 16]}>
                  {interviewers.slice(0, 5).map((interviewer) => (
                    <Col span={8} key={interviewer.id}>
                      <Card 
                        className={styles.interviewerItem} 
                        bordered={false}
                        style={{
                          background: selectedInterviewer?.id === interviewer.id ? '#e6f7ff' : '#f5f5f5'
                        }}
                      >
                        <Space align="center" size="small">
                          <Avatar size={48} src={interviewer.avatar} />
                          <Space direction="vertical" size={0}>
                            <Typography.Text strong>{interviewer.name}</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>{interviewer.title}</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>成功率：{(interviewer.successRate * 100).toFixed(1)}%</Typography.Text>
                          </Space>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          )}

          {/* 奖励排行区域 */}
          <Col span={24}>
            <Card title="奖励排行榜" className={styles.rankingCard} bodyStyle={{ padding: '16px' }}>
              <Row gutter={[16, 16]}>
                {rankingList.map((student, index) => (
                  <Col span={6} key={student.id}>
                    <Card className={styles.rankItem} bordered={false} bodyStyle={{ padding: '16px' }}>
                      <Space direction="horizontal" align="center" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        <div style={{ position: 'relative' }}>
                          <Avatar size={48} src={student.avatar} />
                          <div className={styles.rankNumber} style={{ position: 'absolute', bottom: -4, right: -4 }}>{index + 1}</div>
                        </div>
                        <Space direction="vertical" size={0}>
                          <Typography.Text strong style={{ fontSize: '16px' }}>{student.name}</Typography.Text>
                          <Typography.Text type="success" strong style={{ fontSize: '16px' }}>¥{student.earnings.toLocaleString()}</Typography.Text>
                          <Space size={8}>
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>求职：{student.jobSeekingCount}次</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>面试：{student.interviewCount}次</Typography.Text>
                          </Space>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                ))}                
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default RollCallOperation;