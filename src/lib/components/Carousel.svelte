<script lang="ts">
	import { reSize } from '$lib/actions/resize';
	import ArrowLeft from '$lib/assets/svg/arrow-left.svelte';
	import ArrowRight from '$lib/assets/svg/arrow-right.svelte';
	import type { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from 'embla-carousel';
	import useEmblaCarousel from 'embla-carousel-svelte';
	import { tick, type Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	let prevActive = $state(false);
	let nextActive = $state(false);
	let isOverflowing = $state(true);

	let emblaApi: EmblaCarouselType | null = null;
	const options: EmblaOptionsType = { dragFree: true };
	const goToPrev = () => emblaApi?.scrollPrev();
	const goToNext = () => emblaApi?.scrollNext();

	const updateStates = (embla: EmblaCarouselType) => {
		nextActive = embla.canScrollNext();
		prevActive = embla.canScrollPrev();
		isOverflowing = prevActive || nextActive;
	};

	const onInit = (event: CustomEvent<EmblaCarouselType>) => {
		const embla = event.detail;
		const syncEvents: EmblaEventType[] = ['select', 'reInit'];

		const syncButtons = (hook: 'off' | 'on') => {
			for (const ev of syncEvents) embla[hook](ev, updateStates);
		};

		//update states on init
		updateStates(embla);

		// attach listeners and cleanup
		syncButtons('on');
		embla.on('destroy', () => syncButtons('off'));
		emblaApi = embla;
	};

	const onResize = async () => {
		isOverflowing = true;
		await tick();
		emblaApi?.reInit();
	};
</script>

<div class="embla" use:reSize={onResize}>
	<button class="nav embla__prev" aria-label="Prev" onclick={goToPrev} disabled={!prevActive}>
		<ArrowLeft />
	</button>
	<div
		class="embla__viewport"
		class:no-overflow={!isOverflowing}
		use:useEmblaCarousel={{ options, plugins: [] }}
		onemblaInit={onInit}
	>
		<div class="embla__container">
			{@render children()}
		</div>
	</div>

	<button class="nav embla__next" aria-label="Next" onclick={goToNext} disabled={!nextActive}>
		<ArrowRight />
	</button>
</div>

<style>
	.embla {
		&:hover > .nav {
			visibility: visible;
		}

		.nav {
			visibility: hidden;

			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			flex-shrink: 0;
			border-radius: 50%;
			border: 1.5px solid var(--carousel-border, color-mix(in srgb, currentColor 20%, transparent));
			background: var(--carousel-nav-bg, color-mix(in srgb, currentColor 5%, transparent));
			color: inherit;
			cursor: pointer;
			transition:
				opacity 150ms ease,
				background 150ms ease,
				transform 150ms ease;
			padding: 0;

			&:disabled {
				visibility: hidden;
			}
			&:hover {
				background: var(--carousel-nav-bg-hover, color-mix(in srgb, currentColor 12%, transparent));
				transform: scale(1.08);
			}
			:global(svg) {
				width: 16px;
				height: 16px;
			}
		}
	}
</style>
