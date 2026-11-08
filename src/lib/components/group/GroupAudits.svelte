<script module lang="ts">
	import ArrowLeft from '$lib/assets/svg/arrow-left.svelte';
	import { preferences } from '$lib/stores/preferences.svelte';
	import Input from '../ui/Input.svelte';

	import ArrowRight from '$lib/assets/svg/arrow-right.svelte';
	import Clock from '$lib/assets/svg/clock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import { type AuditFragment, type GroupFragment } from '$lib/graphql/generated';
	import { formatDate } from '$lib/utils/time';
	import Button from '../ui/Button.svelte';
	import AuditResult from './AuditResult.svelte';
	import api from '$lib/api';

	const buildAuditCopyText = async (
		projectName: string,
		members: GroupFragment['members'],
		audits: AuditFragment[]
	) => {
		const membersLogin = members
			.map((m) => m.user?.login)
			.filter((login) => typeof login === 'string');
		const auditorsLogin = audits
			.map((a) => a.auditor?.login)
			.filter((login) => typeof login === 'string');

		const logins = [...auditorsLogin, ...membersLogin];
		const usersDiscord = await api.LIBRAONE.discord(logins);

		const membersMention = membersLogin
			.map((login) => usersDiscord[login])
			.map((discordId) => `<@${discordId}>`)
			.join(' ');

		const auditorsMention = auditorsLogin
			.map((login) => usersDiscord[login])
			.map((discordId) => `<@${discordId}>`)
			.join('\n');

		return [
			`Project: ${projectName}`,
			`Team Members: ${membersMention}`,
			`Available between: ${preferences.auditTime.start} - ${preferences.auditTime.end}`,
			`Auditors:`,
			auditorsMention
		].join('\n');
	};
</script>

<script lang="ts">
	interface Props {
		projectName: string;
		captainId: number | null | undefined;
		members: GroupFragment['members'];
		audits: AuditFragment[];
		createdAt: string;
		endDate?: string;
	}
	const { projectName, captainId, members, audits, createdAt, endDate }: Props = $props();
	let editTimeScreen = $state(false);
</script>

{#if editTimeScreen}
	<div class="editTimeHeader">
		<div class="back">
			<Button style="padding: 10px;" onclick={() => (editTimeScreen = false)}><ArrowLeft /></Button>
		</div>
		Available between:
	</div>
	<div class="time">
		<Input bind:value={preferences.auditTime.start} />
		<Input bind:value={preferences.auditTime.end} />
	</div>
{:else}
	<div class="audit-header">
		<Divider margin="0">
			<div data-tooltip="Created At">{formatDate(createdAt)}</div>
			{#if endDate}
				<ArrowRight />
				<div data-tooltip="End At">{formatDate(endDate)}</div>
			{/if}
		</Divider>
		<div class="actions">
			<span> <CopyButton text={() => buildAuditCopyText(projectName, members, audits)} /></span>
			<span>
				<Button style="padding: 10px;" onclick={() => (editTimeScreen = true)}><Clock /></Button>
			</span>
		</div>
	</div>
	{#each audits as audit, i (i)}
		<AuditResult {audit} {captainId} />
	{/each}
{/if}

<style>
	.editTimeHeader {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.time {
		display: flex;
		gap: 10px;
		align-items: center;
		width: 100%;
	}
	.audit-header {
		width: 100%;
		display: flex;
		white-space: nowrap;
		flex-wrap: wrap;
		gap: 10px;

		.actions {
			display: flex;
			gap: 10px;
			margin-left: auto;
		}
	}
</style>
