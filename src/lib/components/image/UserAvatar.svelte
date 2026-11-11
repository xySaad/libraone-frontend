<script lang="ts">
	import FallbackImage from './FallbackImage.svelte';
	import { resolve } from '$app/paths';
	import Person from '$lib/assets/svg/person.svelte';
	import Block from '$lib/assets/svg/block.svelte';
	import OnlineDot from '../OnlineDot.svelte';
	import { onlineUsers } from '$lib/stores/onlineUsers.svelte';

	interface Props {
		userLogin?: string | null;
		avatarUrl?: string | null;
		banned?: boolean | null;
		showOnline?: boolean | null;
	}
	const { avatarUrl, userLogin, banned, showOnline = true }: Props = $props();
</script>

<a href={resolve(`/users/${userLogin}`)}>
	<div class="avatar">
		{#if banned}
			<div class="banned" data-tooltip-pos="down" data-tooltip="banned">
				<Block />
			</div>
		{/if}
		<FallbackImage src={avatarUrl}>
			<Person />
		</FallbackImage>
		{#if showOnline && userLogin && onlineUsers[userLogin]}
			<div class="online-dot">
				<OnlineDot />
			</div>
		{/if}
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

			.banned {
				position: absolute;
				right: -5px;
				top: -5px;
				color: var(--error);
				background: var(--primary);
				padding: 5px;
				border-radius: 100%;
			}

			.online-dot {
				position: absolute;
				z-index: 1;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>
