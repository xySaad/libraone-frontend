<script lang="ts">
	import UserGroupsList from '$lib/components/GroupList.svelte';
	import LockedOverlay from '$lib/components/LockedOverlay.svelte';
	import LogtimeSection from '$lib/components/profile/LogtimeSection.svelte';
	import NotFoundState from '$lib/components/profile/NotFoundState.svelte';
	import ProfileHero from '$lib/components/profile/ProfileHero.svelte';
	import SessionCard from '$lib/components/profile/SessionCard.svelte';
	import SkeletonLoader from '$lib/components/profile/SkeletonLoader.svelte';
	import { Client } from '$lib/graphql/client';
	import {
		GetUserByIdDocument,
		GetUserByLoginDocument,
		type PublicUserFieldsFragment
	} from '$lib/graphql/generated';
	import { fakeLastSession, fakeLogtime, fakeProfile } from '$lib/mock/mapl';
	import { profileUserState } from '$lib/stores/user.svelte';
	import type { LogtimeData, MaplProfile } from '$lib/types/profile';
	import { formatDateInput } from '$lib/utils/time';
	import { get } from 'svelte/store';
	import type { PageProps } from './$types';
	import ProfileStats from '$lib/components/profile/profileStats.svelte';

	const { params }: PageProps = $props();
	const profileToken = $derived(get(profileUserState)?.token);

	const getPublicUser = async (userId: string) => {
		if (Number.isInteger(+userId)) {
			const res = await Client.request(GetUserByIdDocument, { userId: +userId });
			const publicUser = res.user_public_view[0];
			if (!publicUser) throw new Error('user not found');
			return publicUser;
		}

		const res = await Client.request(GetUserByLoginDocument, { userLogin: userId });
		const publicUser = res.user_public_view[0];
		if (!publicUser) throw new Error('user not found');
		return publicUser;
	};

	const getMaplProfile = async (login: string) => {
		try {
			const r = await fetch(`https://mapl.zone01oujda.ma/profile/${login}`, {
				headers: { 'X-TOKEN': `${profileToken}` }
			});
			return r.ok ? r.json() : null;
		} catch {
			return null;
		}
	};

	const getMaplLogtime = async (login: string) => {
		try {
			const now = new Date();
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const start = new Date(now);
			start.setMonth(start.getMonth() - 12);
			const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

			const r = await fetch(
				`https://mapl.zone01oujda.ma/logtime/${login}?start=${formatDateInput(start)}&end=${formatDateInput(end)}`,
				{ headers: { 'X-TOKEN': `${profileToken}` } }
			);

			return r.ok ? r.json() : null;
		} catch {
			return null;
		}
	};

	let user = $state<PublicUserFieldsFragment>();
	let profile = $state<MaplProfile>();
	let logtime = $state<LogtimeData>();
	let loading = $state(true);

	const mount = async () => {
		try {
			user = await getPublicUser(params.id);
			if (user.login && profileToken) {
				getMaplProfile(user.login).then((p) => (profile = p));
				getMaplLogtime(user.login).then((l) => (logtime = l));
			}
		} finally {
			loading = false;
		}
	};
	$effect(() => {
		mount();
	});
</script>

<div class="profile-root">
	{#if loading}
		<SkeletonLoader />
	{:else if user}
		<ProfileHero {user} active={!!profile?.location}>
			{#if !profileToken}
				<LockedOverlay message="Link profile">
					<ProfileStats logtime={fakeLogtime} profile={fakeProfile} />
				</LockedOverlay>
			{:else}
				<ProfileStats {logtime} {profile} />
			{/if}
		</ProfileHero>
		{#if user.login}
			{#if !profileToken}
				<LockedOverlay message="Link profile">
					<SessionCard lastSession={fakeLastSession} />
				</LockedOverlay>
			{:else if profile?.last_session}
				<div class="cards-grid">
					<SessionCard lastSession={profile.last_session} />
				</div>
			{/if}
			{#if !profileToken}
				<LockedOverlay message="Link profile">
					<LogtimeSection logtime={fakeLogtime} />
				</LockedOverlay>
			{:else if logtime}
				<LogtimeSection {logtime} />
			{/if}
		{/if}
	{:else}
		<NotFoundState icon="⚠" title="Failed to load user data" />
	{/if}

	<UserGroupsList userId={params.id} />
</div>

<style>
	.profile-root {
		overflow: auto;
		padding: 28px 32px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 20px;
		animation: fade-up 0.4s ease both;
		width: 100%;
		max-width: 1200px;
	}
	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 16px;
	}
</style>
