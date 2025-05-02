import { max, value } from '$lib/modals/PostProgressStore';
import { toaster } from '$lib/toaster-svelte';
import { applying } from '$lib/applyImageLockStore';
import { env } from '$env/dynamic/public';
import { PostAnimModal } from '$lib/modals/ModalController';

let currentlyApplying = false;

const apiURL: string = env.PUBLIC_API_URL ?? 'http://localhost:3000';

applying.subscribe((value) => {
	currentlyApplying = value;
});

export function applyImage(imageId: string) {
	if (currentlyApplying) {
		alert('Already applying an image');
		return;
	}
	applying.set(true);
	PostAnimModal.subscribe(controller => {
		if (controller) controller.modalOpen();
	})();
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
				PostAnimModal.subscribe(controller => {
					if (controller) controller.modalClose();
				})();
				toaster.create({
					type: 'error',
					title: 'Error sending data to matrix.',
					duration: 5000,
				});
			}
			const progressRecived = data.split(' of ');
			value.set(parseInt(progressRecived[0]));
			max.set(parseInt(progressRecived[1]));

			if (progressRecived[0] === progressRecived[1]) {
				applying.set(false);
				value.set(0);
				max.set(1);
				PostAnimModal.subscribe(controller => {
					if (controller) controller.modalClose();
				})();
			}

			console.log(data);
		}
	};
	xhr.open('POST', `${apiURL}/api/apply/${imageId}?brightness=20&speed=100`, true);
	xhr.send();
}