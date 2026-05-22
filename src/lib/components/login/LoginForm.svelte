<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Icon from '../shared/Icon.svelte';
	import Wordmark from '../shared/Wordmark.svelte';
	import { FetchError } from '$lib/api/fetch';

	interface Props {
		title?: string;
		submitLabel?: string;
		loadingLabel?: string;
		/** Should throw with a user-facing message on failure (e.g. 'Invalid credentials') */
		onsubmit?: (data: { username: string; password: string }) => void | Promise<void>;
		icon?: Snippet;
		titleColor?: string;
	}

	const {
		icon,
		title = 'Sign in',
		submitLabel = 'Sign in',
		loadingLabel = 'Signing in…',
		onsubmit,
		titleColor
	}: Props = $props();

	let username = $state('');
	let password = $state('');
	let usernameError = $state('');
	let passwordError = $state('');
	let error = $state('');

	function validate() {
		usernameError = username.trim() ? '' : 'Email or username is required';
		passwordError = password ? '' : 'Password is required';
		return !usernameError && !passwordError;
	}

	async function handleSubmit() {
		if (!validate()) return;
		try {
			await onsubmit?.({ username: username.trim(), password });
		} catch (er) {
			if (er instanceof FetchError) {
				error = er.cause?.error ?? er.cause?.detail;
			} else if (er instanceof Error) {
				error = er.message;
			} else {
				error = String(er);
			}
		}
	}
</script>

<Card padding="lg" maxWidth="420px">
	<Form novalidate onsubmit={handleSubmit} {loadingLabel}>
		<Wordmark color={titleColor}>
			{#if icon}
				<Icon>{@render icon()}</Icon>
			{/if}
			{title}
		</Wordmark>

		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}

		<div class="fields">
			<Input
				name="username"
				label="Email or username"
				type="email"
				placeholder="you@example.com"
				bind:value={username}
				error={usernameError}
			/>
			<Input
				name="password"
				label="Password"
				type="password"
				placeholder="••••••••"
				bind:value={password}
				error={passwordError}
			/>
		</div>

		{#snippet button()}
			{submitLabel}
		{/snippet}
	</Form>
</Card>

<style>
	.fields {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.error {
		font-size: 0.8rem;
		color: var(--error);
		background: var(--error-bg);
		border: 1px solid var(--error-border-subtle);
		border-radius: 8px;
		padding: 0.625rem 0.75rem;
		margin: 0;
	}
</style>
