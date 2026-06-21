<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Client } from '$lib/graphql/client';
	import { GetUserProfileDocument } from '$lib/graphql/generated';
	import { profileUserState } from '$lib/stores/user.svelte';
	import UserAvatar from './image/UserAvatar.svelte';
	import Spinner from './ui/Spinner.svelte';

	const getUserProfile = async (userId: number) => {
		const user = await Client.request(GetUserProfileDocument, { userId });
		return user.profile[0];
	};
</script>

{#if $profileUserState}
	<a href={resolve(`/users/${$profileUserState.graphql_login}`)}>
		{#await getUserProfile($profileUserState.graphql_id)}
			<Spinner size="50px" />
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
