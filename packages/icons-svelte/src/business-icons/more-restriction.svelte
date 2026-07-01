<script lang="ts">
  import type { BusinessIconImageProps } from '../businessTypes.js';
  const { size = 24, width, height, alt = '', color = 'currentColor', style, ...props }: BusinessIconImageProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
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
  <path fill-rule="evenodd" clip-rule="evenodd" d="M24 40C32.8366 40 40 32.8366 40 24C40 15.1634 32.8366 8 24 8C15.1634 8 8 15.1634 8 24C8 32.8366 15.1634 40 24 40ZM24 38.1503C31.815 38.1503 38.1503 31.815 38.1503 24C38.1503 16.185 31.815 9.84971 24 9.84971C16.185 9.84971 9.84971 16.185 9.84971 24C9.84971 31.815 16.185 38.1503 24 38.1503ZM23.1676 11.5145C16.7318 11.5145 11.5145 16.7317 11.5145 23.1676H23.1676V11.5145ZM25.0173 11.6994V23.1676H36.4855C36.4855 16.8339 31.3511 11.6994 25.0173 11.6994ZM25.0173 36.4855V25.0173H36.4855C36.4855 31.3511 31.3511 36.4855 25.0173 36.4855ZM11.5145 25.0173C11.5145 31.3511 16.7318 36.4855 23.1676 36.4855V25.0173H11.5145Z" />
</svg>
