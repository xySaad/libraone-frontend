<script lang="ts">
	import Location from '$lib/assets/svg/location.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import CardHeader from '../Card/CardHeader.svelte';
	import OnlineDot from '../OnlineDot.svelte';
	import CalendarDay from '../ui/CalendarDay.svelte';

	interface Props {
		campus: string;
		startAt: number | string | Date;
		endAt: number | string | Date;
	}

	const { startAt, endAt, campus }: Props = $props();

	const now = new Date();
	const start = $derived(new Date(startAt));
	const end = $derived(new Date(endAt));

	const isLive = $derived(now >= start && now <= end);
	const isPast = $derived(now > end);

	const monthLabel = $derived(start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());
	const dayNum = $derived(start.getDate());
	const weekday = $derived(start.toLocaleDateString('en-US', { weekday: 'long' }));
	const year = $derived(start.getFullYear().toString());

	const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

	const isSameDay = $derived(start.toDateString() === end.toDateString());

	const timeRange = $derived(
		isSameDay
			? `${fmt(start)} — ${fmt(end)}`
			: `${fmt(start)} — ${end.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric'
				})}, ${fmt(end)}`
	);
</script>

<CardHeader subtitle={timeRange}>
	{#snippet icon()}
		<CalendarDay
			month={monthLabel}
			day={dayNum}
			type={isPast ? 'expired' : isLive ? 'live' : 'upcoming'}
		></CalendarDay>
	{/snippet}

	{#snippet BadgeCampus()}
		<Location />
		{campus ?? '-'}
	{/snippet}

	{#snippet title()}
		<div class="title">
			{weekday}, {year}
			{#if isLive}
				<Badge type="success">
					<OnlineDot />
					Live
				</Badge>
			{:else if isPast}
				<Badge type="error">Ended</Badge>
			{:else}
				<Badge>Upcoming</Badge>
			{/if}
		</div>
	{/snippet}
</CardHeader>

<style>
	.title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
