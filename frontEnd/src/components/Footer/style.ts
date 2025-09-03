import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  footer: {
    padding: `${token.paddingLG}px 0`,
    background: 'transparent',
    textAlign: 'center',
    '& .ant-pro-global-footer': {
      margin: '24px 0',
    },
    '& .ant-pro-global-footer-links': {
      marginBottom: '8px',
      '& a': {
        color: token.colorTextSecondary,
        transition: 'all 0.3s',
        '&:hover': {
          color: '#1890ff', // 设计文档中指定的主色调
        },
      },
    },
    '& .ant-pro-global-footer-copyright': {
      fontSize: '14px', // 设计文档中指定的正文字体大小
      color: 'rgba(0, 0, 0, 0.45)', // 设计文档中指定的次要文字颜色
    },
  },
}));

export default useStyles;