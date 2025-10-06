import express from 'express';
import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

const eventRoutes = (io) => {
    
    router.post('/', protect, async (req, res) => {
        try {
            const { name, description, date } = req.body;
            const event = new Event({ name, description, date, createdBy: req.user.id });
            await event.save();
            res.json(event);
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const events = await Event.find().populate('createdBy', 'name');
            res.json(events);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const event = await Event.findById(req.params.id)
                .populate('createdBy', 'name')
                .populate('attendees', 'name');

            if (!event) return res.status(404).json({ message: 'Event not found' });

            res.json(event);
        } catch (error) {
            console.error("Error fetching event:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.post('/:id/attend', protect, async (req, res) => {
        try {
            const { id } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid event ID" });
            }
    
            let event = await Event.findById(id);
            if (!event) return res.status(404).json({ message: 'Event not found' });
    
            // Ensure attendees array exists
            if (!Array.isArray(event.attendees)) {
                event.attendees = [];
            }
    
            // Convert attendees to strings for reliable comparison
            const attendeeIds = event.attendees.map(att => att.toString());
            
            if (!attendeeIds.includes(req.user.id)) {
                event.attendees.push(req.user.id);
                await event.save();
    
                // Populate attendees after update
                const updatedEvent = await Event.findById(id).populate('attendees', 'name');
                io.to(id).emit('updateAttendees', updatedEvent.attendees);
    
                return res.json(updatedEvent);
            }
    
            return res.status(400).json({ message: "User already attending the event" });
    
        } catch (error) {
            console.error("Error attending event:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
    

    return router;
};

export default eventRoutes;
