<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import Event from '$lib/assets/svg/event.svelte';
	import Gite from '$lib/assets/svg/gite.svelte';
	import Leaderboard from '$lib/assets/svg/leaderboard.svelte';
	import type { Component } from 'svelte';

	interface NavItem {
		href: Pathname;
		icon: Component;
		text: string;
	}

	const items: NavItem[] = [
		{ href: '/events', icon: Event, text: 'Events' },
		{ href: '/map', icon: Gite, text: 'Map' },
		{ href: '/leaderboard', icon: Leaderboard, text: 'Leaderboard' }
	];

	const isActive = (href: Pathname) => page.url.pathname.startsWith(resolve(href));
</script>

<nav aria-label="Main">
	{#each items as { href, icon: Icon, text } (href)}
		{@const active = isActive(href)}
		<a href={resolve(href)} class={{ active }} aria-label={text} aria-current={active && 'page'}>
			<Icon />
			<span>{text}</span>
		</a>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	a {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		border-radius: var(--surface-radius);
		border: 1px solid transparent;
		font-weight: 700;
		color: var(--text-link);
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			background: var(--surface-bg-hover);
			color: var(--text-primary);
		}

		&.active {
			background: var(--surface-bg);
			border-color: var(--surface-border);
			color: var(--text-title);
		}
	}

	@media (max-width: 640px) {
		a {
			padding: 8px;
		}

		span {
			display: none;
		}
	}
</style>
