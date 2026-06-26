<script lang="ts">
	import CheckMark from '$lib/assets/svg/check-mark.svelte';
	import Discord from '$lib/assets/svg/discord.svelte';
	import Location from '$lib/assets/svg/location.svelte';
	import Search from '$lib/assets/svg/search.svelte';
	import type { PublicUserFieldsFragment } from '$lib/graphql/generated';
	import type { Snippet } from 'svelte';
	import UserAvatar from '../image/UserAvatar.svelte';
	import OnlineDot from '../OnlineDot.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		active?: boolean | null;
		user: PublicUserFieldsFragment;
		children?: Snippet;
	}

	const { user, active, children }: Props = $props();

	const getDiscord = async () => {
		try {
			const resp = await fetch(`https://profile.zone01oujda.ma/api/discord?username=${user.login}`);
			if (resp.status === 403) {
				/* cfNeeded = true */
			}
		} catch {
			/* noop */
		}
		return '-';
	};
</script>

<Card tag="section" glow padding="lg">
	<header>
		<div class="avatar-wrap">
			<UserAvatar
				avatarUrl={user.avatarUrl}
				userLogin={user.login}
				banned={!user.canAccessPlatform}
			/>
			{#if active}
				<OnlineDot />
			{/if}
		</div>
		<h1 class="meta">
			{user.firstName}
			{user.lastName}
			<p class="login">@{user.login} #{user.id}</p>
		</h1>
	</header>
	<div class="card-info">
		<div class="badges">
			{#if user.campus}
				<span class="badge badge-campus"><Location />{user.campus}</span>
			{/if}
			{#if user.canAccessPlatform}
				<span class="badge badge-access" data-tooltip="Can access platform">
					<CheckMark />Platform
				</span>
			{/if}
			{#if user.canBeAuditor}
				<span class="badge badge-auditor" data-tooltip="Can audit peers">
					<Search />Auditor
				</span>
			{/if}
			<span class="badge badge-auditor" data-tooltip="discord">
				{#await getDiscord()}
					<span>loading...</span>
				{:then discord}
					<Discord /><span>{discord}</span>
				{/await}
			</span>
		</div>
	</div>

	{@render children?.()}
</Card>

<style>
	:global(.card) {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 20px;
	}

	header {
		display: flex;
		gap: 20px;

		.meta {
			font-size: 1.45rem;
			font-weight: 700;
			letter-spacing: -0.03em;
			color: var(--text-primary);
			margin: 0;
			line-height: 1.2;
		}

		.login {
			font-size: 0.82rem;
			color: var(--text-muted);
			margin: 0 0 10px;
			font-family: 'SF Mono', 'Fira Code', monospace;
		}
	}
	.avatar-wrap {
		position: relative;
	}

	.card-info {
		flex: 1;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 3px 9px;
		border-radius: 20px;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.badge-campus {
		background: hsla(215, 40%, 55%, 0.12);
		border: 1px solid hsla(215, 40%, 55%, 0.2);
		color: hsl(215, 60%, 72%);
	}

	.badge-access {
		background: hsla(142, 60%, 40%, 0.12);
		border: 1px solid hsla(142, 60%, 40%, 0.22);
		color: hsl(142, 65%, 58%);
	}

	.badge-auditor {
		background: hsla(45, 80%, 50%, 0.1);
		border: 1px solid hsla(45, 80%, 50%, 0.2);
		color: hsl(45, 85%, 65%);
	}
</style>
