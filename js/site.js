/* ============================================================
   QUANTUM FREQUENCY RECORDS
   UNIVERSAL SITE JAVASCRIPT
   ============================================================

   This file controls functionality shared across the entire
   QFRecords website.

   UNIVERSAL SYSTEMS:
   ------------------------------------------------------------
   • Fixed header
   • Header scroll state
   • Mobile navigation
   • Mobile slide-out menu
   • Menu accessibility
   • Active navigation state
   • Escape-key menu closing
   • Body scroll locking
   • Newsletter front-end handling
   • Frequency-line initialization
   • Universal Now Playing framework
   • Player persistence
   • Responsive behavior

   PAGE-SPECIFIC JAVASCRIPT BELONGS IN:
   ------------------------------------------------------------
   home.js
   artists.js
   artist-detail.js
   about.js
   contact.js
   music.js
   videos.js
   gallery.js
   news.js

   ============================================================ */


/* ============================================================
   01. GLOBAL QFR OBJECT
   ============================================================ */

window.QFR = window.QFR || {};


/* ============================================================
   02. DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    QFR.initHeader();

    QFR.initMobileMenu();

    QFR.initNavigation();

    QFR.initNewsletter();

    QFR.initFrequencyLines();

    QFR.initPlayer();

});


/* ============================================================
   03. HEADER
   ============================================================ */

QFR.initHeader = function () {

    const header =
        document.querySelector(".qfr-header");

    if (!header) {
        return;
    }


    function updateHeader() {

        if (window.scrollY > 20) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    updateHeader();

};


/* ============================================================
   04. MOBILE MENU
   ============================================================ */

QFR.initMobileMenu = function () {

    const menuButton =
        document.querySelector(".qfr-menu-button");

    const mobileNavigation =
        document.querySelector(
            ".qfr-mobile-navigation"
        );

    const mobileOverlay =
        document.querySelector(
            ".qfr-mobile-overlay"
        );


    /*
       If the page doesn't contain the new universal
       mobile menu, don't generate errors.
    */

    if (!menuButton || !mobileNavigation) {
        return;
    }


    function openMenu() {

        menuButton.classList.add("open");

        mobileNavigation.classList.add("open");

        if (mobileOverlay) {
            mobileOverlay.classList.add("open");
        }


        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );


        menuButton.setAttribute(
            "aria-label",
            "Close navigation"
        );


        document.body.classList.add(
            "qfr-menu-open"
        );

    }


    function closeMenu() {

        menuButton.classList.remove("open");

        mobileNavigation.classList.remove("open");

        if (mobileOverlay) {
            mobileOverlay.classList.remove("open");
        }


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        menuButton.setAttribute(
            "aria-label",
            "Open navigation"
        );


        document.body.classList.remove(
            "qfr-menu-open"
        );

    }


    function toggleMenu() {

        const isOpen =
            mobileNavigation.classList.contains(
                "open"
            );


        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    }


    menuButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            toggleMenu();

        }
    );


    /*
       Close when clicking a navigation link.
    */

    const mobileLinks =
        mobileNavigation.querySelectorAll(
            "a"
        );


    mobileLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeMenu();

                }
            );

        }
    );


    /*
       Close when clicking the optional overlay.
    */

    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            "click",
            function () {

                closeMenu();

            }
        );

    }


    /*
       Close with Escape.
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                mobileNavigation.classList.contains(
                    "open"
                )
            ) {

                closeMenu();

                menuButton.focus();

            }

        }
    );


    /*
       If the screen becomes desktop width while
       the mobile menu is open, close it.
    */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 800 &&
                mobileNavigation.classList.contains(
                    "open"
                )
            ) {

                closeMenu();

            }

        }
    );

};


/* ============================================================
   05. BODY SCROLL LOCK
   ============================================================ */

QFR.lockBodyScroll = function () {

    document.body.classList.add(
        "qfr-menu-open"
    );

};


QFR.unlockBodyScroll = function () {

    document.body.classList.remove(
        "qfr-menu-open"
    );

};


/* ============================================================
   06. UNIVERSAL NAVIGATION
   ============================================================ */

