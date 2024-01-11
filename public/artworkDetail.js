document.addEventListener('DOMContentLoaded', function() {
    const userId = window.location.pathname.split('/')[1];
    const artworkId = window.location.pathname.split('/')[3];
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const likeBtn = document.getElementById('likeBtn');

    submitReviewBtn.addEventListener('click', function() {
        const reviewContent = document.getElementById('reviewContent').value;
        if (!reviewContent.trim()) {
            alert('Please write a review before submitting.');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/${userId}/artworks/${artworkId}/reviews/add`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    alert('Review added successfully');
                    window.location.reload();
                } else {
                    alert('Error adding review');
                }
            }
        };
        xhr.send(JSON.stringify({ content: reviewContent }));
    });

    likeBtn.addEventListener('click', function() {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/${userId}/artworks/${artworkId}/likes/add`, true);
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    alert('Like status changed');
                    window.location.reload();
                } else {
                    alert('Error changing like status');
                }
            }
        };
        xhr.send();
    });
});
