<script lang="ts">
	import CheckMark from '$lib/assets/svg/check-mark.svelte';
	import Discord from '$lib/assets/svg/discord.svelte';
	import Location from '$lib/assets/svg/location.svelte';
	import Search from '$lib/assets/svg/search.svelte';
	import type { PublicUserFieldsFragment } from '$lib/graphql/generated';
	import type { Snippet } from 'svelte';
	import UserAvatar from '../image/UserAvatar.svelte';

	interface Props {
		active?: boolean | null;
		user: PublicUserFieldsFragment;
		children?: Snippet;
	}
	const { user, active, children }: Props = $props();

	// let cfNeeded = $state(false);
	const getDiscord = async () => {
		try {
			const resp = await fetch(`https://profile.zone01oujda.ma/api/discord?username=${user.login}`);
			if (resp.status === 403) {
				// cfNeeded = true;
			}
		} catch {
			//
		}
		return '-';
	};
</script>

<div class="cd-chall">
	<!-- <iframe  src="https://profile.zone01oujda.ma" title="profile"></iframe> -->
</div>
<header class="hero">
	<div class="hero-glow"></div>

	<div class="avatar-wrap">
		<UserAvatar avatarUrl={user.avatarUrl} userLogin={user.login} />
		{#if active}
			<span class="online-dot" data-tooltip="Active"></span>
		{/if}
	</div>

	<div class="hero-info">
		<h1 class="hero-name">
			{#if user.firstName || user.lastName}
				{user.firstName ?? ''} {user.lastName ?? ''}
			{:else}
				{user.login}
			{/if}
		</h1>

		<p class="hero-login">@{user.login}</p>

		<div class="badges">
			{#if user.campus}
				<span class="badge badge-campus">
					<Location />
					{user.campus}
				</span>
			{/if}

			{#if user.canAccessPlatform}
				<span class="badge badge-access" data-tooltip="Can access platform">
					<CheckMark />
					Platform
				</span>
			{/if}

			{#if user.canBeAuditor}
				<span class="badge badge-auditor" data-tooltip="Can audit peers">
					<Search />
					Auditor
				</span>
			{/if}

			<span class="badge badge-auditor" data-tooltip="discord">
				{#await getDiscord()}
					<span>loading...</span>
				{:then discord}
					<Discord />
					<span> {discord} </span>
				{/await}
			</span>
		</div>
	</div>

	{@render children?.()}
</header>

<style>
	.hero {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 20px;
		padding: 28px;
		border-radius: 14px;
		background: hsla(215, 35%, 10%, 0.55);
		border: 1px solid hsla(215, 40%, 70%, 0.08);
		backdrop-filter: blur(12px);
	}
	.hero-glow {
		position: absolute;
		top: -40px;
		left: -40px;
		width: 220px;
		height: 220px;
		border-radius: 50%;
		background: radial-gradient(circle, hsla(210, 80%, 50%, 0.07) 0%, transparent 70%);
		pointer-events: none;
	}
	.avatar-wrap {
		position: relative;
		flex-shrink: 0;
		width: 100px;
		height: 100px;
		overflow: hidden;

		:global(img) {
			width: 82px;
			height: 82px;
			border-radius: 50%;
			border: 2px solid hsla(215, 40%, 70%, 0.15);
			object-fit: cover;
			display: block;
			overflow: hidden;
		}
	}

	.online-dot {
		position: absolute;
		bottom: 4px;
		right: 4px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: hsl(142, 70%, 45%);
		border: 2px solid hsl(222, 47%, 6%);
		box-shadow: 0 0 6px hsla(142, 70%, 45%, 0.6);
	}
	.hero-info {
		flex: 1;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.hero-name {
		font-size: 1.45rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.2;
	}
	.hero-login {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0 0 10px;
		font-family: 'SF Mono', 'Fira Code', monospace;
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