QFR.initNavigation = function () {

    const currentPath =
        window.location.pathname
            .replace(/\/+$/, "")
            .toLowerCase();


    const navigationLinks =
        document.querySelectorAll(
            ".qfr-navigation a, .qfr-mobile-navigation a"
        );


    navigationLinks.forEach(
        function (link) {

            const href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            /*
               Ignore external links, anchors,
               mail links and javascript links.
            */

            if (
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("javascript:")
            ) {

                return;

            }


            let linkPath = href;


            /*
               Resolve relative paths against
               the current document.
            */

            try {

                linkPath =
                    new URL(
                        href,
                        window.location.href
                    ).pathname;

            } catch (error) {

                return;

            }


            linkPath =
                linkPath
                    .replace(/\/+$/, "")
                    .toLowerCase();


            /*
               Special handling for the root page.
            */

            const isHomeLink =
                href === "../index.html" ||
                href === "./index.html" ||
                href === "/";


            const isCurrentPage =
                linkPath === currentPath;


            if (
                isCurrentPage ||
                (
                    isHomeLink &&
                    (
                        currentPath === "" ||
                        currentPath.endsWith(
                            "/index.html"
                        )
                    )
                )
            ) {

                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }

        }
    );

};


/* ============================================================
   07. NEWSLETTER
   ============================================================ */

QFR.initNewsletter = function () {

    const newsletterForms =
        document.querySelectorAll(
            ".qfr-newsletter-form"
        );


    if (!newsletterForms.length) {
        return;
    }


    newsletterForms.forEach(
        function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const emailInput =
                        form.querySelector(
                            'input[type="email"]'
                        );


                    const message =
                        form.querySelector(
                            ".qfr-newsletter-message"
                        );


                    if (!emailInput) {
                        return;
                    }


                    const email =
                        emailInput.value.trim();


                    /*
                       Basic browser validation.
                    */

                    if (!email) {

                        if (message) {

                            message.textContent =
                                "Please enter your email address.";

                        }

                        emailInput.focus();

                        return;

                    }


                    /*
                       We will connect this to the final
                       free newsletter service later.

                       This temporary behavior confirms
                       the interface is functioning.
                    */

                    if (message) {

                        message.textContent =
                            "You're on the list. Welcome to the frequency.";

                    } else {

                        alert(
                            "You're on the list. Welcome to the frequency."
                        );

                    }


                    form.classList.add(
                        "submitted"
                    );


                    emailInput.value = "";

                }
            );

        }
    );

};


/* ============================================================
   08. FREQUENCY LINE
   ============================================================ */

QFR.initFrequencyLines = function () {

    const frequencyLines =
        document.querySelectorAll(
            ".qfr-frequency-line"
        );


    if (!frequencyLines.length) {
        return;
    }


    frequencyLines.forEach(
        function (line) {

            /*
               The visual frequency animation itself
               belongs in CSS.

               JavaScript simply marks the element as
               initialized so page-specific scripts can
               identify it if needed.
            */

            line.classList.add(
                "initialized"
            );

        }
    );

};


/* ============================================================
   09. NOW PLAYING UNIVERSE
   ============================================================ */

QFR.player = {

    audio:
        null,

    currentSong:
        null,

    playlist:
        [],

    currentIndex:
        -1,

    isPlaying:
        false

};


/* ============================================================
   10. PLAYER INITIALIZATION
   ============================================================ */

