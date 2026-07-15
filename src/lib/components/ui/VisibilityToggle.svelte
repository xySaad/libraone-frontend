<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		first: Snippet;
		second: Snippet;
		isFirstVisible: boolean;
	} & HTMLAttributes<HTMLDivElement>;
	const { first, second, isFirstVisible, ...attrs }: Props = $props();
</script>

<div class="toggle" data-is-first-visible={isFirstVisible} {...attrs}>
	<div class="first">
		{@render first()}
	</div>
	<div class="second">
		{@render second()}
	</div>
</div>

<style>
	.toggle {
		position: relative;
		align-items: center;

		.first {
			visibility: hidden;
		}
		.second {
			position: absolute;
			top: 0;
			left: 0;
			visibility: visible;
			height: 100%;
			width: 100%;
		}

		&[data-is-first-visible='true'] {
			.second {
				visibility: hidden;
			}
			.first {
				visibility: visible;
			}
		}
	}
</style>
