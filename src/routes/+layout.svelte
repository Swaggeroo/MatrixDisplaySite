<script lang="ts">
	import '../app.css';
	import {
		AppBar,
		Toast,
	} from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster-svelte';
	import { SettingsModal as SettingsModalController } from '$lib/modals/ModalController';

	import { applying } from '$lib/applyImageLockStore';
	import icon from '$lib/favicon.svg';
	import { onDestroy } from 'svelte';

	import { env } from '$env/dynamic/public';

	let { children } = $props();
	let apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

	function getStatus() {
		fetch(`${apiURL}/api/status`)
			.then(response => response.json())
			.then(data => {
				status.brightness = data.brightness;
				status.speed = data.speed;
				applying.set(data.applyingImage);
			})
			.catch(() => {
				toaster.create({
					title: 'Failed to get status.',
					type: 'error',
					duration: 5000,
				});
			});
	}

	const intervalId = setInterval(getStatus, 30000);
	getStatus();
	let status = {
		speed: 500,
		brightness: 20
	}

	function handleSettingsClick() {
		SettingsModalController.subscribe(controller => {
			if (controller) controller.modalOpen(status, getStatus);
		})();
	}

	async function handlePowerClick() {
		try {
			await fetch(`${apiURL}/api/off`);
		} catch {
			console.error('Failed to toggle power.');
			toaster.create({
				title: 'Failed to toggle power.',
				type: 'error',
				duration: 5000,
			});
		}
	}

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<svelte:head>
	<title>Matrix Display</title>
</svelte:head>

<Toast.Group {toaster}></Toast.Group>

<!-- App Shell -->
<div class="">
	<header class="sticky top-0 z-10 backdrop-blur-sm p-4">
			<!-- App Bar -->
			<AppBar>
				<AppBar.Toolbar class="grid-cols-[auto_1fr_auto] md:grid-cols-[auto_auto]">
					<AppBar.Lead>

						<img src={icon} alt="Matrix Display Site" class="w-10 h-10 mr-3" />
						<strong class="text-xl uppercase">Matrix Display Site</strong>

					</AppBar.Lead>
					<AppBar.Trail>
						<button class="btn-icon preset-filled-surface-500 w-10 h-10 text-3xl" onclick={handleSettingsClick}>⚙</button>
						<button class="btn-icon preset-filled-surface-500 w-10 h-10 text-xl" onclick={handlePowerClick}>🌙</button>
					</AppBar.Trail>
				</AppBar.Toolbar>
			</AppBar>
	</header>
	<!-- Page Route Content -->
	<main>
		{@render children()}
	</main>
</div>
