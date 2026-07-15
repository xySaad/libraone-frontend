<script lang="ts">
	import BoltBoost from '$lib/assets/svg/bolt-boost.svelte';
	import CompareArrows from '$lib/assets/svg/compare-arrows.svelte';
	import DataUsage from '$lib/assets/svg/data-usage.svelte';
	import Function from '$lib/assets/svg/function.svelte';
	import Groups from '$lib/assets/svg/groups.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { Client } from '$lib/graphql/client';
	import { GetValidationMarkdownsDocument } from '$lib/graphql/generated';
	import type { ProjectAttrs } from '$lib/types/object/attrs/project';
	import { formatBytes } from '$lib/utils/units';
	type Validation = Exclude<ProjectAttrs['validations'], undefined>[number];
	interface Props {
		name: string;
		details: ProjectAttrs;
	}
	const { details, name }: Props = $props();
	let isValidationVisible = $state(false);

	const generateMarkdownData = async ({ form, postQuestions, preQuestions }: Validation) => {
		// await new Promise((res) => setTimeout(res, 100000));
		const { pre, post } = await Client.request(GetValidationMarkdownsDocument, {
			pre: preQuestions ?? [],
			post: postQuestions ?? []
		});

		const preData = '## Pre\n' + pre.map((md) => md.content).join('\n');
		const postData = '## Post\n' + post.map((md) => md.content).join('\n');

		const data = [preData, '', postData];
		if (form) {
			const formResp = await fetch(`https://learn.zone01oujda.ma${form}`);
			const formData = await formResp.text();
			data[1] = '## General\n' + formData;
		}
		return data.join('\n');
	};
</script>

<article>
	<section class="overview">
		<Badge tooltip="language"><Function /> {details.language}</Badge>
		<Badge tooltip="required audit ratio"><DataUsage /> {details.requiredAuditRatio}</Badge>
		<Badge tooltip="group size"><Groups /> {details.groupMin} / {details.groupMax}</Badge>
		<Badge tooltip="XP"><BoltBoost /> {formatBytes(details.baseXp ?? 0)}</Badge>
	</section>
	<section class="forms">
		{#snippet Title()}
			<div class="title">
				<button onclick={() => (isValidationVisible = !isValidationVisible)}>
					<CompareArrows />
				</button>
				<Wordmark>
					{isValidationVisible ? 'Validation' : 'Subject'}
				</Wordmark>
			</div>
		{/snippet}

		{#if isValidationVisible}
			{#each details.validations as validation (validation)}
				<Suspend data={generateMarkdownData(validation)}>
					{#snippet children(markdown)}
						<Markdown fileName="{name}-audit.md" raw={markdown} {Title} />
					{/snippet}
				</Suspend>
			{/each}
		{:else}
			<Markdown
				fileName="{name}.md"
				url={`https://learn.zone01oujda.ma${details.subject}`}
				{Title}
			/>
		{/if}
	</section>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 20px;

		.overview {
			display: flex;
			gap: 10px;
		}
		.forms {
			width: fit-content;
			max-width: 100%;
			margin: auto;
			.title {
				display: flex;
				gap: 10px;
			}
		}
	}
</style>
