<script lang="ts">
	import Crown from '$lib/assets/svg/crown.svelte';
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import type { GetObjectGroupsQuery } from '$lib/graphql/generated';

	interface Props {
		group: GetObjectGroupsQuery['object'][number]['groups'][number];
		title?: string;
	}

	const { group, title }: Props = $props();

	const memberLabel = $derived(group.members.length === 1 ? 'member' : 'members');
</script>

<Card padding="sm">
	<header>
		<span class="icon"><GroupsIcon /></span>
		<span class="title">{title}</span>
		<Badge>{group.members.length} {memberLabel}</Badge>
	</header>

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
	header {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;

		.icon {
			display: flex;
			flex-shrink: 0;
			width: 20px;
			height: 20px;
			color: var(--icon-color);
		}

		.title {
			flex: 1;
			min-width: 0;
			font-size: 0.95rem;
			font-weight: 600;
			color: var(--text-title);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
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