QFR.initPlayer = function () {

    const player =
        document.querySelector(
            ".qfr-now-playing"
        );


    /*
       The player will not exist on the page until
       the universal player markup is installed.

       This makes site.js safe to use immediately.
    */

    if (!player) {
        return;
    }


    QFR.player.audio =
        document.querySelector(
            ".qfr-player-audio"
        );


    QFR.player.playButton =
        player.querySelector(
            "[data-player-action='play']"
        );


    QFR.player.nextButton =
        player.querySelector(
            "[data-player-action='next']"
        );


    QFR.player.previousButton =
        player.querySelector(
            "[data-player-action='previous']"
        );


    QFR.player.progress =
        player.querySelector(
            "[data-player-progress]"
        );


    QFR.player.genreSelect =
        player.querySelector(
            "[data-player-genre]"
        );


    QFR.player.artistSelect =
        player.querySelector(
            "[data-player-artist]"
        );


    QFR.player.title =
        player.querySelector(
            "[data-player-title]"
        );


    QFR.player.artist =
        player.querySelector(
            "[data-player-artist-name]"
        );


    QFR.player.artwork =
        player.querySelector(
            "[data-player-artwork]"
        );


    QFR.player.time =
        player.querySelector(
            "[data-player-time]"
        );


    /*
       Play / pause.
    */

    if (QFR.player.playButton) {

        QFR.player.playButton.addEventListener(
            "click",
            function () {

                QFR.togglePlay();

            }
        );

    }


    /*
       Next.
    */

    if (QFR.player.nextButton) {

        QFR.player.nextButton.addEventListener(
            "click",
            function () {

                QFR.nextSong();

            }
        );

    }


    /*
       Previous.
    */

    if (QFR.player.previousButton) {

        QFR.player.previousButton.addEventListener(
            "click",
            function () {

                QFR.previousSong();

            }
        );

    }


    /*
       Progress bar.
    */

    if (QFR.player.progress) {

        QFR.player.progress.addEventListener(
            "input",
            function () {

                if (
                    !QFR.player.audio ||
                    !QFR.player.audio.duration
                ) {

                    return;

                }


                const percentage =
                    Number(
                        QFR.player.progress.value
                    );


                QFR.player.audio.currentTime =
                    (
                        percentage / 100
                    ) *
                    QFR.player.audio.duration;

            }
        );

    }


    /*
       Audio events.
    */

    if (QFR.player.audio) {

        QFR.player.audio.addEventListener(
            "timeupdate",
            function () {

                QFR.updatePlayerProgress();

            }
        );


        QFR.player.audio.addEventListener(
            "ended",
            function () {

                QFR.nextSong();

            }
        );

    }


    /*
       Genre filtering.
    */

    if (QFR.player.genreSelect) {

        QFR.player.genreSelect.addEventListener(
            "change",
            function () {

                QFR.filterPlayerPlaylist();

            }
        );

    }


    /*
       Artist filtering.
    */

    if (QFR.player.artistSelect) {

        QFR.player.artistSelect.addEventListener(
            "change",
            function () {

                QFR.filterPlayerPlaylist();

            }
        );

    }


    QFR.restorePlayerState();

};


/* ============================================================
   11. SET PLAYER PLAYLIST
   ============================================================ */

QFR.setPlaylist = function (
    songs,
    options
) {

    if (!Array.isArray(songs)) {
        return;
    }


    options =
        options || {};


    QFR.player.playlist =
        songs.slice();


    /*
       Randomize if requested.
    */

    if (options.random === true) {

        QFR.player.playlist =
            QFR.shuffle(
                QFR.player.playlist
            );

    }


    QFR.player.currentIndex =
        -1;


    /*
       Automatically choose the first song.
    */

    if (
        QFR.player.playlist.length &&
        options.autoplay === true
    ) {

        QFR.playSong(
            QFR.player.playlist[0],
            0
        );

    }

};


/* ============================================================
   12. PLAY A SONG
   ============================================================ */

QFR.playSong = function (
    song,
    index
) {

    if (!song) {
        return;
    }


    QFR.player.currentSong =
        song;


    if (
        typeof index === "number"
    ) {

        QFR.player.currentIndex =
            index;

    }


    /*
       Update player artwork.
    */

    if (QFR.player.artwork) {

        QFR.player.artwork.src =
            song.artwork ||
            song.cover ||
            "assets/images/placeholder-song.jpg";

        QFR.player.artwork.alt =
            song.title ||
            "QFR song artwork";

    }


    /*
       Update title.
    */

    if (QFR.player.title) {

        QFR.player.title.textContent =
            song.title ||
            "Untitled";

    }


    /*
       Update artist.
    */

    if (QFR.player.artist) {

        QFR.player.artist.textContent =
            song.artist ||
            "";

    }


    /*
       If there is no audio URL, we can still update
       the player visually without throwing errors.
    */

    if (
        !QFR.player.audio ||
        !song.audio
    ) {

        QFR.player.isPlaying =
            false;

        QFR.updatePlayButton();

        QFR.savePlayerState();

        return;

    }


    /*
       Load audio.
    */

    QFR.player.audio.src =
        song.audio;


    QFR.player.audio.load();


    const playPromise =
        QFR.player.audio.play();


    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {

        playPromise.catch(
            function () {

                /*
                   Browser autoplay restrictions can
                   prevent playback until the user has
                   interacted with the site.

                   This is intentionally silent.
                */

                QFR.player.isPlaying =
                    false;

                QFR.updatePlayButton();

            }
        );

    }


    QFR.player.isPlaying =
        true;


    QFR.updatePlayButton();

    QFR.savePlayerState();

};


/* ============================================================
   13. PLAY / PAUSE
   ============================================================ */

