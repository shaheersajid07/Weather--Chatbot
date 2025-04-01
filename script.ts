
// Define the API Gateway endpoint URL (Replace this with your actual API URL)
const API_URL = "https://xvias0g8i0.execute-api.us-east-2.amazonaws.com/chatbot";

function getWeather() {
    const userInput = (document.getElementById("userInput") as HTMLInputElement).value;

    if (!userInput) {
        alert("Please enter a query.");
        return;
    }

    fetch(`${API_URL}?query=${encodeURIComponent(userInput)}`)
        .then(response => response.json())  // `fetch` returns a Promise
        .then(data => {
            (document.getElementById("response") as HTMLElement).innerText = data.reply;
        })
        .catch(error => {
            console.error("Error:", error);
            (document.getElementById("response") as HTMLElement).innerText = "Error fetching weather data.";
        });
}


