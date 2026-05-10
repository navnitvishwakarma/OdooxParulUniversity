import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const email = req.user?.email;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find user in our database, or create them if they don't exist yet
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: email || '',
          name: req.user?.user_metadata?.full_name || email?.split('@')[0] || 'User',
          avatar_url: req.user?.user_metadata?.avatar_url || null,
        }
      });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { name, phone, location, bio, avatar_url } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        location,
        bio,
        avatar_url
      }
    });

    res.json(user);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
