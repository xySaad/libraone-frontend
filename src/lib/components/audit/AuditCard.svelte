<script lang="ts">
	import Clock from '$lib/assets/svg/clock.svelte';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import { formatDate, timeRemaining } from '$lib/utils/time';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import type { GetAssignedAuditsQuery } from '$lib/graphql/generated';

	type Props = {
		name: string;
		endAt: string | null;
		code: string | null;
		captainLogin: string | null;
		members: GetAssignedAuditsQuery['audit'][number]['group']['members'];
	};

	let { name, endAt, code, captainLogin, members }: Props = $props();

	let now = $state(Date.now());
	let showCode = $state(false);

	// Tick every minute while panel is open
	$effect(() => {
		if (!open) return;
		const id = setInterval(() => (now = Date.now()), 60_000);
		return () => clearInterval(id);
	});
	let { label: remainingLabel, urgency } = $derived(timeRemaining(now, endAt));
</script>

<li class="audit-card" data-urgency={urgency}>
	<!-- Project name + countdown -->
	<div class="audit-top">
		<span class="audit-name" title={name}>{name}</span>
		<span
			class="countdown"
			data-urgency={urgency}
			data-tooltip={formatDate(endAt ?? '')}
			data-tooltip-pos="down"
		>
			{#if urgency !== 'overdue'}
				<Clock />
			{/if}
			{remainingLabel}
		</span>
	</div>

	<!-- Members as avatars -->
	{#if members.length > 0}
		<div class="members-row">
			<div class="avatar-stack">
				{#each members.slice(0, 5) as member (member.user?.id)}
					<div
						class="avatar-chip"
						class:is-captain={member.user?.login === captainLogin}
						data-tooltip={member.user?.login === captainLogin
							? `${member.user?.login} (captain)`
							: member.user?.login}
						data-tooltip-pos="right"
					>
						<UserAvatar avatarUrl={member.user?.avatarUrl} userLogin={member.user?.login} />
					</div>
				{/each}
				{#if members.length > 5}
					<div class="avatar-chip avatar-overflow">+{members.length - 5}</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Actions -->
	{#if code}
		<div class="actions">
			<CopyButton text={code} label="Copy code" aria-label="Copy audit code" />
			<button
				class="toggle-btn"
				onclick={() => (showCode = !showCode)}
				aria-label={showCode ? 'Hide code' : 'Show code'}
				data-tooltip={showCode ? 'Hide code' : 'Show code'}
				data-tooltip-pos="right"
			>
				{#if showCode}
					<!-- Eye-off icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
						/>
						<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
						<line x1="1" y1="1" x2="23" y2="23" />
					</svg>
				{:else}
					<!-- Eye icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
						<circle cx="12" cy="12" r="3" />
					</svg>
				{/if}
			</button>
			{#if showCode}
				<span class="code-display">{code}</span>
			{/if}
		</div>
	{/if}
</li>

<style>
	.audit-card {
		padding: 11px 13px;
		border-radius: 10px;
		border: 1px solid hsl(213, 40%, 16%);
		background: hsl(213, 55%, 9%);
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.audit-card:hover {
		background: hsl(213, 55%, 11%);
		border-color: hsl(213, 40%, 22%);
	}

	.audit-card[data-urgency='overdue'] {
		border-color: hsla(0, 60%, 40%, 0.3);
		background: hsla(0, 50%, 8%, 0.7);
	}

	.audit-card[data-urgency='critical'] {
		border-color: hsla(0, 60%, 45%, 0.2);
		background: hsla(0, 40%, 8%, 0.5);
	}

	.audit-card[data-urgency='soon'] {
		border-color: hsla(38, 70%, 45%, 0.25);
		background: hsla(38, 50%, 7%, 0.6);
	}

	.audit-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.audit-name {
		font-size: 0.85rem;
		font-weight: 600;
		color: hsl(210, 20%, 88%);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.countdown {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 2px 8px;
		border-radius: 999px;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
		background: hsla(213, 40%, 16%, 0.8);
		color: hsl(215, 15%, 55%);
		border: 1px solid hsla(215, 40%, 70%, 0.08);

		&[data-urgency='soon'] {
			background: hsla(38, 70%, 12%, 0.8);
			color: hsl(38, 80%, 62%);
			border-color: hsla(38, 60%, 40%, 0.2);
		}

		&[data-urgency='critical'] {
			background: hsla(0, 70%, 12%, 0.8);
			color: hsl(0, 80%, 68%);
			border-color: hsla(0, 60%, 40%, 0.25);
			animation: pulse-critical 1.5s ease infinite;
		}

		&[data-urgency='overdue'] {
			background: hsla(0, 70%, 14%, 0.8);
			color: hsl(0, 75%, 65%);
			border-color: hsla(0, 60%, 40%, 0.25);
		}
	}

	@keyframes pulse-critical {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.65;
		}
	}

	.members-row {
		display: flex;
		align-items: center;
	}

	.avatar-stack {
		display: flex;
		flex-direction: row-reverse;
	}

	.avatar-chip {
		width: 28px;
		height: 28px;
		margin-left: -6px;
		flex-shrink: 0;
		border-radius: 50%;
		position: relative;

		:global(button) {
			width: 100%;
			height: 100%;
			padding: 0;
			background: none;
			border: none;
		}

		:global(img),
		:global(svg) {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 50%;
			border: 2px solid hsl(213, 55%, 9%);
		}

		&.is-captain :global(img),
		&.is-captain :global(svg) {
			border-color: hsl(45, 80%, 50%);
		}
	}

	.avatar-chip:last-child {
		margin-left: 0;
	}

	.avatar-overflow {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 9px;
		font-weight: 700;
		color: hsl(215, 15%, 55%);
		background: hsl(213, 40%, 14%);
		border: 2px solid hsl(213, 55%, 9%);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.toggle-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		padding: 0;
		border-radius: 6px;
		border: 1px solid hsla(215, 40%, 70%, 0.08);
		background: hsla(213, 40%, 16%, 0.8);
		color: hsl(215, 15%, 55%);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;

		&:hover {
			background: hsl(213, 40%, 20%);
			color: hsl(215, 20%, 75%);
			border-color: hsla(215, 40%, 70%, 0.15);
		}

		&:active {
			background: hsl(213, 40%, 18%);
		}
	}

	.code-display {
		font-family: ui-monospace, 'Cascadia Code', 'SF Mono', monospace;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: hsl(210, 20%, 80%);
		background: hsla(213, 40%, 14%, 0.9);
		border: 1px solid hsla(215, 40%, 70%, 0.1);
		border-radius: 5px;
		padding: 2px 7px;
		user-select: all;
	}
</style>
