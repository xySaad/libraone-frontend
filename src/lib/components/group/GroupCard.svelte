<script lang="ts">
	import Crown from '$lib/assets/svg/crown.svelte';
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import type { GetObjectGroupsQuery } from '$lib/graphql/generated';
	import CardHeader from '../Card/CardHeader.svelte';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		group: GetObjectGroupsQuery['object'][number]['groups'][number];
		title?: string;
	}

	const { group, title: groupTitle }: Props = $props();

	const memberLabel = $derived(group.members.length === 1 ? 'member' : 'members');
</script>

<Card padding="sm">
	<CardHeader>
		{#snippet icon()}
			<GroupsIcon />
		{/snippet}
		{#snippet title()}
			<div class="title">
				{groupTitle}
				<Badge>{group.members.length} {memberLabel}</Badge>
			</div>
		{/snippet}
	</CardHeader>

	<Divider margin="0 0 0 auto" />

	<div class="members">
		{#each group.members as member (member.user?.id)}
			{@const user = member.user}
			{@const isCaptain = user?.id === group.captain?.id}
			<div class="member" data-tooltip={member.user?.login}>
				{#if isCaptain}
					<div class="crown" class:visible={isCaptain}>
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
</Card>

<style>
	.title {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 10px;
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
				width: 50px;
				height: 50px;
			}
			.crown {
				visibility: hidden;
				color: var(--success);
				display: none;
				&.visible {
					display: block;
					visibility: visible;
				}
			}
		}
	}
</style>
