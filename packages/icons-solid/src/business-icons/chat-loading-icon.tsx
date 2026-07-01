import type { BusinessIconImageProps } from '../businessTypes';

const ChatLoadingIcon = ({
  size = 24,
  width,
  height,
  alt = '',
  color = 'currentColor',
  style,
  ...props
}: BusinessIconImageProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={width ?? size}
    height={height ?? size}
    role={alt ? 'img' : undefined}
    aria-label={alt || undefined}
    aria-hidden={alt ? undefined : true}
    color={color}
    style={style}
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
      fill-opacity="0.8"
    />
    <circle
      cx="19"
      cy="12.2285"
      r="1.5"
      fill="currentColor"
      fill-opacity="0.3"
    />
  </svg>
);

export default ChatLoadingIcon;
