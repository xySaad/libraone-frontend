<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		minWidth: number;
		gap: string;
		justifyContent?: string;
	}
	const { children, minWidth, gap, justifyContent }: Props = $props();
	let childrenCount = $state(0);
	function countChildren(node: HTMLElement) {
		childrenCount = node.childElementCount;
		const observer = new MutationObserver(() => (childrenCount = node.childElementCount));
		observer.observe(node, { childList: true });
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<div
	style:justify-content={justifyContent}
	style:--raw-width={minWidth}
	style:--gap={gap}
	use:countChildren
	style:--children-count={childrenCount}
>
	{@render children()}
</div>

<style>
	div {
		display: flex;
		gap: var(--gap);
		flex-wrap: wrap;

		--total-gap: calc(var(--gap) * var(--children-count));
		--raw-threshold: calc(var(--raw-width) * var(--children-count));
		--threshold: calc(var(--raw-threshold) * 1px);
		--diff: calc(var(--threshold) + var(--total-gap) - 100%);
		--sign: clamp(-1px, var(--diff), 1px);

		--min-width: calc(var(--raw-width) * 1px);
		--max-width: clamp(
			var(--min-width),
			calc(var(--sign) * var(--raw-threshold) + var(--total-gap)),
			100%
		);
	}
</style>
