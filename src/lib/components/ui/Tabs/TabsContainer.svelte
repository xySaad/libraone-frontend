<script lang="ts" generics="T extends string">
	import type { Snippet } from 'svelte';
	type PrefixKey<P extends string, T extends string> = T extends `${P}${string}` ? T : never;
	type ExcludePrefixKey<P extends string, T extends string> = T extends `${P}${string}` ? never : T;

	type RequireCoupled<P extends string, T extends string, V> = Record<T, Snippet> &
		Record<PrefixKey<P, T>, V> &
		Record<ExcludePrefixKey<P, T>, V> &
		Record<`${P}${ExcludePrefixKey<P, T>}`, V> &
		Record<PrefixKey<P, T> extends `${P}${infer S}` ? S : never, V>;

	const Prefix = 'Nav';
	type Prefix = typeof Prefix;
	type NavKey = `${Prefix}${string}`;
	type TabKey = ExcludePrefixKey<Prefix, T>;

	const isTab = (k: string): k is TabKey => !k.startsWith(Prefix);

	type bindable = typeof $bindable;
	type Props = { active?: ReturnType<bindable> } & RequireCoupled<Prefix, T, Snippet>;

	const props: Props = $props();
	const navSnippets: Record<NavKey, Snippet> = $derived(props);
	const tabSnippets: Record<TabKey, Snippet> = $derived(props);
	// const navKeys = $derived(Object.keys(props).filter(isNav));
	const tabKeys = $derived(Object.keys(props).filter(isTab));

	let activeTab = $derived(props.active || tabKeys[0]);
</script>

<nav>
	{#each tabKeys as key (key)}
		{@const active = activeTab === key}
		<button class:active onclick={() => (activeTab = key)}>
			{@render navSnippets[`Nav${key}`]()}
		</button>
	{/each}
</nav>

{#each tabKeys as key (key)}
	{@const active = activeTab === key}
	<section class:active>
		{@render tabSnippets[key]()}
	</section>
{/each}

<style>
	section {
		display: none;
		&.active {
			display: block;
		}
	}
	nav {
		display: flex;
		gap: 3px;
		padding: 4px;
		background: var(--primary);
		border: 1px solid var(--card-border);
		border-radius: calc(var(--surface-radius) + 4px);
		width: fit-content;

		button {
			display: flex;
			align-items: center;
			gap: 6px;
			padding: 0.42rem 1rem;
			border-radius: var(--surface-radius);
			border: 1px solid transparent;
			background: transparent;
			font-size: 0.8rem;
			font-weight: 600;
			letter-spacing: 0.025em;
			color: var(--text-muted);
			cursor: pointer;
			transition:
				background 0.18s ease,
				color 0.18s ease,
				border-color 0.18s ease,
				box-shadow 0.18s ease;

			&:hover {
				color: var(--text-value);
				background: var(--secondary);
			}

			&.active,
			&:hover.active {
				background: var(--surface-bg-hover);
				border-color: var(--surface-border);
				color: var(--text-title);
			}
		}
	}
</style>
