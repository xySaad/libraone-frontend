<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		color?: string;
	}
	const { children, color }: Props = $props();
</script>

<span style:color>
	{@render children()}
</span>

<style>
	span {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
		font-weight: 800;
		font-size: 2rem;
		letter-spacing: -0.04em;
		line-height: 1;
		color: var(--text-title);
		margin-bottom: 0.5rem;
	}
</style>
