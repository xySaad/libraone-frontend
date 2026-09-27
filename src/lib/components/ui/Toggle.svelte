<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		checked?: boolean;
		onclick?: (event: MouseEvent) => void;
	} & Omit<HTMLButtonAttributes, 'type' | 'role' | 'onclick'>;

	let { children, checked = $bindable(false), disabled, onclick, ...attrs }: Props = $props();

	function handleClick(event: MouseEvent) {
		if (disabled) return;
		checked = !checked;
		onclick?.(event);
	}
</script>

<label class="field" class:disabled>
	{#if children}
		<span class="label-text">{@render children()}</span>
	{/if}
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		{disabled}
		class="toggle"
		class:checked
		onclick={handleClick}
		{...attrs}
	>
		<span class="thumb"></span>
	</button>
</label>

<style>
	.field {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		cursor: pointer;

		&.disabled {
			cursor: not-allowed;
			opacity: 0.45;
		}
	}

	.label-text {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-value);
	}

	.toggle {
		position: relative;
		flex-shrink: 0;
		width: 2.75rem;
		height: 1.5rem;
		padding: 0;
		border-radius: 999px;
		border: 1px solid var(--surface-border);
		background: var(--surface-bg);
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.15s ease;

		&:hover:not(:disabled) {
			border-color: var(--surface-border-hover);
		}

		&:focus-visible {
			outline: none;
			box-shadow: 0 0 0 3px var(--surface-shadow-hover);
		}

		&:disabled {
			cursor: not-allowed;
		}

		&:active:not(:disabled) .thumb {
			width: 1.375rem;
		}

		&.checked {
			background: var(--success-bg);
			border-color: var(--success-border);

			.thumb {
				transform: translateX(1.25rem);
				background: var(--success-dot);
				box-shadow: 0 0 8px hsla(140, 80%, 55%, 0.45);
			}

			&:focus-visible {
				box-shadow: 0 0 0 3px hsla(140, 70%, 50%, 0.18);
			}

			&:active:not(:disabled) .thumb {
				transform: translateX(1rem);
			}
		}
	}

	.thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 1.125rem;
		height: 1.125rem;
		border-radius: 50%;
		background: var(--text-muted);
		transition:
			transform 0.2s ease,
			width 0.15s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}
</style>
