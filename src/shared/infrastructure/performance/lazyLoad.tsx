import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { Spinner } from "@shared/ui/atoms/Spinner";

interface LazyLoadOptions {
  fallback?: ReactNode;
}

export function lazyLoad(
  factory: () => Promise<{ default: ComponentType }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(factory);

  const WrappedComponent = (props: Record<string, unknown>) => (
    <Suspense fallback={options.fallback || <Spinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return WrappedComponent;
}

// Prefetch on hover/focus for faster navigation
export function createPrefetchLoader(factory: () => Promise<{ default: ComponentType }>) {
  let loaded = false;
  let promise: Promise<{ default: ComponentType }> | null = null;

  const load = () => {
    if (!loaded && !promise) {
      promise = factory();
      promise.then(() => {
        loaded = true;
      });
    }
    return promise;
  };

  return {
    load,
    onMouseEnter: load,
    onFocus: load,
  };
}
