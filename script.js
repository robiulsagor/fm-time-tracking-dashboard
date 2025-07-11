const container = document.querySelector(".container");
const cardTypes = ["work", "play", "study", "exercise", "social", "self-care"];
var timeframeButtons = ["daily", "weekly", "monthly"]; // Array of timeframe buttons
var selectedTimeframe = timeframeButtons[1]; // Default timeframe

const previousLabels = {
  daily: "Yesterday",
  weekly: "Last Week",
  monthly: "Last Month",
};

const fetchData = async () => {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const generateProfileCard = () => {
  return ` <div class="card profile">
        <div class="profile-info">
          <img src="./images/image-jeremy.png" alt="Profile Picture" class="profile-picture">
          <div class="profile-text">
            <p class="profile-text__greeting">Report for</p>
            <h1 class="profile-text__name">Jeremy Robson</h1>
          </div>
         </div>
         
         <div class="profile-timeframe">
        ${timeframeButtons
          .map((timeframe) => {
            return `<button data-timeframe="${timeframe}" class="profile-timeframe__button 
            ${timeframe === selectedTimeframe ? "active" : ""}">
            ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</button>`;
          })
          .join("")}
          
        </div>
      </div>`;
};

const bindTimeframeButtons = () => {
  const buttons = document.querySelectorAll(".profile-timeframe__button");

  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (e.target.classList.contains("active")) {
        return; // Exit if the clicked button is already active
      }

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      selectedTimeframe = e.target.getAttribute("data-timeframe");

      paintCards();
    });
  });
};

const paintCards = async () => {
  const data = await fetchData();

  container.innerHTML = generateProfileCard();
  bindTimeframeButtons();

  cardTypes.forEach((card, index) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card", card);

    cardContainer.innerHTML = `<div class="card-top"> 
          <h2 class="card-left__title">${data[index].title} </h2>
          <div class="option">
            <img src="./images/icon-ellipsis.svg" alt="options icon" class="card-option__icon">
          </div>
        </div>

        <div class="card-bottom">
          <p class="card-left__hours">${data[index].timeframes[selectedTimeframe].current}hrs</p>
          <p class="card-right__previous-hours">${previousLabels[selectedTimeframe]} - ${data[index].timeframes[selectedTimeframe].previous}hrs</p>
        </div>
      `;

    container.appendChild(cardContainer);
  });
};

document.addEventListener("DOMContentLoaded", paintCards);
