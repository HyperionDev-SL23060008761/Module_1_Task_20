"use strict";

//Get the Required Elements
const ratingTableElement = document.querySelector(".anime_rating_table");

//Setup Event Listeners
ratingTableElement.addEventListener("click", handleRatingClickEvents);

//Setup the Rating Table
setupRatingTable();

/**
 * Sets Up the Rating Table
 * @returns {void}
 */
function setupRatingTable() {
	//
	//Get the Card List
	const cardList = getCardList();

	//Check if the Card List is Invalid
	if (cardList.length < 1) return;

	//Setup the Table Item Element List
	const tableItemElementList = new Array();

	//Get the Table Item Template
	const tableItemTemplate = document.querySelector(".template_table_item").content.children[0];

	//Get the Rating Value Template
	const ratingValueTemplate = document.querySelector(".template_rating_value").content.children[0];

	//Loop through the List of Cards
	for (const card of cardList) {
		//
		//Check if the user has not Watched the Anime Yet
		if (!card.watched) continue;

		//Setup the New Table item Element
		const newTableItemElement = tableItemTemplate.cloneNode(true);

		//Update the id for the Table Item
		newTableItemElement.dataset.id = card.id;

		//Update the Anime Name for the Table Item
		newTableItemElement.querySelector(".anime_name").innerText = card.name;

		//Loop through the Detailed Ratings
		for (const [ratingType, ratingValue] of Object.entries(card.detailedRating)) {
			//
			//Setup the New Rating Value Element
			const newRatingValueElement = ratingValueTemplate.cloneNode(true);

			//Get the Input Element for the Rating Value
			const ratingValueInputElement = newRatingValueElement.querySelector("input");

			//Update the Rating Type
			ratingValueInputElement.dataset.type = ratingType;

			//Update the Rating Value
			ratingValueInputElement.value = ratingValue;

			//Add the Rating Value to the New Table Item Element
			newTableItemElement.append(newRatingValueElement);
		}

		//Add the New Table Item to the Table Item Element List
		tableItemElementList.push(newTableItemElement);
	}

	//Add the Table Item Elements to the Rating Table Element
	ratingTableElement.append(...tableItemElementList);
}

/**
 * Sets Up the Rating Table
 * @param {PointerEvent} clickEvent
 * @returns {void}
 */
function handleRatingClickEvents(clickEvent) {
	//
	//Get the Target Element
	const targetElement = clickEvent.target;

	//Setup the variable to Check if the Rating should be Decreased
	const isDecreaseRating = !!targetElement.classList.contains("decrease_rating_button");

	//Setup the variable to Check if the Rating should be Increased
	const isIncreaseRating = !!targetElement.classList.contains("increase_rating_button");

	//Check if the Rating should be Decreased or Increased
	if (isDecreaseRating || isIncreaseRating) return changeRating(clickEvent, isIncreaseRating);
}

/**
 * Changes the Rating for an Anime's Sub Section
 * @param {PointerEvent} clickEvent
 * @param {boolean} increaseRating Whether the Rating should be Increased
 * @returns {void}
 */
function changeRating(clickEvent, increaseRating) {
	//
	//Setup the Maximum Rating
	const maximumRating = 10;

	//Setup the Minimum Rating
	const minimumRating = 0;

	//Get the Target Element
	const targetElement = clickEvent.target;

	//Get the Target's Parent Element
	const parentElement = targetElement.closest("td");

	//Get the Input Element
	const inputElement = parentElement.querySelector("input");

	//Setup the New Rating and set it's value to the Current Rating
	let newRating = Number(inputElement.value);

	//Check if the Current Rating should be Increased
	if (increaseRating) newRating++;

	//check if the Current Rating Should be Decreased
	if (!increaseRating) newRating--;

	//Check if the New Rating is Invalid
	if (newRating > maximumRating || newRating < minimumRating) return;

	//Update the Rating
	inputElement.value = newRating;

	//Get the Table Item Element
	const tableItemElement = targetElement.closest("tr");

	//Get the Card Element's ID
	const cardElementID = tableItemElement.dataset.id;

	//Get the Card List
	const cardList = getCardList();

	//Check if the Card List is Invalid
	if (cardList.length < 1) return;

	//Find the Card to delete in the Card List
	const card = cardList.find(currentCard => currentCard.id == cardElementID);

	//Check if the Card could not be found
	if (!card) return;

	//Update the Card's Detailed Rating
	card.detailedRating[inputElement.dataset.type] = newRating;

	//Save the Card List
	saveCardList(cardList);
}

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
		console.log(cardData);
		//Build the Card from the Card Data
		const card = new Anime(...cardData);

		//Add the Card to the Card List
		cardList.push(card);
	}

	//Return the Card List
	return cardList;
}
