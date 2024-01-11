const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
    artworkTitle: { type: String, required: true }
});

module.exports = mongoose.model('Like', likeSchema);
