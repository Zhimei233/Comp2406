const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/userModel');
const Notification = require('./model/notificationModel');
const Review = require('./model/reviewModel');
const Like = require('./model/likeModel');
const Follow = require('./model/followModel');
const Artwork = require('./model/artworkModel'); 
const Workshop = require('./model/workshopModel');
const RegisteredWorkshop = require('./model/registeredWorkshopModel');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory
app.set('view engine', 'pug');
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

mongoose.connect('mongodb://127.0.0.1/final');

app.get('/', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    // Check if a user is already logged in
    if (req.session.user) {
        return res.status(400).send({ success: false, message: 'Another user is already logged in. Please log out first.' });
    }

    try {
        let user = await User.findOne({ name: req.body.username });
        if (user) {
            return res.send({ success: false, message: 'Username already exists, please choose another one.' });
        }
        user = new User({ name: req.body.username, password: req.body.password, type: 'Patron' });
        await user.save();

        // Set the session user
        req.session.user = user;
        res.send({ success: true, userId: user._id });
    } catch (error) {
        res.status(500).send('Error registering new user.');
    }
});

app.post('/login', async (req, res) => {
    // Check if a user is already logged in
    if (req.session.user) {
        return res.status(400).send({ success: false, message: 'Another user is already logged in. Please log out first.' });
    }

    try {
        const user = await User.findOne({ name: req.body.username });
        if (!user) {
            return res.status(400).send({ success: false, message: 'User does not exist.' });
        }
        if (user.password !== req.body.password) { 
            return res.status(401).send({ success: false, message: 'Incorrect password.' });
        }
        // Set the session user
        req.session.user = user;
        res.send({ success: true, userId: user._id });
    } catch (error) {
        res.status(500).send('Error during login.');
    }
});


// Correct the route to include the dynamic userId parameter
app.get('/:userId/profile', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        res.render('profile', {
            username: user.name,
            userType: user.type,
            userId: userId // Make sure to pass the userId here
        });
    } catch (error) {
        res.status(500).send('Error fetching user data.');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error in logging out:', err);
            return res.status(500).send('Error during logout.');
        }
        // Redirect to the home page or login page after logging out
        res.redirect('/');
    });
});

// Route for changing the user's account type with artwork check
app.post('/:userId/change-account-type', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (user.type === 'Patron') {
            if (await userHasArtworks(user.name)) {
                user.type = 'Artist';
                await user.save();
                res.send({ success: true, userType: user.type });
            } else {
                res.send({ success: false, message: 'You need at least one artwork to become an artist.', redirect: `/${userId}/addArtwork` });
            }
        } else if (user.type === 'Artist') {
            user.type = 'Patron';
            await user.save();
            res.send({ success: true, userType: user.type });
        }
    } catch (error) {
        res.status(500).send('Error changing account type.');
    }
});

// Function to check if the user has artworks
async function userHasArtworks(userName) {
    const artworksCount = await Artwork.countDocuments({ Artist: userName });
    return artworksCount > 0;
}


