"use strict";

//Setup the Anime Class
class Anime {
	//
	/**
	 * @property {Number} id The ID of the Anime
	 */
	id;

	/**
	 * @property {string} name The name of the Anime
	 */
	name;

	/**
	 * @property {string} imageURL The Image URL of the Anime
	 */
	imageURL;

	/**
	 * @property {boolean} watched The Watched Status of the Anime
	 */
	watched;

	/**
	 * @property {"good" | "average" | "bad"} rating The Rating of the Anime
	 */
	rating;

	/**
	 * @property {string} comment The User's Comment for the Anime
	 */
	comment;

	/**
	 * @property {{enjoyment: Number, characters: Number, music: Number, visuals: Number, atmosphere: Number, story: Number, enjoyment: others}} detailedRating The Detailed Rating of the Anime
	 */
	detailedRating = {
		enjoyment: 0,
		characters: 0,
		music: 0,
		visuals: 0,
		atmosphere: 0,
		story: 0,
		others: 0,
	};

	/**
	 * @param {number | null} id The id of the Anime
	 * @param {string} name The name of the Anime
	 * @param {string} imageURL The Image URL of the Anime
	 * @param {"0" | "1"} watched The Watched Status of the Anime
	 * @param {"good" | "average" | "bad"} rating The Rating of the Anime
	 * @param {string} comment The User's Comment for the Anime
	 * @param {{enjoyment: Number, characters: Number, music: Number, visuals: Number, atmosphere: Number, story: Number, enjoyment: others} | null} detailedRating The Detailed Rating of the Anime
	 * @param {boolean} saveCard Whether the card should be saved to the Local Storage
	 * @returns {Anime}
	 */
	constructor(id, name, imageURL, watched, rating, comment, detailedRating, saveCard) {
		//
		//Update the Properties
		this.id = id || Math.round(Math.abs(new Date().getTime() + Math.random() * 100));
		this.name = name;
		this.imageURL = imageURL;
		this.watched = Boolean(Number(watched));
		this.rating = rating;
		this.comment = comment;

		//Check if the Detailed Rating was Provided
		if (detailedRating) this.detailedRating = detailedRating;

		//Save the Card to the Local Storage
		if (saveCard) this.#saveCard();
	}

	/**
	 * Saves this card to the Local Storage
	 * @returns {void}
	 */
	#saveCard() {
		//
		//Get the Current Card's Data
		const cardData = Object.values(this);

		//Get the Raw Card Data List
		const rawCardDataList = localStorage.getItem("SL23060008761-cardList");

		//Parse the Current Card Data List if it exists or a setup a New List
		const cardDataList = JSON.parse(rawCardDataList) || new Array();

		//Add the Card to the Card List
		cardDataList.push(cardData);

		//Save the Updated Card List
		localStorage.setItem("SL23060008761-cardList", JSON.stringify(cardDataList));
	}

	/**
	 * Delete's all of the Nodes that are currently on the Page
	 * @param {Node} cardParentElement The Element where the card is opened in
	 * @param {Node} commentParentElement The Element where the Comment is opened in
	 * @returns {void}
	 */
	deleteNodes(cardParentElement, commentParentElement) {
		//
		//Get the Card Element
		const cardElement = cardParentElement.querySelector(`[data-id="${this.id}"]`);

		//Get the Card Element
		const commentElement = commentParentElement.querySelector(`[data-id="${this.id}"]`);

		//Check if the Card Node Exists and Remove it
		if (cardElement) cardElement.remove();

		//Check if the Comment Node Exists and Remove it
		if (commentElement) commentElement.remove();
	}

	/**
	 * Opens the Card on the Document
	 * @param {Node} cardParentElement The Element where the Card will be Opened in
	 * @param {Node} commentParentElement The Element where the Comment will be Opened in
	 * @returns {void}
	 */
	openCard(cardParentElement, commentParentElement) {
		//
		//Check if the Parent Element is Invalid
		if (!cardParentElement) return;

		//Get the Node List
		const nodeList = this.nodeData();

		//Add the Card to the Card's Parent Element
		cardParentElement.append(nodeList.card);

		//Add the Comment to the Comment's Parent Element
		commentParentElement.append(nodeList.comment);
	}

	/**
	 * Gets the Node/Element Data for this card
	 * @returns {{card: Node, comment: Node}}
	 */
	nodeData() {
		//
		//Setup the Node List Object
		const nodeList = new Object();

		//Get the Template Card
		const templateCard = document.body.querySelector(".template_card");

		//Setup the New Card
		const newCard = templateCard.content.children[0].cloneNode(true);

		//Get the New Card's Watched Bar
		const newCardWatchedBar = newCard.querySelector(".watched_bar");

		//Set the Rating Class for the Card
		newCard.classList.toggle(`card_rating_${this.rating}`, true);

		//Set the Watched Status for the Card
		newCard.classList.toggle(`card_watched`, this.watched);

		//Update the New Card's Data
		newCard.dataset.id = this.id;

		//Update the Card's Watched Icons
		newCardWatchedBar
			.querySelector(".watched_icon")
			.classList.toggle("watched_icon_hidden", !this.watched);
		newCardWatchedBar
			.querySelector(".no_watched_icon")
			.classList.toggle("watched_icon_hidden", this.watched);

		//Update the New Card's Name
		newCard.querySelector(".card_title").innerText = this.name;

		//Update the New Card's Image
		newCard.querySelector(".card_img img").src = this.imageURL;

		//Add the New Card to the Node List
		nodeList.card = newCard;

		//Get the Template Comment
		const templateComment = document.body.querySelector(".template_comment");

		//Setup the New Comment
		const newComment = templateComment.content.children[0].cloneNode(true);

		//Get the Comment's Anime Name
		const commentAnimeName = newComment.querySelector(".anime_name");

		//Get the Comment's Content
		const commentContent = newComment.querySelector(".comment_content");

		//Update the New Comment's Data
		newComment.dataset.id = this.id;

		//Update the Comment's Anime Name Element's Class to reflect the rating the user gave it
		commentAnimeName.classList.toggle(this.rating, true);

		//Update the Comment's Anime Name
		commentAnimeName.innerText = this.name;

		//Update the Comment's Content
		commentContent.innerText = this.comment;

		//Add the New Comment to the Node List
		nodeList.comment = newComment;

		//Return the Node List
		return nodeList;
	}
}
