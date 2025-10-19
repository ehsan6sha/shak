// Audio Player Functionality

// Format time in MM:SS format
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Toggle play/pause for a specific player
function togglePlay(playerId) {
    const audio = document.getElementById(playerId);
    const playerContainer = audio.closest('.episode-player');
    const playBtn = playerContainer.querySelector('.play-btn');
    
    if (audio.paused) {
        // Pause all other players first
        document.querySelectorAll('audio').forEach(a => {
            if (a.id !== playerId && !a.paused) {
                a.pause();
                const otherBtn = a.closest('.episode-player').querySelector('.play-btn');
                if (otherBtn) {
                    otherBtn.classList.remove('playing');
                }
            }
        });
        
        audio.play();
        playBtn.classList.add('playing');
    } else {
        audio.pause();
        playBtn.classList.remove('playing');
    }
}

// Seek to position in audio
function seek(event, playerId) {
    const audio = document.getElementById(playerId);
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    // RTL: calculate from right side
    const clickPosition = rect.right - event.clientX;
    const percentage = clickPosition / rect.width;
    audio.currentTime = percentage * audio.duration;
}

// Play specific episode (for archive cards)
function playEpisode(audioUrl) {
    // Check if there's a featured player
    const featuredPlayer = document.getElementById('featured-player');
    if (featuredPlayer) {
        featuredPlayer.src = audioUrl;
        featuredPlayer.load();
        togglePlay('featured-player');
        // Scroll to player
        featuredPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize audio players
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayers = document.querySelectorAll('audio.audio-player');
    
    audioPlayers.forEach(audio => {
        const playerContainer = audio.closest('.episode-player');
        if (!playerContainer) return;
        
        const progressFill = playerContainer.querySelector('.progress-fill');
        const currentTimeEl = playerContainer.querySelector('.current-time');
        const playBtn = playerContainer.querySelector('.play-btn');
        
        // Update progress and time
        audio.addEventListener('timeupdate', function() {
            if (!progressFill || !currentTimeEl) return;
            
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percentage + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });
        
        // Update duration when metadata is loaded
        audio.addEventListener('loadedmetadata', function() {
            const durationEl = playerContainer.querySelector('.duration');
            if (durationEl && audio.duration) {
                durationEl.textContent = formatTime(audio.duration);
            }
        });
        
        // When audio ends
        audio.addEventListener('ended', function() {
            if (playBtn) {
                playBtn.classList.remove('playing');
            }
            if (progressFill) {
                progressFill.style.width = '0%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = '0:00';
            }
        });
        
        // Handle play/pause state changes
        audio.addEventListener('play', function() {
            if (playBtn) {
                playBtn.classList.add('playing');
            }
        });
        
        audio.addEventListener('pause', function() {
            if (playBtn) {
                playBtn.classList.remove('playing');
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// Toggle transcript visibility
function toggleTranscript() {
    const header = document.querySelector('.transcript-header');
    const content = document.getElementById('transcript-content');
    const toggleText = document.querySelector('.toggle-text');
    
    if (!header || !content) return;
    
    header.classList.toggle('active');
    content.classList.toggle('active');
    
    if (content.classList.contains('active')) {
        toggleText.textContent = 'بستن متن';
    } else {
        toggleText.textContent = 'نمایش متن';
    }
}

// Toggle video play/pause
function toggleVideo() {
    const video = document.querySelector('.episode-video-teaser');
    const container = document.querySelector('.video-teaser-container');
    
    if (!video || !container) return;
    
    if (video.paused) {
        video.play();
        container.classList.add('playing');
    } else {
        video.pause();
        container.classList.remove('playing');
    }
}

// Auto-hide video overlay when playing
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.episode-video-teaser');
    const container = document.querySelector('.video-teaser-container');
    
    if (video && container) {
        video.addEventListener('play', function() {
            container.classList.add('playing');
        });
        
        video.addEventListener('pause', function() {
            container.classList.remove('playing');
        });
        
        video.addEventListener('ended', function() {
            container.classList.remove('playing');
        });
    }
});