app.get('/:userId/notifications', async (req, res) => {
    const userId = req.params.userId;
    try {
        const notifications = await Notification.find({ userId });
        if (!notifications || notifications.length === 0) {
            res.render('notifications', { userId, message: "There's nothing here yet" });
        } else {
            res.render('notifications', { userId, notifications });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications.');
    }
});

app.get('/:userId/reviews', async (req, res) => {
    const userId = req.params.userId;
    try {
        const reviews = await Review.find({ userId });
        if (!reviews || reviews.length === 0) {
            res.render('reviews', { userId, message: "There's nothing here yet" });
        } else {
            res.render('reviews', { userId, reviews });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching reviews.');
    }
});


// Route to handle review deletion
app.post('/:userId/reviews/delete', async (req, res) => {
    const { reviewId } = req.body;
    try {
        await Review.findByIdAndDelete(reviewId);
        res.send({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting review');
    }
});


app.get('/:userId/likes', async (req, res) => {
    const userId = req.params.userId;
    try {
        const likes = await Like.find({ userId }).populate('artworkId');
        if (!likes || likes.length === 0) {
            res.render('likes', { userId, message: "There's nothing here yet" });
        } else {
            res.render('likes', { userId, likes });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching likes.');
    }
});

app.get('/:userId/follows', async (req, res) => {
    const userId = req.params.userId;
    try {
        const follows = await Follow.find({ userId }).populate('artistId');
        if (!follows || follows.length === 0) {
            res.render('follows', { userId, message: "There's nothing here yet" });
        } else {
            res.render('follows', { userId, follows });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching follows.');
    }
});


app.get('/:userId/addArtwork', async (req, res) => {
    const userId = req.params.userId;
    res.render('addArtwork', { userId: userId });
});

app.get('/:userId/addWorkshop', async (req, res) => {
    const userId = req.params.userId;
    res.render('addWorkshop', { userId: userId });
});


app.post('/:userId/artworks/add', async (req, res) => {
    const userId = req.params.userId;
    // Extract data from request body
    const { title, year, category, medium, description, poster } = req.body;

    try {
        // Check if artwork with the same title already exists
        const existingArtwork = await Artwork.findOne({ Title: new RegExp('^' + title.trim() + '$', 'i') });
        if (existingArtwork) {
            return res.status(400).send({ success: false, message: 'Artwork with this title already exists. Please choose a different title.' });
        }


        // Retrieve user for the artist's name
        const user = await User.findById(userId);

        // Create and save new artwork
        const newArtwork = new Artwork({ 
            Title: title, 
            Artist: user.name, 
            Year: year, 
            Category: category, 
            Medium: medium, 
            Description: description, 
            Poster: poster 
        });
        await newArtwork.save();

        // After saving the new artwork or workshop
        const followers = await Follow.find({ artistId: userId });
        followers.forEach(async (follower) => {
            await Notification.create({
                userId: follower.userId,
                content: `Your followed artist, ${user.name}, has added a new artwork.`
            });
        });
        let updatedUserType = user.type;

        res.send({ success: true, userType: updatedUserType, message: 'Artwork added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
    }
});


// Route for adding workshop
app.post('/:userId/workshops/add', async (req, res) => {
    const { userId } = req.params;
    const { title, description } = req.body;
    const user = await User.findById(userId);

    try {
        const artist = await User.findById(userId);
        if (!artist) {
            return res.status(404).send('Artist not found');
        }

        const newWorkshop = new Workshop({
            title,
            artistId: userId,
            description,
            artistName: artist.name 
        });

        await newWorkshop.save();

        const followers = await Follow.find({ artistId: userId });
        followers.forEach(async (follower) => {
            await Notification.create({
                userId: follower.userId,
                content: `Your followed artist, ${user.name}, has added a new workshop.`
            });
        });

        res.send({ success: true, message: 'Workshop added successfully.' });
    } catch (error) {
        res.status(500).send('Error adding workshop.');
    }
});


// Home page route
app.get('/:userId/home', async (req, res) => {
    const userId = req.params.userId;
    const artworks = await Artwork.find({});

    // New code to fetch artist user IDs
    for (let artwork of artworks) {
        const artistUser = await User.findOne({ name: artwork.Artist });
        artwork.artistUserId = artistUser ? artistUser._id : null;
    }

    res.render('home', { userId, artworks });
});

  
// Search results route
app.get('/:userId/artworks', async (req, res) => {
    const userId = req.params.userId;
    const query = req.query.search;
    const searchResults = await Artwork.find({
        $or: [
            { Title: new RegExp(query, 'i') },
            { Artist: new RegExp(query, 'i') },
            { Category: new RegExp(query, 'i') }
        ]
    });

    for (let artwork of searchResults) {
        const artistUser = await User.findOne({ name: artwork.Artist });
        artwork.artistUserId = artistUser ? artistUser._id : null;
    }

    // Check if there are no search results
    if (searchResults.length === 0) {
        return res.render('artwork-search-results', { 
            userId, 
            searchResults, 
            message: "No matching search results found." // Display this message when no results are found
        });
    }

    res.render('artwork-search-results', { userId, searchResults });
});



// Route for artwork detail page
app.get('/:userId/artworks/:artworkId', async (req, res) => {
    const { userId, artworkId } = req.params;
    const user = await User.findById(userId);
    const artwork = await Artwork.findById(artworkId);
    const artistUser = await User.findOne({ name: artwork.Artist });
    const reviews = await Review.find({ artworkId }).populate('userId', 'name');
    const likeCount = await Like.countDocuments({ artworkId });
    const alreadyLiked = await Like.findOne({ userId, artworkId });
    const isArtist = artwork.Artist === user.name;

    res.render('artworkDetail', {
        userId,
        artwork,
        artistUserId: artistUser._id,
        reviews,
        likeCount,
        alreadyLiked: !!alreadyLiked,
        isArtist
    });
});

// Route for adding a review
app.post('/:userId/artworks/:artworkId/reviews/add', async (req, res) => {
    const { userId, artworkId } = req.params;
    const { content } = req.body;

    try {
        const user = await User.findById(userId);
        const artwork = await Artwork.findById(artworkId);

        if (!user || !artwork) {
            return res.status(404).send({ message: 'User or Artwork not found' });
        }

        const newReview = new Review({
            userId,
            artworkId,
            content,
            userName: user.name, 
            artworkTitle: artwork.Title 
        });

        await newReview.save();
        res.send({ success: true, message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});



// Route for adding/removing a like
app.post('/:userId/artworks/:artworkId/likes/add', async (req, res) => {
    const { userId, artworkId } = req.params;

    const existingLike = await Like.findOne({ userId, artworkId });
    const artwork = await Artwork.findById(artworkId);

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        res.send({ success: true, message: 'Like removed' });
    } else {
        const newLike = new Like({ 
            userId, 
            artworkId,
            artworkTitle: artwork.Title
        });
        await newLike.save();
        res.send({ success: true, message: 'Like added' });
    }
});

// Artist profile route
app.get('/:userId/artists/:artistId', async (req, res) => {
    const { userId, artistId } = req.params;

    try {
        const artist = await User.findById(artistId);
        if (!artist) {
            return res.status(404).send('Artist not found');
        }

        const artworks = await Artwork.find({ Artist: artist.name });
        const workshops = await Workshop.find({ artistId: artist._id });
        const likeCounts = await Promise.all(artworks.map(async (artwork) => {
            return Like.countDocuments({ artworkId: artwork._id });
        }));
        const totalLikes = likeCounts.reduce((acc, count) => acc + count, 0);
        const isFollowing = await Follow.findOne({ userId, artistId }) != null;
        
        const artworkDisplays = artworks.map(artwork => ({
            _id: artwork._id,
            title: artwork.Title,
            poster: artwork.Poster
        }));

        for (let workshop of workshops) {
            const isRegistered = await RegisteredWorkshop.findOne({ userId, workshopId: workshop._id });
            workshop.isRegistered = !!isRegistered;
        }

        res.render('artistDetail', {
            userId,
            artistName: artist.name,
            totalArtworks: artworks.length,
            totalLikes,
            workshops,
            artworks,
            artworks: artworkDisplays,
            isFollowing,
            artistId,
            workshops
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching artist data.');
    }
});


// Follow artist route
app.post('/:userId/follow/:artistId', async (req, res) => {
    const { userId, artistId } = req.params;
    try {
        const artist = await User.findById(artistId);
        if (!artist) {
            return res.status(404).send('Artist not found');
        }

        const existingFollow = await Follow.findOne({ userId, artistId });
        if (!existingFollow) {
            const newFollow = new Follow({
                userId, 
                artistId, 
                artistName: artist.name 
            });
            await newFollow.save();
            res.send({ success: true, message: 'Followed artist successfully.' });
        } else {
            res.send({ success: false, message: 'Already following this artist.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing follow.');
    }
});


// Unfollow artist route
app.post('/:userId/unfollow/:artistId', async (req, res) => {
    const { userId, artistId } = req.params;
    try {
        const follow = await Follow.findOneAndDelete({ userId, artistId });
        if (follow) {
            res.send({ success: true, message: 'Unfollowed artist successfully.' });
        } else {
            res.send({ success: false, message: 'Not following this artist.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing unfollow.');
    }
});


app.post('/:userId/registerWorkshop/:workshopId', async (req, res) => {
    const { userId, workshopId } = req.params;
    try {
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).send('Workshop not found');
        }

        const newRegistration = new RegisteredWorkshop({
            userId,
            workshopId,
            workshopTitle: workshop.title,
            artistId: workshop.artistId,
            artistName: workshop.artistName,
        });
        await newRegistration.save();
        res.send({ success: true, message: 'Registered for workshop successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering for workshop.');
    }
});

app.get('/:userId/workshops', async (req, res) => {
    const userId = req.params.userId;
    let createdWorkshops = [];
    let registeredWorkshops = [];

    const user = await User.findById(userId);
    if (user.type === 'Artist') {
        createdWorkshops = await Workshop.find({ artistId: userId });
    }

    registeredWorkshops = await RegisteredWorkshop.find({ userId }).populate('workshopId');

    res.render('workshop', {
        userId,
        userType: user.type,
        createdWorkshops,
        registeredWorkshops: registeredWorkshops.map(rw => ({
            workshopTitle: rw.workshopTitle,
            description: rw.description,
            artistId: rw.artistId,
            artistName: rw.artistName
        }))
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
