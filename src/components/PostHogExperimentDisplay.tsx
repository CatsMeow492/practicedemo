'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js'; // Assuming posthog-js is installed and configured

// Per posthog-integration rule: If using TypeScript, use an enum to store flag names.
enum FeatureFlags {
  ENHANCED_FLAG_ANIMATION = 'enhanced-flag-animation',
}

const TEST_VARIANT_CLASS = 'enhanced-flag-animation-test';

export default function PostHogExperimentDisplay() {
  const [flagVariant, setFlagVariant] = useState<string | boolean | undefined | null>(null);

  useEffect(() => {
    const fetchFlag = () => {
      const variant = posthog.getFeatureFlag(FeatureFlags.ENHANCED_FLAG_ANIMATION);
      setFlagVariant(variant ?? null); // Coalesce undefined to null if you prefer to not have undefined in state

      // Apply/remove body class based on the variant
      if (variant === 'test') {
        document.body.classList.add(TEST_VARIANT_CLASS);
      } else {
        document.body.classList.remove(TEST_VARIANT_CLASS);
      }
    };

    if (posthog.__loaded) {
      fetchFlag();
    } else {
      console.warn('PostHog not loaded yet when trying to fetch feature flag. Listening for onFeatureFlags.');
      posthog.onFeatureFlags(() => {
        fetchFlag();
      });
    }

    // Cleanup function to remove the class when the component unmounts or before re-running the effect
    return () => {
      document.body.classList.remove(TEST_VARIANT_CLASS);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  if (flagVariant === null || flagVariant === undefined) { // Check for undefined as well
    return <div className="text-sm text-text-secondary">Loading experiment...</div>;
  }

  return (
    <div className="text-sm text-text-secondary">
      Animation Variant: {String(flagVariant)}
    </div>
  );
} 