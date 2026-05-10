import { Request, Response } from 'express';
import prisma from '../config/db';

export const getBudgetItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const budgetItems = await prisma.budgetItem.findMany({
      where: { trip_id: tripId },
      include: {
        stop: {
          include: { city: true }
        }
      },
      orderBy: { category: 'asc' },
    });

    res.json(budgetItems);
  } catch (error) {
    console.error('Error fetching budget items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addBudgetItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const { stop_id, category, label, amount, currency } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!category || !label || amount === undefined) {
      return res.status(400).json({ error: 'Category, label, and amount are required' });
    }

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const newBudgetItem = await prisma.budgetItem.create({
      data: {
        trip_id: tripId,
        stop_id: stop_id || null,
        category,
        label,
        amount,
        currency: currency || 'USD',
      },
    });

    res.status(201).json(newBudgetItem);
  } catch (error) {
    console.error('Error adding budget item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBudgetItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const itemId = req.params.itemId as string;
    const { stop_id, category, label, amount, currency } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Verify budget item belongs to trip
    const budgetItem = await prisma.budgetItem.findUnique({ where: { id: itemId } });
    if (!budgetItem || budgetItem.trip_id !== tripId) {
       return res.status(404).json({ error: 'Budget item not found' });
    }

    const updatedItem = await prisma.budgetItem.update({
      where: { id: itemId },
      data: {
        ...(stop_id !== undefined && { stop_id: stop_id || null }),
        ...(category !== undefined && { category }),
        ...(label !== undefined && { label }),
        ...(amount !== undefined && { amount }),
        ...(currency !== undefined && { currency }),
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating budget item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBudgetItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const itemId = req.params.itemId as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Verify budget item belongs to trip
    const budgetItem = await prisma.budgetItem.findUnique({ where: { id: itemId } });
    if (!budgetItem || budgetItem.trip_id !== tripId) {
       return res.status(404).json({ error: 'Budget item not found' });
    }

    await prisma.budgetItem.delete({
      where: { id: itemId },
    });

    res.json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
