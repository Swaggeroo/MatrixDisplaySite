<script lang="ts">
	import ImagePreview from '$lib/ImagePreview.svelte';
	import { onMount } from 'svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { applyImage } from '$lib/RestFunctions';

	let imageIds: string[] = [];

	function loadImageIDs() {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				const data = JSON.parse(xhr.responseText);
				imageIds = data;
			}
		};
		xhr.open('GET', 'http://localhost:3000/api', true);
		xhr.send();
	}

	function handleFabUploadClick() {
		modalStore.trigger(uploadModal);
	}

	function handleFabRandomClick() {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				console.log(xhr.responseText);
				applyImage(xhr.responseText, modalStore);
			}
		};
		xhr.open('GET', 'http://localhost:3000/api/random', true);
		xhr.send();
	}

	const modalStore = getModalStore();
	const uploadModal: ModalSettings = {
		type: 'component',
		component: 'uploadPicModal',
		meta: {
			reloadIDs: loadImageIDs
		}
	};

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

<section class="flex flex-row justify-around w-full p-5 flex-wrap">
	{#each imageIds as imageId (imageId)}
		<ImagePreview imageId={imageId} reloadIDs={loadImageIDs} />
	{/each}
</section>

<button class="fabRight btn-icon variant-filled-primary w-16 h-16 text-5xl" on:click={handleFabUploadClick}>+</button>
<button class="fabLeft btn-icon variant-filled-secondary w-16 h-16 text-3xl" on:click={handleFabRandomClick}>🍀</button>