// پادکست شک — player + homepage interactions
//
// DOM contract (referenced by _includes/player.html, _includes/sticky_player.html,
// index.html and _layouts/post.html — keep in sync):
//   #featured-player            main <audio> element (one per page)
//   .episode-player             player container (#main-player-section)
//   .custom-player .play-btn    play/pause button (.playing class toggles icons)
//   .progress-bar / .progress-fill / .current-time / .duration
//   #sticky-player / #sticky-title / #sticky-progress-fill / #sticky-time / .sticky-play-btn
//   .archive-tabs .chip[data-group] + .archive-row[data-group]  archive filtering
//   #shak-data (JSON) + #aph-tabs / #aph-grid / #aph-card-*     aphorism explorer
//   .transcript-header / #transcript-content / .toggle-text     transcript accordion
//   .video-teaser-container / .episode-video-teaser             video teaser

// ========================
// Persian number helpers
// ========================
function faNum(value) {
    return String(value).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
}

// Normalize a duration string like "00:35:13" → "۳۵:۱۳"
function faDur(d) {
    let s = String(d || '');
    if (s.indexOf('00:') === 0 && s.length > 5) s = s.slice(3);
    return faNum(s);
}

// Format seconds as h:mm:ss / m:ss with Persian digits
function formatTime(seconds) {
    if (seconds == null || isNaN(seconds)) return faNum('0:00');
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = function (x) { return String(x).padStart(2, '0'); };
    return faNum(h ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s));
}

// Track current playing title for sticky player
let currentPlayingTitle = '';
let stickyDismissed = false;

