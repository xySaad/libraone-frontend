<script lang="ts">
	import { api } from '$lib/api';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	const columns = 2;
	const campusPreffix = 'b1f1';
	const blocks = [
		{ rows: 5, size: 6, direction: 'up', after: true },
		{ rows: 5, size: 6, direction: 'right' },
		{ rows: 6, size: 6, direction: 'down' },
		{ rows: 3, size: 12, direction: 'left' }
	];

	let searchQuery = $state('');

	const matchesSearch = (username: string | undefined) => {
		if (!searchQuery.trim() || !username) return false;
		return username.toLowerCase().includes(searchQuery.toLowerCase().trim());
	};

	const fetchOnlineUsers = async () => {
		const busyPosts = await api.CAMPUS.online().catch(() => ({}) as Record<string, string>);
		const onlineUsers: Record<string, string | undefined> = {};
		for (const post in busyPosts) {
			onlineUsers[busyPosts[post]] = post;
		}
		return [onlineUsers, busyPosts];
	};

	const [, BusyPosts] = await fetchOnlineUsers();
</script>

<div class="search-bar">
	<input type="search" placeholder="Search by username..." bind:value={searchQuery} />
	{#if searchQuery.trim()}
		{@const matches = Object.values(BusyPosts).filter((u) =>
			u?.toLowerCase().includes(searchQuery.toLowerCase().trim())
		)}
		<span class="result-count">{matches.length} result{matches.length !== 1 ? 's' : ''}</span>
	{/if}
</div>

<div class="map" data-searching={searchQuery.length > 0}>
	{#each blocks as block, i (block)}
		<div class="block" data-after={block.after} data-direction={block.direction}>
			{#each { length: block.rows } as _, localRow (localRow)}
				{@const rowOffset = blocks.slice(0, i).reduce((sum, b) => sum + b.rows, 0)}
				{@const row = rowOffset + localRow + 1}
				<div class="row">
					R{row}
					<div class="columns">
						{#each { length: columns } as _, column (column)}
							<div class="column">
								{#each { length: block.size } as _, post (post)}
									{@const postNumber = post * columns + (columns - column)}
									{@const postId = `${campusPreffix}r${row}s${postNumber}`}
									{@const username = BusyPosts[postId]}
									<div class="post" data-post={postId} data-highlighted={matchesSearch(username)}>
										{#if username}
											<UserAvatar userLogin={username} />
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.search-bar {
		margin: auto;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;

		input[type='search'] {
			background: var(--secondary);
			border: 1px solid rgba(255, 255, 255, 0.2);
			border-radius: 6px;
			color: inherit;
			font-size: 0.9rem;
			outline: none;
			padding: 8px 14px;
			transition: border-color 0.2s;
			width: 240px;

			&:focus {
				border-color: rgba(255, 255, 255, 0.6);
			}

			&::placeholder {
				opacity: 0.5;
			}
		}

		.result-count {
			font-size: 0.8rem;
			opacity: 0.6;
		}
	}

	.map {
		display: grid;
		grid-template-columns: auto;
		grid-template-areas:
			'. top top'
			'left . right'
			'. bottom .';
		justify-content: center;
		align-items: end;
		gap: 32px;
		width: 100%;
		overflow: auto;

		&[data-searching='true'] {
			.post {
				opacity: 0.3;
			}
		}
		.block {
			margin: 0 auto;
			display: flex;
			width: fit-content;
			height: fit-content;
			&[data-direction='up'] {
				flex-direction: column-reverse;
				.columns {
					flex-direction: column;
				}
			}
			&[data-direction='down'] {
				flex-direction: column;
				.row {
					flex-direction: row-reverse;
					.columns {
						flex-direction: column-reverse;
						.column {
							flex-direction: row-reverse;
						}
					}
				}
			}
			&[data-direction='right'] {
				flex-direction: row;
				.row {
					.columns {
						flex-direction: row-reverse;
						.column {
							flex-direction: column;
						}
					}
				}
			}
			&[data-direction='left'] {
				width: 100%;
				justify-content: center;
				flex-direction: row-reverse;
				.row {
					flex-direction: column-reverse;
					.column {
						flex-direction: column-reverse;
					}
				}
			}
			.row {
				display: flex;
				gap: 10px;
				align-items: center;
				border: white 1px solid;
				padding: 10px;
				.columns {
					display: flex;
					gap: 10px;
					.column {
						display: flex;
						gap: 10px;
						.post {
							background: var(--secondary);
							min-width: 50px;
							max-width: 50px;
							aspect-ratio: 1;
							border-radius: 6px;
							overflow: hidden;
							transition:
								outline 0.15s,
								opacity 0.15s;

							&[data-highlighted='true'] {
								scale: 1.1;
								opacity: 1;
								outline: 2px solid var(--text-muted);
								outline-offset: 2px;
							}
						}
					}
				}
			}
		}

		.block:nth-child(1) {
			grid-area: left;
		}

		.block:nth-child(2) {
			grid-area: top;
		}

		.block:nth-child(3) {
			grid-area: right;
		}

		.block:nth-child(4) {
			grid-area: bottom;
		}
	}
</style>
