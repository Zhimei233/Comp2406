document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function() {
        // Collect form data
        const workshopData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
        };

        // Create AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/${userId}/workshops/add`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const response = JSON.parse(this.responseText);
                    // Handle success
                    alert('Workshop added successfully');
                    window.location.href = `/${userId}/profile`;
                } else {
                    // Handle error
                    alert('Error adding workshop');
                }
            }
        };
        xhr.send(JSON.stringify(workshopData));
    });
});