// ========================
// Core player controls
// ========================
function togglePlay(playerId) {
    const audio = document.getElementById(playerId);
    if (!audio) return;
    const playerContainer = audio.closest('.episode-player');
    const playBtn = playerContainer ? playerContainer.querySelector('.play-btn') : null;

    if (audio.paused) {
        document.querySelectorAll('audio').forEach(a => {
            if (a.id !== playerId && !a.paused) {
                a.pause();
                const otherContainer = a.closest('.episode-player');
                const otherBtn = otherContainer ? otherContainer.querySelector('.play-btn') : null;
                if (otherBtn) otherBtn.classList.remove('playing');
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

function seek(event, playerId) {
    const audio = document.getElementById(playerId);
    if (!audio || isNaN(audio.duration)) return;
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    // RTL: calculate from right side
    const clickPosition = rect.right - event.clientX;
    const percentage = clickPosition / rect.width;
    audio.currentTime = percentage * audio.duration;
}

// Play a specific episode in the main player (archive rows / explorer card)
function playEpisode(audioUrl, title) {
    const featuredPlayer = document.getElementById('featured-player');
    if (!featuredPlayer) return;
    const source = featuredPlayer.querySelector('source');
    const current = source ? source.getAttribute('src') : featuredPlayer.getAttribute('src');

    if (current !== audioUrl) {
        if (source) source.setAttribute('src', audioUrl);
        featuredPlayer.src = audioUrl;
        featuredPlayer.load();
    }
    if (title) {
        currentPlayingTitle = title;
        const stickyTitle = document.getElementById('sticky-title');
        if (stickyTitle) stickyTitle.textContent = title;
    }
    if (featuredPlayer.paused) togglePlay('featured-player');

    const playerSection = document.getElementById('main-player-section');
    if (playerSection) {
        playerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function closeStickyPlayer() {
    stickyDismissed = true;
    const sticky = document.getElementById('sticky-player');
    if (sticky) sticky.classList.remove('visible');
}

// ========================
// Archive chapter tabs
// ========================
function switchChapter(group, btn) {
    document.querySelectorAll('.archive-tabs .chip').forEach(function (tab) {
        tab.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    let count = 0;
    document.querySelectorAll('.archive-row').forEach(function (row) {
        const show = row.getAttribute('data-group') === group;
        row.classList.toggle('hidden-by-tab', !show);
        if (show) count++;
    });

    const countEl = document.getElementById('archive-count');
    if (countEl) countEl.textContent = faNum(count) + ' اپیزود';
}

// ========================
// Transcript accordion
// ========================
function toggleTranscript() {
    const header = document.querySelector('.transcript-header');
    const content = document.getElementById('transcript-content');
    const toggleText = document.querySelector('.toggle-text');

    if (!header || !content) return;

    header.classList.toggle('active');
    content.classList.toggle('active');

    if (toggleText) {
        toggleText.textContent = content.classList.contains('active') ? 'بستن' : 'نمایش';
    }
}

// ========================
// Video teaser
// ========================
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

// ========================
// Aphorism explorer
// ========================
function initExplorer() {
    const dataEl = document.getElementById('shak-data');
    const tabsEl = document.getElementById('aph-tabs');
    const gridEl = document.getElementById('aph-grid');
    if (!dataEl || !tabsEl || !gridEl) return;

    let data;
    try {
        data = JSON.parse(dataEl.textContent);
    } catch (e) {
        return;
    }

    const episodes = data.episodes || [];       // oldest → newest
    const sections = (data.book && data.book.sections) || [];
    if (!episodes.length) return;

    const prefaceEps = episodes
        .map(function (e, i) { return { ep: e, idx: i }; })
        .filter(function (x) { return x.ep.section; });

    const tabs = [];
    if (prefaceEps.length) tabs.push({ key: 'preface', label: 'پیش‌گفتار' });
    sections.forEach(function (s) {
        if (s.id > 0 && episodes.some(function (e) { return !e.section && e.chapter === s.id; })) {
            tabs.push({ key: s.id, label: s.label });
        }
    });
    if (!tabs.length) return;

    let selEp = episodes.length - 1; // latest episode
    let selTab = episodes[selEp].section ? 'preface' : episodes[selEp].chapter;
    if (!tabs.some(function (t) { return t.key === selTab; })) selTab = tabs[tabs.length - 1].key;

    // Last (newest) episode covering aphorism n
    function epForAph(n) {
        let idx = null;
        episodes.forEach(function (e, i) {
            if (e.a1 != null && e.a2 != null && n >= e.a1 && n <= e.a2) idx = i;
        });
        return idx;
    }

    // Newest episode belonging to a tab
    function defaultEpForTab(key) {
        for (let i = episodes.length - 1; i >= 0; i--) {
            const e = episodes[i];
            if (key === 'preface' ? e.section : (!e.section && e.chapter === key)) return i;
        }
        return episodes.length - 1;
    }

    function badgeOf(e) {
        if (e.section === 'intro') return 'معرفی کتاب';
        if (e.section === 'preface') return 'پیش‌گفتار' + (e.part ? ' ' + faNum(e.part) : '');
        if (e.a1 != null) return 'قصار ' + faNum(e.a1) + (e.a2 != null && e.a2 !== e.a1 ? '–' + faNum(e.a2) : '');
        return 'اپیزود ' + faNum(String(e.num).replace('-', '/'));
    }

    function sectionLabelOf(e) {
        if (e.section) return 'پیش‌گفتار';
        const s = sections.find(function (x) { return x.id === e.chapter; });
        return s ? s.label : '';
    }

    function renderTabs() {
        tabsEl.innerHTML = '';
        tabs.forEach(function (t) {
            const btn = document.createElement('button');
            btn.className = 'chip' + (t.key === selTab ? ' active' : '');
            btn.type = 'button';
            btn.textContent = t.label;
            btn.addEventListener('click', function () {
                selTab = t.key;
                selEp = defaultEpForTab(t.key);
                render();
            });
            tabsEl.appendChild(btn);
        });
    }

    function makeNumBtn(label, idx) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        const covered = idx != null;
        btn.className = 'num-btn' + (covered ? (idx === selEp ? ' selected' : ' covered') : '');
        if (covered) {
            btn.addEventListener('click', function () {
                selEp = idx;
                render();
            });
        } else {
            btn.disabled = true;
        }
        return btn;
    }

    function renderGrid() {
        gridEl.innerHTML = '';
        if (selTab === 'preface') {
            prefaceEps.forEach(function (x) {
                const label = x.ep.section === 'intro' ? 'معرفی' : 'بخش ' + faNum(x.ep.part || '');
                gridEl.appendChild(makeNumBtn(label, x.idx));
            });
        } else {
            const sec = sections.find(function (s) { return s.id === selTab; });
            if (!sec) return;
            for (let n = sec.from; n <= sec.to; n++) {
                gridEl.appendChild(makeNumBtn(faNum(n), epForAph(n)));
            }
        }
    }

    function renderCard() {
        const e = episodes[selEp];
        if (!e) return;
        const badge = document.getElementById('aph-card-badge');
        const title = document.getElementById('aph-card-title');
        const desc = document.getElementById('aph-card-desc');
        const meta = document.getElementById('aph-card-meta');
        const play = document.getElementById('aph-card-play');
        const link = document.getElementById('aph-card-link');

        if (badge) badge.textContent = badgeOf(e);
        if (title) title.textContent = faNum(e.title);
        if (desc) desc.textContent = e.desc;
        if (meta) meta.textContent = sectionLabelOf(e) + ' · ' + faDur(e.dur) + ' · ' + faNum(e.date);
        if (play) play.onclick = function () { playEpisode(e.audio, e.fullTitle); };
        if (link) link.setAttribute('href', e.url);
    }

    function render() {
        renderTabs();
        renderGrid();
        renderCard();
    }

    render();
}

// ========================
// Init on DOM ready
// ========================
document.addEventListener('DOMContentLoaded', function () {

    // --- Audio players ---
    const audioPlayers = document.querySelectorAll('audio.audio-player');

    audioPlayers.forEach(audio => {
        const playerContainer = audio.closest('.episode-player');
        if (!playerContainer) return;

        const progressFill = playerContainer.querySelector('.progress-fill');
        const currentTimeEl = playerContainer.querySelector('.current-time');
        const playBtn = playerContainer.querySelector('.play-btn');

        audio.addEventListener('timeupdate', function () {
            if (!progressFill || !currentTimeEl) return;

            const percentage = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percentage + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);

            const stickyFill = document.getElementById('sticky-progress-fill');
            const stickyTime = document.getElementById('sticky-time');
            if (stickyFill) stickyFill.style.width = percentage + '%';
            if (stickyTime) stickyTime.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', function () {
            const durationEl = playerContainer.querySelector('.duration');
            if (durationEl && audio.duration) {
                durationEl.textContent = formatTime(audio.duration);
            }
            const heroTitle = document.querySelector('.hero-card-title, .ep-title');
            if (heroTitle && !currentPlayingTitle) {
                currentPlayingTitle = heroTitle.textContent.trim();
            }
        });

        audio.addEventListener('ended', function () {
            if (playBtn) playBtn.classList.remove('playing');
            if (progressFill) progressFill.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = faNum('0:00');
            updateStickyState(audio);
        });

        audio.addEventListener('play', function () {
            if (playBtn) playBtn.classList.add('playing');
            updateStickyState(audio);
        });

        audio.addEventListener('pause', function () {
            if (playBtn) playBtn.classList.remove('playing');
            updateStickyState(audio);
        });
    });

    // --- Sticky mini player ---
    const stickyPlayer = document.getElementById('sticky-player');
    const mainPlayerSection = document.getElementById('main-player-section');
    const stickyPlayBtn = stickyPlayer ? stickyPlayer.querySelector('.sticky-play-btn') : null;

    function updateStickyState(audio) {
        if (!stickyPlayer || !mainPlayerSection || stickyDismissed) return;

        const isPlaying = audio && !audio.paused;
        const rect = mainPlayerSection.getBoundingClientRect();
        const isOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;

        if (stickyPlayBtn) {
            stickyPlayBtn.classList.toggle('playing', isPlaying);
        }

        const stickyTitle = document.getElementById('sticky-title');
        if (stickyTitle && currentPlayingTitle) {
            stickyTitle.textContent = currentPlayingTitle;
        }

        if (isPlaying && isOutOfView) {
            stickyPlayer.classList.add('visible');
        } else {
            stickyPlayer.classList.remove('visible');
        }
    }

    let scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            requestAnimationFrame(function () {
                const audio = document.getElementById('featured-player');
                if (audio && !audio.paused) {
                    updateStickyState(audio);
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // --- Archive: apply default tab filter ---
    const activeChip = document.querySelector('.archive-tabs .chip.active');
    if (activeChip) {
        switchChapter(activeChip.getAttribute('data-group'), activeChip);
    }

    // --- Aphorism explorer ---
    initExplorer();

    // --- Scroll animations ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animateElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        animateElements.forEach(function (el) {
            el.classList.add('animated');
        });
    }

    // --- Smooth scroll for same-page anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // --- Video teaser overlay sync ---
    const video = document.querySelector('.episode-video-teaser');
    const container = document.querySelector('.video-teaser-container');

    if (video && container) {
        video.addEventListener('play', function () {
            container.classList.add('playing');
        });
        video.addEventListener('pause', function () {
            container.classList.remove('playing');
        });
        video.addEventListener('ended', function () {
            container.classList.remove('playing');
        });
    }
});
