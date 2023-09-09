"use strict";

//Setup the Show Data Class
class Show_Data {
	//
	/**
	 * @property {Number} id The ID of the Show
	 */
	id;

	/**
	 * @property {string} name The name of the Show
	 */
	name;

	/**
	 * @property {string} imageURL The URL containing the Image of the Show
	 */
	name;

	/**
	 * @property {Object<any, any>} data The Raw Data of the Show
	 */
	rawData;

	/**
	 * Gets a List of Shows using a requested Show Name
	 * @param {string} showName //The Name of the Show to search
	 * @returns {Array<{name: string, id: number, imageURL: string}>} //The List of available shows to choose from
	 */
	async searchShow(showName) {
		//
		//Get the URI Encoded Show Name
		const URIEncodedShowName = encodeURI(showName);

		//Setup the Base URL
		const baseURL = "https://api.tvmaze.com";

		//Setup the Endpoint
		const endpoint = `search/shows?q=${URIEncodedShowName}`;

		//Setup the Final URL
		const finalURL = `${baseURL}/${endpoint}`;

		//Run the Request to fetch the Show List based on the given name
		const showRequestResponse = await fetch(finalURL);

		//Extract the Show List in JSON format from the Show Request Response
		const showList = await showRequestResponse.json();

		//Re Map the Show List to be more Readable
		const mappedShowList = showList.map(currentShow => {
			//
			//Setup the New Show Object
			const newShow = new Object();

			//Update the New Show's Name
			newShow.name = currentShow.show.name;

			//Update the New Show's ID
			newShow.id = currentShow.show.id;

			//Update the New Show's Image URL
			newShow.imageURL = currentShow.show.image?.medium;

			//Return the New Show Object
			return newShow;
		});

		//Return the Show List
		return mappedShowList;
	}

	/**
	 * Gets a show using a requested Show's ID
	 * @param {Number} showID //The ID of the Show to Get
	 * @returns {boolean} //Whether a Show could be Found
	 */
	async getShowByID(showID) {
		//
		//Setup the Base URL
		const baseURL = "https://api.tvmaze.com";

		//Setup the Endpoint
		const endpoint = `shows/${showID}`;

		//Setup the Final URL
		const finalURL = `${baseURL}/${endpoint}`;

		//Run the Request to fetch the Show based on the given ID
		const showRequestResponse = await fetch(finalURL);

		//Extract the Show in JSON format from the Show Request Response
		const requestedShow = await showRequestResponse.json();

		if (!requestedShow) return false;

		//Update the Show's ID
		this.id = requestedShow.id;

		//Update the Show's Name
		this.name = requestedShow.name;

		//Update the Show's ImageURL
		this.imageURL = requestedShow.image?.medium;

		//Save the Show's Raw Data
		this.rawData = requestedShow;

		//Return Success Status
		return true;
	}
}
