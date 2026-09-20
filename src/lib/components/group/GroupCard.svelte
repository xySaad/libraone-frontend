<script lang="ts">
	import Crown from '$lib/assets/svg/crown.svelte';
	import DoneOutline from '$lib/assets/svg/done_outline.svelte';
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import Hail from '$lib/assets/svg/hail.svelte';
	import IncompleteCircle from '$lib/assets/svg/incomplete-circle.svelte';
	import PrivacyTip from '$lib/assets/svg/privacy-tip.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { Group_Status_Enum, type GetObjectGroupsQuery } from '$lib/graphql/generated';
	import { formatDate } from '$lib/utils/time';
	import CardHeader from '../Card/CardHeader.svelte';
	import Badge from '../ui/Badge.svelte';
	import TabsContainer from '../ui/Tabs/TabsContainer.svelte';
	import AuditResult from './AuditResult.svelte';
	const statusIconMap = {
		[Group_Status_Enum.Setup]: Hail,
		[Group_Status_Enum.Working]: IncompleteCircle,
		[Group_Status_Enum.Audit]: PrivacyTip,
		[Group_Status_Enum.Finished]: DoneOutline
	};

	interface Props {
		group: GetObjectGroupsQuery['object'][number]['groups'][number];
		title?: string;
	}

	const { group, title: groupTitle = '-' }: Props = $props();

	const StatusIcon = $derived(statusIconMap[group.status]);
	const memberLabel = $derived(group.members.length === 1 ? 'member' : 'members');
</script>

<Card padding="sm">
	<div class="headerWrap" data-tooltip={groupTitle}>
		<CardHeader>
			{#snippet icon()}
				<GroupsIcon />
			{/snippet}
			{#snippet title()}
				<div class="title">
					<div class="text">{groupTitle} #{group.id}</div>
					<Badge>{group.members.length} {memberLabel}</Badge>
				</div>
			{/snippet}
		</CardHeader>
	</div>

	<TabsContainer
		active="Results"
		navMinWidth={100}
		hidden={{
			Invitations: group.invitations.length < 1,
			Members: group.members.length < 1,
			Results: group.results.length < 1
		}}
	>
		{#snippet NavMembers()}
			members
		{/snippet}
		{#snippet Members()}
			<div class="members">
				{#each group.members as member (member.user?.id)}
					{@const user = member.user}
					{@const isCaptain = user?.id === group.captain?.id}
					{@const memberTooltip = `${member.user?.login}${isCaptain ? ' (captain)' : ''}`}
					<div class="member" data-tooltip={memberTooltip}>
						{#if isCaptain}
							<div class="crown">
								<Crown />
							</div>
						{/if}
						<div class="avatar">
							<UserAvatar
								avatarUrl={user?.avatarUrl}
								userLogin={user?.login}
								banned={!user?.canAccessPlatform}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/snippet}

		{#snippet NavInvitations()}
			invitations
		{/snippet}
		{#snippet Invitations()}
			<div class="members">
				{#each group.invitations as member (member.user?.id)}
					{@const user = member.user}
					{@const isCaptain = user?.id === group.captain?.id}
					{@const memberTooltip = `${member.user?.login}${isCaptain ? ' (captain)' : ''}`}
					<div class="member" data-tooltip={memberTooltip}>
						{#if isCaptain}
							<div class="crown">
								<Crown />
							</div>
						{/if}
						<div class="avatar">
							<UserAvatar
								avatarUrl={user?.avatarUrl}
								userLogin={user?.login}
								banned={!user?.canAccessPlatform}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/snippet}

		{#snippet NavResults()}
			results
		{/snippet}
		{#snippet Results()}
			<div class="results">
				{#if group.auditors.length > 0}
					<div class="members">
						<Divider margin="0 0 0 auto">in progress</Divider>
						{#each group.auditors as audit, i (i)}
							<AuditResult {audit} captainId={group.captain?.id} />
						{/each}
					</div>
				{/if}
				{#each group.results as result (result.id)}
					<div class="members">
						<Divider margin="0 0 0 auto">{formatDate(result.createdAt)}</Divider>
						{#each result.audits as audit, i (i)}
							<AuditResult {audit} captainId={group.captain?.id} />
						{/each}
					</div>
				{/each}
			</div>
		{/snippet}
	</TabsContainer>

	<div class="status-divider">
		<Divider />
	</div>
	<div class="status" data-tooltip="status">
		{group.status}
		<StatusIcon />
	</div>
</Card>

<style>
	.headerWrap {
		width: 100%;
		.title {
			display: flex;
			justify-content: space-between;
			gap: 10px;
			width: 100%;

			.text {
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 30px;
		font-weight: 600;
		color: var(--text-title);
		white-space: nowrap;
	}
	.members {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;

		.member {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			width: fit-content;
			.avatar {
				width: 70px;
				height: 70px;
			}
			.crown {
				color: var(--success);
			}
		}
	}
	.status-divider {
		margin-top: auto;
	}
	.status {
		margin-left: auto;
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: end;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-value);
	}
</style>
