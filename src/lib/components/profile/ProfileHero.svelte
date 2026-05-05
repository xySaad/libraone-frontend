<script lang="ts">
	import FallbackImage from '$lib/components/FallbackImage.svelte';
	import Image from '$lib/components/Image.svelte';
	import { profileUserState } from '$lib/stores/user.svelte';
	import { get } from 'svelte/store';
	import type { PublicUserFieldsFragment } from '$lib/graphql/generated';
	import { fmtSeconds } from '$lib/utils/time';
	import type { MaplProfile, LogtimeData } from '$lib/types/profile';
	import Discord from '$lib/assets/svg/discord.svelte';
	import Location from '$lib/assets/svg/location.svelte';
	import CheckMark from '$lib/assets/svg/check-mark.svelte';
	import Search from '$lib/assets/svg/search.svelte';

	interface Props {
		profile?: MaplProfile | null;
		logtime?: LogtimeData | null;
		user: PublicUserFieldsFragment;
	}
	const { user, profile, logtime }: Props = $props();

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
	const totalSec = $derived(
		logtime ? Object.values(logtime).reduce((a, v) => a + (v?.total ?? 0), 0) : 0
	);
</script>

<div class="cd-chall">
	<!-- <iframe  src="https://profile.zone01oujda.ma" title="profile"></iframe> -->
</div>
<header class="hero">
	<div class="hero-glow"></div>

	<div class="avatar-wrap">
		{#if user.avatarUrl}
			<div class="avatar">
				<FallbackImage src={user.avatarUrl} alt={user.login}>
					<Image
						src={`https://mapl.zone01oujda.ma/image/map/${user.login}`}
						alt={user.login}
						headers={{ 'X-TOKEN': `${get(profileUserState)?.token}` }}
					/>
				</FallbackImage>
			</div>
		{/if}

		{#if profile?.location}
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

	{#if profile}
		<div class="quick-stats">
			<div class="qs-item">
				<span class="qs-label">Group</span>
				<span class="qs-value">{profile.main_group ?? '—'}</span>
			</div>

			<div class="qs-sep"></div>

			<div class="qs-item">
				<span class="qs-label">Sub-group</span>
				<span class="qs-value">{profile.sub_group ?? '—'}</span>
			</div>

			{#if profile.location}
				<div class="qs-sep"></div>
				<div class="qs-item">
					<span class="qs-label">Location</span>
					<span class="qs-value">{profile.location}</span>
				</div>
			{/if}

			{#if logtime}
				<div class="qs-sep"></div>
				<div class="qs-item">
					<span class="qs-label">Total logtime</span>
					<span class="qs-value accent">{fmtSeconds(totalSec)}</span>
				</div>
			{/if}
		</div>
	{/if}
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
	}
	.avatar {
		width: 82px;
		height: 82px;
		border-radius: 50%;
		border: 2px solid hsla(215, 40%, 70%, 0.15);
		object-fit: cover;
		display: block;
		overflow: hidden;
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
	.quick-stats {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0;
		margin-top: 4px;
		padding-top: 16px;
		border-top: 1px solid hsla(215, 40%, 70%, 0.07);
	}
	.qs-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 20px 0 0;
	}
	.qs-label {
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.07em;
	}
	.qs-value {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--text-value);
	}
	.qs-value.accent {
		color: hsl(210, 80%, 65%);
	}
	.qs-sep {
		width: 1px;
		height: 28px;
		background: hsla(215, 40%, 70%, 0.1);
		margin-right: 20px;
		flex-shrink: 0;
	}
</style>
