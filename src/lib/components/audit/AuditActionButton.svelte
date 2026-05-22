<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		active?: boolean;
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		'aria-label': string;
		'aria-pressed'?: boolean;
		'data-tooltip'?: string;
		'data-tooltip-pos'?: string;
	};

	let {
		children,
		active = false,
		class: className = '',
		type = 'button',
		...buttonProps
	}: Props = $props();
</script>

<button {type} class="audit-action-btn {className}" class:active {...buttonProps}>
	{@render children()}
</button>

<style>
	.audit-action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 26px;
		height: 26px;
		padding: 0;
		flex-shrink: 0;
		border-radius: 6px;
		border: 1px solid hsla(215, 40%, 70%, 0.12);
		background: hsla(215, 40%, 70%, 0.05);
		color: hsl(215, 15%, 52%);
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s,
			transform 0.1s;
	}

	.audit-action-btn:hover {
		background: hsla(215, 40%, 70%, 0.1);
		border-color: hsla(215, 40%, 70%, 0.22);
		color: hsl(215, 15%, 70%);
	}

	.audit-action-btn:active {
		transform: scale(0.96);
	}

	.audit-action-btn.active {
		border-color: hsla(142, 60%, 40%, 0.3);
		background: hsla(142, 60%, 40%, 0.1);
		color: hsl(142, 65%, 58%);
	}

	.audit-action-btn.with-code {
		width: auto;
		max-width: 100%;
		padding: 0 8px;
	}
</style>
