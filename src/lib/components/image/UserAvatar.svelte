<script lang="ts">
	import FallbackImage from './FallbackImage.svelte';
	import { resolve } from '$app/paths';
	import Person from '$lib/assets/svg/person.svelte';
	import Block from '$lib/assets/svg/block.svelte';
	import api from '$lib/api';

	interface Props {
		userLogin?: string | null;
		avatarUrl?: string | null;
		banned?: boolean | null;
		allowSwitch?: boolean;
	}
	const { avatarUrl, userLogin, banned, allowSwitch = true }: Props = $props();
</script>

<a href={resolve(`/users/${userLogin}`)} class:banned>
	<div class="banned-status">
		<Block />
	</div>
	<div class="avatar" class:allow-switch={allowSwitch}>
		<div class="graphql">
			<FallbackImage src={avatarUrl}>
				<Person />
			</FallbackImage>
		</div>
		<div class="campus">
			<FallbackImage src={`${api.CAMPUS.ORIGIN}/image/map/${userLogin}`}>
				<Person />
			</FallbackImage>
		</div>
	</div>
</a>

<style>
	@keyframes show {
		to {
			width: 100%;
			height: 100%;
		}
	}
	@keyframes hide {
		to {
			width: 0;
			height: 0;
		}
	}
	a {
		display: block;
		position: relative;
		max-width: 85px;
		.avatar {
			border-radius: 100%;
			aspect-ratio: 1;
			overflow: hidden;
			transition: transform 0.8s;

			.graphql {
				width: 0;
				height: 0;
				animation: show 0s 0.2s forwards;
			}

			.campus {
				transform: rotateY(180deg);
				height: 100%;
				width: 100%;
				animation: hide 0s 0.2s forwards;
			}
		}
		&:hover {
			.avatar.allow-switch {
				transform: rotateY(180deg);
				.graphql {
					width: 100%;
					height: 100%;
					animation: hide 0s 0.2s forwards;
				}
				.campus {
					width: 0;
					height: 0;
					animation: show 0s 0.2s forwards;
				}
			}
		}

		.banned-status {
			display: none;
		}

		&.banned {
			&:hover .banned-status {
				display: none;
			}

			.banned-status {
				z-index: 1;
				display: flex;
				position: absolute;
				inset: 0;
				align-items: center;
				justify-content: center;
				background: var(--card-bg);
				color: var(--error);
				backdrop-filter: blur(1px);
			}
		}
	}
</style>
