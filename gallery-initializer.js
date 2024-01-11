const mongoose = require('mongoose');
const Artwork = require('./model/artworkModel'); 
const User = require('./model/userModel'); 
const Notification = require('./model/notificationModel'); 
const Review = require('./model/reviewModel'); 
const Like = require('./model/likeModel');
const Follow = require('./model/followModel'); 
const Workshop = require('./model/workshopModel'); 
const RegisteredWorkshop = require('./model/registeredWorkshopModel');
const fs = require('fs');
const path = require('path');

// Load the artwork data from gallery.json
const artworksData = fs.readFileSync(path.join(__dirname, 'gallery.json'));
const artworks = JSON.parse(artworksData);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/final');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
  // Clear the collections if they exist
  await Artwork.deleteMany({});
  await User.deleteMany({});
  await Notification.deleteMany({});
  await Review.deleteMany({});
  await Like.deleteMany({});
  await Follow.deleteMany({});
  await Workshop.deleteMany({});

  // Re-creation of artworks data
  let savedArtworks = [];
  for (const artworkData of artworks) {
    const artwork = new Artwork(artworkData);
    try {
      const savedArtwork = await artwork.save();
      savedArtworks.push(savedArtwork);
      console.log(`Saved artwork: ${savedArtwork.Title}`);
    } catch (err) {
      console.error('Error saving artwork: ', err);
    }
  }
  console.log('All artworks saved.');

  let artistNames = new Set();
  for (const artworkData of artworks) {
    artistNames.add(artworkData.Artist);
  }

  for (const artistName of artistNames) {
    let artistUser = await User.findOne({ name: artistName });
    if (!artistUser) {
      artistUser = new User({
        name: artistName,
        password: '000', // Default password
        type: 'Artist'
      });
      await artistUser.save();
    }
  }

  // Example user creation
  const exampleUser = new User({
    name: 'exampleUsername',
    password: 'examplePassword',
    type: 'Patron'
  });
  await exampleUser.save();

  // Example notification creation
  const exampleNotification = new Notification({
    userId: exampleUser._id,
    content: 'Welcome to the Art Gallery!'
  });
  await exampleNotification.save();

  // Example review creation
  const exampleReview = new Review({
    userId: exampleUser._id,
    artworkId: savedArtworks[0]._id, 
    content: 'Incredible piece of art!',
    artworkTitle: savedArtworks[0].Title,
    userName: exampleUser.name
  });
  await exampleReview.save();

  // Example like creation
  const exampleLike = new Like({
    userId: exampleUser._id,
    artworkId: savedArtworks[0]._id,
    artworkTitle: savedArtworks[0].Title
  });
  await exampleLike.save();

  // Example follow creation
  const exampleFollow = new Follow({
    userId: exampleUser._id,
    artistId: exampleUser._id, 
    artistName: exampleUser.name
  });
  await exampleFollow.save();

  // Example workshop creation
  const exampleWorkshop = new Workshop({
    title: 'Art Workshop',
    artistId: exampleUser._id,
    description: 'new workshop',
    artistName: exampleUser.name
  });
  await exampleWorkshop.save();

  // Example registered workshop creation
  const exampleRegisteredWorkshop = new RegisteredWorkshop({
    userId: exampleUser._id,
    workshopId: exampleWorkshop._id,
    workshopTitle: exampleWorkshop.title,
    artistId: exampleWorkshop.artistId,
    artistName: exampleWorkshop.artistName
  });
  await exampleRegisteredWorkshop.save();

  console.log('All collections initialized.');
});
