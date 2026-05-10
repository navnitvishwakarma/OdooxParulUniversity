import { Request, Response } from 'express';
import prisma from '../config/db';

// Get all activities for a stop
export const getStopActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const stopId = req.params.stopId as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify ownership of the trip that this stop belongs to
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });

    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    if (stop.trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const stopActivities = await prisma.stopActivity.findMany({
      where: { stop_id: stopId },
      include: {
        activity: true,
      },
      orderBy: { scheduled_time: 'asc' },
    });

    res.json(stopActivities);
  } catch (error) {
    console.error('Error fetching stop activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add an activity to a stop
export const addStopActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const stopId = req.params.stopId as string;
    const { activity_id, scheduled_time, notes } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!activity_id) return res.status(400).json({ error: 'activity_id is required' });

    // Verify ownership of the trip that this stop belongs to
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });

    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    if (stop.trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const newStopActivity = await prisma.stopActivity.create({
      data: {
        stop_id: stopId,
        activity_id,
        scheduled_time: scheduled_time ? new Date(scheduled_time) : null,
        notes,
      },
      include: { activity: true }
    });

    res.status(201).json(newStopActivity);
  } catch (error) {
    console.error('Error adding activity to stop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove an activity from a stop
export const deleteStopActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const stopId = req.params.stopId as string;
    const id = req.params.id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify ownership of the trip that this stop belongs to
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });

    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    if (stop.trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Make sure the StopActivity actually belongs to this stop
    const stopActivity = await prisma.stopActivity.findUnique({ where: { id } });
    if (!stopActivity || stopActivity.stop_id !== stopId) {
       return res.status(404).json({ error: 'Stop Activity not found' });
    }

    await prisma.stopActivity.delete({
      where: { id },
    });

    res.json({ message: 'Activity removed from stop' });
  } catch (error) {
    console.error('Error deleting stop activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
