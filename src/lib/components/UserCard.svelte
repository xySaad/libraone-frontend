<script lang="ts">
	import Block from '$lib/assets/svg/block.svelte';
	import { onlineUsers } from '$lib/stores/onlineUsers.svelte';
	import type { EventPublicUser, EventUserRel } from '$lib/types/events';
	import UserAvatar from './image/UserAvatar.svelte';
	import Badge from './ui/Badge.svelte';
	import Card from './ui/Card.svelte';

	interface Props {
		user: EventPublicUser;
		eventUserRel?: EventUserRel;
	}
	let { user, eventUserRel }: Props = $props();
	const level = $derived(eventUserRel?.level);
	const auditRatio = $derived(eventUserRel?.userAuditRatio);

	const post = $derived(user.login ? onlineUsers[user.login] : null);
</script>

<Card>
	<header>
		<UserAvatar
			avatarUrl={user.avatarUrl}
			userLogin={user.login}
			banned={!user.canAccessPlatform}
		/>
		<div class="meta">
			<span class="login">{user.login}</span>
			<span class="id">#{user.id}</span>
		</div>
		<span style:margin-left="auto">
			<Badge tooltip="Level {level}">{level}</Badge>
		</span>
	</header>
	<dl>
		<div>
			<dt>firstName</dt>
			<dd>{user.firstName}</dd>

			<dt>lastName</dt>
			<dd>{user.lastName}</dd>
		</div>
		<div>
			<dt>last online</dt>
			<dd>{post ?? '-'}</dd>
			<dt>audit ratio</dt>
			<dd>{auditRatio ? Number(auditRatio).toFixed(2) : '_'}</dd>
		</div>
	</dl>
	{#if !user.canBeAuditor}
		<span style:width="100%">
			<Badge width="100%">
				<div class="unavailable">
					<Block width="18px" height="18px" />
					Unavailable for audits
				</div>
			</Badge>
		</span>
	{/if}
</Card>

<style>
	.unavailable {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 5px 0;
	}
	header {
		display: flex;
		gap: 1rem;
		width: 100%;

		.meta {
			display: flex;
			flex-direction: column;

			.id {
				color: var(--text-muted);
				font-size: var(--subtitle-font-size);
			}
		}
	}

	dl {
		display: flex;
		justify-content: space-between;
		width: 100%;

		dt {
			color: var(--text-muted);
			font-size: 0.72rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
		}

		dd {
			font-size: 0.875rem;
			font-weight: 500;
		}
	}

	.login {
		font-size: 1.125rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: hsl(210, 20%, 90%);
		letter-spacing: -0.01em;
	}
</style>
