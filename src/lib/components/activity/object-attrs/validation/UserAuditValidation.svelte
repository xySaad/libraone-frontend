<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import { Client } from '$lib/graphql/client';
	import { GetValidationMarkdownsDocument } from '$lib/graphql/generated';
	import type { UserAuditValidation } from '$lib/types/object/attrs/validation';
	import type { Snippet } from 'svelte';

	interface Props {
		validation: UserAuditValidation;
		fileName: string;
		Title: Snippet;
	}
	const { validation, fileName, Title }: Props = $props();

	const generateMarkdownData = async (validation: UserAuditValidation) => {
		const { form, preQuestions, postQuestions } = validation;
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

<Suspend data={generateMarkdownData(validation)}>
	{#snippet children(markdown)}
		<Markdown {fileName} raw={markdown} {Title} />
	{/snippet}
</Suspend>
