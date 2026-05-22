<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children?: Snippet } = $props();
</script>

<div class={{ empty: !children }}>
	{@render children?.()}
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

		&::before,
		&::after {
			content: '';
			position: relative;
			height: 1px;
			width: 30%;
			background: linear-gradient(
				90deg,
				transparent,
				hsla(215, 40%, 70%, 0.12) 30%,
				hsla(215, 40%, 70%, 0.12) 70%,
				transparent
			);
		}

		&.empty {
			&::before {
				width: 100%;
			}
			&::after {
				display: none;
			}
		}
	}
</style>
