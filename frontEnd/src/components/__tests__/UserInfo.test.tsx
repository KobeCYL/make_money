import '@testing-library/jest-dom';
import type { RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import UserInfo from '../UserInfo';

describe('UserInfo Component', () => {
  const mockUserInfo = {
    name: 'John Doe',
    role: 'Teacher',
    phone: '123-456-7890',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('renders loading skeleton when loading is true', () => {
    render(<UserInfo loading={true} />);
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  it('renders user information correctly', () => {
    render(<UserInfo userInfo={mockUserInfo} />);
    
    expect(screen.getByText(mockUserInfo.name)).toBeInTheDocument();
    expect(screen.getByText(mockUserInfo.role)).toBeInTheDocument();
    expect(screen.getByText(mockUserInfo.phone)).toBeInTheDocument();
    expect(screen.getByText(mockUserInfo.email)).toBeInTheDocument();
  });

  it('renders avatar with fallback icon when no avatar URL is provided', () => {
    const userInfoWithoutAvatar = { ...mockUserInfo, avatar: undefined };
    render(<UserInfo userInfo={userInfoWithoutAvatar} />);
    
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('does not render contact information when not provided', () => {
    const userInfoWithoutContacts = {
      name: 'John Doe',
      role: 'Teacher',
    };
    render(<UserInfo userInfo={userInfoWithoutContacts} />);
    
    expect(screen.queryByText('123-456-7890')).not.toBeInTheDocument();
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
  });
});