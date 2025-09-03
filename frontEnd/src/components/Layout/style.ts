import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f0f2f5', // 设计文档中指定的背景色
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
    zIndex: 1,
    padding: `0 ${token.paddingLG}px`,
    height: '64px',
    position: 'sticky',
    top: 0,
  },
  logo: {
    fontSize: '20px', // 设计文档中指定的标题字体大小
    fontWeight: 'bold',
    color: '#1890ff', // 设计文档中指定的主色调
    marginRight: token.marginLG,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'color 0.3s',
    '&:hover': {
      color: token.colorPrimaryHover,
    },
  },
  content: {
    flex: 1,
    padding: token.paddingLG,
    maxWidth: '1200px', // 设计文档中指定的大屏宽度
    margin: '0 auto',
    width: '100%',
    '@media screen and (max-width: 992px)': {
      padding: token.padding,
    },
  },
}));

export default useStyles;