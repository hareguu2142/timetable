const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

router.get('/:day', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('school');
    const collection = database.collection('timetable2024second');
    
    const day = req.params.day;
    const timetable = await collection.find({ Day: day }).toArray();
    
    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

module.exports = router;