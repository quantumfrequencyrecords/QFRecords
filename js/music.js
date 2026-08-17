document.addEventListener("DOMContentLoaded", function () {

    const musicGrid =
        document.getElementById("musicGrid");

    const featuredSong =
        document.getElementById("featuredSong");

    const artistFilter =
        document.getElementById("artistFilter");

    const genreFilter =
        document.getElementById("genreFilter");

    const musicSearch =
        document.getElementById("musicSearch");

    const musicEmpty =
        document.getElementById("musicEmpty");


    const songModal =
        document.getElementById("songModal");

    const closeSongModal =
        document.getElementById("closeSongModal");


    const modalArtwork =
        document.getElementById("modalArtwork");

    const modalArtist =
        document.getElementById("modalArtist");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalAlbum =
        document.getElementById("modalAlbum");

    const modalLyrics =
        document.getElementById("modalLyrics");

    const spotifyButton =
        document.getElementById("spotifyButton");

    const playModalSong =
        document.getElementById("playModalSong");


    const audioPlayer =
        document.getElementById("audioPlayer");

    const playerArtwork =
        document.getElementById("playerArtwork");

    const playerTitle =
        document.getElementById("playerTitle");

    const playerArtist =
        document.getElementById("playerArtist");

    const playerPlay =
        document.getElementById("playerPlay");

    const playerSeek =
        document.getElementById("playerSeek");

    const playerCurrent =
        document.getElementById("playerCurrent");

    const playerDuration =
        document.getElementById("playerDuration");

    const playerClose =
        document.getElementById("playerClose");

    const nowPlaying =
        document.getElementById("nowPlaying");


    let songs = [];

    let currentSong = null;


    loadMusic();


    async function loadMusic() {

        try {

            const response =
                await fetch(
                    "../data/music/index.json"
                );


            if (!response.ok) {

                throw new Error(
                    "Music database unavailable."
                );

            }


            const data =
                await response.json();


            songs =
                data.songs || [];


            buildFilters();

            renderFeatured();

            renderSongs();

        }

        catch (error) {

            console.error(error);

            musicGrid.innerHTML = `

                <div class="music-error">

                    Unable to load the QFR music catalog.

                </div>

            `;

        }

    }


    function buildFilters() {

        const artists =
            [...new Set(
                songs.map(
                    song =>
                        song.artistName
                )
            )].sort();


        const genres =
            [...new Set(
                songs.map(
                    song =>
                        song.genre
                )
            )].sort();


        artists.forEach(
            function (artist) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    artist;


                option.textContent =
                    artist;


                artistFilter.appendChild(
                    option
                );

            }
        );


        genres.forEach(
            function (genre) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    genre;


                option.textContent =
                    genre;


                genreFilter.appendChild(
                    option
                );

            }
        );

    }


    function renderFeatured() {

        const song =
            songs.find(
                item =>
                    item.featured
            );


        if (!song) {

            featuredSong.innerHTML = `

                <p>
                    No featured song available.
                </p>

            `;

            return;

        }


        featuredSong.innerHTML = `

            <div class="featured-song-art">

                <img
                    src="${song.artwork}"
                    alt="${escapeHTML(
                        song.title
                    )}"
                >

            </div>


            <div class="featured-song-info">

                <span>
                    FEATURED RELEASE
                </span>

                <h3>
                    ${escapeHTML(
                        song.title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        song.artistName
                    )}
                </p>

                <button
                    class="music-button primary"
                    data-song-id="${song.id}"
                >
                    ▶ LISTEN NOW
                </button>

            </div>

        `;


        const button =
            featuredSong.querySelector(
                "button"
            );


        button.addEventListener(
            "click",
            function () {

                openSong(song);

            }
        );

    }


    function renderSongs() {

        const search =
            musicSearch.value
                .trim()
                .toLowerCase();


        const selectedArtist =
            artistFilter.value;


        const selectedGenre =
            genreFilter.value;


        const filteredSongs =
            songs.filter(
                function (song) {

                    const matchesSearch =

                        !search ||

                        song.title
                            .toLowerCase()
                            .includes(search) ||

                        song.artistName
                            .toLowerCase()
                            .includes(search) ||

                        song.albumName
                            .toLowerCase()
                            .includes(search);


                    const matchesArtist =

                        selectedArtist === "all" ||

                        song.artistName ===
                            selectedArtist;


                    const matchesGenre =

                        selectedGenre === "all" ||

                        song.genre ===
                            selectedGenre;


                    return (
                        matchesSearch &&
                        matchesArtist &&
                        matchesGenre
                    );

                }
            );


        musicGrid.innerHTML = "";


        musicEmpty.hidden =
            filteredSongs.length !== 0;


        filteredSongs.forEach(
            function (song) {

                musicGrid.appendChild(
                    createSongCard(song)
                );

            }
        );

    }


    function createSongCard(song) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "music-card";


        card.innerHTML = `

            <div class="music-card-art">

                <img
                    src="${song.artwork}"
                    alt="${escapeHTML(
                        song.title
                    )}"
                    loading="lazy"
                >

                <button
                    class="card-play"
                    aria-label="Play song"
                >
                    ▶
                </button>

            </div>


            <div class="music-card-content">

                <span>
                    ${escapeHTML(
                        song.artistName
                    )}
                </span>

                <h3>
                    ${escapeHTML(
                        song.title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        song.albumName
                    )}
                </p>

            </div>

        `;


        const playButton =
            card.querySelector(
                ".card-play"
            );


        playButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                playSong(song);

            }
        );


        card.addEventListener(
            "click",
            function () {

                openSong(song);

            }
        );


        return card;

    }


    function openSong(song) {

        currentSong =
            song;


        modalArtwork.src =
            song.artwork;


        modalArtwork.alt =
            song.title;


        modalArtist.textContent =
            song.artistName;


        modalTitle.textContent =
            song.title;


        modalAlbum.textContent =
            song.albumName;


        loadLyrics(song);


        if (
            song.streaming &&
            song.streaming.spotify
        ) {

            spotifyButton.href =
                song.streaming.spotify;

            spotifyButton.hidden =
                false;

        }

        else {

            spotifyButton.hidden =
                true;

        }


        playModalSong.onclick =
            function () {

                playSong(song);

            };


        songModal.classList.add(
            "open"
        );


        songModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    async function loadLyrics(song) {

        if (
            !song.lyrics ||
            !song.lyrics.enabled ||
            !song.lyrics.file
        ) {

            modalLyrics.textContent =
                "Lyrics are not currently available.";

            return;

        }


        try {

            const response =
                await fetch(
                    song.lyrics.file
                );


            if (!response.ok) {

                throw new Error(
                    "Lyrics unavailable."
                );

            }


            const lyrics =
                await response.text();


            modalLyrics.textContent =
                lyrics;

        }

        catch (error) {

            modalLyrics.textContent =
                "Lyrics are not currently available.";

        }

    }


    function playSong(song) {

        if (
            !song.audio ||
            !song.audio.enabled ||
            !song.audio.file
        ) {

            alert(
                "Audio for this song has not been uploaded yet."
            );

            return;

        }


        currentSong =
            song;


        audioPlayer.src =
            song.audio.file;


        playerArtwork.src =
            song.artwork;


        playerTitle.textContent =
            song.title;


        playerArtist.textContent =
            song.artistName;


        nowPlaying.classList.add(
            "visible"
        );


        audioPlayer.play()
            .then(
                function () {

                    playerPlay.textContent =
                        "Ⅱ";

                }
            )
            .catch(
                function (error) {

                    console.error(error);

                }
            );

    }


    playerPlay.addEventListener(
        "click",
        function () {

            if (
                !audioPlayer.src
            ) {

                return;

            }


            if (
                audioPlayer.paused
            ) {

                audioPlayer.play();

                playerPlay.textContent =
                    "Ⅱ";

            }

            else {

                audioPlayer.pause();

                playerPlay.textContent =
                    "▶";

            }

        }
    );


    audioPlayer.addEventListener(
        "loadedmetadata",
        function () {

            playerDuration.textContent =
                formatTime(
                    audioPlayer.duration
                );

        }
    );


    audioPlayer.addEventListener(
        "timeupdate",
        function () {

            if (
                !audioPlayer.duration
            ) {

                return;

            }


            const percentage =
                (
                    audioPlayer.currentTime /
                    audioPlayer.duration
                ) * 100;


            playerSeek.value =
                percentage;


            playerCurrent.textContent =
                formatTime(
                    audioPlayer.currentTime
                );

        }
    );


    audioPlayer.addEventListener(
        "ended",
        function () {

            playerPlay.textContent =
                "▶";

        }
    );


    playerSeek.addEventListener(
        "input",
        function () {

            if (
                !audioPlayer.duration
            ) {

                return;

            }


            audioPlayer.currentTime =
                (
                    playerSeek.value / 100
                ) *
                audioPlayer.duration;

        }
    );


    playerClose.addEventListener(
        "click",
        function () {

            audioPlayer.pause();

            nowPlaying.classList.remove(
                "visible"
            );

        }
    );


    closeSongModal.addEventListener(
        "click",
        closeModal
    );


    songModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === songModal
            ) {

                closeModal();

            }

        }
    );


    function closeModal() {

        songModal.classList.remove(
            "open"
        );


        songModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    musicSearch.addEventListener(
        "input",
        renderSongs
    );


    artistFilter.addEventListener(
        "change",
        renderSongs
    );


    genreFilter.addEventListener(
        "change",
        renderSongs
    );


    function formatTime(seconds) {

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

    }


    function escapeHTML(value) {

        return String(value)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }

});
