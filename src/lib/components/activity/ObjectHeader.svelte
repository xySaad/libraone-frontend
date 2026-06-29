<script lang="ts">
	import CodeIcon from '$lib/assets/svg/code.svelte';
	import FolderData from '$lib/assets/svg/folder-data.svelte';
	import Location from '$lib/assets/svg/location.svelte';
	import PiscineIcon from '$lib/assets/svg/piscine.svelte';
	import ProfileIcon from '$lib/assets/svg/profile.svelte';
	import QuestionMark from '$lib/assets/svg/question-mark.svelte';
	import type { Component } from 'svelte';
	import CardHeader from '../Card/CardHeader.svelte';
	import Icon from '../shared/Icon.svelte';

	const TYPE_ICONS: { [k: string]: Component } = {
		INTERVIEW: ProfileIcon,
		MODULE: CodeIcon,
		PISCINE: PiscineIcon,
		PROJECT: FolderData
	};

	interface Props {
		type: string;
		name?: string | null | undefined;
		campus?: string | null | undefined;
	}
	const { type, name, campus }: Props = $props();

	const getTypeIcon = (type: string) => {
		return TYPE_ICONS[type.toUpperCase()] ?? QuestionMark;
	};
	const TypeIcon = $derived(getTypeIcon(type));
</script>

<CardHeader tooltip={type} title={name ?? '-'}>
	{#snippet icon()}
		<Icon><TypeIcon /></Icon>
	{/snippet}

	{#snippet BadgeCampus()}
		<Location />
		{campus}
	{/snippet}
</CardHeader>
