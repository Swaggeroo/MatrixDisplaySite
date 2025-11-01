import { writable } from 'svelte/store';

export const PostAnimModal = writable<{
	modalOpen: () => void;
	modalClose: () => void;
} | null>(null);

export const SettingsModal = writable<{
	modalOpen: (
		settingsData: { speed: number; brightness: number },
		refreshStatus: () => void
	) => void;
	modalClose: () => void;
} | null>(null);

export const UploadPicModal = writable<{
	modalOpen: (reloadIDs: () => Promise<void>) => void;
	modalClose: () => void;
} | null>(null);
