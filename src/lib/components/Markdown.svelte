<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import 'github-markdown-css/github-markdown.css';
	import DOMPurify from 'dompurify';
	import CopyButton from './CopyButton.svelte';
	import DownloadButton from './ui/DownloadButton.svelte';
	import FlexContainer from './ui/Flex/FlexContainer.svelte';
	import FlexItem from './ui/Flex/FlexItem.svelte';

	interface Props {
		url: string;
		fileName?: string;
	}
	const { url, fileName }: Props = $props();

	const fetchMarkdown = async (url: string) => {
		const resp = await fetch(url);
		const text = await resp.text();
		return DOMPurify.sanitize(text);
	};

	const markdown = $derived(fetchMarkdown(url));
</script>

{#await markdown}
	Loading markdown...
{:then source}
	<FlexContainer minWidth={150} gap="5px">
		<FlexItem><DownloadButton {url} {fileName} /></FlexItem>
		<FlexItem><CopyButton text={source} /></FlexItem>
	</FlexContainer>
	<SvelteMarkdown {source} />
{:catch}
	Failed to load markdown.
{/await}
