import { Request, Response } from 'express';
import prisma from '../config/db';

export const searchCities = async (req: Request, res: Response) => {
  try {
    const { q, region } = req.query;

    let cities = await prisma.city.findMany({
      where: {
        ...(q && { name: { contains: q as string, mode: 'insensitive' } }),
        ...(region && { region: region as string }),
      },
      orderBy: { popularity_score: 'desc' },
      take: 20,
    });

    if (cities.length === 0 && q && typeof q === 'string') {
      const newCity = await prisma.city.create({
        data: {
          name: q.charAt(0).toUpperCase() + q.slice(1),
          country: 'India',
          popularity_score: 50,
          image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
        }
      });
      cities = [newCity];
    }

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
