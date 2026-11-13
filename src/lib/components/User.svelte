<script lang="ts">
	import { Client } from '$lib/graphql/client';
	import { GetUserProfileDocument } from '$lib/graphql/generated';
	import { intraUserIdState, libraoneUserState } from '$lib/stores/user.svelte';
	import UserAvatar from './image/UserAvatar.svelte';
	import LoginButton from './LoginButton.svelte';
	import Spinner from './ui/Spinner.svelte';

	const getUserProfile = async (userId: number) => {
		const user = await Client.request(GetUserProfileDocument, { userId });
		return user.profile[0];
	};
	const userId = $derived($libraoneUserState?.graphql_id || $intraUserIdState);
</script>

{#if userId}
	{#await getUserProfile(userId)}
		<Spinner size="50px" />
	{:then user}
		<div class="shrink">
			<UserAvatar avatarUrl={user.avatarUrl} userLogin={user.login} />
		</div>
	{/await}
{:else}
	<LoginButton />
{/if}

<style>
	.shrink {
		overflow: hidden;
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
</style>
