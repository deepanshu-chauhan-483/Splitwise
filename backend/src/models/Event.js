import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Event', EventSchema);