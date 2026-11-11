<script lang="ts">
	import { hash } from '$lib/utils/ui/hash.js';
	import type { User } from '$lib/types/map/occupancy.js';

	let { user }: { user: Pick<User, 'login' | 'avatar'> } = $props();

	// if the picture fails to load, the coloured initials underneath stay visible
	let broken = $state(false);
	const hue = $derived(hash(user.login) % 360);
</script>

<span class="av" style:--h={hue}>
	<b>{user.login.slice(0, 2).toUpperCase()}</b>
	{#if !broken}
		<img
			src={user.avatar}
			alt=""
			loading="lazy"
			referrerpolicy="no-referrer"
			onerror={() => (broken = true)}
		/>
	{/if}
</span>

<style>
	.av {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
		background: hsl(var(--h) 40% 42%);
		color: #fff;
	}
	b {
		font-weight: 700;
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
	}
</style>
