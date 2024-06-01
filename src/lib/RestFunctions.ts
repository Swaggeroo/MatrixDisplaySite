import { max, value } from '$lib/modals/PostProgressStore';
import {
	type ModalSettings,
	type ModalStore,
	type ToastSettings,
	type ToastStore
} from '@skeletonlabs/skeleton';
import { applying } from '$lib/applyImageLockStore';
import { env } from '$env/dynamic/public';

let currentlyApplying = false;

const apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

applying.subscribe((value) => {
	currentlyApplying = value;
});

const modal: ModalSettings = {
	type: 'component',
	component: 'postAnimModal',
};

export function applyImage(imageId: string, modalStore: ModalStore, toastStore: ToastStore) {
	if (currentlyApplying) {
		alert('Already applying an image');
		return;
	}
	applying.set(true);
	modalStore.trigger(modal);
	const xhr = new XMLHttpRequest();
	let lastPos = 0;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 3) {
			const data = xhr.responseText.substring(lastPos);
			lastPos = xhr.responseText.length;
			if (data === 'Error sending data to matrix.') {
				applying.set(false);
				value.set(0);
				max.set(1);
				modalStore.close();
				const toastSettings: ToastSettings = {
					message: 'Error sending data to matrix.',
					timeout: 5000,
					hoverable: true,
					action: {
						label: 'Retry',
						response: () => {
							applyImage(imageId, modalStore, toastStore);
						}
					}
				};
				toastStore.trigger(toastSettings);
			}
			const progressRecived = data.split(' of ');
			value.set(parseInt(progressRecived[0]));
			max.set(parseInt(progressRecived[1]));

			if (progressRecived[0] === progressRecived[1]) {
				applying.set(false);
				value.set(0);
				max.set(1);
				modalStore.close();
			}

			console.log(data);
		}
	};
	xhr.open('POST', `${apiURL}/api/apply/${imageId}?brightness=20&speed=100`, true);
	xhr.send();
}