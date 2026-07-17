<script lang="ts">
	import Clock from '$lib/assets/svg/clock.svelte';
	import Docker from '$lib/assets/svg/docker.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { TesterValidation } from '$lib/types/object/attrs/validation';

	interface Props {
		validation: TesterValidation;
	}

	function formatCooldown(ms: number): string {
		if (!Number.isFinite(ms) || ms <= 0) return '0s';

		const parts: string[] = [];

		const h = Math.floor(ms / 3_600_000);
		ms %= 3_600_000;

		const m = Math.floor(ms / 60_000);
		ms %= 60_000;

		const s = Math.floor(ms / 1_000);

		if (h) parts.push(`${h}h`);
		if (m) parts.push(`${m}m`);
		if (s || parts.length === 0) parts.push(`${s}s`);

		return parts.join(' ');
	}
	const { validation }: Props = $props();
</script>

<section>
	<div class="test">
		<Badge tooltip="Docker Image"><Docker />{validation.testImage}</Badge>
		<Badge tooltip="Cooldown">
			<Clock />{validation.cooldown ? formatCooldown(validation.cooldown) : '-'}
		</Badge>
		<Button style="max-width: fit-content" disabled>Test Exercise (soon)</Button>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 10px;

		.test {
			display: flex;
			align-items: center;
			gap: 10px;
			white-space: nowrap;
		}
	}
</style>
