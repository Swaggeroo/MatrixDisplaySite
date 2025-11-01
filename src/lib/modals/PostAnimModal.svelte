<script lang="ts">
	import { Dialog, Progress } from '@skeletonlabs/skeleton-svelte';
	import { value, max} from '$lib/modals/PostProgressStore';
	import { PostAnimModal } from '$lib/modals/ModalController';
	import { onDestroy, onMount } from 'svelte';

	let progress = $state({
		value: 0,
		max: 0
	});

	let openState = $state(false);

	export function modalClose() {
		openState = false;
	}

	export function modalOpen() {
		openState = true;
	}

	onMount(() => {
		PostAnimModal.set({ modalOpen, modalClose });
	});

	onDestroy(() => {
		PostAnimModal.set(null);
	});

	value.subscribe((val) => {
		progress.value = val;
	});

	max.subscribe((val) => {
		progress.max = val;
	});

	let percentage = $derived(Math.round(progress.value / progress.max * 100));

	// Base Classes
	const cBase = 'card bg-surface-100-900 p-5 space-y-4 shadow-xl max-w-screen-sm flex flex-col items-center justify-center rounded';
</script>

<!-- @component This example creates an embedded video modal. -->
<Dialog
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	contentBase="{cBase} bg-surface-800"
>
	{#snippet content()}
		<h2 class="text-2xl font-bold">Applying Frames</h2>
		<p class="text-sm">Applying frame {progress.value} of {progress.max}</p>
		<Progress size="size-40" value={percentage} strokeLinecap="round" meterStroke="stroke-primary-500" trackStroke="stroke-primary-500/30" showLabel />
	{/snippet}
</Dialog>