const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Artist: { type: String, required: true },
    Year: { type: String, required: true },
    Category: { type: String, required: true },
    Medium: { type: String, required: true },
    Description: { type: String, required: false },
    Poster: { type: String, required: true }
});

module.exports = Artwork = mongoose.model('Artwork', artworkSchema);
