// Define the API Gateway endpoint URL (Replace this with your actual API URL)
var API_URL = "https://us-east-2.console.aws.amazon.com/apigateway/main/apis/xvias0g8i0/resources/?api=xvias0g8i0&experience=rest&region=us-east-2";
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
