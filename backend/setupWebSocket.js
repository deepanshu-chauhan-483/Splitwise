import { Server } from 'socket.io';
import Event from './src/models/Event.js';

export const setupWebSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "*", credentials: true }
    });
    

    io.on('connection', (socket) => {
        console.log('New client is now connected');

       
        socket.on('joinEvent', (eventId) => {
            socket.join(eventId);
        });

        
        socket.on('attendEvent', async (eventId, userId) => {
            try {
                const event = await Event.findById(eventId).populate('attendees', 'name');
                if (!event) return;

               
                if (!event.attendees.some(attendee => attendee._id.equals(userId))) {
                    event.attendees.push(userId);
                    await event.save();
                }

                
                io.to(eventId).emit('updateAttendees', event.attendees);
            } catch (error) {
                console.error('Error updating attendees:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io; 
};
