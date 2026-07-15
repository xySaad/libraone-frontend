<script lang="ts" generics="T extends Record<string, unknown>">
	import MoreVert from '$lib/assets/svg/more-vert.svelte';
	import RuleSettings from '$lib/assets/svg/rule-settings.svelte';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import DOMPurify from 'dompurify';
	import 'github-markdown-css/github-markdown.css';
	import type { Snippet } from 'svelte';
	import CopyButton from './CopyButton.svelte';
	import Button from './ui/Button.svelte';
	import DownloadButton from './ui/DownloadButton.svelte';
	import Input from './ui/Input.svelte';
	import PopoverMenu from './ui/PopoverMenu.svelte';
	import VisibilityToggle from './ui/VisibilityToggle.svelte';

	type Props = {
		fileName?: string;
		Title?: Snippet;
	} & ({ raw: string; url?: never } | { raw?: never; url: string });

	type OptionKey = Exclude<keyof T, keyof Props>;
	type Options = Record<OptionKey, Snippet> & T;
	const { raw, url: inputURL, fileName, Title, ...options }: Props & Options = $props();

	const url = $derived(inputURL ?? URL.createObjectURL(new Blob([raw])));
	const fetchMarkdown = async (url: string) => {
		const resp = await fetch(url);
		const text = await resp.text();
		return DOMPurify.sanitize(text);
	};

	const markdown = $derived(raw ?? fetchMarkdown(url));
	let maxWidth = $state(100);
	let isRangeResize = $state(true);
</script>

<section>
	<div class="title">
		{@render Title?.()}
		<div class="menu">
			<PopoverMenu {...options}>
				{#snippet Icon()}
					<MoreVert />
				{/snippet}
				{#snippet Download()}
					<DownloadButton {url} {fileName} />
				{/snippet}
				{#snippet Copy()}
					{#await markdown then source}
						<CopyButton text={source} />
					{/await}
				{/snippet}
				{#snippet Resize()}
					<div class="resize">
						<VisibilityToggle isFirstVisible={!isRangeResize}>
							{#snippet first()}
								<div class="flex" style:gap="5px">
									<Button style="flex:1" onclick={() => maxWidth > 1 && maxWidth--}>-</Button>
									<Button style="flex:1" onclick={() => maxWidth < 100 && maxWidth++}>+</Button>
								</div>
							{/snippet}
							{#snippet second()}
								<div class="range">
									<input type="range" min="1" max="100" bind:value={maxWidth} />
								</div>
							{/snippet}
						</VisibilityToggle>

						<Input size={3} type="number" bind:value={maxWidth} />
						<Button style="flex:1" onclick={() => (isRangeResize = !isRangeResize)}>
							<RuleSettings />
						</Button>
					</div>
				{/snippet}
			</PopoverMenu>
		</div>
	</div>

	<div class="markdown-body" style:max-width="{maxWidth}%">
		{#await markdown}
			Loading markdown...
		{:then source}
			<SvelteMarkdown {source} />
		{:catch}
			Failed to load markdown.
		{/await}
	</div>
</section>

<style>
	section {
		border-radius: 10px;

		.title {
			display: flex;
			align-items: center;
			padding: 0 10px;
			.menu {
				width: fit-content;
				margin-left: auto;

				.resize {
					align-items: end;
					display: flex;
					gap: 10px;
					color: var(--text-primary);

					.range {
						display: flex;
						align-items: center;
						height: 100%;

						input {
							width: 100%;
						}
					}
				}
			}
		}
		.markdown-body {
			padding: 20px;
			border-radius: 10px;
			margin: auto;
			transition: max-width 0.1s ease-out;
		}
	}
</style>
