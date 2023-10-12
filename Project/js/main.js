"use strict";

//Get the Required Elements
const cardListElement = document.querySelector(".card_list");
const commentListElement = document.querySelector(".comment_list");
const notifierElement = document.querySelector(".notifier");

//Setup Event Listeners
cardListElement.addEventListener("click", handleCardClickEvents);

//Setup the Notifier
const notifier = new Notifier(notifierElement);

//Load the Card List
loadCardList();

/**
 * This will save the Card List to the Local Storage
 * @param {Array<Anime>} cardList
 */
function saveCardList(cardList) {
	//
	//Check if the Card List is Invalid
	if (!cardList) return;

	//Get the Card Data List from the Card List
	const cardDataList = cardList.map(card => Object.values(card));

	//Save the Card List
	localStorage.setItem("SL23060008761-cardList", JSON.stringify(cardDataList));
}

/**
 * This will load the Card List from the Local Storage
 */
function loadCardList() {
	//
	//Get the Card List
	const cardList = getCardList();

	//Sort the Card List
	cardList.sort((previousCard, currentCard) => previousCard.watched - currentCard.watched);

	//Check if the Card List is Invalid
	if (cardList.length < 1) return;

	//Loop through the Card Data List
	for (const card of cardList) {
		//
		//Add the Cards to the List
		card.openCard(cardListElement, commentListElement);
	}
}

/**
 * Handles Click Events for a Card
 * @param {PointerEvent} clickEvent
 */
function handleCardClickEvents(clickEvent) {
	//
	//Get the Target Element
	const targetElement = clickEvent.target;

	//Check if the Element is Invalid
	if (!targetElement) return;

	//const setup the variable to check if a card should be added
	const shouldAddCard = !!targetElement.closest(".add_card");

	//const setup the variable to check if a card should be Deleted
	const shouldDeleteCard = !!targetElement.closest(".card_delete_btn");

	//Check if the user wants to add a Card
	if (shouldAddCard) return setupAddCardModal();

	//Check if the user wants to delete a Card
	if (shouldDeleteCard) return deleteCard(targetElement);
}

/**
 * Handles Click Events for a Modals Content
 * @param {PointerEvent} clickEvent
 */
function handleModalContentClickEvents(clickEvent) {
	//
	//Get the Target Element
	const targetElement = clickEvent.target;

	//Check if the Element is Invalid
	if (!targetElement) return;

	//Setup the variable to Check if a Card Should be Added
	const isFormButtonGroup = !!targetElement.closest(".form_button_group");

	//Setup the Variable to Check if an Anime has been Selected from the Show List
	const isSelectedShow = !!targetElement.closest(".animeSearchList");

	//Check if the user wants to add a Card
	if (isFormButtonGroup) return handleFormButtonClick(clickEvent);

	//Check if the User want to Select a Show
	if (isSelectedShow) return handleShowSelectedEvent(clickEvent);
}

/**
 * Handles Click Events for a Form's Button Group
 * @param {PointerEvent} clickEvent
 */
function handleFormButtonClick(clickEvent) {
	//
	//Get the Target Element
	const targetElement = clickEvent.target;

	//Check if the Button is Already Active
	if (targetElement.classList.contains("form_button_active")) return;

	//Get the Form's Button Group
	const buttonGroup = targetElement.closest(".form_button_group");

	//Get the Current Active Button Element from the Button Group
	const activeButtonElement = buttonGroup.querySelector(".form_button_active");

	//Get the Button Group's Input Element
	const buttonGroupInputElement = buttonGroup.querySelector("input");

	//Update the Value of the Button Group's Input Element
	buttonGroupInputElement.value = targetElement.dataset.value;

	//Mark the Current Active Button Element as Inactive
	activeButtonElement.classList.toggle("form_button_active", false);

	//Mark the Clicked Button Element as Active
	targetElement.classList.toggle("form_button_active", true);
}

