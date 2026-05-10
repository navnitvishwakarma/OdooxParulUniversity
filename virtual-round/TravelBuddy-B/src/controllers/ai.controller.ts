import { Request, Response } from 'express';
import { getTripSuggestions } from '../services/ai.service';

export const suggestItinerary = async (req: Request, res: Response) => {
  const { destination, days, preferences } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: "Destination and days are required" });
  }

  try {
    const suggestions = await getTripSuggestions(destination, parseInt(days), preferences);
    res.json(suggestions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
