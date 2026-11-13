<script lang="ts">
	import Warning from '$lib/assets/svg/warning.svelte';
	import GroupCard from '$lib/components/group/GroupCard.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import Notice from '$lib/components/ui/Notice.svelte';
	import { Client } from '$lib/graphql/client';
	import { GetUserGroupsInAuditDocument } from '$lib/graphql/generated';
	import { intraUserIdState, libraoneUserState } from '$lib/stores/user.svelte';
	import walkingKerby from '$lib/assets/walking_kerby.webp';
	import LoginButton from '$lib/components/LoginButton.svelte';

	const userId = $derived($libraoneUserState?.graphql_id || $intraUserIdState);
	const getGroupsInAudit = async (userId: number) => {
		const { group } = await Client.request(GetUserGroupsInAuditDocument, { userId: userId });
		return group;
	};

	async function getContributors() {
		const response = await fetch(
			`https://api.github.com/repos/xySaad/libraone-frontend/contributors`
		);
		const contributors: { login: string; avatar_url: string; html_url: string }[] =
			await response.json();
		return contributors;
	}
</script>

<main>
	<Notice type="warning" title="Work in progress">
		{#snippet icon()}
			<Warning />
		{/snippet}
		<div class="notice">
			This project is still under active development. You may run into bugs or a rough user
			experience while we keep improving it.
			<img src={walkingKerby} alt="kerby" />
		</div>
	</Notice>

	<section class="audits">
		<header>
			<h2>Groups in audit</h2>
			<p>Your groups that are currently waiting for or going through an audit.</p>
		</header>

		{#if userId}
			<Suspend data={getGroupsInAudit(userId)} size="32px">
				{#snippet children(groups)}
					{#if groups.length === 0}
						<p class="empty">None of your groups are in audit right now.</p>
					{:else}
						<FlexContainer minWidth={500} gap="16px" justifyContent="center">
							{#snippet children(Flex)}
								{#each groups as group (group.id)}
									<Flex>
										<GroupCard {group} title={group.object.name ?? '-'} />
									</Flex>
								{/each}
							{/snippet}
						</FlexContainer>
					{/if}
				{/snippet}
			</Suspend>
		{:else}
			<div class="login">
				<p class="empty">Log in to see your groups that are in audit.</p>
				<LoginButton />
			</div>
		{/if}
	</section>

	<footer class="contributors-footer">
		<a href="https://github.com/xySaad/libraone-frontend" rel="external" target="_blank">
			<div class="divider"></div>
			<span class="label">Contributors</span>
			<ul class="avatars">
				<Suspend data={getContributors()}>
					{#snippet children(contributors)}
						{#each contributors as contributor (contributor.login)}
							<li class="avatar-item" data-tooltip={contributor.login}>
								<img
									src={contributor.avatar_url}
									alt={contributor.login}
									class="avatar"
									loading="lazy"
								/>
							</li>
						{/each}
					{/snippet}
				</Suspend>
			</ul>
		</a>
	</footer>
</main>

<style>
	main {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 0 24px;
		overflow-y: auto;
		overflow-x: hidden;

		.notice {
			display: flex;
			align-items: center;
			gap: 10px;
		}
		.audits {
			display: flex;
			flex-direction: column;
			gap: 16px;

			h2 {
				margin: 0;
				font-size: 1.25rem;
				font-weight: 700;
				color: var(--text-title);
			}

			header p {
				margin: 4px 0 0;
				font-size: 0.85rem;
				color: var(--text-muted);
			}
		}

		.empty {
			margin: 0;
			text-align: center;
			font-size: 0.9rem;
			color: var(--text-muted);
		}

		.login {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 12px;
		}

		.contributors-footer {
			margin-top: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
			padding: 1rem 1.5rem 1.25rem;

			.label {
				font-size: 0.65rem;
				font-weight: 600;
				letter-spacing: 0.18em;
				text-transform: uppercase;
				color: var(--text-muted);
			}

			.avatars {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				gap: 0;
			}

			.avatar-item {
				margin-left: -8px;
				transition:
					transform 0.2s ease,
					z-index 0s;
				position: relative;
				z-index: 0;

				&:first-child {
					margin-left: 0;
				}

				&:hover {
					transform: translateY(-5px) scale(1.12);
					z-index: 10;

					.avatar {
						border-color: hsla(215, 40%, 70%, 0.4);
					}
				}

				.avatar {
					display: block;
					width: 32px;
					height: 32px;
					border-radius: 50%;
					border: 2px solid var(--primary);
					background: var(--secondary);
					transition: border-color 0.2s ease;
				}
			}
		}
	}
</style>
