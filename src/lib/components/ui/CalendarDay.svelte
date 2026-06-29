<script lang="ts">
	interface Props {
		month: string;
		day: number;
		type: 'expired' | 'live' | 'upcoming';
	}

	const { month, day, type }: Props = $props();
</script>

<div class="date-block" data-type={type}>
	<span class="month">{month}</span>
	<span class="day">{day}</span>
</div>

<style>
	.date-block {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		padding: 6px 4px;
		gap: 2px;
		border: 1px solid;
		border-radius: var(--icon-radius);

		.month {
			font-size: 0.55rem;
			font-weight: 700;
			letter-spacing: 0.1em;
			text-transform: uppercase;
		}
		.day {
			font-size: 1.25rem;
			font-weight: 700;
			line-height: 1;
			color: var(--text-title);
		}

		&[data-type='expired'] {
			background: var(--error-bg);
			border-color: var(--error-border-subtle);
			.month {
				color: var(--error);
			}
		}
		&[data-type='live'] {
			background: var(--success-bg);
			border-color: var(--success-border);
			.month {
				color: var(--success);
			}
		}
		&[data-type='upcoming'] {
			background: var(--icon-bg);
			border-color: var(--icon-border);
			.month {
				color: var(--icon-color);
			}
		}
	}
</style>
