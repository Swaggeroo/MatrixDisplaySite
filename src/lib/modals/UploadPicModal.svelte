<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import type { SvelteComponent } from 'svelte';
	import { env } from '$env/dynamic/public'

	// Stores
	import { getModalStore, getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';

	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	// Props
	
	interface Props {
		/** Exposes parent props to this component. */
		parent: SvelteComponent;
	}

	let { parent }: Props = $props();

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	// Form Data
	const formData = $state({
		title: Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000,
	});

	let submitting = $state(false);

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
					$modalStore[0].meta.reloadIDs();
					parent.onClose();
				}, 1000);
			}
		};
		xhr.onerror = function () {
			submitting = false;
			$modalStore[0].meta.reloadIDs();
			parent.onClose();
			toastStore.trigger({
				message: 'Failed to upload picture.',
				timeout: 5000,
				hoverable: true,
				background: 'variant-filled-warning'
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

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
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
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>{parent.buttonTextCancel}</button>
			{#if submitting}
				<button class="btn {parent.buttonPositive}" disabled><ProgressRadial value={undefined} class="w-5 h-5" /></button>
			{:else}
				<button class="btn {parent.buttonPositive}" onclick={onFormSubmit} type="submit" form="uploadPicForm">Submit Form</button>
			{/if}
		</footer>
	</div>
{/if}