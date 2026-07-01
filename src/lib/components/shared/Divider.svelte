<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, margin }: { children?: Snippet; margin?: string } = $props();
</script>

<div class={{ empty: !children }} style:margin>
	{@render children?.()}
</div>

<style>
	div {
		width: 100%;
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
			background: var(--card-border);
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
