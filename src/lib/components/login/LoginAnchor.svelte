<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import type { Snippet } from 'svelte';

	type LoginType = Extract<RouteId, `/login/${string}`> extends `/login/${infer T}` ? T : never;
	interface Props {
		children: Snippet;
		subtitle: string;
		type: LoginType;
		disabled?: boolean;
	}

	const { children, type, subtitle, disabled = false }: Props = $props();
	const title = $derived(type.charAt(0).toUpperCase() + type.substring(1));
</script>

<a
	href={resolve(`/login/${type}`)}
	aria-disabled={disabled}
	onclick={(e) => disabled && e.preventDefault()}
>
	<span class="icon"> {@render children()}</span>
	<span class="label">
		<span class="title"> {title}</span>
		<span class="subtitle">{subtitle}</span>
	</span>
	<span class="arrow">→</span>
</a>

<style>
	a {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.875rem 1rem;
		border-radius: var(--surface-radius);
		border: 1px solid transparent;
		cursor: pointer;
		text-align: left;
		color: var(--text-link);
		background: var(--surface-bg);
		border-color: var(--surface-border);

		&[aria-disabled='false']:hover {
			background: var(--surface-bg-hover);
			border-color: var(--surface-border-hover);
			box-shadow: 0 0 0 3px var(--surface-shadow-hover);

			.arrow {
				opacity: 1;
				transform: translateX(0);
			}
		}

		&:active {
			transform: scale(0.985);
		}

		&[aria-disabled='true'] {
			cursor: not-allowed;
			opacity: 0.45;
			filter: grayscale(0.25) saturate(0.7);
		}

		.icon {
			flex-shrink: 0;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: var(--icon-radius);
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--icon-bg);
			border: 1px solid var(--icon-border);
			color: var(--icon-color);
		}

		.label {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.125rem;
			min-width: 0;

			.title {
				font-size: 0.875rem;
				font-weight: 600;
				letter-spacing: -0.01em;
				color: var(--text-title);
			}

			.subtitle {
				font-size: 0.72rem;
				letter-spacing: 0.01em;
			}
		}

		.arrow {
			flex-shrink: 0;
			font-size: 1rem;
			opacity: 0;
			transform: translateX(-4px);
			transition: var(--transition-ui);
		}
	}
</style>
