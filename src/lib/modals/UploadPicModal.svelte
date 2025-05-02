<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { onDestroy, onMount, type SvelteComponent } from 'svelte';
	import { env } from '$env/dynamic/public'

	// Stores
	import { ProgressRing, Modal } from '@skeletonlabs/skeleton-svelte';
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
		title: Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000,
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
				duration: 5000,
			});
		};
		xhr.open('POST', `${apiURL}/api/upload`, true);
		xhr.send(formData);

	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	contentBase="modal-example-form {cBase}"
>
	{#snippet content()}
		<header class={cHeader}>Upload Picture</header>
		<article>
			<p>Upload a picture to the server.</p>
		</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}" id="uploadPicForm" onsubmit={preventDefault(onFormSubmit)}>
			<label class="label">
				<span>Title</span>
				<input class="input" type="text" bind:value={formData.title} placeholder="Enter name..." name="title" />
			</label>
			<label class="label">
				<span>PNG or GIF</span>
				<input class="input" type="file" accept="image/png, image/gif" name="pictures" />
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer">
			<button class="btn" onclick={modalClose}>Cancel</button>
			{#if submitting}
				<button class="btn" disabled><ProgressRing value={null} size="w-5 h-5" /></button>
			{:else}
				<button class="btn" onclick={onFormSubmit} type="submit" form="uploadPicForm">Submit Form</button>
			{/if}
		</footer>
	{/snippet}
</Modal>