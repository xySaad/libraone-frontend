<script lang="ts">
	import { type UserGroupFieldsFragment } from '$lib/graphql/generated';
	import { projectName, projectParent } from './groupUtils';
	import GroupCardHeader from './GroupCardHeader.svelte';
	import MembersRow from './MembersRow.svelte';
	import AuditSection from './AuditSection.svelte';

	interface Props {
		userGroup: UserGroupFieldsFragment;
		intraUserId: number | undefined;
	}
	const { userGroup, intraUserId }: Props = $props();

	const name = $derived(projectName(userGroup.group.path));
	const parent = $derived(projectParent(userGroup.group.path));
	const isCaptain = $derived(userGroup.group.captainId === userGroup.userId);

	const isTeammate = $derived(
		userGroup.userId !== intraUserId &&
			userGroup.group.members.some((m) => m.user?.id === intraUserId)
	);
</script>

<article class="group-card">
	<div class="accent-bar"></div>

	<div class="card-body">
		<GroupCardHeader
			{name}
			{parent}
			{isCaptain}
			{isTeammate}
			id={userGroup.groupId}
			status={userGroup.group.status}
		/>
		<MembersRow members={userGroup.group.members} captainId={userGroup.group.captainId} />

		<AuditSection group={userGroup.group} />
	</div>
</article>

<style>
	.group-card {
		position: relative;
		display: flex;
		border-radius: var(--border-radius-lg, 12px);
		border: 1px solid hsl(213, 40%, 18%);
		background: hsl(213, 60%, 10%);
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.group-card:hover {
		background: hsl(213, 60%, 12%);
		border-color: hsl(213, 40%, 24%);
	}

	.accent-bar {
		width: 3px;
		flex-shrink: 0;
		background: hsl(213, 40%, 28%);
	}

	.card-body {
		flex: 1;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}
</style>
