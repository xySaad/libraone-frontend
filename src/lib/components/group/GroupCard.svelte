<script lang="ts">
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import type { GetObjectGroupsQuery } from '$lib/graphql/generated';

	interface Props {
		group: GetObjectGroupsQuery['object'][number]['groups'][number];
		index: number;
	}

	const { group, index }: Props = $props();
</script>

<Card>
	<header>
		<Icon>
			<GroupsIcon />
		</Icon>
		<div class="group-info">
			<h3 class="group-title">Group #{index + 1}</h3>
			<span class="member-count">{group.members.length} members</span>
		</div>
	</header>

	<Divider />

	<div class="members">
		{#each group.members as { user } (user?.id)}
			{#if user}
				<div class="member" class:captain={user.id === group.captainId}>
					<div class="avatar-wrap">
						<UserAvatar
							avatarUrl={user.avatarUrl}
							userLogin={user.login}
							banned={!user.canAccessPlatform}
							allowSwitch={false}
						/>
					</div>
					<div class="member-meta">
						<span class="login">{user.login}</span>
						{#if user.id === group.captainId}
							<Badge>captain</Badge>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</Card>

<style>
	header {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;

		.group-info {
			display: flex;
			flex-direction: column;
			gap: 2px;

			.group-title {
				font-size: 1rem;
				font-weight: 600;
				color: var(--text-title);
			}

			.member-count {
				font-size: var(--subtitle-font-size);
				color: var(--text-muted);
			}
		}
	}

	.members {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;

		.member {
			display: flex;
			align-items: center;
			gap: 12px;

			.avatar-wrap {
				width: 36px;
				flex-shrink: 0;
				overflow: hidden;
			}

			.member-meta {
				display: flex;
				flex-direction: column;
				gap: 4px;
				min-width: 0;
			}

			.login {
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--text-value);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			&.captain .login {
				color: var(--text-title);
			}
		}
	}
</style>
