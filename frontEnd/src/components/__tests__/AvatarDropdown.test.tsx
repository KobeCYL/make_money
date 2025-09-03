import { fireEvent, render } from '@testing-library/react';
import { TestBrowser } from '@umijs/max';
import { AvatarDropdown } from '../AvatarDropdown';

const mockInitialState = {
  currentUser: {
    name: 'Test User',
    avatar: 'https://example.com/avatar.png',
  },
};

jest.mock('@/hooks/useInitialState', () => ({
  useInitialState: () => [mockInitialState],
}));

describe('AvatarDropdown', () => {
  it('should render user avatar', () => {
    const { getByAltText } = render(
      <TestBrowser>
        <AvatarDropdown />
      </TestBrowser>
    );
    expect(getByAltText('avatar')).toBeInTheDocument();
  });

  it('should show dropdown menu on click', () => {
    const { getByRole, getByText } = render(
      <TestBrowser>
        <AvatarDropdown />
      </TestBrowser>
    );
    
    fireEvent.click(getByRole('img'));
    expect(getByText('个人中心')).toBeInTheDocument();
    expect(getByText('个人设置')).toBeInTheDocument();
    expect(getByText('退出登录')).toBeInTheDocument();
  });
});