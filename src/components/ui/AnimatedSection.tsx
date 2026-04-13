import { ReactNode } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Props {
  children: ReactNode;
  className?: string;
  animation?: 'up' | 'left' | 'right';
  delay?: number;
}

export function AnimatedSection({ children, className = '', animation = 'up', delay = 0 }: Props) {
  const { ref, isVisible } = useIntersectionObserver();
  const animClass = {
    up: 'animate-fade-in-up',
    left: 'animate-fade-in-left',
    right: 'animate-fade-in-right',
  }[animation];

  return (
    <div
      ref={ref}
      className={`transition-opacity ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? undefined : 'none',
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className={isVisible ? animClass : ''}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
