<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { Snippet } from 'svelte';
	type Badges = Record<`Badge${string}`, Snippet>;

	type Props = {
		icon?: Snippet;
		title: string | Snippet;
		subtitle?: string;
		tooltip?: string;
	} & Badges;

	const { title, icon: DaIcon, subtitle, tooltip, ...rest }: Props = $props();
	const badges = $derived(Object.values(rest));
</script>

<div class="card-header">
	<div class="icon" data-tooltip={tooltip}>
		{@render DaIcon?.()}
	</div>
	<div class="card-title-group">
		<h3 class="card-title">
			{#if typeof title === 'string'}
				{title}
			{:else}
				{@render title()}
			{/if}
		</h3>
		<div class="subtitle">
			{subtitle}
		</div>
		{#each badges as badge (badge)}
			<Badge width="fit-content">
				{@render badge()}
			</Badge>
		{/each}
	</div>
</div>

<style>
	.card-header {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		.icon {
			align-self: flex-start;
		}
		.card-title-group {
			display: flex;
			flex-direction: column;
			gap: 8px;
			min-width: 0;
			width: 100%;

			.card-title {
				width: 100%;
				font-weight: 600;
				color: var(--text-title);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		.subtitle {
			font-size: var(--subtitle-font-size);
			color: var(--text-muted);
			letter-spacing: 0.02em;
		}
	}
</style>
