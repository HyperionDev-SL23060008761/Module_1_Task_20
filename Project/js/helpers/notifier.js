"use strict";

//Setup the Notifier Class
class Notifier {
	//
	/**
	 * @property {Node} notifierElement The Notifier's Element
	 */
	#notifierElement;

	/**
	 * @property {Array<>} notificationQueue The Notification Queue
	 */
	#notificationQueue = new Array();

	/**
	 * @param {Node} notifierElement The Notifier's Element
	 * @returns {Modal}
	 */
	constructor(notifierElement) {
		//
		//Update the Notifier Element Property
		this.#notifierElement = notifierElement;

		//Run the Notification Monitor
		this.#notificationQueueMonitor();
	}

	/**
	 * Creates a Notification
	 * @param {"Success" | "Info" | "Fail"} notifierType The Type of the Notification
	 * @param {string} notifierMessage The Success Message
	 * @param {number} notifierDuration The Duration of the Notification (in Milliseconds)
	 * @returns {void}
	 */
	notify(notifierType, notifierMessage, notifierDuration) {
		//
		//Check if the Notifier Type or Message is Invalid
		if (!notifierType || !notifierMessage) throw new Error("Invalid Notifier Type or Message");

		//Setup the Notification Details
		const notificationDetails = {
			notifierType: notifierType,
			notifierMessage: notifierMessage,
			notifierDuration: notifierDuration || 750,
		};

		//Add the Notification to the Notification Queue
		this.#notificationQueue.push(notificationDetails);
	}

	/**
	 * Shows a Notification
	 * @param {"Success" | "Info" | "Fail"} notifierType The Type of the Notification
	 * @param {string} notifierMessage The Success Message
	 * @param {number} notifierDuration The Duration of the Notification (in Milliseconds)
	 * @returns {void}
	 */
	#showNotification(notifierType, notifierMessage, notifierDuration) {
		//
		//Update the Notifier Element's Title
		this.#notifierElement.querySelector(".notifier_title").innerText = notifierType;

		//Update the Notifier Element's Description
		this.#notifierElement.querySelector(".notifier_description").innerText = notifierMessage;

		//Toggle the Notifier's Status
		this.#notifierElement.classList.toggle("notifier_success", notifierType == "Success");
		this.#notifierElement.classList.toggle("notifier_info", notifierType == "Info");
		this.#notifierElement.classList.toggle("notifier_fail", notifierType == "Fail");

		//Update the Notifier Elements Position
		$(this.#notifierElement).css({
			right: `-${this.#notifierElement.clientWidth}px`,
		});

		//Show the Notification Message
		$(this.#notifierElement)
			.animate({ right: "0px" }, 500)
			.delay(notifierDuration || 2500)
			.animate({ right: `-${this.#notifierElement.clientWidth}px` }, 500);
	}

	/**
	 * Monitors the Notification Queue to play any new notifications
	 * @returns {void}
	 */
	async #notificationQueueMonitor() {
		//
		//Get the Current Item in the Queue
		const currentQueueItem = this.#notificationQueue.shift();

		//Check if the Current Queue Item is Invalid
		if (!currentQueueItem) {
			//
			//Check the Queue again after a set timeout
			setTimeout(() => this.#notificationQueueMonitor(), 100);

			//End the Script to prevent memory leaks
			return;
		}

		//Show the Notification
		this.#showNotification(
			currentQueueItem.notifierType,
			currentQueueItem.notifierMessage,
			currentQueueItem.notifierDuration
		);

		//Wait for the Notification to end and check the queue again
		setTimeout(() => this.#notificationQueueMonitor(), currentQueueItem.notifierDuration + 1000);

		//End the Script to prevent memory leaks
		return;
	}
}
