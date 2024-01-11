document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  searchButton.addEventListener('click', function() {
      const query = searchInput.value;
      if (!query.trim()) {
          alert('Please enter a search query.'); // Alert if the query is empty
          return;
      }
      window.location.href = `/${userId}/artworks?search=${encodeURIComponent(query)}`;
  });
});
