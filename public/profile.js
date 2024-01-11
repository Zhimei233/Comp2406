document.addEventListener('DOMContentLoaded', function() {
    const userId = window.location.pathname.split('/')[1];

    const accountTypeButton = document.getElementById('accountType');
    const notificationsButton = document.getElementById('notifications');
    const reviewsButton = document.getElementById('reviews');
    const likesButton = document.getElementById('likes');
    const followsButton = document.getElementById('follows');
    const addArtworkButton = document.getElementById('addArtwork');
    const addWorkshopButton = document.getElementById('addWorkshop');

    accountTypeButton.addEventListener('click', function() {
        const request = new XMLHttpRequest();
        request.open('POST', `/${userId}/change-account-type`, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);
                if (response.success) {
                    alert('Account type changed to ' + response.userType);
                    window.location.reload();
                } else {
                    alert(response.message);
                    if (response.redirect) {
                        window.location.href = `/${userId}/addArtwork`;
                    }
                }
            }
        };
        request.send(JSON.stringify({ userId: userId }));
    });    

    notificationsButton.addEventListener('click', function() {
        window.location.href = `/${userId}/notifications`;
    });

    reviewsButton.addEventListener('click', function() {
        window.location.href = `/${userId}/reviews`;
    });

    likesButton.addEventListener('click', function() {
        window.location.href = `/${userId}/likes`;
    });

    followsButton.addEventListener('click', function() {
        window.location.href = `/${userId}/follows`;
    });

    if (userType === 'Artist') {
        addArtworkButton.addEventListener('click', function() {
            window.location.href = `/${userId}/addArtwork`;
        });

        addWorkshopButton.addEventListener('click', function() {
            window.location.href = `/${userId}/addWorkshop`;
        });
    }

    const profileLink = document.querySelector('a[href$="/profile"]');
    profileLink.setAttribute('href', `/${userId}/profile`);

    // Set the href attribute for the Home link
    const homeLink = document.querySelector('a[href$="/home"]');
    homeLink.setAttribute('href', `/${userId}/home`);

    // Function to update artwork links
    function updateArtworkLinks() {
        document.querySelectorAll('.artwork-link').forEach(link => {
            const artworkId = link.getAttribute('href').substring(1); 
            link.setAttribute('href', `/${userId}/artworks/${artworkId}`);
        });
    }

    // Call the function to update links
    updateArtworkLinks();
});

function deleteReview(reviewId) {
    const userId = window.location.pathname.split('/')[1]; // Get userId from the URL
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/${userId}/reviews/delete`, true); // Corrected URL
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            alert('Review deleted successfully');
            window.location.reload();
        }
    };
    xhr.send(JSON.stringify({ reviewId }));
}

