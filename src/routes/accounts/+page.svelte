<script lang="ts">
	import Code from '$lib/assets/svg/code.svelte';
	import Gitea from '$lib/assets/svg/gitea.svelte';
	import CardHeader from '$lib/components/Card/CardHeader.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import LoginAnchor from '$lib/components/login/LoginAnchor.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import ActionButton from '$lib/components/ui/ActionButton.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { Client } from '$lib/graphql/client';
	import { GetUserByIdDocument } from '$lib/graphql/generated';
	import { intraCreds, profileUserState } from '$lib/stores/user.svelte';

	const getJWTSub = (token: string): number => Number(JSON.parse(atob(token.split('.')[1])).sub);
	const getUserById = async (userId: number) => {
		const res = await Client.request(GetUserByIdDocument, { userId });
		const publicUser = res.user_public_view[0];
		if (!publicUser) throw new Error('user not found');
		return publicUser;
	};
</script>

<div class="accounts-root">
	<div class="orb orb-1" aria-hidden="true"></div>
	<div class="orb orb-2" aria-hidden="true"></div>

	<div class="grid-overlay" aria-hidden="true"></div>
	<div class="card">
		<Card maxWidth="600px">
			<Wordmark>Accounts</Wordmark>
			{#if $profileUserState}
				<div class="gitea">
					<Card>
						<CardHeader>
							{#snippet icon()}<Icon><Gitea /></Icon>{/snippet}
							{#snippet title()}
								<div class="title">
									Gitea OAuth
									<div class="logout">
										<ActionButton onclick={() => {}}>Logout</ActionButton>
									</div>
								</div>
							{/snippet}
						</CardHeader>

						<section class="user">
							<UserAvatar
								userLogin={$profileUserState.graphql_login}
								avatarUrl={$profileUserState.avatar_url}
							/>
							<Badge>
								{$profileUserState.gitea_login} ({$profileUserState.role})</Badge
							>
						</section>
					</Card>
				</div>
			{:else}
				<LoginAnchor type="gitea" subtitle="Login via OAuth">
					<Gitea />
				</LoginAnchor>
			{/if}
			{#if $intraCreds}
				<div class="intra">
					<Card>
						<CardHeader>
							{#snippet icon()}<Icon><Code fill="var(--intra-accent)" /></Icon>{/snippet}
							{#snippet title()}
								<div class="title">
									Intra
									<div class="logout">
										<ActionButton onclick={() => {}}>Logout</ActionButton>
									</div>
								</div>
							{/snippet}
						</CardHeader>

						<section class="user">
							<Suspend data={getUserById(getJWTSub($intraCreds))}>
								{#snippet children(user)}
									<UserAvatar userLogin={user.login} avatarUrl={user.avatarUrl} />
									<Badge>{user.login}</Badge>
								{/snippet}
							</Suspend>
						</section>
					</Card>
				</div>
			{:else}
				<LoginAnchor type="intra" subtitle="Login via Intra password">
					<Code fill="var(--intra-accent)" />
				</LoginAnchor>
			{/if}
		</Card>
	</div>
</div>

<style>
	.accounts-root {
		position: relative;
		height: 100%;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		display: flex;

		.card {
			display: flex;
			justify-content: center;

			height: fit-content;
			width: 100%;
			margin: auto;

			.title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				.logout {
					width: fit-content;
				}
			}
			.user {
				display: flex;
				flex-direction: column;
				width: 100%;
				align-items: center;
				gap: 10px;
			}
		}
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		pointer-events: none;
	}
	.orb-1 {
		width: 520px;
		height: 520px;
		top: -140px;
		right: -160px;
		background: radial-gradient(circle, hsla(38, 70%, 40%, 0.14) 0%, transparent 70%);
	}
	.orb-2 {
		width: 480px;
		height: 480px;
		bottom: -120px;
		left: -140px;
		background: radial-gradient(circle, hsla(210, 80%, 45%, 0.12) 0%, transparent 70%);
	}

	.grid-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(hsla(215, 40%, 70%, 0.025) 1px, transparent 1px),
			linear-gradient(90deg, hsla(215, 40%, 70%, 0.025) 1px, transparent 1px);
		background-size: 48px 48px;
		mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
	}
</style>
