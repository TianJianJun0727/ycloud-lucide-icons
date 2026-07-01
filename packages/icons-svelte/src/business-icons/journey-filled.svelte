<script lang="ts">
  import type { BusinessIconImageProps } from '../businessTypes.js';
  const { size = 24, width, height, alt = '', color = 'currentColor', style, ...props }: BusinessIconImageProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-4.3 -3 32.5 32.5"
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
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6365 4.95095C15.6365 6.97397 14.2032 8.66223 12.2966 9.05561V11.4385H17.0096C18.7024 11.4385 20.0747 12.8108 20.0747 14.5036V16.8668C22.2656 17.004 24 18.8243 24 21.0497C24 23.3644 22.1235 25.2409 19.8088 25.2409C17.4941 25.2409 15.6176 23.3644 15.6176 21.0497C15.6176 19.0918 16.9601 17.4475 18.7747 16.987V14.5036C18.7747 13.5288 17.9845 12.7385 17.0096 12.7385H6.42301C5.44818 12.7385 4.65792 13.5288 4.65792 14.5036V16.8842C6.75298 17.1163 8.38237 18.8927 8.38237 21.0497C8.38237 23.3644 6.50591 25.2409 4.19118 25.2409C1.87646 25.2409 0 23.3644 0 21.0497C0 19.0203 1.44238 17.3277 3.35792 16.9413V14.5036C3.35792 12.8108 4.73021 11.4385 6.42301 11.4385H10.9966V9.1184C8.89288 8.89452 7.25411 7.11411 7.25411 4.95095C7.25411 2.63622 9.13057 0.759766 11.4453 0.759766C13.76 0.759766 15.6365 2.63622 15.6365 4.95095Z" />
</svg>
