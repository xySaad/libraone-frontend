<script lang="ts">
	import FallbackImage from '$lib/components/image/FallbackImage.svelte';
	import { hash } from '$lib/map/ui/hash';
	import { avatarUrl } from '$lib/map/ui/avatar';

	let { login }: { login: string } = $props();

	const hue = $derived(hash(login) % 360);
</script>

<span class="av" style:--h={hue}>
	<FallbackImage src={avatarUrl(login)} alt="">
		<b>{login.slice(0, 2).toUpperCase()}</b>
	</FallbackImage>
</span>

<style>
	.av {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
		background: hsl(var(--h) 40% 34%);
		color: #fff;
	}
	b {
		font-weight: 700;
	}
	.av :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
	}
</style>
