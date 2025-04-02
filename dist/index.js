"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_comprehend_1 = require("@aws-sdk/client-comprehend");
const axios_1 = __importDefault(require("axios"));
// Initialize the Comprehend client in AWS
const comprehendClient = new client_comprehend_1.ComprehendClient({ region: "us-east-1" });
// Initialize the Weather API
const WEATHER_API_KEY = "2a56111e0d4c4ebe8f030857250104";
const WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json";
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Received event:", JSON.stringify(event, null, 2)); // Log the whole event
    const requestBody = JSON.parse(JSON.stringify(event, null, 2) || "{}");
    console.log("Parsed request body:", requestBody); // Check if parsed correctly
    const userMessage = requestBody.message || "No input received";
    // Analyze the text input
    const analyze = new client_comprehend_1.DetectEntitiesCommand({
        Text: userMessage,
        LanguageCode: "en",
    });
    try {
        const response = yield comprehendClient.send(analyze); // Send the command to AWS Comprehend
        // Extract locations by filtering by type "LOCATION"
        const location = ((_a = response.Entities) === null || _a === void 0 ? void 0 : _a.filter((entity) => entity.Type === "LOCATION").map((loc) => loc.Text)) || []; // Map function just gets the text
        // If no locations were found in the text
        if (location.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `You said: ${userMessage}`,
                    locations: location.length ? location : "No locations found",
                }),
            };
        }
        // First location found
        const loc = location[0];
        // Make the call to the Weather API
        const weatherResponse = yield axios_1.default.get(WEATHER_API_URL, {
            params: {
                key: WEATHER_API_KEY,
                q: loc,
            },
        });
        // Extract data from API response
        const weatherData = weatherResponse.data;
        // Return the weather data if successful
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                message: `You asked about the weather in ${loc}`,
                locations: weatherData.location.name,
                temperature: `${weatherData.current.temp_f}F`,
                condition: weatherData.current.condition.text,
            }),
        };
    }
    catch (error) {
        // Log errors
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: "Failed to process" }),
        };
    }
});
exports.handler = handler;
