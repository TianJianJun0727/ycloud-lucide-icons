<script lang="ts">
  import type { BusinessIconImageProps } from '../businessTypes.js';
  const { size = 24, width, height, alt = '', color = 'currentColor', style, ...props }: BusinessIconImageProps = $props();
</script>

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
  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.82 4H19C20.1 4 21 4.9 21 6V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V6C3 4.9 3.9 4 5 4H9.18C9.6 2.84 10.7 2 12 2C13.3 2 14.4 2.84 14.82 4ZM13 5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5C11 5.55 11.45 6 12 6C12.55 6 13 5.55 13 5ZM12.0504 17.9086C11.6353 17.9086 11.2997 17.573 11.2997 17.1579V14.5014H8.84202C8.4269 14.5012 8.09131 14.1656 8.09131 13.7507C8.09131 13.3356 8.4269 13 8.84202 13H11.2997V10.7507C11.2997 10.3356 11.6353 10 12.0504 10C12.4655 10 12.8011 10.3356 12.8011 10.7507V13H15.2492C15.6643 13 15.9999 13.3356 15.9999 13.7507C15.9999 14.1658 15.6643 14.5014 15.2492 14.5014H12.8011V17.1579C12.8009 17.573 12.4653 17.9086 12.0504 17.9086Z" />
</svg>
