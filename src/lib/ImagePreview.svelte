<script lang="ts">
	import { onMount } from 'svelte';
	import { toaster } from '$lib/toaster-svelte';
	import { applyImage } from '$lib/RestFunctions';
	import { env } from '$env/dynamic/public';

	// Props

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
			toaster.create({
				title: 'Failed to load image.',
				type: 'error',
				duration: 5000,
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
			toaster.create({
				title: 'Failed to delete image.',
				type: 'error',
				duration: 5000,
			});
		};
		xhr.open('DELETE', `${apiURL}/api/picture/${imageId}`, true);
		xhr.send();
	}

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
	<div class="card card-hover p-3 h-auto max-w-full m-4 bg-gray-900 flex flex-col items-center justify-center">
		<header class="card-header flex justify-between w-full">
			<h2 class="text-xl font-bold self-center">
				{imageName}
			</h2>
			<button
				type="button"
				class="btn-icon preset-filled-error-500 w-10 h-10"
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
				class="btn preset-filled-success-500 p-2 rounded-lg w-72 h-10"
				onclick={() => {
					applyImage(imageId);
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