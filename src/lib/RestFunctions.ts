import { max, value } from '$lib/modals/PostProgressStore';
import { type ModalSettings, type ModalStore } from '@skeletonlabs/skeleton';
import { applying } from '$lib/applyImageLockStore';

let currentlyApplying = false;

const apiURL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

applying.subscribe((value) => {
	currentlyApplying = value;
});

const modal: ModalSettings = {
	type: 'component',
	component: 'postAnimModal',
};

export function applyImage(imageId: string, modalStore: ModalStore) {
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