QFR.togglePlay = function () {

    if (!QFR.player.audio) {
        return;
    }


    /*
       If no song is selected, choose one.
    */

    if (!QFR.player.currentSong) {

        if (
            QFR.player.playlist.length
        ) {

            QFR.playSong(
                QFR.player.playlist[0],
                0
            );

        }

        return;

    }


    if (
        QFR.player.audio.paused
    ) {

        const playPromise =
            QFR.player.audio.play();


        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {

            playPromise.catch(
                function () {}
            );

        }


        QFR.player.isPlaying =
            true;

    } else {

        QFR.player.audio.pause();

        QFR.player.isPlaying =
            false;

    }


    QFR.updatePlayButton();

    QFR.savePlayerState();

};


/* ============================================================
   14. NEXT SONG
   ============================================================ */

QFR.nextSong = function () {

    const playlist =
        QFR.player.playlist;


    if (!playlist.length) {
        return;
    }


    let nextIndex =
        QFR.player.currentIndex + 1;


    if (
        nextIndex >= playlist.length
    ) {

        nextIndex = 0;

    }


    QFR.playSong(
        playlist[nextIndex],
        nextIndex
    );

};


/* ============================================================
   15. PREVIOUS SONG
   ============================================================ */

QFR.previousSong = function () {

    const playlist =
        QFR.player.playlist;


    if (!playlist.length) {
        return;
    }


    let previousIndex =
        QFR.player.currentIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            playlist.length - 1;

    }


    QFR.playSong(
        playlist[previousIndex],
        previousIndex
    );

};


/* ============================================================
   16. FILTER PLAYER PLAYLIST
   ============================================================ */

QFR.filterPlayerPlaylist = function () {

    /*
       The actual catalog will come from data/songs.json.

       This function is intentionally prepared for the
       catalog structure we will install later.
    */

    if (
        !Array.isArray(
            window.QFR_SONGS
        )
    ) {

        return;

    }


    const genre =
        QFR.player.genreSelect
            ? QFR.player.genreSelect.value
            : "";


    const artist =
        QFR.player.artistSelect
            ? QFR.player.artistSelect.value
            : "";


    let filtered =
        window.QFR_SONGS.slice();


    if (
        genre &&
        genre !== "all"
    ) {

        filtered =
            filtered.filter(
                function (song) {

                    if (
                        !song.genre
                    ) {

                        return false;

                    }


                    if (
                        Array.isArray(
                            song.genre
                        )
                    ) {

                        return song.genre
                            .map(
                                value =>
                                    String(value)
                                        .toLowerCase()
                            )
                            .includes(
                                genre.toLowerCase()
                            );

                    }


                    return String(
                        song.genre
                    ).toLowerCase() ===
                    genre.toLowerCase();

                }
            );

    }


    if (
        artist &&
        artist !== "all"
    ) {

        filtered =
            filtered.filter(
                function (song) {

                    return String(
                        song.artistId ||
                        song.artist ||
                        ""
                    ).toLowerCase() ===
                    artist.toLowerCase();

                }
            );

    }


    QFR.setPlaylist(
        filtered,
        {
            random: true,
            autoplay: true
        }
    );

};


/* ============================================================
   17. PLAYER PROGRESS
   ============================================================ */

QFR.updatePlayerProgress = function () {

    if (!QFR.player.audio) {
        return;
    }


    if (
        QFR.player.progress &&
        QFR.player.audio.duration
    ) {

        QFR.player.progress.value =
            (
                QFR.player.audio.currentTime /
                QFR.player.audio.duration
            ) *
            100;

    }


    if (QFR.player.time) {

        const current =
            QFR.formatTime(
                QFR.player.audio.currentTime
            );


        const duration =
            QFR.formatTime(
                QFR.player.audio.duration
            );


        QFR.player.time.textContent =
            current +
            " / " +
            duration;

    }

};


/* ============================================================
   18. PLAYER BUTTON
   ============================================================ */

QFR.updatePlayButton = function () {

    if (!QFR.player.playButton) {
        return;
    }


    const icon =
        QFR.player.playButton.querySelector(
            "[data-player-icon]"
        );


    if (QFR.player.isPlaying) {

        QFR.player.playButton.setAttribute(
            "aria-label",
            "Pause"
        );


        if (icon) {

            icon.textContent =
                "Ⅱ";

        }

    } else {

        QFR.player.playButton.setAttribute(
            "aria-label",
            "Play"
        );


        if (icon) {

            icon.textContent =
                "▶";

        }

    }

};


