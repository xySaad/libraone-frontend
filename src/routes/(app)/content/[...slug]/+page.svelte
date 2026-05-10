<script lang="ts">
	import { Tabs } from 'bits-ui';
	import Markdown from '$lib/components/Markdown.svelte';
	import { GetEvent } from '$lib/utils/events';
	import { page } from '$app/state';

	const event = $derived(GetEvent(page.params.slug || ''));
	const content = $derived(event?.attrs);

	type ChecklistItem = {
		id: number;
		label: string;
		checked: boolean;
	};

	type AuditChecklist = {
		id: number;
		items: ChecklistItem[];
	};

	const auditSource = $derived.by(async () => {
		const validations = content?.validations ?? [];

		if (validations.length === 0) return [] as AuditChecklist[];

		return Promise.all(
			validations.map(async (validation, id) => {
				if (!validation.form) {
					return { id, items: [] } satisfies AuditChecklist;
				}

				const response = await fetch(`https://learn.zone01oujda.ma${validation.form}`);
				const markdown = await response.text();

				return {
					id,
					items: markdown
						.split('\n')
						.map((line, itemId) => ({
							id: itemId,
							label: line.trim().replace(/^[-*+]\s+/, '').replace(/^#+\s+/, ''),
							checked: false
						}))
						.filter((item) => item.label.length > 0)
				} satisfies AuditChecklist;
			})
		);
	});
</script>

{#if content}
	<section class="markdown-body">
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
						<Markdown url={`https://learn.zone01oujda.ma${content.subject}`} />
					</div>
				</Tabs.Content>
			{/if}

			{#if content.validations}
				<Tabs.Content value="audit">
					<div class="scroll">
						{#await auditSource}
							<p>Loading audit checklist...</p>
						{:then items}
							{#each items as validationChecklist (validationChecklist.id)}
								<div class="audit-group">
									{#each validationChecklist.items as item (item.id)}
										<label class="audit-item">
											<input type="checkbox" bind:checked={item.checked} />
											<span>{item.label}</span>
										</label>
									{/each}
								</div>
							{/each}
						{:catch}
							<p>Failed to load audit checklist.</p>
						{/await}
					</div>
				</Tabs.Content>
			{/if}
		</Tabs.Root>
	</section>
{/if}

<style>
	.scroll {
		max-height: 70vh;
		overflow-y: auto;
	}

	.audit-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 16px;
	}

	.audit-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 12px;
		border: 1px solid var(--bg-3);
		border-radius: 8px;
		background: var(--bg-2);
		transition: background-color 0.2s ease;
	}

	.audit-item:has(input[type='checkbox']:checked) {
		background-color: #2563eb;
	}

	.audit-item input[type='checkbox'] {
		accent-color: #2563eb;
	}

	.audit-item span {
		line-height: 1.4;
		word-break: break-word;
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
