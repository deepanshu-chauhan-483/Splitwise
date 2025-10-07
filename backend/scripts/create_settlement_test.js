import 'dotenv/config';
import mongoose from 'mongoose';
import Settlement from '../src/models/Settlement.model.js';
import { Types } from 'mongoose';

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SplitwiseDB';
  console.log('Connecting to', uri);
  try {
    await mongoose.connect(uri, { dbName: 'SplitwiseDB' });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Connection failed', err);
    process.exit(1);
  }

  try {
    const s = await Settlement.create({
      groupId: null,
      fromUser: new Types.ObjectId('000000000000000000000001'),
      toUser: new Types.ObjectId('000000000000000000000002'),
      amount: 10,
      note: 'Automated test settlement',
      createdBy: new Types.ObjectId('000000000000000000000001')
    });
    console.log('Created settlement:', s);
  } catch (err) {
    console.error('Failed to create settlement', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
