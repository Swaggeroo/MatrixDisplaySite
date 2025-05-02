<script lang="ts">
	import ImagePreview from '$lib/ImagePreview.svelte';
	import { onMount } from 'svelte';
	import { toaster } from '$lib/toaster-svelte';
	import { applyImage } from '$lib/RestFunctions';
	import { env } from '$env/dynamic/public'
	import { UploadPicModal as UploadPicModalController } from '$lib/modals/ModalController';

	// Modals
	import PostAnimModal from '$lib/modals/PostAnimModal.svelte'
	import UploadPicModal from '$lib/modals/UploadPicModal.svelte'
	import SettingsModal from '$lib/modals/SettingsModal.svelte';

	let imageIds: string[] = $state([]);
	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	async function loadImageIDs() {
		try {
			const response = await fetch(`${apiURL}/api`);
			imageIds = await response.json();
		} catch {
			toaster.create({
				title: 'Failed to load images.',
				type: 'error',
				duration: 5000,
			});
		}
	}

	function handleFabUploadClick() {
		UploadPicModalController.subscribe(controller => {
			if (controller) controller.modalOpen(loadImageIDs);
		})();
	}

	async function handleFabRandomClick() {
		try {
			const response = await fetch(`${apiURL}/api/random`);
			applyImage(await response.text());
		} catch {
			toaster.create({
				title: 'Failed to load random image.',
				type: 'error',
				duration: 5000,
			});
			UploadPicModalController.subscribe(controller => {
				if (controller) controller.modalClose();
			})();
		}
	}

	onMount(() => {
		loadImageIDs();
	});
</script>

<style>
    .fabRight {
        position: fixed;
        right: 16px;
        bottom: 16px;
    }

	.fabLeft {
				position: fixed;
				left: 16px;
				bottom: 16px;
		}
</style>

<UploadPicModal />
<SettingsModal />
<PostAnimModal />

<section class="flex flex-row justify-around w-full p-5 flex-wrap">
	{#each imageIds as imageId (imageId)}
		<ImagePreview imageId={imageId} reloadIDs={loadImageIDs} />
	{/each}
</section>

<button class="fabRight btn-icon preset-filled-primary-500 w-16 h-16 text-5xl rounded-full" onclick={handleFabUploadClick}>+</button>
<button class="fabLeft btn-icon preset-filled-secondary-500 w-16 h-16 text-3xl rounded-full" onclick={handleFabRandomClick}>🍀</button>