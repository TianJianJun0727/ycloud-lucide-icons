import type { BusinessIconImageProps } from '../businessTypes';

const ShowSideBar = ({
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
    viewBox="0 0 25 24"
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
      d="M3.05249 5.26221C3.05249 4.84799 3.25297 4.51221 3.50027 4.51221H13.774C14.0213 4.51221 14.2218 4.84799 14.2218 5.26221C14.2218 5.67642 14.0213 6.01221 13.774 6.01221H3.50027C3.25297 6.01221 3.05249 5.67642 3.05249 5.26221ZM3.05249 11.4243C3.05249 11.0101 3.38828 10.6743 3.80249 10.6743H13.5372C13.9514 10.6743 14.2872 11.0101 14.2872 11.4243C14.2872 11.8385 13.9514 12.1743 13.5372 12.1743H3.80249C3.38828 12.1743 3.05249 11.8385 3.05249 11.4243ZM3.80249 16.8364C3.38828 16.8364 3.05249 17.1722 3.05249 17.5864C3.05249 18.0006 3.38828 18.3364 3.80249 18.3364H13.5372C13.9514 18.3364 14.2872 18.0006 14.2872 17.5864C14.2872 17.1722 13.9514 16.8364 13.5372 16.8364H3.80249Z"
      fill="currentColor"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.6637 16.2223C15.3797 15.953 15.3797 15.5163 15.6637 15.247L19.6949 11.4243L15.6637 7.60163C15.3797 7.3323 15.3797 6.89564 15.6637 6.62631C15.9477 6.35698 16.4082 6.35698 16.6922 6.62631L21.2377 10.9367C21.5217 11.206 21.5217 11.6426 21.2377 11.912L16.6922 16.2223C16.4082 16.4916 15.9477 16.4916 15.6637 16.2223Z"
      fill="currentColor"
    />
  </svg>
);

export default ShowSideBar;
