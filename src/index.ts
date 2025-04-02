import { APIGatewayEvent, Context } from "aws-lambda";
import {
  ComprehendClient,
  DetectEntitiesCommand,
} from "@aws-sdk/client-comprehend";
import axios from "axios";

// Initialize the Comprehend client in AWS
const comprehendClient = new ComprehendClient({ region: "us-east-1" });

// Initialize the Weather API
const WEATHER_API_KEY = "2a56111e0d4c4ebe8f030857250104";
const WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json";

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // Log the whole event

  const requestBody = JSON.parse(JSON.stringify(event, null, 2) || "{}");
  console.log("Parsed request body:", requestBody); // Check if parsed correctly

  const userMessage = requestBody.message || "No input received";

  // Analyze the text input
  const analyze = new DetectEntitiesCommand({
    Text: userMessage,
    LanguageCode: "en",
  });

  try {
    const response = await comprehendClient.send(analyze); // Send the command to AWS Comprehend

    // Extract locations by filtering by type "LOCATION"
    const location =
      response.Entities?.filter((entity) => entity.Type === "LOCATION").map(
        (loc) => loc.Text
      ) || []; // Map function just gets the text
    
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
    const weatherResponse = await axios.get(WEATHER_API_URL, {
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
  } catch (error) {
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
};
