<script lang="ts">
	import intra from '$lib/assets/intra.png';
	import Gitea from '$lib/assets/svg/gitea.svelte';
	import Profile from '$lib/assets/svg/profile.svelte';
	import LoginAnchor from '$lib/components/login/LoginAnchor.svelte';
	import Divider from '$lib/components/shared/Divider.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Card from '$lib/components/ui/Card.svelte';
</script>

<div class="login-root">
	<div class="orb orb-1" aria-hidden="true"></div>
	<div class="orb orb-2" aria-hidden="true"></div>

	<div class="grid-overlay" aria-hidden="true"></div>
	<Card maxWidth="600px">
		<Wordmark>Login</Wordmark>
		<LoginAnchor disabled type="gitea" subtitle="Login via OAuth">
			<Gitea />
		</LoginAnchor>

		<Divider>Link Accounts</Divider>

		<LoginAnchor type="intra" subtitle="Link your Intra account">
			<img src={intra} alt="intra" />
		</LoginAnchor>

		<LoginAnchor type="profile" subtitle="Link your Profile account">
			<Profile />
		</LoginAnchor>
	</Card>
</div>

<style>
	.login-root {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		pointer-events: none;
	}
	.orb-1 {
		width: 520px;
		height: 520px;
		top: -140px;
		right: -160px;
		background: radial-gradient(circle, hsla(38, 70%, 40%, 0.14) 0%, transparent 70%);
	}
	.orb-2 {
		width: 480px;
		height: 480px;
		bottom: -120px;
		left: -140px;
		background: radial-gradient(circle, hsla(210, 80%, 45%, 0.12) 0%, transparent 70%);
	}

	.grid-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(hsla(215, 40%, 70%, 0.025) 1px, transparent 1px),
			linear-gradient(90deg, hsla(215, 40%, 70%, 0.025) 1px, transparent 1px);
		background-size: 48px 48px;
		mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
	}
</style>
