<script lang="ts">
	import api from '$lib/api';
	import UserGroupsList from '$lib/components/GroupList.svelte';
	import LockedOverlay from '$lib/components/LockedOverlay.svelte';
	import LogtimeSection from '$lib/components/profile/LogtimeSection.svelte';
	import NotFoundState from '$lib/components/profile/NotFoundState.svelte';
	import ProfileHero from '$lib/components/profile/ProfileHero.svelte';
	import ProfileStats from '$lib/components/profile/profileStats.svelte';
	import SkeletonLoader from '$lib/components/profile/SkeletonLoader.svelte';
	import { Client } from '$lib/graphql/client';
	import {
		GetUserByIdDocument,
		GetUserByLoginDocument,
		type PublicUserFieldsFragment
	} from '$lib/graphql/generated';
	import { fakeLogtime, fakeProfile } from '$lib/mock/mapl';
	import { profileUserState } from '$lib/stores/user.svelte';
	import type { LogtimeData, MaplProfile } from '$lib/types/profile';
	import { formatDateInput } from '$lib/utils/time';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
	const profileState = $derived($profileUserState);

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

	const getMaplLogtime = async (login: string) => {
		const now = new Date();
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const start = new Date(now);
		start.setMonth(start.getMonth() - 12);
		const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		return await api.CAMPUS.logtime({
			start: formatDateInput(start),
			end: formatDateInput(end),
			login
		});
	};

	let user = $state<PublicUserFieldsFragment>();
	let profile = $state<MaplProfile>();
	let logtime = $state<LogtimeData>();
	let loading = $state(true);

	const mount = async () => {
		try {
			user = await getPublicUser(params.id);
			if (user.login && profileState) {
				api.CAMPUS.profile({ login: user.login }).then((p) => (profile = p));
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
			{#if !profileState}
				<LockedOverlay message="Link profile">
					<ProfileStats logtime={fakeLogtime} profile={fakeProfile} />
				</LockedOverlay>
			{:else}
				<ProfileStats {logtime} {profile} />
			{/if}
		</ProfileHero>
		{#if user.login}
			{#if !profileState}
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
</style>
