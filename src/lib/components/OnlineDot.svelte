<div class="online-dot" data-tooltip="Online"></div>

<style>
	.online-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--live-dot);
		animation: pulse-online 2s ease-in-out infinite;
	}

	@keyframes pulse-online {
		0% {
			box-shadow:
				0 0 0 0 hsla(140, 80%, 55%, 0.55),
				0 0 12px hsla(140, 80%, 55%, 0.65);
		}
		70% {
			box-shadow:
				0 0 0 8px hsla(140, 80%, 55%, 0),
				0 0 18px hsla(140, 80%, 55%, 0.35);
		}
		100% {
			box-shadow:
				0 0 0 0 hsla(140, 80%, 55%, 0),
				0 0 12px hsla(140, 80%, 55%, 0.65);
		}
	}
</style>
