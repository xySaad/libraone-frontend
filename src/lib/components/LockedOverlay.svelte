<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Lock from '$lib/assets/svg/lock.svelte';
	import type { Snippet } from 'svelte';
	import type { DOMAttributes } from 'svelte/elements';

	interface Props {
		children: Snippet;
		message?: string;
		onclick?: DOMAttributes<HTMLButtonElement>['onclick'];
	}
	//TODO: create a separate LockedForProfile component to prevent onclick hardcode
	let {
		children,
		message = 'Login to view details',
		onclick = () => goto(resolve(`/login/gitea?from=${location.pathname}`), { replaceState: true })
	}: Props = $props();
</script>

<div class="locked-container">
	<div class="blur-content">
		{@render children()}
	</div>
	<div class="lock-overlay">
		<button class="lock-badge" {onclick}>
			<Lock size={16} />
			<span>{message}</span>
		</button>
	</div>
</div>

<style>
	.locked-container {
		display: block;
		position: relative;
		width: 100%;
	}
	.blur-content {
		:global(> *) {
			filter: blur(4px);
		}
		opacity: 0.5;
		pointer-events: none;
		user-select: none;
	}
	.lock-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
	}
	.lock-badge {
		display: flex;
		align-items: center;
		gap: 8px;
		background: hsla(215, 30%, 15%, 0.9);
		padding: 10px 20px;
		border-radius: 99px;
		border: 1px solid hsla(215, 40%, 70%, 0.15);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		backdrop-filter: blur(4px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}
</style>
