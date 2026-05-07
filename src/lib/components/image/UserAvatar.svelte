<script lang="ts">
	import { get } from 'svelte/store';
	import FallbackImage from './FallbackImage.svelte';
	import Image from './Image.svelte';
	import { profileUserState } from '$lib/stores/user.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Person from '$lib/assets/svg/person.svelte';

	interface Props {
		userLogin?: string | null;
		avatarUrl?: string | null;
	}
	const { avatarUrl, userLogin }: Props = $props();
	const profileToken = $derived(get(profileUserState)?.token);

	let error = $state(false);
</script>

<button onclick={() => goto(resolve(`/users/${userLogin}`))}>
	{#if error}
		<Person />
	{:else}
		<FallbackImage src={avatarUrl}>
			{#if profileToken}
				<Image
					src={`https://mapl.zone01oujda.ma/image/map/${userLogin}`}
					alt={userLogin}
					headers={{ 'X-TOKEN': `${profileToken}` }}
					onerror={() => (error = true)}
				/>
			{:else}
				<Person />
			{/if}
		</FallbackImage>
	{/if}
</button>
