const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
    content: { type: String, required: true },
    artworkTitle: { type: String, required: true },
    userName: { type: String, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
