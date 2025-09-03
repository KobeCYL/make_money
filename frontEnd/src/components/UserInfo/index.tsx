import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import React from 'react';
import useStyles from './style';

export interface UserInfoProps {
  loading?: boolean;
  userInfo?: {
    name: string;
    avatar?: string;
    role: string;
    phone?: string;
    email?: string;
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ loading = false, userInfo }) => {
  const { styles } = useStyles();

  return (
    <Card bordered={false} className={styles.userInfoCard}>
      <Skeleton loading={loading} avatar active>
        {userInfo && (
          <div className={styles.userInfoContent}>
            <div className={styles.avatarHolder}>
              <Avatar
                size={64}
                src={userInfo.avatar}
                icon={<UserOutlined />}
              />
              <div className={styles.name}>{userInfo.name}</div>
              <div className={styles.role}>{userInfo.role}</div>
            </div>
            <div className={styles.detail}>
              {userInfo.phone && (
                <p>
                  <PhoneOutlined className={styles.icon} />
                  {userInfo.phone}
                </p>
              )}
              {userInfo.email && (
                <p>
                  <MailOutlined className={styles.icon} />
                  {userInfo.email}
                </p>
              )}
            </div>
          </div>
        )}
      </Skeleton>
    </Card>
  );
};

export default UserInfo;