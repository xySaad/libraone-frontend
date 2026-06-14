<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface PropsBase {
		/** Called after the native submit event is already prevented */
		onsubmit?: () => void | Promise<void>;
		novalidate?: boolean;
		class?: string;
		children: Snippet;
	}

	interface PropsWithButton extends PropsBase {
		button: Snippet;
		loadingLabel?: string;
	}

	interface PropsWithoutButton extends PropsBase {
		button?: never;
		loadingLabel?: never;
	}

	type Props = PropsWithButton | PropsWithoutButton;

	const {
		onsubmit,
		novalidate = false,
		class: className = '',
		children,
		loadingLabel,
		button
	}: Props = $props();

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!button) await onsubmit?.();
	}
</script>

<form class={className} {novalidate} onsubmit={handleSubmit}>
	{@render children()}

	{#if button}
		<Button type="submit" {loadingLabel} onclick={onsubmit}>
			{@render button()}
		</Button>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
