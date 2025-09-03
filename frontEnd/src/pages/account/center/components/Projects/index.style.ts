import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  coverCardList: {
    marginTop: 24,
  },
  card: {
    position: 'relative',
  },
  cardBody: {
    height: '100%',
  },
  cardBodyTitle: {
    fontSize: 0,
  },
  cardAction: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  projectGrid: {
    width: '33.33%',
  },
  cardInfo: {
    marginTop: 16,
    marginBottom: 16,
    display: 'flex',
    gap: 16,
    color: 'rgba(0, 0, 0, 0.45)',
    position: 'relative',
    height: '64px',
  },
  cardDescription: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
};

export default styles;
