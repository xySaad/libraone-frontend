<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { intraUserState, profileUserState } from '$lib/stores/user.svelte';

	let { children } = $props();

	$effect(() => {
		if (page.url.pathname !== resolve('/login')) return;

		if ($intraUserState && $profileUserState) {
			goto(resolve('/'), { replaceState: true });
		}
	});
</script>

{@render children()}
