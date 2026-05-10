import { Request, Response } from 'express';
import prisma from '../config/db';

// Get all trips for the authenticated user
export const getTrips = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const trips = await prisma.trip.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { stops: true }
        },
        budgetItems: {
          select: { amount: true }
        }
      }
    });

    // Map trips to include calculated total_budget from items if the column is null
    const tripsWithBudget = trips.map((trip: any) => {
      const itemsTotal = trip.budgetItems.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
      return {
        ...trip,
        total_budget: trip.total_budget ? Number(trip.total_budget) : itemsTotal,
        budgetItems: undefined // Don't send the full list to dashboard
      };
    });

    res.json(tripsWithBudget);
  } catch (error: any) {
    console.error('Error fetching trips:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new trip
export const createTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, description, cover_photo_url, start_date, end_date, is_public } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Trip name is required' });
    }

    console.log(`[Trip] Creating trip for user ${userId}: ${name} (Public: ${is_public})`);

    const newTrip = await prisma.trip.create({
      data: {
        name,
        description,
        cover_photo_url,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        user_id: userId,
        is_public: !!is_public,
      },
    });

    console.log(`[Trip] Successfully created trip ${newTrip.id}`);

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single trip's details
export const getTripById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid Trip ID' });
    }

    console.log(`[Trip] Fetching trip ${id} for user ${userId}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const trip = await prisma.trip.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            name: true,
            avatar_url: true,
          }
        },
        stops: {
          include: {
            city: true,
            stopActivities: {
              include: {
                activity: true
              },
              orderBy: { scheduled_time: 'asc' }
            }
          },
          orderBy: { order_index: 'asc' }
        },
      },
    });

    if (!trip) {
      console.warn(`[Trip] Trip ${id} not found`);
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.user_id !== userId && !trip.is_public) {
      console.warn(`[Trip] Unauthorized access attempt to trip ${id} by user ${userId}`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Convert Decimals to Numbers and map stopActivities -> stop_activities for frontend
    const formattedTrip = {
      ...trip,
      total_budget: trip.total_budget ? Number(trip.total_budget) : 0,
      stops: (trip as any).stops.map((stop: any) => ({
        ...stop,
        stopActivities: undefined,
        stop_activities: (stop.stopActivities || []).map((sa: any) => ({
          ...sa,
          activity: {
            ...sa.activity,
            estimated_cost: sa.activity.estimated_cost ? Number(sa.activity.estimated_cost) : 0
          }
        }))
      }))
    };

    res.json(formattedTrip);
  } catch (error: any) {
    console.error(`[Trip] Error fetching trip ${req.params.id}:`, error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

// Update a trip
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const id = req.params.id as string;
    const { name, description, cover_photo_url, start_date, end_date, is_public, total_budget } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify ownership
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(cover_photo_url !== undefined && { cover_photo_url }),
        ...(start_date !== undefined && { start_date: start_date ? new Date(start_date) : null }),
        ...(end_date !== undefined && { end_date: end_date ? new Date(end_date) : null }),
        ...(is_public !== undefined && { is_public }),
        ...(total_budget !== undefined && { total_budget }),
      },
    });

    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a trip
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const id = req.params.id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify ownership
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.trip.delete({
      where: { id },
    });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- STOPS APIs ---

// Get all stops for a trip
export const getStops = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const stops = await prisma.stop.findMany({
      where: { trip_id: tripId },
      orderBy: { order_index: 'asc' },
      include: {
        city: true,
      },
    });

    res.json(stops);
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a stop to a trip
export const addStop = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const { city_id, arrival_date, departure_date, notes } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!city_id) return res.status(400).json({ error: 'city_id is required' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Determine max order_index
    const maxOrderStop = await prisma.stop.findFirst({
      where: { trip_id: tripId },
      orderBy: { order_index: 'desc' },
    });
    const nextOrderIndex = maxOrderStop ? maxOrderStop.order_index + 1 : 0;

    const newStop = await prisma.stop.create({
      data: {
        trip_id: tripId,
        city_id,
        arrival_date: arrival_date ? new Date(arrival_date) : null,
        departure_date: departure_date ? new Date(departure_date) : null,
        order_index: nextOrderIndex,
        notes,
      },
      include: { city: true }
    });

    res.status(201).json(newStop);
  } catch (error) {
    console.error('Error adding stop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a stop
export const updateStop = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const stopId = req.params.stopId as string;
    const { arrival_date, departure_date, notes } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updatedStop = await prisma.stop.update({
      where: { id: stopId },
      data: {
        ...(arrival_date !== undefined && { arrival_date: arrival_date ? new Date(arrival_date) : null }),
        ...(departure_date !== undefined && { departure_date: departure_date ? new Date(departure_date) : null }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(updatedStop);
  } catch (error) {
    console.error('Error updating stop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a stop
export const deleteStop = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const stopId = req.params.stopId as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.stop.delete({
      where: { id: stopId },
    });

    res.json({ message: 'Stop deleted successfully' });
  } catch (error) {
    console.error('Error deleting stop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reorder stops
export const reorderStops = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const tripId = req.params.id as string;
    const { stopIds } = req.body; // Array of stop IDs in the new desired order

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!Array.isArray(stopIds)) return res.status(400).json({ error: 'stopIds array is required' });

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updatePromises = stopIds.map((id, index) =>
      prisma.stop.update({
        where: { id },
        data: { order_index: index },
      })
    );

    await prisma.$transaction(updatePromises);

    res.json({ message: 'Stops reordered successfully' });
  } catch (error) {
    console.error('Error reordering stops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicTrips = async (req: Request, res: Response) => {
  try {
    const publicTrips = await prisma.trip.findMany({
      where: {
        is_public: true,
        OR: [
          { name: { contains: 'Vadodara', mode: 'insensitive' } },
          { description: { contains: 'Vadodara', mode: 'insensitive' } },
          { stops: { some: { city: { name: { contains: 'Vadodara', mode: 'insensitive' } } } } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
            location: true,
            bio: true
          }
        },
        _count: {
          select: { stops: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(publicTrips);
  } catch (error: any) {
    console.error('Error fetching public trips:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const joinTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;
    const tripId = id as string;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // 1. Fetch the source trip with its stops and activities
    const sourceTrip = await (prisma.trip as any).findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: {
            stopActivities: {
              include: {
                activity: true
              }
            }
          }
        }
      }
    });

    if (!sourceTrip) return res.status(404).json({ error: 'Trip not found' });
    if (!sourceTrip.is_public && sourceTrip.user_id !== userId) {
      return res.status(403).json({ error: 'This trip is private and cannot be joined' });
    }

    // 2. Create a new trip for the user
    const newTrip = await prisma.trip.create({
      data: {
        name: `${sourceTrip.name} (Joined)`,
        description: sourceTrip.description,
        cover_photo_url: sourceTrip.cover_photo_url,
        start_date: sourceTrip.start_date,
        end_date: sourceTrip.end_date,
        user_id: userId,
        total_budget: sourceTrip.total_budget,
        is_public: false // Cloned trips are private by default
      }
    });

    // 3. Clone stops and activities
    const stops = (sourceTrip as any).stops || [];
    for (const stop of stops) {
      const newStop = await prisma.stop.create({
        data: {
          trip_id: newTrip.id,
          city_id: stop.city_id,
          arrival_date: stop.arrival_date,
          departure_date: stop.departure_date,
          order_index: stop.order_index,
          notes: stop.notes
        }
      });

      const stopActivities = (stop as any).stopActivities || [];
      for (const sa of stopActivities) {
        await prisma.stopActivity.create({
          data: {
            stop_id: newStop.id,
            activity_id: sa.activity_id,
            scheduled_time: sa.scheduled_time,
            notes: sa.notes
          }
        });
      }
    }

    res.status(201).json(newTrip);
  } catch (error: any) {
    console.error('Error joining trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
