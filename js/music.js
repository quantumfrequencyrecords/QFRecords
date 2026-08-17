document.addEventListener("DOMContentLoaded", function () {

    const musicGrid =
        document.getElementById("musicGrid");

    const searchInput =
        document.getElementById("musicSearch");

    const artistFilter =
        document.getElementById("artistFilter");

    const genreFilter =
        document.getElementById("genreFilter");

    const albumFilter =
        document.getElementById("albumFilter");

    const resultCount =
        document.getElementById("resultCount");

    const noResults =
        document.getElementById("noResults");

    const audioPlayer =
        document.getElementById("audioPlayer");

    const playerSong =
        document.getElementById("playerSong");


    let songs = [];


    loadMusic();


    async function loadMusic() {

        try {

            const response =
                await fetch("../data/artists/index.json");

            if (!response.ok) {
                throw new Error(
                    "Artist index could not be loaded."
                );
            }

            const index =
                await response.json();


            const artistData =
                await Promise.all(

                    index.artists.map(
                        async function (artist) {

                            const response =
                                await fetch(
                                    "../data/artists/" +
                                    artist.file
                                );

                            if (!response.ok) {
                                return null;
                            }

                            return await response.json();

                        }
                    )

                );


            artistData
                .filter(Boolean)
                .forEach(function (artist) {

                    if (!artist.releases) {
                        return;
                    }


                    artist.releases.forEach(
                        function (release) {

                            if (!release.songs) {
                                return;
                            }


                            release.songs.forEach(
                                function (song) {

                                    songs.push({

                                        ...song,

                                        artistId:
                                            artist.id,

                                        artistName:
                                            artist.name,

                                        artistGenre:
                                            artist.genre,

                                        albumTitle:
                                            release.title,

                                        albumYear:
                                            release.year,

                                        releaseType:
                                            release.type,

                                        releaseArtwork:
                                            release.artwork

                                    });

                                }
                            );

                        }
                    );

                });


            buildFilters();

            renderSongs();


        } catch (error) {

            console.error(error);

            musicGrid.innerHTML = `

                <div class="music-error">

                    <h3>
                        MUSIC LIBRARY UNAVAILABLE
                    </h3>

                    <p>
                        The QFR music library could not
                        be loaded.
                    </p>

                </div>

            `;

        }

    }


    function buildFilters() {

        const artists =
            [...new Set(
                songs.map(
                    song => song.artistName
                )
            )].sort();


        const genres =
            [...new Set(
                songs.map(
                    song => song.artistGenre
                )
            )].sort();


        const albums =
            [...new Set(
                songs.map(
                    song => song.albumTitle
                )
            )].sort();


        artists.forEach(function (artist) {

            const option =
                document.createElement("option");

            option.value =
                artist;

            option.textContent =
                artist;

            artistFilter.appendChild(option);

        });


        genres.forEach(function (genre) {

            const option =
                document.createElement("option");

            option.value =
                genre;

            option.textContent =
                genre;

            genreFilter.appendChild(option);

        });


        albums.forEach(function (album) {

            const option =
                document.createElement("option");

            option.value =
                album;

            option.textContent =
                album;

            albumFilter.appendChild(option);

        });

    }


    function getFilteredSongs() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const artist =
            artistFilter.value;


        const genre =
            genreFilter.value;


        const album =
            albumFilter.value;


        return songs.filter(function (song) {

            const searchable = (

                song.title +
                " " +
                song.artistName +
                " " +
                song.albumTitle +
                " " +
                song.artistGenre

            ).toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(search);


            const matchesArtist =
                artist === "all" ||
                song.artistName === artist;


            const matchesGenre =
                genre === "all" ||
                song.artistGenre === genre;


            const matchesAlbum =
                album === "all" ||
                song.albumTitle === album;


            return (
                matchesSearch &&
                matchesArtist &&
                matchesGenre &&
                matchesAlbum
            );

        });

    }


    function renderSongs() {

        const filtered =
            getFilteredSongs();


        musicGrid.innerHTML = "";


        resultCount.textContent =
            filtered.length +
            (
                filtered.length === 1
                    ? " SONG"
                    : " SONGS"
            );


        noResults.hidden =
            filtered.length !== 0;


        filtered.forEach(function (song) {

            const card =
                document.createElement("article");

            card.className =
                "music-card";


            card.innerHTML = `

                <div class="music-artwork">

                    <img
                        src="${song.artwork || song.releaseArtwork}"
                        alt="${escapeHTML(song.title)}"
                        loading="lazy"
                    >

                    <button
                        class="music-play"
                        data-audio="${song.audio || ""}"
                        data-title="${escapeHTML(song.title)}"
                        data-artist="${escapeHTML(song.artistName)}"
                    >
                        ▶
                    </button>

                </div>


                <div class="music-card-info">

                    <span class="music-artist">
                        ${escapeHTML(song.artistName)}
                    </span>

                    <h3>
                        ${escapeHTML(song.title)}
                    </h3>

                    <p>
                        ${escapeHTML(song.albumTitle)}
                    </p>


                    <div class="music-card-actions">

                        <button
                            class="lyrics-button"
                            data-title="${escapeHTML(song.title)}"
                            data-artwork="${song.artwork || song.releaseArtwork}"
                            data-lyrics="${encodeURIComponent(song.lyrics || "Lyrics coming soon.")}"
                        >
                            LYRICS
                        </button>


                        ${
                            song.spotify
                            ?
                            `
                            <a
                                href="${song.spotify}"
                                target="_blank"
                                rel="noopener"
                                class="spotify-button"
                            >
                                SPOTIFY
                            </a>
                            `
                            :
                            ""
                        }


                        <a
                            href="artist.html?artist=${song.artistId}"
                            class="artist-button"
                        >
                            ARTIST
                        </a>

                    </div>

                </div>

            `;


            musicGrid.appendChild(card);

        });


        attachSongEvents();

    }


    function attachSongEvents() {

        document
            .querySelectorAll(".music-play")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const audio =
                            button.dataset.audio;


                        if (!audio) {

                            playerSong.textContent =
                                "Audio coming soon";

                            return;

                        }


                        audioPlayer.src =
                            audio;


                        playerSong.textContent =
                            button.dataset.title +
                            " — " +
                            button.dataset.artist;


                        audioPlayer.play();

                    }
                );

            });


        document
            .querySelectorAll(".lyrics-button")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document.getElementById(
                            "modalTitle"
                        ).textContent =
                            button.dataset.title;


                        document.getElementById(
                            "modalArtwork"
                        ).src =
                            button.dataset.artwork;


                        document.getElementById(
                            "modalLyrics"
                        ).textContent =
                            decodeURIComponent(
                                button.dataset.lyrics
                            );


                        openModal();

                    }
                );

            });

    }


    searchInput.addEventListener(
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


    albumFilter.addEventListener(
        "change",
        renderSongs
    );


    document
        .querySelectorAll(".music-filter")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(".music-filter")
                        .forEach(
                            btn =>
                            btn.classList.remove("active")
                        );


                    button.classList.add("active");

                    const type =
                        button.dataset.filter;


                    if (type === "all") {

                        albumFilter.value =
                            "all";

                    }


                    renderSongs();

                }
            );

        });


    function openModal() {

        const modal =
            document.getElementById(
                "songModal"
            );


        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeModal() {

        const modal =
            document.getElementById(
                "songModal"
            );


        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.getElementById(
        "closeSongModal"
    ).addEventListener(
        "click",
        closeModal
    );


    document.getElementById(
        "songModal"
    ).addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                document.getElementById(
                    "songModal"
                )
            ) {

                closeModal();

            }

        }
    );


    function escapeHTML(value) {

        return String(value)

            .replaceAll("&", "&amp;")

            .replaceAll("<", "&lt;")

            .replaceAll(">", "&gt;")

            .replaceAll('"', "&quot;")

            .replaceAll("'", "&#039;");

    }

});
