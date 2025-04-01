// Define the API Gateway endpoint URL (Replace this with your actual API URL)
var API_URL = "https://xvias0g8i0.execute-api.us-east-2.amazonaws.com/chatbot";
function getWeather() {
    var userInput = document.getElementById("userInput").value;
    if (!userInput) {
        alert("Please enter a query.");
        return;
    }
    fetch("".concat(API_URL, "?query=").concat(encodeURIComponent(userInput)))
        .then(function (response) { return response.json(); }) // `fetch` returns a Promise
        .then(function (data) {
        document.getElementById("response").innerText = data.reply;
    })
        .catch(function (error) {
        console.error("Error:", error);
        document.getElementById("response").innerText = "Error fetching weather data.";
    });
}
