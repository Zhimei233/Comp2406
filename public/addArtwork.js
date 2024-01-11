document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function() {
        // Collect form data
        const artworkData = {
            title: document.getElementById('title').value,
            year: document.getElementById('year').value,
            category: document.getElementById('category').value,
            medium: document.getElementById('medium').value,
            description: document.getElementById('description').value,
            poster: document.getElementById('poster').value,
        };

        // Check if all required fields are filled
        if (!artworkData.title || !artworkData.year || !artworkData.category || !artworkData.medium || !artworkData.description || !artworkData.poster) {
            alert('Please fill in all the required fields.');
            return;
        }

        // AJAX request to add artwork
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/${userId}/artworks/add`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const response = JSON.parse(this.responseText);
                    // Artwork added successfully
                    alert('Artwork added successfully');
                    if (response.userType !== 'Artist') {
                        updateUserType(userId); // Call only if user is not an Artist
                    } else {
                        window.location.href = `/${userId}/profile`; // Redirect to profile
                    }
                } else if(this.status === 400){
                    const response = JSON.parse(this.responseText);
                    alert(response.message);
                    window.location.reload();
                }else {
                    const response = JSON.parse(this.responseText);
                    alert(response.message); // Handle error
                }
            }
        };
        xhr.send(JSON.stringify(artworkData));
    });
});

function updateUserType(userId) {
    // AJAX request to update user type
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/${userId}/change-account-type`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            if (response.success) {
                window.location.href = `/${userId}/profile`; // Redirect to profile
            }
        }
    };
    xhr.send(JSON.stringify({ userId: userId }));
}
