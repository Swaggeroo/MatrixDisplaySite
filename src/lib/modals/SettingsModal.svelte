<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	// Stores
	import { Modal, Slider } from '@skeletonlabs/skeleton-svelte';

	import { env } from '$env/dynamic/public';
	import { SettingsModal } from '$lib/modals/ModalController';

	let openState = $state(false);

	function modalClose() {
		openState = false;
	}

	function modalOpen(receivedData: { speed: number, brightness: number }, statusFunction: () => void) {
		openState = true;
		settingsData.speed = receivedData.speed;
		settingsData.brightness = receivedData.brightness
		refreshStatus = statusFunction;
	}

	let refreshStatus: () => void;

	onMount(() => {
		SettingsModal.set({ modalOpen, modalClose });
	});

	onDestroy(() => {
		SettingsModal.set(null);
	});

	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	// Form Data
	let settingsData = $state({
		speed: 500,
		brightness: 20
	});

	const minSpeed = 0;
	const maxSpeed = 2000;
	const speedStep = 10;

	const minBrightness = 1;
	const maxBrightness = 255;
	const brightnessStep = 1;

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		console.log('Submitting form data:', settingsData);

		const xhrSpeed = new XMLHttpRequest();
		xhrSpeed.onreadystatechange = function () {
			if (xhrSpeed.readyState === 4) {
				console.log(xhrSpeed.responseText);
			}
		};
		xhrSpeed.onerror = function () {
			console.error('Failed to set speed.', xhrSpeed.responseText);
		};
		xhrSpeed.open('POST', `${apiURL}/api/setSpeed`, true);
		xhrSpeed.setRequestHeader('Content-Type', 'application/json');
		xhrSpeed.send(JSON.stringify({ speed: settingsData.speed }));

		const xhrBrightness = new XMLHttpRequest();
		xhrBrightness.onreadystatechange = function () {
			if (xhrBrightness.readyState === 4) {
				console.log(xhrBrightness.responseText);
			}
		};
		xhrBrightness.onerror = function () {
			console.error('Failed to set brightness.', xhrBrightness.responseText);
		};
		xhrBrightness.open('POST', `${apiURL}/api/setBrightness`, true);
		xhrBrightness.setRequestHeader('Content-Type', 'application/json');
		xhrBrightness.send(JSON.stringify({ brightness: settingsData.brightness }));


		setTimeout(() => {
			refreshStatus();
			parent.onClose();
		}, 1000);
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container';
</script>

<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	contentBase="modal-example-form {cBase}"
>
	{#snippet content()}
		<header class={cHeader}>Settings</header>
		<article>
			<p>Change the speed and brightness of the Matrix.</p>
		</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Speed</span>
				<input class="input" type="number" bind:value={settingsData.speed} placeholder="Enter name..." />
				<Slider name="range-slider" value={[settingsData.speed]} onValueChange={(e) => settingsData.speed = e.value[0]} max={maxSpeed} step={speedStep} min={minSpeed}></Slider>
			</label>
			<label class="label">
				<span>Brightness</span>
				<input class="input" type="number" bind:value={settingsData.brightness} placeholder="Enter name..." />
				<Slider name="range-slider" value={[settingsData.speed]} onValueChange={(e) => settingsData.brightness= e.value[0]} max={maxBrightness} step={brightnessStep} min={minBrightness}></Slider>
			</label>
		</form>
		<footer class="modal-footer">
			<button class="btn" onclick={modalClose}>Cancel</button>
			<button class="btn" onclick={onFormSubmit}>Save</button>
		</footer>
	{/snippet}
</Modal>