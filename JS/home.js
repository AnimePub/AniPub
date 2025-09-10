const profileButton = document.querySelector(".profile-icon");

profileButton.addEventListener('click', () => {
    window.location.href = `/Profile`
})

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.searchbox');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                window.location.href = `/Search?genre=${encodeURIComponent(query)}`;
            } else {
                alert('Please enter a search term');
            }
        }
    }
});