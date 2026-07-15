<script lang="ts" generics="T">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props {
		value: HTMLSelectAttributes['value'];
		options: { value: T; text: string }[];
	}

	let { value = $bindable(), options }: Props = $props();
</script>

<select name="search-filter" id="search-filter" bind:value>
	{#each options as opt (opt)}
		<option value={opt.value}>
			{opt.text}
		</option>
	{/each}
</select>

<style>
	select {
		background: var(--primary);
		border-radius: 8px;
	}
</style>
