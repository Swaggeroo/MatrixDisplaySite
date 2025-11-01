<script lang="ts">
	import { Dialog, Progress, Portal } from '@skeletonlabs/skeleton-svelte';
	import { value, max } from '$lib/modals/PostProgressStore';
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

	let percentage = $derived(Math.round((progress.value / progress.max) * 100));

	// Base Classes
	const cBase =
		'card bg-surface-100-900 p-5 space-y-4 shadow-xl max-w-screen-sm flex flex-col items-center justify-center rounded';
</script>

<!-- @component This example creates an embedded video modal. -->
<Dialog open={openState} onOpenChange={(e) => (openState = e.open)}>
	<Portal>
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
			<Dialog.Content class="{cBase} bg-surface-800">
				<h2 class="text-2xl font-bold">Applying Frames</h2>
				<p class="text-sm">Applying frame {progress.value} of {progress.max}</p>
				<Progress class="size-40 w-fit" value={percentage}>
					<Progress.Circle>
						<Progress.CircleTrack class="stroke-primary-500/30" />
						<Progress.CircleRange class="stroke-primary-500" />
					</Progress.Circle>
					<Progress.ValueText />
				</Progress>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
