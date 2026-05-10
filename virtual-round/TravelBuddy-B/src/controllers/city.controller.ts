import { Request, Response } from 'express';
import prisma from '../config/db';

export const createCity = async (req: Request, res: Response) => {
  try {
    const { name, country, region, lat, lng } = req.body;
    if (!name || !country) {
      return res.status(400).json({ error: 'name and country are required' });
    }
    // Upsert: return existing city if it already exists
    const existing = await prisma.city.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, country: { equals: country, mode: 'insensitive' } }
    });
    if (existing) return res.json(existing);

    const city = await prisma.city.create({
      data: { name, country, region: region || null, lat: lat || null, lng: lng || null, popularity_score: 0 }
    });
    res.status(201).json(city);
  } catch (error) {
    console.error('Error creating city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchCities = async (req: Request, res: Response) => {
  try {
    const { q, region } = req.query;

    const cities = await prisma.city.findMany({
      where: {
        ...(q && { name: { contains: q as string, mode: 'insensitive' } }),
        ...(region && { region: region as string }),
      },
      orderBy: { popularity_score: 'desc' },
      take: 20,
    });

    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCityById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: {
          take: 10,
          orderBy: { estimated_cost: 'asc' },
        },
      },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
