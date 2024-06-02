<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore, RangeSlider } from '@skeletonlabs/skeleton';

	import { env } from '$env/dynamic/public';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	// Form Data
	let settingsData = {
		speed: 500,
		brightness: 20
	};

	const receivedData = $modalStore[0].meta.settingsData;
	if (receivedData) {
		settingsData.speed = receivedData.speed;
		settingsData.brightness = receivedData.brightness;
	}

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
			$modalStore[0].meta.refreshStatus();
			parent.onClose();
		}, 1000);
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Settings</header>
		<article>
			<p>Change the speed and brightness of the Matrix.</p>
		</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Speed</span>
				<input class="input" type="number" bind:value={settingsData.speed} placeholder="Enter name..." />
				<RangeSlider name="range-slider" bind:value={settingsData.speed} max={maxSpeed} step={speedStep} min={minSpeed}></RangeSlider>
			</label>
			<label class="label">
				<span>Brightness</span>
				<input class="input" type="number" bind:value={settingsData.brightness} placeholder="Enter name..." />
				<RangeSlider name="range-slider" bind:value={settingsData.brightness} max={maxBrightness} step={brightnessStep} min={minBrightness}></RangeSlider>
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Save</button>
		</footer>
	</div>
{/if}