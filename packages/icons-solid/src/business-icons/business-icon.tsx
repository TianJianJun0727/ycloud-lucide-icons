import type { BusinessIconImageProps } from '../businessTypes';

const BusinessIcon = ({
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
    viewBox="0 0 21 20"
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
    <path d="M15.0522 8.19429L10.5 4.80566L5.9478 8.19429C5.66589 8.40311 5.5 8.73374 5.5 9.08525V14.0829C5.5 14.6966 5.99768 15.1943 6.61137 15.1943H14.3886C15.0023 15.1943 15.5 14.6966 15.5 14.0829V9.08525C15.5 8.73374 15.3341 8.40311 15.0522 8.19429ZM12.5835 13.5272H8.41647C8.18677 13.5272 8 13.3393 8 13.1108C8 12.8822 8.18794 12.6943 8.41647 12.6943H12.5835C12.8132 12.6943 13 12.8822 13 13.1108C13 13.3393 12.8121 13.5272 12.5835 13.5272V13.5272Z" />
  </svg>
);

export default BusinessIcon;
