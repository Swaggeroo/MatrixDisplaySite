<script lang="ts">
	import { onMount } from 'svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { applyImage } from '$lib/RestFunctions';
	import { env } from '$env/dynamic/public';

	// Props
	

	const toastStore = getToastStore();
	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	interface Props {
		/** Exposes parent props to this component. */
		reloadIDs: Function;
		imageId: string;
	}

	let { reloadIDs, imageId }: Props = $props();
	let imageUri = $state('');
	let imageName = $state('');
	let isLoaded = $state(false);

	function loadImage() {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				const data = JSON.parse(xhr.responseText);
				imageUri = data.url;
				imageName = data.name;
				let img=new Image();
				img.src=imageUri;
				img.onload = () => {
					isLoaded = true;
				}
			}
		};
		xhr.onerror = function() {
			toastStore.trigger({
				message: 'Failed to load image.',
				timeout: 5000,
				hoverable: true,
				background: 'variant-filled-warning'
			});
		};
		xhr.open('GET', `${apiURL}/api/picture/${imageId}`, true);
		xhr.send();
	}

	function deleteImage() {
		isLoaded = false;
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				console.log(xhr.responseText);
				reloadIDs();
			}
		};
		xhr.onerror = function() {
			toastStore.trigger({
				message: 'Failed to delete image.',
				timeout: 5000,
				hoverable: true,
				background: 'variant-filled-warning'
			});
		};
		xhr.open('DELETE', `${apiURL}/api/picture/${imageId}`, true);
		xhr.send();
	}

	const modalStore = getModalStore();

	onMount(() => {
		loadImage();
	});
</script>

<style>
	.pixelArt {
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
	}
</style>

{#if isLoaded}
	<div class="card card-hover p-1 h-auto max-w-full m-4">
		<header class="card-header flex justify-between">
			<h2 class="text-xl font-bold self-center">
				{imageName}
			</h2>
			<button
				type="button"
				class="btn-icon variant-filled-error w-10 h-10"
				onclick={() => {
					if (confirm('Are you sure you want to delete '+imageName+'?')){
						deleteImage();
					}
				}}
			>
				💣
			</button>
		</header>


		<section class="p-4">
			<img class="h-72 w-72 rounded-lg pixelArt" src="{imageUri}" alt="">
		</section>

		<footer class="card-footer">
			<button
				type="button"
				class="btn variant-filled-success p-2 rounded-lg w-72 h-10"
				onclick={() => {
					applyImage(imageId, modalStore, toastStore);
				}}
			>
				Apply
			</button>
		</footer>
	</div>
{:else}
	<div class="card card-hover p-1 h-auto max-w-full m-4">
		<header class="card-header flex justify-between">
			<h2 class="text-xl font-bold self-center placeholder animate-pulse w-52 h-7">

			</h2>
			<button
				type="button"
				class="placeholder btn-icon w-10 h-10 animate-pulse rounded-full"
			>
			</button>
		</header>
		<section class="p-4">
			<div class="placeholder animate-pulse h-72 w-72 rounded-lg"></div>
		</section>
		<footer class="card-footer">
			<button
				type="button"
				class="placeholder animate-pulse btn p-2 rounded-lg w-72 h-10"
				disabled
			></button>
		</footer>
	</div>
{/if}