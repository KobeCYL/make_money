import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  listContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  listContentItem: {
    marginBottom: 16,
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: 14,
    position: 'relative',
  },
  extra: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: 14,
    marginTop: 16,
    lineHeight: '22px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 16,
    lineHeight: '24px',
    marginBottom: 16,
  },
  articleList: {
    marginTop: 24,
  },
};

export default styles;
