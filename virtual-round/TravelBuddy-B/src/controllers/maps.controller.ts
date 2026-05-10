import { Request, Response } from 'express';
import { getNearbyPlaces } from '../services/maps.service';

export const getNearby = async (req: Request, res: Response) => {
  const { location, type } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    const places = await getNearbyPlaces(location as string, type as string || 'restaurant');
    res.json(places);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
