
// API reference interfaces
interface zippopotamusResults {
    country: string;
    "country abbreviation": string;
    "post code": string;
    places: zippopotamusResultsPlace[];
}

interface zippopotamusResultsPlace {
    "place name": string;
    longitude: string;
    latitude: string;
    state: string;
    "state abbreviation": string;
}

// Simplified compared to all data available from API, but we don't use most of
// it, so no need to add it here.
interface weatherGovPoints {
    properties: {
        forecast: string,
        forecastHourly: string,
        forecastGridData: string,
        observationStations: string,
        relativeLocation: {
            properties: {
                city: string,
                state: string,
            }
        },
        forecastZone: string,
        county: string,
        fireWeatherZone: string,
        timeZone: string,
        radarStation: string,
        astronomicalData: {
            "sunrise": "2026-04-08T06:20:00-05:00",
            "sunset": "2026-04-08T19:27:53-05:00",
        },
    }
};

interface weatherGovForecast {
    properties: {
        elevation: {
            unitCode: string,
            value: number
        },
        periods: weatherGovForecastPeriod[];
    }

};

interface weatherGovForecastPeriod {
    number: 14,
    name: "Tuesday Night",
    startTime: "2026-04-14T18:00:00-05:00",
    endTime: "2026-04-15T06:00:00-05:00",
    isDaytime: false,
    temperature: 31,
    temperatureUnit: "F",
    temperatureTrend: null,
    probabilityOfPrecipitation: {
        "unitCode": "wmoUnit:percent",
        "value": 54
    },
    windSpeed: "10 to 15 mph",
    windDirection: "NE",
    icon: "https://api.weather.gov/icons/land/night/rain_showers,50/rain_showers,40?size=medium",
    shortForecast: "Chance Rain Showers",
    detailedForecast: "A chance of rain showers. Mostly cloudy, with a low around 31. Chance of precipitation is 50%."
};





// HTML DOM connections
const zipCodeInput = document.getElementById("zip") as HTMLInputElement;
const submitZipButton = document.getElementById("submit-zip") as HTMLButtonElement;
const errorBox = document.getElementById("error-box") as HTMLDivElement;




/**
 * Validates that a US ZIP code is correctly formatted. Accepts either the
 * simple format 5 digit zip code, or the ZIP+4 code.
 * @param {string} zip - 
 * @returns {boolean} true if the zip code is valid.
 */
const validateZipCode = (zip: string): boolean => {
	if (zip.length !== 5)
		if (zip.length !== 10)
			return false;

	if (zip.length === 10 && zip.charAt(5) !== '-')
		return false;

	if (zip.length == 5) {
		if (!parseInt(zip)) return false;
	} else {
		if (!parseInt(zip.split("-")[0]))
			return false;

		if (!parseInt(zip.split("-")[1]))
			return false;
	}

	return true;
}

/**
 * Displays a provided string as an error to the user. This should be used when
 * the program can't continue and needs to alert the user as such.
 * @param {string} msg the message to display to the user.
 */
const presentError = (msg: string): void => {
    errorBox.style.display = "block";
    errorBox.innerText = msg;
}

/**
 * Removes the error box from the user's view. Use this when the error message
 * is no longer relevant to the user.
 */
const clearError = (): void => {
    errorBox.style.display = "none";
    errorBox.innerText = "";
}

// Standard requests from our program can use these params for convinence. Not
// strictly necessary, but it's nice to tell APIs where the calls are coming
// from via User-Agent.
const requestParams: RequestInit = {
    headers: { "User-Agent": "SkillsWeatherApp/1.0" }
};


submitZipButton.addEventListener("click", async () => {
    clearError();

    let zip: string = zipCodeInput.value;

    // added benefit of handling empty inputs too, so no need to check for that.
    if (!validateZipCode(zip)) {
        presentError("Zip code is invalid. Must be standard 5 digit US zip or US ZIP+4.");
        return;
    }

    // While the program does additionally accept ZIP+4 codes, our API does not.
    // In this case we'll just throw away everything after the standard 5 digits
    zip = zip.substring(0, 5);

    // No need to overcomplicate logic here. Just make the API calls and chain
    // them together, we'll handle errors along the way as well.
    const zipResolverResults = await fetch(`https://api.zippopotam.us/us/${zip}`, requestParams);
    if (!zipResolverResults.ok) { presentError("Failed to convert zip code"); return; }
    const zipResolverJSON: zippopotamusResults = await zipResolverResults.json();

    // Typically zippopotamus only returns one place, and for our use case it's
    // good enough to grab the first one.

    const resolvedLocation = zipResolverJSON.places[0];
    resolvedLocation.latitude;
    resolvedLocation.longitude;

    // Now we need to pipe these results into the next API, etc, etc.
    const weatherResolverResults = await fetch(`https://api.weather.gov/points/${resolvedLocation.latitude},${resolvedLocation.longitude}`, requestParams);
    if (!weatherResolverResults.ok) { presentError("Failed to resolve location from zip code"); return; }
    const weatherResolverJSON: weatherGovPoints = await weatherResolverResults.json();

    const forecastResolverResults = await fetch(weatherResolverJSON.properties.forecast, requestParams);
    if (!forecastResolverResults.ok) { presentError("Failed to retrieve forecast"); return; }
    const forecastResolverJSON: weatherGovForecast = await forecastResolverResults.json();



    // Update various info in the results UI
    document.getElementById("relative-location")!.innerText
        = weatherResolverJSON.properties.relativeLocation.properties.city + ", "
        + weatherResolverJSON.properties.relativeLocation.properties.state;

    const periodToday = forecastResolverJSON.properties.periods[0];
    document.getElementById("current-weather")!.innerHTML
        = `<img src="${periodToday.icon}" />
        <h1>${periodToday.temperature}°${periodToday.temperatureUnit}</h1>
        <div class="grow"></div>
        <span>
            ${periodToday.windSpeed} winds, facing ${periodToday.windDirection}
            <br>
            ${forecastResolverJSON.properties.elevation.value}m elevation
        </span>`;

    // To make the weekly forecast, we'll iterate through a set amount of days
    // in the future
    for (let i = 1; i <= 7; i++) {
        const periodOnThisDay = forecastResolverJSON.properties.periods[i];

        const dayElement = document.createElement("div");
        dayElement.classList.add("day");

        dayElement.innerHTML
            = `<img src="${periodOnThisDay.icon}" />
            <span class="day-temp">${periodOnThisDay.temperature}°${periodOnThisDay.temperatureUnit}</span>
            <span>${periodOnThisDay.shortForecast}</span>`

        dayElement.title = periodOnThisDay.detailedForecast;

        document.getElementById("weekly-forecast")?.appendChild(dayElement);
    }


    // good to show results now
    document.getElementById("results-section")!.style.display = "block";
});
