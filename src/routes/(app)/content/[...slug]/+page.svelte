<script lang="ts">
	import { Tabs } from 'bits-ui';
	import Markdown from '$lib/components/Markdown.svelte';
	import type { PageProps } from './$types';
	import { findByPath } from '$lib/stores/objects.svelte';

	const { params }: PageProps = $props();
	const projectPromise = $derived(findByPath('/' + params.slug));

	function formatXP(xp?: number): string {
		if (!xp) return 'N/A';
		if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)} MB`;
		if (xp >= 1000) return `${(xp / 1000).toFixed(1)} kB`;
		return `${xp} B`;
	}

	function formatMembers(min?: number, max?: number): string {
		if (min === null && max === null) return 'Any size';
		if (min === 1 && max === 1) return 'Solo';
		if (min === 1 && max !== null) return `1-${max} members`;
		if (max === null || min === max) return `${min} members`;
		return `${min}-${max} members`;
	}

	async function downloadFile(url: string, filename: string) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Network response was not ok');
			
			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			
			// Cleanup
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Failed to download file via fetch, falling back to new tab:', error);
			window.open(url, '_blank');
		}
	}
</script>

{#await projectPromise}
	...loading
{:then project}
	{#if project}
		{@const content = project.attrs}
		{@const { baseXp, groupMax, groupMin } = project.attrs}
		<section class="markdown-body">
			<div class="project-meta">
				<div class="meta-badge xp-badge">
					<span class="meta-icon">⚡</span>
					<div class="meta-text">
						<span class="meta-label">XP Reward</span>
						<span class="meta-value">{formatXP(baseXp)}</span>
					</div>
				</div>
				<div class="meta-badge members-badge">
					<span class="meta-icon">👥</span>
					<div class="meta-text">
						<span class="meta-label">Team Size</span>
						<span class="meta-value">{formatMembers(groupMin, groupMax)}</span>
					</div>
				</div>
			</div>

			<Tabs.Root value={content.subject ? 'subject' : 'audit'} class="tabs">
				<Tabs.List class="tablist">
					{#if content.subject}
						<Tabs.Trigger class="tab" value="subject">Subject</Tabs.Trigger>
					{/if}
					{#if (content.validations?.length ?? 0) > 0}
						<Tabs.Trigger class="tab" value="audit">Audit</Tabs.Trigger>
					{/if}
				</Tabs.List>

				{#if content.subject}
					<Tabs.Content value="subject">
						<div class="scroll">
							<div class="content-actions">
								<button 
									class="download-btn" 
									onclick={() => downloadFile(`https://learn.zone01oujda.ma${content.subject}`, 'subject.md')}
								>
									<span class="meta-icon" style="font-size: 1.1rem;">⬇️</span> Download Subject
								</button>
							</div>
							<Markdown url={`https://learn.zone01oujda.ma${content.subject}`} />
						</div>
					</Tabs.Content>
				{/if}

				{#if content.validations}
					<Tabs.Content value="audit">
						<div class="scroll">
							{#each content.validations as validation, index (index)}
								{#if validation.form}
									<div class="content-actions">
										<button 
											class="download-btn" 
											onclick={() => downloadFile(`https://learn.zone01oujda.ma${validation.form}`, `audit_${index + 1}.md`)}
										>
											<span class="meta-icon" style="font-size: 1.1rem;">⬇️</span> Download Audit {index + 1}
										</button>
									</div>
									<Markdown url={`https://learn.zone01oujda.ma${validation.form}`} />
								{/if}
								{#if validation.testImage}
									<div class="test-image-link">
										Test Image:
										<a href="https://{validation.testImage}" rel="external">
											{validation.testImage}
										</a>
									</div>
								{/if}
							{/each}
						</div>
					</Tabs.Content>
				{/if}
			</Tabs.Root>
		</section>
	{/if}
{/await}

<style>
	.scroll {
		max-height: 70vh;
		overflow-y: auto;
		padding-right: 8px; /* Added slight padding for scrollbar */
	}

	.project-meta {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin: 0 auto 16px;
		max-width: 1200px;
		padding: 0 12px;
	}

	.meta-badge {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		border-radius: 10px;
		border: 1px solid var(--bg-3, #333);
		background: var(--bg-2, #1a1a1a);
		min-width: 140px;
		transition: border-color 0.2s;

		&:hover {
			border-color: var(--secondary, #888);
		}
	}

	.meta-icon {
		font-size: 1.3rem;
		line-height: 1;
	}

	.meta-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.meta-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted, #888);
		font-weight: 500;
	}

	.meta-value {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text, #f0f0f0);
		line-height: 1.2;
	}

	/* New styles for the download button area */
	.content-actions {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 16px;
		padding-top: 8px;
	}

	.download-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border-radius: 8px;
		border: 1px solid var(--bg-3, #333);
		background: var(--bg-2, #1a1a1a);
		color: var(--text, #f0f0f0);
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.download-btn:hover {
		background: var(--bg-3, #333);
		border-color: var(--secondary, #888);
	}

	.test-image-link {
		margin-top: 16px;
		padding: 12px;
		background: var(--bg-2, #1a1a1a);
		border-radius: 8px;
	}

	section {
		border-radius: 10px;
		padding: 16px;
		width: fit-content;
		width: calc(100% - 25px);
		margin: 0 auto;
		max-width: 1200px;

		:global(.tabs) {
			padding: 10px;
		}

		:global(.tab) {
			padding: 10px 20px;
			border-radius: 8px;
			width: 100%;
			border: solid 1px;
			border-color: transparent;

			&:hover {
				background: var(--bg-3);
			}
		}

		:global(button[data-state='active']) {
			background: var(--secondary) !important;
			border-color: var(--bg-3);
		}

		:global(.tablist) {
			display: flex;
			justify-content: space-around;
			width: 100%;
			gap: 20px;
		}
	}
</style>