import { forwardRef } from 'react';
import type { BusinessIconImageProps } from '../businessTypes';

const ChatLoadingIcon = forwardRef<SVGSVGElement, BusinessIconImageProps>(
  ({ size = 24, width, height, alt = '', color = 'currentColor', style, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={width ?? size}
      height={height ?? size}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={{ color, ...style }}
      {...props}
    >
      <circle
        cx="5"
        cy="12.2285"
        r="1.5"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="12.2285"
        r="1.5"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <circle
        cx="19"
        cy="12.2285"
        r="1.5"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  ),
);

ChatLoadingIcon.displayName = 'ChatLoadingIcon';

export default ChatLoadingIcon;
