import type { BusinessIconImageProps } from '../businessTypes';

const QmaiEvent = ({
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
    viewBox="0 0 20 20"
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
    <path
      d="M16.4897 12.7312H13.6862L13.7913 12.5396C13.8557 12.422 13.9301 12.2858 13.9523 12.2438C14.8474 10.5345 14.7939 8.85323 13.6534 7.30082C12.5256 5.76547 10.9449 5.14889 9.07932 5.53852C7.24897 5.92083 6.07713 7.10189 5.5957 8.90775C4.86155 11.6616 7.00142 14.4947 9.84324 14.5328C10.8577 14.5471 11.8719 14.5502 12.8864 14.5496C13.8444 14.5496 14.8021 14.5447 15.7598 14.5435H17.0532V17.0795H10.1619C6.61536 17.0734 3.86952 14.8633 3.07676 11.3829C2.26728 7.82844 4.67141 3.97636 8.22429 3.13192C11.9111 2.25793 15.4029 4.11893 16.6802 7.66759C17.2224 9.1737 17.2087 10.7042 16.7151 12.2267C16.6544 12.415 16.5538 12.5899 16.4897 12.7312Z"
      fill="currentColor"
    />
    <path
      d="M13.7616 12.5918L13.2182 13.58L12.9877 13.9267L12.841 14.1476L12.8337 14.1588L12.5552 14.5774H15.7603L16.5336 12.6378L13.7616 12.5918Z"
      fill="currentColor"
    />
  </svg>
);

export default QmaiEvent;
