document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const artistId =
        params.get("artist") || "buckshot-bourbon";

    const artistPath =
        "../data/artists/" + artistId + ".json";


    fetch(artistPath)

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Artist data could not be loaded.");
            }

            return response.json();

        })

        .then(function (artist) {

            renderArtist(artist);

        })

        .catch(function (error) {

            console.error(error);

            document.getElementById("artistName").textContent =
                "Artist unavailable";

            document.getElementById("artistTagline").textContent =
                "The requested artist could not be loaded.";

        });


    function renderArtist(artist) {

        document.title =
            artist.name + " | Quantum Frequency Records";


        document.getElementById("artistName").textContent =
            artist.name;


        document.getElementById("artistGenre").textContent =
            artist.genre;


        document.getElementById("artistTagline").textContent =
            artist.tagline;


        document.getElementById("artistShortBio").textContent =
            artist.shortBio;


        document.getElementById("artistBiography").textContent =
            artist.biography;


        const hero =
            document.querySelector(".artist-hero");


        if (artist.heroImage) {

            hero.style.backgroundImage =
                "url('" + artist.heroImage + "')";

        }


        renderLatest(artist);

        renderDiscography(artist);

        renderVideos(artist);

        renderMembers(artist);

        renderGallery(artist);

    }


    function renderLatest(artist) {

        if (!artist.releases || !artist.releases.length) {
            return;
        }

        const latest =
            artist.releases[0];


        document.getElementById("latestRelease").textContent =
            latest.title;


        document.getElementById("latestReleaseYear").textContent =
            latest.year;

    }


    function renderDiscography(artist) {

        const container =
            document.getElementById("discography");

        container.innerHTML = "";


        if (!artist.releases) {
            return;
        }


        artist.releases.forEach(function (release) {

            const article =
                document.createElement("article");

            article.className =
                "release-card";


            let songsHTML = "";


            release.songs.forEach(function (song, index) {

                songsHTML += `

                    <div class="song-row">

                        <div class="song-number">
                            ${String(index + 1).padStart(2, "0")}
                        </div>

                        <div class="song-title">
                            ${song.title}
                        </div>

                        <div class="song-duration">
                            ${song.duration || ""}
                        </div>

                        <button
                            class="song-play"
                            data-audio="${song.audio}"
                            data-title="${song.title}"
                        >
                            ▶
                        </button>

                        <button
                            class="song-lyrics"
                            data-title="${song.title}"
                            data-artwork="${song.artwork}"
                            data-lyrics="${encodeURIComponent(song.lyrics || "")}"
                        >
                            LYRICS
                        </button>

                    </div>

                `;

            });


            article.innerHTML = `

                <div class="release-header">

                    <img
                        src="${release.artwork}"
                        alt="${release.title}"
                    >

                    <div>

                        <span class="release-type">
                            ${release.type} • ${release.year}
                        </span>

                        <h3>
                            ${release.title}
                        </h3>

                        <p>
                            ${release.description || ""}
                        </p>

                    </div>

                </div>

                <div class="song-list">

                    ${songsHTML}

                </div>

            `;


            container.appendChild(article);

        });


        addSongEvents();

    }


    function addSongEvents() {

        document
            .querySelectorAll(".song-play")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const audio =
                            document.getElementById("audioPlayer");

                        const title =
                            button.dataset.title;

                        audio.src =
                            button.dataset.audio;

                        audio.play();

                        document.getElementById(
                            "playerSong"
                        ).textContent = title;

                    }
                );

            });


        document
            .querySelectorAll(".song-lyrics")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document.getElementById(
                            "modalSongTitle"
                        ).textContent =
                            button.dataset.title;


                        document.getElementById(
                            "modalSongArtwork"
                        ).src =
                            button.dataset.artwork;


                        document.getElementById(
                            "modalLyrics"
                        ).textContent =
                            decodeURIComponent(
                                button.dataset.lyrics
                            );


                        openModal(
                            "songModal"
                        );

                    }
                );

            });

    }


    function renderVideos(artist) {

        const container =
            document.getElementById("artistVideos");

        container.innerHTML = "";


        if (!artist.videos) {
            return;
        }


        artist.videos.forEach(function (video) {

            const card =
                document.createElement("article");

            card.className =
                "video-card";


            card.innerHTML = `

                <div class="video-wrapper">

                    <iframe

                        src="https://www.youtube.com/embed/${video.youtubeId}"

                        title="${video.title}"

                        loading="lazy"

                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

                        allowfullscreen>

                    </iframe>

                </div>

                <h3>
                    ${video.title}
                </h3>

            `;


            container.appendChild(card);

        });

    }


    function renderMembers(artist) {

        const container =
            document.getElementById("artistMembers");

        container.innerHTML = "";


        if (!artist.members) {
            return;
        }


        artist.members.forEach(function (member) {

            const card =
                document.createElement("article");

            card.className =
                "member-card";


            card.innerHTML = `

                <img
                    src="${member.image}"
                    alt="${member.name}"
                >

                <div class="member-card-info">

                    <span>
                        ${member.role}
                    </span>

                    <h3>
                        ${member.name}
                    </h3>

                    <p>
                        ${member.hometown}
                    </p>

                    <button class="member-more">
                        VIEW PROFILE
                    </button>

                </div>

            `;


            const button =
                card.querySelector(".member-more");


            button.addEventListener(
                "click",
                function () {

                    document.getElementById(
                        "modalMemberImage"
                    ).src =
                        member.image;


                    document.getElementById(
                        "modalMemberName"
                    ).textContent =
                        member.name;


                    document.getElementById(
                        "modalMemberRole"
                    ).textContent =
                        member.role;


                    document.getElementById(
                        "modalMemberBio"
                    ).textContent =
                        member.bio;


                    openModal(
                        "memberModal"
                    );

                }
            );


            container.appendChild(card);

        });

    }


    function renderGallery(artist) {

        const container =
            document.getElementById("artistGallery");

        container.innerHTML = "";


        if (!artist.gallery) {
            return;
        }


        artist.gallery.forEach(function (group) {

            const groupElement =
                document.createElement("div");

            groupElement.className =
                "gallery-group";


            groupElement.innerHTML = `

                <h3>
                    ${group.title}
                </h3>

                <div class="gallery-group-grid">

                    ${group.items.map(function (item) {

                        return `

                            <figure>

                                <img
                                    src="${item.image}"
                                    alt="${item.title}"
                                    loading="lazy"
                                >

                                <figcaption>
                                    ${item.title}
                                </figcaption>

                            </figure>

                        `;

                    }).join("")}

                </div>

            `;


            container.appendChild(groupElement);

        });

    }


    function openModal(id) {

        const modal =
            document.getElementById(id);

        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeModal(id) {

        const modal =
            document.getElementById(id);

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
        function () {
            closeModal("songModal");
        }
    );


    document.getElementById(
        "closeMemberModal"
    ).addEventListener(
        "click",
        function () {
            closeModal("memberModal");
        }
    );


    document
        .querySelectorAll(".qfr-modal")
        .forEach(function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (event.target === modal) {

                        closeModal(
                            modal.id
                        );

                    }

                }
            );

        });

});
