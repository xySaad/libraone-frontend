<script lang="ts">
	import api from '$lib/api';
	import CompareArrows from '$lib/assets/svg/compare-arrows.svelte';
	import Markdown from '$lib/components/ui/Markdown/Markdown.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import { ObjectAttrsSchema } from '$lib/types/object/attrs';
	import ObjectOverview from './ObjectOverview.svelte';
	import Validation from './validation/Validation.svelte';
	interface Props {
		name: string;
		path: string;
	}
	const { path, name }: Props = $props();
	let isValidationVisible = $state(false);

	const getObjectAttrs = async (path: string) => {
		const attrs = await api.LIBRAONE.object(path);
		return ObjectAttrsSchema.parse(attrs);
	};
</script>

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

<Suspend data={getObjectAttrs(path)}>
	{#snippet children(attrs)}
		{@const details = attrs.attrs}
		<article>
			<ObjectOverview {attrs} />
			<section class="validation">
				{#if isValidationVisible}
					{#each details.validations as validation (validation)}
						<Validation {validation} fileName="{name}-audit.md" {Title} />
					{/each}
				{:else}
					<Markdown
						fileName="{name}.md"
						src={{ url: `https://learn.zone01oujda.ma${details.subject}` }}
						{Title}
					/>
				{/if}
			</section>
		</article>
	{/snippet}
</Suspend>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 20px;

		.validation {
			width: 100%;
			margin: auto;

			.title {
				display: flex;
				gap: 10px;
			}
		}
	}
</style>
