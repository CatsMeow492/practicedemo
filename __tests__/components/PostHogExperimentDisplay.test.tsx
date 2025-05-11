import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostHogExperimentDisplay from '../../src/components/PostHogExperimentDisplay';

// Mock posthog-js
jest.mock('posthog-js', () => ({
  getFeatureFlag: jest.fn(),
  onFeatureFlags: jest.fn(),
  __loaded: true,
}));

describe('PostHogExperimentDisplay Component', () => {
  // Save references to mock functions for easy access
  const mockGetFeatureFlag = jest.requireMock('posthog-js').getFeatureFlag;
  const mockOnFeatureFlags = jest.requireMock('posthog-js').onFeatureFlags;

  // Mock document.body.classList
  const classListMock = {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    toggle: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up document.body.classList mock
    Object.defineProperty(document.body, 'classList', {
      value: classListMock,
      configurable: true,
    });

    // Set PostHog as loaded by default
    jest.requireMock('posthog-js').__loaded = true;
  });

  afterEach(() => {
    // Restore everything
    jest.restoreAllMocks();
  });

  it('displays loading state when flag is null', () => {
    // Mock feature flag returning null
    mockGetFeatureFlag.mockReturnValue(null);

    render(<PostHogExperimentDisplay />);

    expect(screen.getByText('Loading experiment...')).toBeInTheDocument();
    expect(classListMock.remove).toHaveBeenCalledWith('enhanced-flag-animation-test');
  });

  it('displays flag variant when feature flag is present', () => {
    // Mock feature flag returning a value
    mockGetFeatureFlag.mockReturnValue('control');

    render(<PostHogExperimentDisplay />);

    expect(screen.getByText('Animation Variant: control')).toBeInTheDocument();
    expect(classListMock.remove).toHaveBeenCalledWith('enhanced-flag-animation-test');
  });

  it('adds test variant class to body when variant is "test"', () => {
    // Mock feature flag returning test variant
    mockGetFeatureFlag.mockReturnValue('test');

    render(<PostHogExperimentDisplay />);

    expect(screen.getByText('Animation Variant: test')).toBeInTheDocument();
    expect(classListMock.add).toHaveBeenCalledWith('enhanced-flag-animation-test');
  });

  it('uses onFeatureFlags callback when PostHog is not loaded', () => {
    // Mock PostHog not loaded
    jest.requireMock('posthog-js').__loaded = false;

    const callback = jest.fn();
    mockOnFeatureFlags.mockImplementation((cb: () => void) => {
      callback.mockImplementation(cb);
    });

    render(<PostHogExperimentDisplay />);

    expect(mockOnFeatureFlags).toHaveBeenCalled();
    expect(screen.getByText('Loading experiment...')).toBeInTheDocument();

    // Simulate PostHog loaded and flags ready
    mockGetFeatureFlag.mockReturnValue('test');
    act(() => {
      callback();
    });
  });

  it('removes class on unmount', () => {
    // Need to skip class add check since we're checking removal during unmount
    mockGetFeatureFlag.mockReturnValue('test');

    const { unmount } = render(<PostHogExperimentDisplay />);

    // First verify we've rendered with the test variant
    expect(screen.getByText('Animation Variant: test')).toBeInTheDocument();

    // Reset counts for clearer assertions
    jest.clearAllMocks();

    // Unmount component
    unmount();

    // Check the cleanup effect ran
    expect(classListMock.remove).toHaveBeenCalledWith('enhanced-flag-animation-test');
  });
});
