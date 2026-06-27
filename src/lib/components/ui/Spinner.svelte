<script lang="ts">
	interface Props {
		size?: string;
	}

	const { size = '40px' }: Props = $props();
</script>

<span class="spinner" aria-hidden="true" style="width: {size}; height: {size};"></span>

<style>
	.spinner {
		display: inline-block;
		flex-shrink: 0;
		border-radius: 50%;
		border: 2px solid var(--spinner-track);
		border-top-color: var(--text-primary);
		animation: spin 0.6s linear infinite;
	}
</style>
