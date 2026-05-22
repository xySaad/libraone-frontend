<script lang="ts">
	import Eye from '$lib/assets/svg/eye-on.svelte';
	import EyeOff from '$lib/assets/svg/eye-off.svelte';

	interface Props {
		label?: string;
		type?: 'text' | 'email' | 'password';
		name: string;
		placeholder?: string;
		value?: string;
		error?: string;
		disabled?: boolean;
		id?: string;
	}

	let {
		label,
		type = 'text',
		name,
		placeholder,
		value = $bindable(''),
		error,
		disabled = false,
		id = name
	}: Props = $props();

	let showPassword = $state(false);
	const inputType = $derived(type === 'password' && showPassword ? 'text' : type);
</script>

<div class="field">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<div class="input-wrap" class:has-error={!!error} class:disabled>
		<input {id} {name} type={inputType} {placeholder} {disabled} bind:value />
		{#if type === 'password'}
			<button
				type="button"
				class="eye-toggle"
				onclick={() => (showPassword = !showPassword)}
				aria-label={showPassword ? 'Hide password' : 'Show password'}
				tabindex="-1"
			>
				{#if showPassword}
					<EyeOff />
				{:else}
					<Eye />
				{/if}
			</button>
		{/if}
	</div>
	{#if error}
		<span class="error-msg">{error}</span>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--text-value);
	}

	.input-wrap {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 8px;
		border: 1px solid var(--surface-border);
		background: var(--surface-bg);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;

		&:focus-within {
			border-color: var(--surface-border-hover);
			box-shadow: 0 0 0 3px var(--surface-shadow-hover);
		}

		&.has-error {
			border-color: var(--error-border);

			&:focus-within {
				box-shadow: 0 0 0 3px var(--error-shadow);
			}
		}

		&.disabled {
			opacity: 0.45;
			cursor: not-allowed;
		}
	}

	input {
		flex: 1;
		padding: 0.625rem 0.75rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		border: none;
		outline: none;
		background: transparent;
		border-radius: 8px;
		width: 100%;

		&::placeholder {
			color: var(--text-muted);
		}

		&:disabled {
			cursor: not-allowed;
		}
	}

	.eye-toggle {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.625rem;
		background: transparent;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		transition: color 0.15s ease;

		&:hover {
			color: var(--text-value);
		}
	}

	.error-msg {
		font-size: 0.72rem;
		color: var(--error);
		letter-spacing: 0.01em;
	}
</style>
