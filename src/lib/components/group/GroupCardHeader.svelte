<script lang="ts">
	import PartnerExchange from '$lib/assets/svg/partner-exchange.svelte';
	import type { Group_Status_Enum } from '$lib/graphql/generated';
	interface Props {
		id: number;
		name: string;
		parent: string | null;
		isCaptain: boolean;
		isTeammate: boolean;
		status: Group_Status_Enum;
	}
	const { name, parent, isCaptain, isTeammate, id, status }: Props = $props();
</script>

<div class="card-header">
	<div class="title-block">
		{#if parent}
			<span class="parent-path">{parent}</span>
		{/if}
		<h3 class="project-name">{name} #{id}</h3>
	</div>

	<div class="badges">
		{#if isCaptain}
			<span class="badge badge-captain" data-tooltip="Group captain">⚑ Captain</span>
		{/if}
		{#if isTeammate}
			<span class="badge badge-captain" data-tooltip="You are a member">
				<PartnerExchange /> Teammate
			</span>
		{/if}
		<span class="badge">
			{status}
		</span>
	</div>
</div>

<style>
	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}

	.title-block {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.parent-path {
		font-size: 11px;
		color: #4e6278;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.project-name {
		font-size: 14px;
		font-weight: 600;
		color: #e8edf2;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: -0.01em;
	}

	.badges {
		display: flex;
		gap: 5px;
		flex-shrink: 0;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 10px;
		font-weight: 600;
		padding: 2px 7px;
		border-radius: 20px;
		white-space: nowrap;
	}

	.badge-captain {
		background: hsl(45, 70%, 12%);
		color: hsl(45, 85%, 65%);
		border: 1px solid hsl(45, 60%, 22%);
		cursor: default;
	}
</style>
