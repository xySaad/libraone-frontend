<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Progress from '$lib/assets/svg/progress.svelte';
	import { Client } from '$lib/graphql/client';
	import { GetUserProfileDocument } from '$lib/graphql/generated';
	import { intraUserState, profileUserState } from '$lib/stores/user.svelte';
	import Image from '$lib/components/image/Image.svelte';
	import UserAvatar from './image/UserAvatar.svelte';
	import api from '$lib/api';

	const getUserProfile = async (userId: number) => {
		const user = await Client.request(GetUserProfileDocument, { userId });
		return user.profile[0];
	};
</script>

{#if $profileUserState}
	{@const username = $profileUserState.graphql_login}
	<a href={resolve('/(app)/users/[id]', { id: $profileUserState.graphql_login })}>
		<Image src={`${api.CAMPUS.ORIGIN}/image/map/${username}`} alt={username} headers={{}} />
	</a>
{:else if $intraUserState}
	<a href={resolve(`/users/${$intraUserState.userId}`)}>
		{#await getUserProfile($intraUserState.userId)}
			<Progress />
		{:then user}
			<UserAvatar avatarUrl={user.avatarUrl} userLogin={user.login} />
		{/await}
	</a>
{:else}
	<button class="btn blue" onclick={() => goto(resolve('/login'))}> Login </button>
{/if}

<style>
	a {
		overflow: hidden;
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
</style>
