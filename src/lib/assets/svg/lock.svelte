<script lang="ts">
	let { size = 18, color = 'currentColor', strokeWidth = 2 } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class="lucide lucide-lock"
>
	<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
	<path d="M7 11V7a5 5 0 0 1 10 0v4" />
</svg>

<style>
	svg {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
	}
</style>
