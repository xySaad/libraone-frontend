<script module lang="ts">
	import Crown from '$lib/assets/svg/crown.svelte';
	import DoneOutline from '$lib/assets/svg/done_outline.svelte';
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import Hail from '$lib/assets/svg/hail.svelte';
	import IncompleteCircle from '$lib/assets/svg/incomplete-circle.svelte';
	import PrivacyTip from '$lib/assets/svg/privacy-tip.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import {
		Group_Status_Enum,
		type AuditFragment,
		type GroupFragment
	} from '$lib/graphql/generated';
	import CardHeader from '../Card/CardHeader.svelte';
	import Badge from '../ui/Badge.svelte';
	import TabsContainer from '../ui/Tabs/TabsContainer.svelte';
	import GroupAudits from './GroupAudits.svelte';

	interface Props {
		group: GroupFragment;
		title?: string;
	}

	const statusIconMap = {
		[Group_Status_Enum.Setup]: Hail,
		[Group_Status_Enum.Working]: IncompleteCircle,
		[Group_Status_Enum.Audit]: PrivacyTip,
		[Group_Status_Enum.Finished]: DoneOutline
	};

	type GroupedAuditors = {
		createdAt: string;
		endDate: string;
		audits: AuditFragment[];
	};
	const groupAuditsByDate = (audits: AuditFragment[]) => {
		return audits.reduce<Record<string, GroupedAuditors>>((acc, audit) => {
			const key = `${audit.createdAt}${audit.endAt}`;
			if (!acc[key]) {
				acc[key] = {
					createdAt: audit.createdAt,
					endDate: audit.endAt,
					audits: []
				};
			}

			acc[key].audits.push(audit);
			return acc;
		}, {});
	};
</script>

<script lang="ts">
	const { group, title: groupTitle = '-' }: Props = $props();
	const StatusIcon = $derived(statusIconMap[group.status]);
	const { id, object, members, auditors } = $derived(group);
</script>

<Card padding="sm">
	<div class="headerWrap" data-tooltip={groupTitle}>
		<CardHeader>
			{#snippet icon()}
				<GroupsIcon />
			{/snippet}
			{#snippet title()}
				<div class="title">
					<div class="text">{groupTitle} #{id}</div>
					<Badge>{group.members.length} {members.length === 1 ? 'member' : 'members'}</Badge>
				</div>
			{/snippet}
		</CardHeader>
	</div>

	<TabsContainer
		navMinWidth={100}
		hidden={{
			Invitations: group.invitations.length < 1,
			Members: group.members.length < 1,
			Results: group.results.length < 1 && group.auditors.length < 1
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
					{#each Object.entries(groupAuditsByDate(auditors)) as [key, { createdAt, endDate, audits }] (key)}
						<div class="members">
							<GroupAudits
								projectName={object.name ?? 'unknown'}
								captainId={group.captain?.id}
								members={group.members}
								{audits}
								{createdAt}
								{endDate}
							/>
						</div>
					{/each}
				{/if}
				{#each group.results as result (result.id)}
					{@const { audits, createdAt } = result}
					<div class="members">
						<GroupAudits
							projectName={object.name ?? 'unknown'}
							captainId={group.captain?.id}
							members={group.members}
							{audits}
							{createdAt}
						/>
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
