<script lang="ts">
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import { avatarUrl } from '$lib/map/ui/avatar';
	import type { Occupant } from '$lib/map/domain/occupancy';

	let { occupant, onclose }: { occupant: Occupant; onclose: () => void } = $props();
</script>

<div class="card">
	<div class="big">
		<UserAvatar
			userLogin={occupant.login}
			avatarUrl={avatarUrl(occupant.login)}
			showOnline={false}
		/>
	</div>
	<div class="who">
		<strong>{occupant.login}</strong>
		<span>Row {occupant.row}, seat {occupant.seat}</span>
		<span>{occupant.hostname}</span>
	</div>
	<button class="x" aria-label="Close" onclick={onclose}>&times;</button>
</div>

<style>
	.card {
		position: sticky;
		bottom: 12px;
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 12px;
		padding: 12px 14px;
		border-radius: var(--card-radius);
		border: 1px solid var(--surface-border);
		background: var(--card);
		box-shadow: 0 8px 28px var(--shadow);
	}
	.big {
		width: 56px;
		flex: none;
	}
	.who {
		flex: 1;
		min-width: 0;
		display: grid;
		gap: 2px;
	}
	.who strong {
		font-size: 1.05rem;
	}
	.who span {
		color: var(--muted);
		font-size: 0.88rem;
	}
	.x {
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 50%;
		background: var(--chip);
		color: var(--ink);
		font-size: 1.2rem;
		line-height: 1;
	}
</style>
