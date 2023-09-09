"use strict";

//Run the Initial Setup if this is the first time the user visited the site
if (!localStorage.getItem("SL23060008761-visited")) setupInitialList();

/**
 * This will add a List of Anime Cards as a Show Case for First Time Users
 */
function setupInitialList() {
	//
	//Get the Card List Element
	const cardListElement = document.querySelector(".card_list");

	//Setup the Cards for the Showcase
	const cardA = new Anime(
		null,
		"Re: Zero",
		"https://m.media-amazon.com/images/M/MV5BN2NlM2Y5Y2MtYjU5Mi00ZjZiLWFjNjMtZDNiYzJlMjhkOWZiXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_FMjpg_UX1000_.jpg",
		"0",
		"good",
		"This is a Cool Anime",
		null,
		true
	);

	const cardB = new Anime(
		null,
		"Black Clover",
		"https://www.crunchyroll.com/imgsrv/display/thumbnail/480x720/catalog/crunchyroll/e108ae17d8d0407417cac40eb52d849a.jpe",
		"1",
		"good",
		"This is a Really Cool Anime",
		null,
		true
	);

	const cardC = new Anime(
		null,
		"Claymore",
		"https://cdn.myanimelist.net/images/anime/3/21834.jpg",
		"1",
		"good",
		"This is a Cool Anime but I did not like some of the Visuals",
		null,
		true
	);

	const cardD = new Anime(
		null,
		"Garzey's Wing",
		"https://upload.wikimedia.org/wikipedia/en/e/e2/Garzey%27s_Wing.jpeg",
		"0",
		"bad",
		"I couldnt even finish watching it",
		null,
		true
	);

	const cardE = new Anime(
		null,
		"So I'm a Spider, So what?",
		"https://e0.pxfuel.com/wallpapers/238/221/desktop-wallpaper-kumo-desu-ga-nani-ka-so-i-m-a-spider-so-what-anime-board.jpg",
		"1",
		"average",
		"This is the Best anime in the list",
		null,
		true
	);

	//Mark the User as Visited
	localStorage.setItem("SL23060008761-visited", "true");
}
