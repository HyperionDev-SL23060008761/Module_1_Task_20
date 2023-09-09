"use strict";

//Setup the Modal Class
class Modal {
	//
	/**
	 * @property {string} title The Modal's Title
	 */
	title;

	//Setup the Private Properties
	#contentClickEventHandler;
	#modalForm;
	#buttons = new Array();
	#modalElement;

	/**
	 * @param {string} title The Modal's Title
	 * @returns {Modal}
	 */
	constructor(title) {
		//
		//Update the Properties
		this.title = title;
	}

	/**
	 * Sets the Click Event Handler for the Modal's Content
	 * @param {(clickEvent: PointerEvent) => void} contentClickEventHandler The Function that will handle Click Events on the Modal's Content
	 * @returns {void}
	 */
	setContentClickEventHandler(contentClickEventHandler) {
		//
		//Check if the Given Content is Invalid
		if (!contentClickEventHandler) return;

		//Save the Content Click Event Handler to the Modal's Class
		this.#contentClickEventHandler = contentClickEventHandler;
	}

	/**
	 * Adds a Given Form to the Modal
	 * @param {Node} givenFormElement The Form Element to be added to the Modal's Content
	 * @returns {void}
	 */
	setForm(givenFormElement) {
		//
		//Check if the Given Form is Invalid
		if (!givenFormElement) return;

		//Save the Given Form to the Modal's Class
		this.#modalForm = givenFormElement;
	}

	/**
	 * Gets the Form Data from the Modal
	 * @returns {{[key: string]: string}}
	 */
	getFormData() {
		//
		//Setup the Form Data
		const formData = new Object();

		//Check if the Given Form is Invalid
		if (!this.#modalForm) return formData;

		//Get the list of Input Elements from the Form
		const formInputElements = this.#modalForm.querySelectorAll("input");

		//Loop through the List of Input Elements
		for (const formInputElement of formInputElements) {
			//
			//Check if the Input is a Radio Button that is not Checked
			if (formInputElement.type == "radio" && !formInputElement.checked) continue;

			//Get the Input ID
			const formInputID = formInputElement.id || formInputElement.name;

			//Get the Input Value
			const formInputValue = formInputElement.value;

			//Add the Input Data to the Form Data
			formData[formInputID] = formInputValue;
		}

		//Return the Form Data
		return formData;
	}

	/**
	 * Adds a Button to the Modal
	 * @param {Array<Modal_Button>} buttons The Buttons to be Added to the Modal
	 * @returns {void}
	 */
	addButtons(...buttons) {
		//
		//Check if the Given Button is Invalid
		if (!buttons) return;

		//Add the Button to the Button List
		this.#buttons.push(...buttons);
	}

	/**
	 * Opens the Modal
	 * @returns {void}
	 */
	open() {
		//
		//Check if the Modal is already open
		if (this.#modalElement) return;

		//Get the Modal's Node Data
		const modalNodeData = this.#getNodeData();

		//Save the Modal Node Data to the Object's Element Cache
		this.#modalElement = modalNodeData;

		//Add the Modal's Node Data to the Document
		document.body.append(modalNodeData);
	}

	/**
	 * Deletes the Modal
	 * @returns {Node}
	 */
	delete() {
		//
		//Check if the Modal is Already Deleted
		if (!this.#modalElement) return;

		//Remove the Modal from the Node List
		this.#modalElement.remove();

		//Delete the Modal Node Data from the Object's Element Cache
		this.#modalElement = null;
	}

	/**
	 * Gets the Node/Element Data for this Modal
	 * @returns {Node}
	 */
	#getNodeData() {
		//
		//Get the Template Modal
		const templateModal = document.body.querySelector(".template_modal");

		//Setup the New Modal
		const newModal = templateModal.content.children[0].cloneNode(true);

		//Get the New Modal's Title Element
		const newModalTitleElement = newModal.querySelector(".modal_title");

		//Get the New Modal's Content Element
		const newModalContentElement = newModal.querySelector(".modal_content");

		//Get the New Modal's Buttons Element
		const newModalButtonsElement = newModal.querySelector(".modal_buttons");

		//Update the New Modal's Title
		newModalTitleElement.querySelector("h1").innerText = this.title;

		//Add the Content to the New Modal
		newModalContentElement.append(this.#modalForm);

		//Clear the Pre-Existing Buttons from the New Modal
		newModalButtonsElement.innerHTML = "";

		//Add the Buttons to the New Modal
		newModalButtonsElement.append(...this.#buttons);

		//Check if the user has added a Content Click Event Handler
		if (this.#contentClickEventHandler) {
			//
			//Add the Event Listener to the New Modal's Content
			newModalContentElement.addEventListener("click", this.#contentClickEventHandler);
		}

		//Add the Event Listener to the New Modal's Background
		newModal
			.querySelector(".modal_background")
			.addEventListener("click", this.delete.bind(this), { once: true });

		//Return the New Card
		return newModal;
	}
}

//Setup the Modal Button Class
class Modal_Button {
	/**
	 * @property {string} text The Button's Text
	 */
	text;

	/**
	 * @property {"success" | "info" | "error"} type The Type of the Button - success | info | error
	 */
	type;

	/**
	 * @param {string} text The Button's Text
	 * @param {"success" | "info" | "error"} type The Type of the Button - success | info | error
	 * @param {(clickEvent: PointerEvent) => void} onClick The Function to Handle Click Events
	 * @returns {Node}
	 */
	constructor(text, type, onClick) {
		//
		//Update the Properties
		this.text = text.toLowerCase();
		this.type = type.toLowerCase();

		//Return the Node Data
		return this.#getNodeData(onClick);
	}

	/**
	 * Gets the Node/Element Data for this Button
	 * @returns {Node}
	 */
	#getNodeData(onClick) {
		//
		//Get the Template Modal
		const templateModal = document.body.querySelector(".template_modal");

		//Setup the New Modal Button
		const newModalButton = templateModal.content.querySelector(".modal_button").cloneNode(true);

		//Get the New Modal Buttons Type Class
		const newModalButtonTypeClass = `modal_${this.type}_button`;

		//Update the New Modal Button's Text
		newModalButton.querySelector("h1").innerText = this.text;

		//Update the New Modal Button's Type
		newModalButton.classList.toggle(newModalButtonTypeClass, true);

		//Add the Event Listener to the Modal Button
		newModalButton.addEventListener("click", onClick);

		//Return the New Modal Button
		return newModalButton;
	}
}
