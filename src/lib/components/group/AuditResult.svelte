<script lang="ts">
	import Crown from '$lib/assets/svg/crown.svelte';
	import DoneOutline from '$lib/assets/svg/done_outline.svelte';
	import GppBad from '$lib/assets/svg/gpp-bad.svelte';
	import type { GetObjectGroupsQuery } from '$lib/graphql/generated';
	import UserAvatar from '../image/UserAvatar.svelte';
	import Markdown from '../ui/Markdown/Markdown.svelte';

	interface Props {
		captainId?: number | null;
		audit: GetObjectGroupsQuery['object'][number]['groups'][number]['results'][number]['audits'][number];
	}

	const { audit, captainId }: Props = $props();
	const { closureType, grade, attrs, auditor } = $derived(audit);
	let showFeedback = $state(false);
	const isCaptain = $derived(auditor?.id === captainId);
	const memberTooltip = $derived(`${auditor?.login}${isCaptain ? ' (captain)' : ''}`);
</script>

<div class="audit" class:showFeedback>
	<div class="member">
		{#if isCaptain}
			<div class="crown">
				<Crown />
			</div>
		{/if}
		<div class="avatar" data-tooltip={memberTooltip}>
			<UserAvatar
				avatarUrl={auditor?.avatarUrl}
				userLogin={auditor?.login}
				banned={!auditor?.canAccessPlatform}
			/>
		</div>
		<div class="closure" data-tooltip="{closureType} ({grade})">
			{#if closureType === 'failed'}
				<GppBad
					fill={'var(--error)'}
					style="cursor: pointer:"
					onclick={() => (showFeedback = !showFeedback)}
				/>
			{:else if closureType === 'succeeded'}
				<DoneOutline fill={'var(--success)'} />
				<!-- TODO: handle other closure types -->
			{/if}
		</div>
	</div>

	{#if closureType === 'failed' && showFeedback}
		<div class="feedback">
			{#each Object.entries(attrs) as [k, v], i (i)}
				<Markdown src={{ raw: '## Failed:\n' + k + '\n## Reason:\n' + v }} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.audit {
		gap: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;

		&.showFeedback {
			width: 100%;
			.feedback {
				width: 100%;
				max-width: 100%;
				white-space: wrap;
			}
		}

		.member {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			width: fit-content;
			.avatar {
				width: 70px;
				height: 70px;
			}
			.crown {
				color: var(--success);
			}
		}
	}
</style>
