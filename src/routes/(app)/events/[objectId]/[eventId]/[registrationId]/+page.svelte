<script lang="ts">
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import List from '$lib/components/ui/List.svelte';
	import { Client } from '$lib/graphql/client';
	import {
		GetRegistrationUsersDocument,
		GetUserByIdDocument,
		type PublicUserFieldsFragment
	} from '$lib/graphql/generated';
	import { use } from 'marked';
	import type { PageProps } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import UserCard from '$lib/components/UserCard.svelte';

	const { params }: PageProps = $props();
	const eventId = $derived(params.eventId);
	const objectId = $derived(params.objectId);
	const registrationId = $derived(params.registrationId);

	type RegistrationUser = {
		id: number;
		registeredAt?: unknown | null;
		position?: number | null;
		public?: PublicUserFieldsFragment;
	};
	const getRegistrationUsers = async (id: number) => {
		const { registration_by_pk } = await Client.request(GetRegistrationUsersDocument, { id });
		const users = new Map<number, RegistrationUser>();
		registration_by_pk?.users.forEach((u) => {
			if (u.id) users.set(u.id, { id: u.id, position: u.position, registeredAt: u.registeredAt });
		});

		const ids = [...users.keys()];
		const { user_public_view } = await Client.request(GetUserByIdDocument, { userId: ids ?? [] });
		user_public_view.forEach((publicUser) => {
			if (publicUser.id) {
				const user = users.get(publicUser.id);
				if (user) user.public = publicUser;
			}
		});
		return [...users.values()];
	};
</script>

<article>
	<Suspend data={getRegistrationUsers(+registrationId)}>
		{#snippet children(users)}
			<List items={users}>
				{#snippet Item(user)}
					{#if user.public}
						<UserCard user={user.public} />
					{/if}
				{/snippet}
			</List>
		{/snippet}
	</Suspend>
</article>

<style>
	article {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;

		overflow-y: scroll;
		overflow-x: hidden;
	}
</style>
