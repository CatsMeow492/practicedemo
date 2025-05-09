/**
 * AccessibleImage component
 *
 * Enhances the Next.js Image component with additional accessibility features:
 * - Required alt text
 * - Optional loading state
 * - Optional blurhash placeholder
 * - ARIA attributes
 */
import React from 'react';
import Image, { ImageProps } from 'next/image';

interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  alt: string; // Make alt text required and non-optional
  showLoadingIndicator?: boolean;
  className?: string;
  imgClassName?: string;
  role?: string;
}

export default function AccessibleImage({
  alt,
  showLoadingIndicator = false,
  className = '',
  imgClassName = '',
  role = 'img',
  ...props
}: AccessibleImageProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} role="presentation">
      {/* Image component with enhanced accessibility */}
      <Image
        alt={alt}
        {...props}
        className={`${imgClassName} ${
          loading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        aria-hidden={false}
        role={role}
      />

      {/* Loading indicator */}
      {showLoadingIndicator && loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <span className="sr-only">Loading image: {alt}</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
            Unable to load image: {alt}
          </span>
        </div>
      )}
    </div>
  );
}
