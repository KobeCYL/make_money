import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import useStyles from './style';

const Footer: React.FC = () => {
  const { styles } = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      className={styles.footer}
      copyright={`${currentYear} 智能点名系统 版权所有`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com',
          blankTarget: true,
        },
        {
          key: 'privacy',
          title: '隐私政策',
          href: '/privacy',
        },
        {
          key: 'terms',
          title: '使用条款',
          href: '/terms',
        },
      ]}
    />
  );
};

export default Footer;