/**
 * Handles Anime Name Changes when Adding an Anime
 * @param {InputEvent} inputEvent
 */
async function handleAnimeNameChangeEvents(inputEvent) {
	//
	//Get the Target Element
	const targetElement = inputEvent.target;

	//Get the New Anime Name
	const newAnimeName = targetElement.value;

	//Get the Anime Search List Element in the Target Form
	const animeSearchListElement = targetElement.closest("form").querySelector(".animeSearchList");

	//Check if the Anime Search List Element is not Valid
	if (!animeSearchListElement) return;

	//Check if there are not enough Letters to conduct the search
	if (newAnimeName.length < 2) {
		//
		//Clear the Anime Search List
		animeSearchListElement.innerHTML = null;

		//End the Script
		return;
	}

	//Setup the Show List Elements
	const showListElements = new Array();

	//Setup the New Show Data
	const newShowData = new Show_Data();

	//Get the Show List
	const showList = await newShowData.searchShow(newAnimeName);

	//Check if there are No Shows and return to prevent the current list from becoming empty
	if (showList.length < 1) return;

	//Loop through the Show List
	for (const currentShow of showList) {
		//
		//Setup the New Element for the Current Show
		const newShowElement = document
			.querySelector(".template_show_list")
			.content.children[0].cloneNode(true);

		//Update the Show ID for the Show Element
		newShowElement.dataset.showID = currentShow.id;

		//Update the Show Element's Image
		newShowElement.querySelector(".show_image").src = currentShow.imageURL;

		//Update the Show Element's Name
		newShowElement.querySelector(".show_name").innerText = currentShow.name;

		//Push the new Show Element to the Show List Elements
		showListElements.push(newShowElement);
	}

	//Clear the Anime Search List
	$(animeSearchListElement).empty();

	//Show the Dropdown List
	$(animeSearchListElement).css({
		opacity: `100%`,
	});

	//Add the List of Show Elements to the Anime Search List Element
	$(animeSearchListElement).append(...showListElements);
}

/**
 * Handles the Click Event when a User has chosen the Show from the Anime Search List
 * @param {PointerEvent} clickEvent
 */
async function handleShowSelectedEvent(clickEvent) {
	//
	//Get the Target Element
	const targetElement = clickEvent.target;

	//Get the ID of the Selected Show
	const selectedShowID = Number(targetElement.dataset.showID);

	//Check if the Selected Show's ID is not Valid
	if (!selectedShowID) return;

	//Setup the Selected Show
	const selectedShow = new Show_Data();

	//Get the Show by It's ID and save the Result of the search
	const showFound = await selectedShow.getShowByID(selectedShowID);

	//Check if the Show could not be found
	if (!showFound) return;

	//Get the Parent Form Element
	const parentFormElement = targetElement.closest("form");

	//Get the Anime ID Input Element
	const animeIDInputElement = parentFormElement.querySelector("input#animeID");

	//Get the Anime Name Input Element
	const animeNameInputElement = parentFormElement.querySelector("input#animeName");

	//Get the Anime Name Input Element
	const animeImageURLInputElement = parentFormElement.querySelector("input#animeImageURL");

	//Get the Anime Search List Element in the Target Form
	const animeSearchListElement = parentFormElement.querySelector(".animeSearchList");

	//Clear the Anime Search List
	animeSearchListElement.innerHTML = null;

	//Update the Selected Anime ID
	animeIDInputElement.value = selectedShow.id;

	//Update the Selected Anime Name
	animeNameInputElement.value = selectedShow.name;

	//Update the Selected Anime Image URL
	animeImageURLInputElement.value = selectedShow.imageURL;
}

/**
 *
 * @param {EventTarget} targetElement
 */
