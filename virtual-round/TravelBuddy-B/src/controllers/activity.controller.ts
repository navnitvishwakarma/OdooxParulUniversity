import { Request, Response } from 'express';
import prisma from '../config/db';

export const searchActivities = async (req: Request, res: Response) => {
  try {
    const { city_id, type } = req.query;

    // Validate enum if type is provided
    let activityType;
    if (type) {
      const validTypes = ['SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'NIGHTLIFE', 'OTHER'];
      if (validTypes.includes((type as string).toUpperCase())) {
        activityType = (type as string).toUpperCase();
      }
    }

    const activities = await prisma.activity.findMany({
      where: {
        ...(city_id && { city_id: city_id as string }),
        ...(activityType && { type: activityType as any }),
      },
      orderBy: { name: 'asc' },
      take: 50,
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
