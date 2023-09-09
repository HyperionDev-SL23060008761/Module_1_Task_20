"use strict";

//Get the Required Elements
const notifierElement = document.querySelector(".notifier");
const contactFormElement = document.querySelector(".contact_form form");
const sendMessageButtonElement = document.querySelector(".send_message_button");

//Setup the Notifier
const notifier = new Notifier(notifierElement);

//Setup Event Listeners
sendMessageButtonElement.addEventListener("click", sendMessage);

/**
 * @param {PointerEvent} clickEvent //The click Event for the Send Message Button
 * @returns {void}
 */
function sendMessage(clickEvent) {
	//
	//Get the Form's Input Elements
	const formInputElements = contactFormElement.querySelectorAll("input");

	//Loop through the Form's Input Elements
	for (const formInputElement of formInputElements) {
		//
		//Check if it is a Radio Input and continue to the next element
		if (formInputElement.type == "radio") continue;

		//Reset the Element's Input Value
		formInputElement.value = "";
	}

	//Notify the User of the Successful Contact Message
	notifier.notify("Success", "Sent Your Message", 2500);
}
