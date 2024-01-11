const mongoose = require('mongoose');

const registeredWorkshopSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
  workshopTitle: { type: String, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistName: { type: String, required: true }
});

module.exports = mongoose.model('RegisteredWorkshop', registeredWorkshopSchema);
