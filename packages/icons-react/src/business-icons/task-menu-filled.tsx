import { forwardRef } from 'react';
import type { BusinessIconImageProps } from '../businessTypes';

const TaskMenuFilled = forwardRef<SVGSVGElement, BusinessIconImageProps>(
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
      <g clipPath="url(#clip0_7774_12737)">
        <path d="M19 4H14.82C14.4 2.84 13.3 2 12 2C10.7 2 9.6 2.84 9.18 4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM12 4C12.55 4 13 4.45 13 5C13 5.55 12.55 6 12 6C11.45 6 11 5.55 11 5C11 4.45 11.45 4 12 4ZM14 17.75C14 18.1642 13.6642 18.5 13.25 18.5H7.75C7.33579 18.5 7 18.1642 7 17.75C7 17.3358 7.33579 17 7.75 17H13.25C13.6642 17 14 17.3358 14 17.75ZM17 13.75C17 14.1642 16.6642 14.5 16.25 14.5H7.75C7.33579 14.5 7 14.1642 7 13.75C7 13.3358 7.33579 13 7.75 13H16.25C16.6642 13 17 13.3358 17 13.75ZM17 9.75C17 10.1642 16.6642 10.5 16.25 10.5H7.75C7.33579 10.5 7 10.1642 7 9.75C7 9.33579 7.33579 9 7.75 9H16.25C16.6642 9 17 9.33579 17 9.75Z" />
      </g>
      <defs>
        <clipPath id="clip0_7774_12737">
          <rect
            width="24"
            height="24"
            fill="currentColor"
          />
        </clipPath>
      </defs>
    </svg>
  ),
);

TaskMenuFilled.displayName = 'TaskMenuFilled';

export default TaskMenuFilled;
