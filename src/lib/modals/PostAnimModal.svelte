<script lang="ts">
	import { getModalStore,  ProgressRadial } from '@skeletonlabs/skeleton';
	import { value, max} from '$lib/modals/PostProgressStore';
	import { onDestroy } from 'svelte';

	let progress = $state({
		value: 0,
		max: 0
	});

	value.subscribe((val) => {
		progress.value = val;
	});

	max.subscribe((val) => {
		progress.max = val;
	});

	let percentage = $derived(Math.round(progress.value / progress.max * 100));

	const modalStore = getModalStore();



	// Base Classes
	const cBase = 'relative shadow-xl flex flex-col items-center justify-center p-5 rounded-lg';

	onDestroy(() => {
		modalStore.clear();
	});
</script>

<!-- @component This example creates an embedded video modal. -->

{#if $modalStore[0]}
	<div class="{cBase} bg-surface-800">
		<h2 class="text-2xl font-bold">Applying Frames</h2>
		<p class="text-sm">Applying frame {progress.value} of {progress.max}</p>
		<ProgressRadial class="pt-5" value={percentage} strokeLinecap="round" meter="stroke-primary-500" track="stroke-primary-500/30">{percentage}%</ProgressRadial>
	</div>
{/if}