<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onDestroy, onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	// Stores
	import { Progress, Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster-svelte';
	import { UploadPicModal } from '$lib/modals/ModalController';

	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	let openState = $state(false);

	function modalClose() {
		openState = false;
	}

	function modalOpen(reloadIDsFunction: () => void) {
		openState = true;
		reloadIDs = reloadIDsFunction;
	}

	onMount(() => {
		UploadPicModal.set({ modalOpen, modalClose });
	});

	onDestroy(() => {
		UploadPicModal.set(null);
	});

	// Form Data
	const formData = $state({
		title: Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000
	});

	let submitting = $state(false);

	let reloadIDs: () => void;

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit() {
		if (submitting) return;
		submitting = true;
		const form = document.getElementById('uploadPicForm') as HTMLFormElement;
		const formData = new FormData(form);
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				console.log(xhr.responseText);
				setTimeout(() => {
					reloadIDs();
					submitting = false;
					modalClose();
				}, 1000);
			}
		};
		xhr.onerror = function () {
			submitting = false;
			reloadIDs();
			modalClose();
			toaster.create({
				title: 'Failed to upload picture.',
				type: 'error',
				duration: 5000
			});
		};
		xhr.open('POST', `${apiURL}/api/upload`, true);
		xhr.send(formData);
	}

	// Base Classes
	const cBase = 'card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container';
</script>

<!-- @component This example creates a simple form modal. -->

<Dialog open={openState} onOpenChange={(e) => (openState = e.open)}>
	<Portal>
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
			<Dialog.Content class="modal-example-form {cBase}">
				<header class={cHeader}>Upload Picture</header>
				<article>
					<p>Upload a picture to the server.</p>
				</article>
				<!-- Enable for debugging: -->
				<form class="modal-form {cForm}" id="uploadPicForm" onsubmit={preventDefault(onFormSubmit)}>
					<label class="label">
						<span>Title</span>
						<input
							class="input"
							type="text"
							bind:value={formData.title}
							placeholder="Enter name..."
							name="title"
						/>
					</label>
					<label class="label">
						<span>PNG or GIF</span>
						<input class="input" type="file" accept="image/png, image/gif" name="pictures" />
					</label>
				</form>
				<!-- prettier-ignore -->
				<footer class="modal-footer">
					<button class="btn preset-tonal" onclick={modalClose}>Cancel</button>
					{#if submitting}
						<button class="btn preset-filled w-30 h-8" disabled><Progress value={null} class="size-5" /></button>
					{:else}
						<button class="btn preset-filled w-30 h-8" onclick={onFormSubmit} type="submit" form="uploadPicForm">Submit Form</button>
					{/if}
				</footer>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
