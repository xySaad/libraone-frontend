<script lang="ts">
	interface Props {
		src?: string | null;
		alt?: string | null;
		headers: Record<string, string>;
	}

	const { src, alt, headers }: Props = $props();

	const getImageUrl = async () => {
		console.log(headers);

		const resp = await fetch(src, { headers });
		const url = URL.createObjectURL(await resp.blob());
		return url;
	};
</script>

{#await getImageUrl()}
	<!--  -->
{:then url}
	<img src={url} {alt} />
{/await}

<style>
	img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}
</style>
