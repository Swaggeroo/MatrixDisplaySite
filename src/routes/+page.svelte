<script lang="ts">
	import ImagePreview from '$lib/ImagePreview.svelte';
	import { onMount } from 'svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { applyImage } from '$lib/RestFunctions';
	import { env } from '$env/dynamic/public'

	const toastStore = getToastStore();
	let imageIds: string[] = [];
	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	function loadImageIDs() {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				imageIds = JSON.parse(xhr.responseText);
			}
		};
		xhr.onerror = function() {
			toastStore.trigger({
				message: 'Failed to load images.',
				timeout: 5000,
				hoverable: true,
				background: 'variant-filled-error'
			});
		};
		xhr.open('GET', `${apiURL}/api`, true);
		xhr.send();
	}

	function handleFabUploadClick() {
		modalStore.trigger(uploadModal);
	}

	function handleFabRandomClick() {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					console.log(xhr.responseText);
					applyImage(xhr.responseText, modalStore, toastStore);
				}
			}
		};
		xhr.onerror = function() {
			toastStore.trigger({
				message: 'Failed to load random image.',
				timeout: 5000,
				hoverable: true,
				background: 'variant-filled-error'
			});
			modalStore.clear();
		};
		xhr.open('GET', `${apiURL}/api/random`, true);
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