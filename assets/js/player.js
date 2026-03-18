// Audio Player Functionality

// Format time in MM:SS format
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Track current playing title for sticky player
let currentPlayingTitle = '';
let stickyDismissed = false;

// Toggle play/pause for a specific player
function togglePlay(playerId) {
    const audio = document.getElementById(playerId);
    if (!audio) return;
    const playerContainer = audio.closest('.episode-player');
    const playBtn = playerContainer ? playerContainer.querySelector('.play-btn') : null;

    if (audio.paused) {
        // Pause all other players first
        document.querySelectorAll('audio').forEach(a => {
            if (a.id !== playerId && !a.paused) {
                a.pause();
                const otherContainer = a.closest('.episode-player');
                const otherBtn = otherContainer ? otherContainer.querySelector('.play-btn') : null;
                if (otherBtn) {
                    otherBtn.classList.remove('playing');
                }
            }
        });

        audio.play();
        if (playBtn) playBtn.classList.add('playing');
        stickyDismissed = false;
    } else {
        audio.pause();
        if (playBtn) playBtn.classList.remove('playing');
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
function playEpisode(audioUrl, title) {
    const featuredPlayer = document.getElementById('featured-player');
    if (featuredPlayer) {
        featuredPlayer.src = audioUrl;
        featuredPlayer.load();
        if (title) currentPlayingTitle = title;
        togglePlay('featured-player');
        // Scroll to hero player
        const heroPlayer = document.querySelector('.hero-player');
        if (heroPlayer) {
            heroPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Close sticky player
function closeStickyPlayer() {
    stickyDismissed = true;
    const sticky = document.getElementById('sticky-player');
    if (sticky) sticky.classList.remove('visible');
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', function() {

    // ========================
    // Audio Players
    // ========================
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

            // Update sticky player progress
            const stickyFill = document.getElementById('sticky-progress-fill');
            const stickyTime = document.getElementById('sticky-time');
            if (stickyFill) stickyFill.style.width = percentage + '%';
            if (stickyTime) stickyTime.textContent = formatTime(audio.currentTime);
        });

        // Update duration when metadata is loaded
        audio.addEventListener('loadedmetadata', function() {
            const durationEl = playerContainer.querySelector('.duration');
            if (durationEl && audio.duration) {
                durationEl.textContent = formatTime(audio.duration);
            }
            // Set initial title for sticky player
            const heroTitle = document.querySelector('.hero-episode-title');
            if (heroTitle && !currentPlayingTitle) {
                currentPlayingTitle = heroTitle.textContent.trim();
            }
        });

        // When audio ends
        audio.addEventListener('ended', function() {
            if (playBtn) playBtn.classList.remove('playing');
            if (progressFill) progressFill.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
            updateStickyState(audio);
        });

        // Sync play/pause states
        audio.addEventListener('play', function() {
            if (playBtn) playBtn.classList.add('playing');
            updateStickyState(audio);
        });

        audio.addEventListener('pause', function() {
            if (playBtn) playBtn.classList.remove('playing');
            updateStickyState(audio);
        });
    });

    // ========================
    // Sticky Mini Player
    // ========================
    const stickyPlayer = document.getElementById('sticky-player');
    const mainPlayerSection = document.getElementById('main-player-section');
    const stickyPlayBtn = stickyPlayer ? stickyPlayer.querySelector('.sticky-play-btn') : null;

    function updateStickyState(audio) {
        if (!stickyPlayer || !mainPlayerSection || stickyDismissed) return;

        const isPlaying = audio && !audio.paused;
        const rect = mainPlayerSection.getBoundingClientRect();
        const isOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;

        // Update sticky play button state
        if (stickyPlayBtn) {
            if (isPlaying) {
                stickyPlayBtn.classList.add('playing');
            } else {
                stickyPlayBtn.classList.remove('playing');
            }
        }

        // Update sticky title
        const stickyTitle = document.getElementById('sticky-title');
        if (stickyTitle && currentPlayingTitle) {
            stickyTitle.textContent = currentPlayingTitle;
        }

        // Show/hide
        if (isPlaying && isOutOfView) {
            stickyPlayer.classList.add('visible');
        } else {
            stickyPlayer.classList.remove('visible');
        }
    }

    // Check sticky visibility on scroll
    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                const audio = document.getElementById('featured-player');
                if (audio && !audio.paused) {
                    updateStickyState(audio);
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // ========================
    // Scroll Animations (IntersectionObserver)
    // ========================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animateElements.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything immediately
        animateElements.forEach(function(el) {
            el.classList.add('animated');
        });
    }

    // ========================
    // Smooth scroll for anchor links
    // ========================
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
