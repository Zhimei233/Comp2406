document.addEventListener('DOMContentLoaded', function() {
    const followButton = document.getElementById('followButton');
    const unfollowButton = document.getElementById('unfollowButton');
    const userId = window.location.pathname.split('/')[1];
    const artistId = window.location.pathname.split('/')[3];

    followButton?.addEventListener('click', function() {
        followOrUnfollowArtist('follow');
    });

    unfollowButton?.addEventListener('click', function() {
        followOrUnfollowArtist('unfollow');
    });

    function followOrUnfollowArtist(action) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/${userId}/${action}/${artistId}`, true); 
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert(`You have ${action === 'follow' ? 'followed' : 'unfollowed'} the artist.`);
                window.location.reload();
            }
        };
        xhr.send();
    }

    document.querySelectorAll('.workshop-register-button').forEach(button => {
        button.addEventListener('click', function() {
            const workshopId = this.dataset.workshopId;
            registerForWorkshop(workshopId);
        });
    });
    

    function registerForWorkshop(workshopId, artistName) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/${userId}/registerWorkshop/${workshopId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert('You have successfully registered for the workshop.');
                window.location.reload();
            }
        };
        xhr.send(JSON.stringify({ userId, workshopId, artistName })); // Include artistName here
    }
    

});