/* ============================================================
   19. PLAYER PERSISTENCE
   ============================================================ */

QFR.savePlayerState = function () {

    try {

        const state = {

            song:
                QFR.player.currentSong,

            index:
                QFR.player.currentIndex,

            isPlaying:
                QFR.player.isPlaying

        };


        sessionStorage.setItem(
            "qfrNowPlaying",
            JSON.stringify(state)
        );

    } catch (error) {

        /*
           Ignore storage errors.
        */

    }

};


/* ============================================================
   20. RESTORE PLAYER STATE
   ============================================================ */

QFR.restorePlayerState = function () {

    try {

        const saved =
            sessionStorage.getItem(
                "qfrNowPlaying"
            );


        if (!saved) {
            return;
        }


        const state =
            JSON.parse(saved);


        if (!state) {
            return;
        }


        if (state.song) {

            QFR.player.currentSong =
                state.song;

            QFR.player.currentIndex =
                typeof state.index === "number"
                    ? state.index
                    : -1;


            /*
               Restore visual information but do not
               automatically start audio.

               Browsers frequently block autoplay.
            */

            if (QFR.player.artwork) {

                QFR.player.artwork.src =
                    state.song.artwork ||
                    state.song.cover ||
                    "assets/images/placeholder-song.jpg";

            }


            if (QFR.player.title) {

                QFR.player.title.textContent =
                    state.song.title ||
                    "Untitled";

            }


            if (QFR.player.artist) {

                QFR.player.artist.textContent =
                    state.song.artist ||
                    "";

            }

        }


        QFR.player.isPlaying =
            false;


        QFR.updatePlayButton();

    } catch (error) {

        /*
           Ignore invalid storage data.
        */

    }

};


/* ============================================================
   21. SHUFFLE
   ============================================================ */

QFR.shuffle = function (
    array
) {

    const result =
        array.slice();


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        const temp =
            result[i];


        result[i] =
            result[j];


        result[j] =
            temp;

    }


    return result;

};


/* ============================================================
   22. RANDOM SONG
   ============================================================ */

QFR.playRandom = function (
    songs
) {

    if (
        !Array.isArray(songs) ||
        !songs.length
    ) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() * songs.length
        );


    QFR.setPlaylist(
        songs,
        {
            random: true
        }
    );


    const shuffled =
        QFR.player.playlist;


    QFR.playSong(
        shuffled[0],
        0
    );

};


/* ============================================================
   23. FORMAT TIME
   ============================================================ */

QFR.formatTime = function (
    seconds
) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            remainingSeconds
        ).padStart(
            2,
            "0"
        )
    );

};


/* ============================================================
   24. ARTIST LISTEN NOW
   ============================================================ */

QFR.listenToArtist = function (
    artistId
) {

    if (
        !Array.isArray(
            window.QFR_SONGS
        )
    ) {

        return;

    }


    const songs =
        window.QFR_SONGS.filter(
            function (song) {

                return String(
                    song.artistId ||
                    song.artist ||
                    ""
                ).toLowerCase() ===
                String(
                    artistId ||
                    ""
                ).toLowerCase();

            }
        );


    if (!songs.length) {
        return;
    }


    QFR.setPlaylist(
        songs,
        {
            random: true,
            autoplay: true
        }
    );

};


/* ============================================================
   25. GLOBAL EVENT SUPPORT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        /*
           Allows buttons anywhere on the website to
           use:

           data-listen-artist="buckshot-bourbon"
        */

        const listenButton =
            event.target.closest(
                "[data-listen-artist]"
            );


        if (listenButton) {

            const artistId =
                listenButton.getAttribute(
                    "data-listen-artist"
                );


            QFR.listenToArtist(
                artistId
            );

        }

    }
);


/* ============================================================
   26. PAGE VISIBILITY
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    function () {

        /*
           Do not automatically stop the music when the
           user changes tabs.

           This allows the Now Playing Universe to
           continue behaving like a real music player.

           We intentionally leave the browser in control
           of background playback.
        */

    }
);


/* ============================================================
   27. DEBUG INFORMATION
   ============================================================ */

QFR.version =
    "2.0.0";


/*
   Development helper.

   This remains quiet in production.
*/

if (
    window.location.hostname ===
    "localhost"
) {

    console.info(
        "QFRecords Universal Framework",
        QFR.version
    );

}
