<script lang="ts">
	import type { LogtimeData, MaplProfile } from '$lib/types/profile';
	import { fmtSeconds } from '$lib/utils/time';
	interface Props {
		profile?: MaplProfile;
		logtime?: LogtimeData;
	}

	const { profile, logtime }: Props = $props();
	const totalSec = (logtime: LogtimeData) =>
		Object.values(logtime).reduce((a, v) => a + (v?.total ?? 0), 0);
</script>

<div class="quick-stats">
	<div class="qs-item">
		<span class="qs-label">Group</span>
		<span class="qs-value">{profile?.main_group ?? '—'}</span>
	</div>

	<div class="qs-sep"></div>

	<div class="qs-item">
		<span class="qs-label">Sub-group</span>
		<span class="qs-value">{profile?.sub_group ?? '—'}</span>
	</div>

	{#if profile?.location}
		<div class="qs-sep"></div>
		<div class="qs-item">
			<span class="qs-label">Location</span>
			<span class="qs-value">{profile.location}</span>
		</div>
	{/if}

	<div class="qs-sep"></div>
	<div class="qs-item">
		<span class="qs-label">Total logtime</span>
		<span class="qs-value accent">{logtime ? fmtSeconds(totalSec(logtime)) : '-'}</span>
	</div>
</div>

<style>
	.quick-stats {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0;
		margin-top: 4px;
		padding-top: 16px;
		border-top: 1px solid hsla(215, 40%, 70%, 0.07);
	}
	.qs-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 20px 0 0;
	}
	.qs-label {
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.07em;
	}
	.qs-value {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--text-value);
	}
	.qs-value.accent {
		color: hsl(210, 80%, 65%);
	}
	.qs-sep {
		width: 1px;
		height: 28px;
		background: hsla(215, 40%, 70%, 0.1);
		margin-right: 20px;
		flex-shrink: 0;
	}
</style>
