import type { BusinessIconImageProps } from '../businessTypes';

const Unsubscribe = ({
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
    viewBox="0 0 19 18"
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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.76465 2.51172H12.2165C13.5814 2.51172 14.6879 3.61819 14.6879 4.98309V8.20472V14.3129C14.6879 15.0648 13.8892 15.5478 13.2234 15.1985L11.1574 14.1147C10.2927 13.6611 9.26142 13.6567 8.39289 14.1028L6.2216 15.2183C5.55612 15.5602 4.76465 15.077 4.76465 14.3288V5.51172C4.76465 3.85486 6.10779 2.51172 7.76465 2.51172ZM7.96133 6.3042C7.57225 6.3042 7.25684 6.61961 7.25684 7.00869C7.25684 7.39777 7.57225 7.71318 7.96133 7.71318H11.4911C11.8802 7.71318 12.1956 7.39777 12.1956 7.00869C12.1956 6.61961 11.8802 6.3042 11.4911 6.3042H7.96133Z"
    />
  </svg>
);

export default Unsubscribe;
