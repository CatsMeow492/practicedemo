import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthStatus from '../../src/components/AuthStatus';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

import { useSession, signIn, signOut } from 'next-auth/react';

describe('AuthStatus Component', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    // Mock loading state
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AuthStatus />);

    // Check loading UI is shown (an animated placeholder)
    const loadingElement = screen.getByTestId('auth-loading');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should render signed out state with sign in button', () => {
    // Mock unauthenticated state
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthStatus />);

    // Check sign in button is shown
    const signInButton = screen.getByText('Sign in');
    expect(signInButton).toBeInTheDocument();

    // Click the sign in button
    fireEvent.click(signInButton);

    // Check signIn function was called
    expect(signIn).toHaveBeenCalled();
  });

  it('should render signed in state with user info and sign out button', () => {
    // Mock authenticated state
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/user.jpg',
        },
        expires: '2023-01-01',
      },
      status: 'authenticated',
    });

    render(<AuthStatus />);

    // Check user name is shown
    expect(screen.getByText('Test User')).toBeInTheDocument();

    // Check user image is shown
    const userImage = screen.getByAltText('Test User');
    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute('src', 'https://example.com/user.jpg');

    // Check sign out button is shown
    const signOutButton = screen.getByText('Sign out');
    expect(signOutButton).toBeInTheDocument();

    // Click the sign out button
    fireEvent.click(signOutButton);

    // Check signOut function was called with correct parameters
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('should handle signed in state without user image', () => {
    // Mock authenticated state without image
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          // No image property
        },
        expires: '2023-01-01',
      },
      status: 'authenticated',
    });

    render(<AuthStatus />);

    // Check user name is shown
    expect(screen.getByText('Test User')).toBeInTheDocument();

    // Check image is not in the document
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    // Check sign out button is shown
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should handle signed in state without user name', () => {
    // Mock authenticated state without name
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
          image: 'https://example.com/user.jpg',
          // No name property
        },
        expires: '2023-01-01',
      },
      status: 'authenticated',
    });

    render(<AuthStatus />);

    // Check default "Signed in" text is shown
    expect(screen.getByText('Signed in')).toBeInTheDocument();

    // Check user image is shown with default alt text
    const userImage = screen.getByAltText('User');
    expect(userImage).toBeInTheDocument();
  });
});
