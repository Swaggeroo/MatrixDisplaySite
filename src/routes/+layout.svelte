<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		initializeStores,
		Modal,
		Toast,
		type ModalComponent,
		getModalStore, getToastStore
	} from '@skeletonlabs/skeleton';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import { applying } from '$lib/applyImageLockStore';
	import icon from '$lib/favicon.svg';
	import { onDestroy } from 'svelte';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Initialize Stores
	initializeStores();

	// Modals
	import PostAnimModal from '$lib/modals/PostAnimModal.svelte'
	import UploadPicModal from '$lib/modals/UploadPicModal.svelte'
	import SettingsModal from '$lib/modals/SettingsModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		postAnimModal: { ref: PostAnimModal },
		uploadPicModal: { ref: UploadPicModal },
		settingsModal: { ref: SettingsModal }
	};

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	import { env } from '$env/dynamic/public';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
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
				toastStore.trigger({
					message: 'Failed to get status.',
					timeout: 1000,
					hoverable: true,
					background: 'variant-filled-warning'
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
		modalStore.trigger({
			type: 'component',
			component: 'settingsModal',
			meta: {
				settingsData: status,
				refreshStatus: getStatus
			}
		});
	}

	async function handlePowerClick() {
		try {
			await fetch(`${apiURL}/api/off`);
		} catch {
			console.error('Failed to toggle power.');
			toastStore.trigger({
				message: 'Failed to toggle power.',
				timeout: 5000,
				hoverable: true,
				background: 'variant-filled-warning'
			});
		}
	}

	onDestroy(() => {
		clearInterval(intervalId);
		modalStore.clear();
		toastStore.clear();
	});
</script>

<svelte:head>
	<title>Matrix Display</title>
</svelte:head>

<Toast />
<Modal components={modalRegistry} />

<!-- App Shell -->
<AppShell>
	{#snippet header()}
	
			<!-- App Bar -->
			<AppBar>
				{#snippet lead()}
					
						<img src={icon} alt="Matrix Display Site" class="w-10 h-10 mr-3" />
						<strong class="text-xl uppercase">Matrix Display Site</strong>
					
					{/snippet}
				{#snippet trail()}
					
						<button class="btn-icon variant-filled-surface w-10 h-10 text-3xl" onclick={handleSettingsClick}>⚙</button>
						<button class="btn-icon variant-filled-surface w-10 h-10 text-xl" onclick={handlePowerClick}>🌙</button>
					
					{/snippet}
			</AppBar>
		
	{/snippet}
	<!-- Page Route Content -->
	{@render children?.()}
</AppShell>
