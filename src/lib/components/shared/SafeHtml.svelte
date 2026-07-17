<script lang="ts">
	import DOMPurify from 'dompurify';

	type Props = { html: string; tag?: keyof HTMLElementTagNameMap };
	const { html, tag = 'div' }: Props = $props();

	function render(node: HTMLElement, value: string) {
		node.innerHTML = DOMPurify.sanitize(value);
		return {
			update(newValue: string) {
				node.innerHTML = DOMPurify.sanitize(newValue);
			}
		};
	}
</script>

<svelte:element this={tag} use:render={html}></svelte:element>
