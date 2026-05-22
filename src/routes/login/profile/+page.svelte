<script lang="ts">
	import { api } from '$lib/api';
	import Profile from '$lib/assets/svg/profile.svelte';
	import LoginForm from '$lib/components/login/LoginForm.svelte';
	import { profileUserState } from '$lib/stores/user.svelte';

	const handleSubmit = async ({ username, password }: { username: string; password: string }) => {
		const creds = await api.PROFILE.login({ username, password });
		$profileUserState = creds;
		history.back();
	};
</script>

<article>
	<LoginForm title="Profile" onsubmit={handleSubmit}>
		{#snippet icon()}
			<Profile />
		{/snippet}
	</LoginForm>
</article>

<style>
	article {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
</style>
