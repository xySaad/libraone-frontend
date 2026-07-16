<script lang="ts">
	import BoltBoost from '$lib/assets/svg/bolt-boost.svelte';
	import DataUsage from '$lib/assets/svg/data-usage.svelte';
	import Function from '$lib/assets/svg/function.svelte';
	import Groups from '$lib/assets/svg/groups.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { ObjectAttrs } from '$lib/types/object/attrs';
	import { formatBytes } from '$lib/utils/units';
	interface Props {
		attrs: ObjectAttrs;
	}
	const { attrs }: Props = $props();
</script>

<section class="overview">
	{#if attrs.type === 'project'}
		{@const { language, requiredAuditRatio, groupMax, groupMin, baseXp } = attrs.attrs}
		<Badge tooltip="language"><Function /> {language}</Badge>
		<Badge tooltip="required audit ratio"><DataUsage /> {requiredAuditRatio}</Badge>
		<Badge tooltip="group size"><Groups /> {groupMin} / {groupMax}</Badge>
		<Badge tooltip="XP"><BoltBoost /> {baseXp ? formatBytes(baseXp) : '-'}</Badge>
	{:else if attrs.type === 'exercise'}
		{@const { language, baseXp, category, difficulty, duration, expectedFiles, level } =
			attrs.attrs}
		<Badge tooltip="language"><Function /> {language}</Badge>
		<Badge tooltip="XP"><BoltBoost /> {baseXp ? formatBytes(baseXp) : '-'}</Badge>
	{/if}
</section>

<style>
	.overview {
		display: flex;
		gap: 10px;
	}
</style>
