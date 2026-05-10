import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export const getNearbyPlaces = async (location: string, type: string = 'restaurant') => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API Key is missing");
  }

  try {
    // 1. Get coordinates for the location name
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`;
    const geoRes = await axios.get(geoUrl);
    
    if (geoRes.data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${geoRes.data.status}`);
    }

    const { lat, lng } = geoRes.data.results[0].geometry.location;

    // 2. Search for nearby places
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
    const placesRes = await axios.get(placesUrl);

    if (placesRes.data.status !== 'OK' && placesRes.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API failed: ${placesRes.data.status}`);
    }

    return placesRes.data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating,
      address: place.vicinity,
      image: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` : null,
      location: place.geometry.location
    }));
  } catch (error: any) {
    console.error("Google Maps API Error:", error.message);
    throw new Error("Failed to fetch nearby places");
  }
};
