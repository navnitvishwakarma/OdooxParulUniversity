import { Request, Response } from 'express';
import prisma from '../config/db';

export const getChecklistItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const checklistItems = await prisma.checklistItem.findMany({
      where: { trip_id: tripId },
      orderBy: { category: 'asc' },
    });

    res.json(checklistItems);
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addChecklistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const { category, label, is_packed } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!category || !label) {
      return res.status(400).json({ error: 'Category and label are required' });
    }

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const newItem = await prisma.checklistItem.create({
      data: {
        trip_id: tripId,
        category,
        label,
        is_packed: is_packed || false,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding checklist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateChecklistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const itemId = req.params.itemId as string;
    const { category, label, is_packed } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Verify item belongs to trip
    const item = await prisma.checklistItem.findUnique({ where: { id: itemId } });
    if (!item || item.trip_id !== tripId) {
       return res.status(404).json({ error: 'Checklist item not found' });
    }

    const updatedItem = await prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        ...(category !== undefined && { category }),
        ...(label !== undefined && { label }),
        ...(is_packed !== undefined && { is_packed }),
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteChecklistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const itemId = req.params.itemId as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Verify item belongs to trip
    const item = await prisma.checklistItem.findUnique({ where: { id: itemId } });
    if (!item || item.trip_id !== tripId) {
       return res.status(404).json({ error: 'Checklist item not found' });
    }

    await prisma.checklistItem.delete({
      where: { id: itemId },
    });

    res.json({ message: 'Checklist item deleted successfully' });
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
