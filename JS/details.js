// Details Page Interactions

// Watch Button Handler
document.querySelectorAll('.watch-btn').forEach(button => {
    button.addEventListener('click', function() {
        const animeId = this.getAttribute('data-anime-id');
        if (animeId) {
            // Redirect to player starting at episode 0
            window.location.href = `/AniPlayer/${animeId}/0`;
        }
    });
});

// Watchlist Button Handler
document.querySelectorAll('.watchlist-btn').forEach(button => {
    button.addEventListener('click', function() {
        const animeId = this.getAttribute('data-anime-id');
        if (!animeId) {
            console.error('Anime ID not found');
            return;
        }

        // Make API call to add to watchlist
        fetch('/PlayList/Update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                AniID: animeId,
                Progress: 0
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add to watchlist');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('Added to watchlist!', 'success');
            // Update button appearance
            button.classList.add('added');
            button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg> Added';
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to add to watchlist. Please login first.', 'error');
        });
    });
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .watchlist-btn.added {
        background: #10b981;
        border-color: #10b981;
        color: white;
        cursor: not-allowed;
    }

    .watchlist-btn.added:hover {
        background: #059669;
        border-color: #059669;
    }
`;
document.head.appendChild(style);

// Character card click handler (optional - for future enhancement)
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', function() {
        // Can add modal or detailed character view here
        console.log('Character card clicked');
    });
});

// Genre tag search
document.querySelectorAll('.genre-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.preventDefault();
        // The link already handles navigation, but we can add tracking here
        console.log('Searching for genre:', this.textContent);
    });
});

// Relation link handler
document.querySelectorAll('.relation-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // The link already handles navigation
        console.log('Navigating to related anime:', this.textContent);
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Details page loaded');

    // Check if user is logged in by checking for watchlist button
    // If buttons exist, the user is able to interact with them
    const watchlistBtn = document.querySelector('.watchlist-btn');
    if (watchlistBtn) {
        // Add a slight delay to ensure all elements are loaded
        setTimeout(() => {
            console.log('Watchlist button available - user can add to list');
        }, 100);
    }
});
