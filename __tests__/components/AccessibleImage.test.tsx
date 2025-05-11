import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AccessibleImage from '../../src/components/AccessibleImage';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    onLoadingComplete,
    onError,
    className,
    fill,
    ...props
  }: any) {
    // Simulate the image loading
    React.useEffect(() => {
      if (src && onLoadingComplete) {
        // Simulate successful loading
        if (!src.includes('error')) {
          setTimeout(() => {
            onLoadingComplete({ naturalWidth: 100, naturalHeight: 100 });
          }, 10);
        } else if (onError) {
          // Simulate error if "error" is in the src
          setTimeout(() => {
            onError(new Error('Image failed to load'));
          }, 10);
        }
      }
    }, [src, onLoadingComplete, onError]);

    return (
      <img
        src={src?.toString() || ''}
        alt={alt}
        className={className}
        data-testid="mock-image"
        {...props}
      />
    );
  };
});

describe('AccessibleImage', () => {
  it('renders with required alt text', () => {
    render(
      <AccessibleImage
        src="/test-image.jpg"
        alt="Test image description"
        width={100}
        height={100}
      />,
    );

    const image = screen.getByTestId('mock-image');
    expect(image).toHaveAttribute('alt', 'Test image description');
  });

  it('handles loading state correctly with loading indicator', async () => {
    render(
      <AccessibleImage
        src="/test-image.jpg"
        alt="Test image description"
        width={100}
        height={100}
        showLoadingIndicator={true}
      />,
    );

    // Initially, loading indicator should be visible
    expect(screen.getByText('Loading image: Test image description')).toBeInTheDocument();

    // After loading completes, loading indicator should disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading image: Test image description')).not.toBeInTheDocument();
    });

    // Image should have opacity-100 class after loading
    const image = screen.getByTestId('mock-image');
    expect(image.className).toContain('opacity-100');
  });

  it('handles error state correctly', async () => {
    render(
      <AccessibleImage src="/error-image.jpg" alt="Test error image" width={100} height={100} />,
    );

    // After error, error message should appear
    await waitFor(() => {
      expect(screen.getByText('Unable to load image: Test error image')).toBeInTheDocument();
    });
  });

  it('applies custom class names correctly', () => {
    render(
      <AccessibleImage
        src="/test-image.jpg"
        alt="Test image with classes"
        width={100}
        height={100}
        className="wrapper-class"
        imgClassName="image-class"
      />,
    );

    const wrapper = screen.getByRole('presentation');
    expect(wrapper.className).toContain('wrapper-class');

    const image = screen.getByTestId('mock-image');
    expect(image.className).toContain('image-class');
  });

  it('handles fill prop correctly', () => {
    render(<AccessibleImage src="/test-image.jpg" alt="Test fill image" fill={true} />);

    const wrapper = screen.getByRole('presentation');
    expect(wrapper.className).toContain('w-full h-full');
  });

  it('applies custom role if provided', () => {
    render(
      <AccessibleImage
        src="/test-image.jpg"
        alt="Test image with custom role"
        width={100}
        height={100}
        role="button"
      />,
    );

    const image = screen.getByTestId('mock-image');
    expect(image).toHaveAttribute('role', 'button');
  });
});