function deleteCard(targetElement) {
	//
	//Get the Parent Card Element
	const cardElement = targetElement.closest(".card");

	//Get the Card Element's Name
	const cardElementID = cardElement.dataset.id;

	//Get the Card List
	const cardList = getCardList();

	//Check if the Card List is Invalid
	if (cardList.length < 1) return;

	//Find the Card to delete in the Card List
	const card = cardList.find(currentCard => currentCard.id == cardElementID);

	//Check if the Card could not be found
	if (!card) return;

	//Get the Index of the Card
	const cardIndex = cardList.indexOf(card);

	//Delete the Card
	cardList.splice(cardIndex, 1);

	//Delete the Card Element
	//cardElement.remove();
	card.deleteNodes(cardListElement, commentListElement);

	//Save the Card List
	saveCardList(cardList);

	//Notify the User of the Successful Deletion of the Anime
	return notifier.notify(
		"Success",
		`Deleted Anime from your list (${cardList.length} in List)`,
		2500
	);
}

/**
 * Adds a New Card to the List
 * @param {Modal} newCardModal The modal Class that requested the Card to be Added
 * @param {PointerEvent} clickEvent
 */
function addCard(newCardModal, clickEvent) {
	//
	//Get the Card List Element
	const cardListElement = document.querySelector(".card_list");

	//Get the Card List
	const cardList = getCardList();

	//Check if the Card List is Invalid
	if (!cardList) return notifier.notify("Fail", "Failed to Add Card", 2500);

	//Get the Form Data from the Modal
	const newCardFormData = newCardModal.getFormData();

	//Setup the New Card
	const newCard = new Anime(
		null,
		newCardFormData.animeName,
		newCardFormData.animeImageURL,
		newCardFormData.watchedAnimeResult,
		newCardFormData.animeRating,
		newCardFormData.animeComment,
		null,
		true
	);

	//Load the New Card
	newCard.openCard(cardListElement, commentListElement);

	//Delete the Modal
	newCardModal.delete();

	//Notify the user of the addition of the card
	return notifier.notify(
		"Success",
		`Added new Anime to your list (${cardList.length + 1} in List)`,
		2500
	);
}

/**
 * Sets up the Add Card Modal
 * @param {PointerEvent} clickEvent
 */
function setupAddCardModal(clickEvent) {
	//
	//Setup the Modal for the New Card
	const newCardModal = new Modal("Add New Anime");

	//Setup the Modal Form
	const modalForm = document
		.querySelector(".template_add_anime_form")
		.content.children[0].cloneNode(true);

	//Add an Event Listener to the Modal Form's "Anime Name" Input
	modalForm.querySelector("#animeName").addEventListener("input", handleAnimeNameChangeEvents);

	//Setup the Modal Buttons for the New Card to be Added
	const newCardModalButtons = [
		new Modal_Button("Add", "success", addCard.bind(null, newCardModal)),
		new Modal_Button("Cancel", "error", newCardModal.delete.bind(newCardModal)),
	];

	//Set the Modal's Content Event Listener
	newCardModal.setContentClickEventHandler(handleModalContentClickEvents);

	//Add the Form to the Modal
	newCardModal.setForm(modalForm);

	//Add the Buttons to the Modal
	newCardModal.addButtons(...newCardModalButtons);

	//Open the Modal
	newCardModal.open();
}

/**
 * Gets the List of Cards from the Local Storage
 * @returns {Array<Anime>}
 */
function getCardList() {
	//
	//Setup the Card List
	const cardList = new Array();

	//Get the Raw Card Data List
	const rawCardDataList = localStorage.getItem("SL23060008761-cardList");

	//Check if the Card Data List does not Exist
	if (!rawCardDataList) return cardList;

	//Get the Card Data List
	const cardDataList = JSON.parse(rawCardDataList);

	//Check if the Card Data List is Empty
	if (cardDataList.length < 1) return cardList;

	//Loop through the Card Data List
	for (const cardData of cardDataList) {
		//
		//Build the Card from the Card Data
		const card = new Anime(...cardData);

		//Add the Card to the Card List
		cardList.push(card);
	}

	//Return the Card List
	return cardList;
}
