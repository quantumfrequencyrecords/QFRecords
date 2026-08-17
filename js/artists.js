/* ============================================================
   QF RECORDS — ARTISTS PAGE ENGINE
   ============================================================ */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeArtistsPage();

    }
);


/* ============================================================
   STATE
   ============================================================ */

let allArtists = [];

let currentArtists = [];


/* ============================================================
   INITIALIZE
   ============================================================ */

async function initializeArtistsPage() {

    try {

        if (
            typeof QFRData === "undefined" ||
            typeof QFRData.activeArtists !== "function"
        ) {

            throw new Error(
                "QFRData.activeArtists() is unavailable."
            );

        }


        allArtists =
            await QFRData.activeArtists();


        currentArtists =
            [...allArtists];


        setupGenreFilter();

        renderArtistMarquee();

        renderArtists();

        setupSearch();

        setupMarquee();

    }
    catch (error) {

        console.error(
            "QFR Artists Error:",
            error
        );


        showArtistError();

    }

}


/* ============================================================
   GENRE FILTER
   ============================================================ */

function setupGenreFilter() {

    const filter =
        document.getElementById(
            "genre-filter"
        );


    if (!filter) {
        return;
    }


    const genres = [];


    allArtists.forEach(
        function (artist) {

            if (!artist.genre) {
                return;
            }


            const artistGenres =
                artist.genre
                    .split("/")
                    .map(
                        function (genre) {
                            return genre.trim();
                        }
                    );


            artistGenres.forEach(
                function (genre) {

                    if (
                        genre &&
                        !genres.includes(genre)
                    ) {

                        genres.push(genre);

                    }

                }
            );

        }
    );


    genres.sort(
        function (a, b) {

            return a.localeCompare(b);

        }
    );


    genres.forEach(
        function (genre) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                genre.toLowerCase();


            option.textContent =
                genre;


            filter.appendChild(
                option
            );

        }
    );


    filter.addEventListener(
        "change",
        function () {

            filterArtists();

        }
    );

}


/* ============================================================
   SEARCH
   ============================================================ */

function setupSearch() {

    const search =
        document.getElementById(
            "artist-search"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            filterArtists();

        }
    );

}


/* ============================================================
   FILTER ARTISTS
   ============================================================ */

function filterArtists() {

    const filter =
        document.getElementById(
            "genre-filter"
        );


    const search =
        document.getElementById(
            "artist-search"
        );


    const selectedGenre =
        filter
            ? filter.value
            : "all";


    const searchValue =
        search
            ? search.value
                .trim()
                .toLowerCase()
            : "";


    currentArtists =
        allArtists.filter(
            function (artist) {

                const artistGenre =
                    (
                        artist.genre ||
                        ""
                    ).toLowerCase();


                const artistName =
                    (
                        artist.name ||
                        ""
                    ).toLowerCase();


                const genreMatch =
                    selectedGenre === "all" ||
                    artistGenre.includes(
                        selectedGenre
                    );


                const searchMatch =
                    !searchValue ||
                    artistName.includes(
                        searchValue
                    );


                return (
                    genreMatch &&
                    searchMatch
                );

            }
        );


    renderArtists();

}


/* ============================================================
   RENDER MARQUEE
   ============================================================ */

function renderArtistMarquee() {

    const groups =
        document.querySelectorAll(
            "[data-marquee-group]"
        );


    if (!groups.length) {
        return;
    }


    const markup =
        allArtists
            .map(
                function (artist) {

                    return `

                        <div class="artist-marquee-item">

                            <span class="artist-marquee-symbol">
                                QF
                            </span>

                            <span>
                                ${escapeHTML(
                                    artist.name
                                )}
                            </span>

                        </div>

                    `;

                }
            )
            .join("");


    groups.forEach(
        function (group) {

            group.innerHTML =
                markup;

        }
    );

}


/* ============================================================
   RENDER ARTISTS
   ============================================================ */

function renderArtists() {

    const container =
        document.getElementById(
            "artist-list"
        );


    if (!container) {
        return;
    }


    if (!currentArtists.length) {

        container.innerHTML = `

            <div class="artists-loading">

                <p>
                    No artists match your search.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        currentArtists
            .map(
                function (
                    artist,
                    index
                ) {

                    return createArtistCard(
                        artist,
                        index
                    );

                }
            )
            .join("");


    activateImageFallbacks();

}


/* ============================================================
   ARTIST CARD
   ============================================================ */

function createArtistCard(
    artist,
    index
) {

    const reverse =
        index % 2 === 1;


    const image =
        artist.image ||
        "../assets/images/artists/artist-placeholder.jpg";


    const release =
        artist.latestRelease ||
        {};


    const releaseImage =
        release.image ||
        "../assets/images/releases/release-placeholder.jpg";


    const releaseTitle =
        release.title ||
        "New Frequency";


    const releaseDate =
        release.date ||
        "";


    const location =
        artist.hometown ||
        artist.location ||
        "Independent";


    const members =
        artist.membersCount ||
        artist.memberCount ||
        "";


    const signed =
        artist.signedSince ||
        "";


    const memberText =
        members
            ? `${members} Members`
            : "";


    const metadata = [

        location,

        artist.genre || "",

        signed
            ? `Signed Since ${signed}`
            : "",

        memberText

    ].filter(Boolean);


    return `

        <article
            class="
                artist-roster-card
                ${reverse ? "reverse" : ""}
            "
        >


            ${
                reverse
                ? createReleasePanel(
                    artist,
                    releaseImage,
                    releaseTitle,
                    releaseDate
                )
                : createArtistImage(
                    artist,
                    image
                )
            }


            <div class="artist-roster-info">

                <div class="artist-roster-number">

                    ${String(index + 1).padStart(2, "0")}

                </div>


                <h2 class="artist-roster-name">

                    ${escapeHTML(
                        artist.name
                    )}

                </h2>


                <div class="artist-roster-genre">

                    ${escapeHTML(
                        artist.genre ||
                        "Artist"
                    )}

                </div>


                <p class="artist-roster-bio">

                    ${escapeHTML(
                        artist.shortBio ||
                        "Creating music beyond the expected."
                    )}

                </p>


                <div class="artist-roster-meta">

                    ${
                        metadata
                            .map(
                                function (item) {

                                    return `
                                        <span>
                                            ${escapeHTML(item)}
                                        </span>
                                    `;

                                }
                            )
                            .join("")
                    }

                </div>

            </div>


            ${
                reverse
                ? createArtistImage(
                    artist,
                    image
                )
                : createReleasePanel(
                    artist,
                    releaseImage,
                    releaseTitle,
                    releaseDate
                )
            }

        </article>

    `;

}


/* ============================================================
   IMAGE
   ============================================================ */

function createArtistImage(
    artist,
    image
) {

    return `

        <div class="artist-roster-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(
                    artist.name
                )}"
                loading="lazy"
                data-fallback-image
            >

        </div>

    `;

}


/* ============================================================
   RELEASE PANEL
   ============================================================ */

function createReleasePanel(
    artist,
    image,
    title,
    date
) {

    return `

        <div class="artist-roster-release">

            <div>

                <div class="artist-release-label">
                    Latest Release
                </div>


                <img
                    class="artist-release-art"
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(title)}"
                    loading="lazy"
                    data-fallback-image
                >


                <div class="artist-release-title">

                    ${escapeHTML(title)}

                </div>


                <div class="artist-release-date">

                    ${escapeHTML(date)}

                </div>

            </div>


            <div class="artist-roster-actions">

                <a
                    href="
                        artist.html?id=${encodeURIComponent(
                            artist.id
                        )}
                    "
                    class="artist-roster-button"
                >
                    Meet The Band →
                </a>


                <a
                    href="
                        music.html?artist=${encodeURIComponent(
                            artist.id
                        )}
                    "
                    class="artist-roster-button"
                >
                    ▶ Listen Now
                </a>

            </div>

        </div>

    `;

}


/* ============================================================
   IMAGE FALLBACK
   ============================================================ */

function activateImageFallbacks() {

    const images =
        document.querySelectorAll(
            "[data-fallback-image]"
        );


    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    if (
                        image.dataset.fallbackUsed
                    ) {
                        return;
                    }


                    image.dataset.fallbackUsed =
                        "true";


                    if (
                        image.classList.contains(
                            "artist-release-art"
                        )
                    ) {

                        image.src =
                            "../assets/images/releases/release-placeholder.jpg";

                    }
                    else {

                        image.src =
                            "../assets/images/artists/artist-placeholder.jpg";

                    }

                }
            );

        }
    );

}


/* ============================================================
   MOBILE MARQUEE
   ============================================================ */

function setupMarquee() {

    const viewport =
        document.querySelector(
            "[data-artist-marquee]"
        );


    const track =
        document.querySelector(
            "[data-artist-marquee-track]"
        );


    if (!viewport || !track) {
        return;
    }


    let isDragging =
        false;


    let startX = 0;

    let scrollStart = 0;


    viewport.addEventListener(
        "pointerdown",
        function (event) {

            isDragging = true;

            startX =
                event.clientX;

            scrollStart =
                viewport.scrollLeft;


            viewport.classList.add(
                "dragging"
            );


            track.style.animationPlayState =
                "paused";


            viewport.setPointerCapture(
                event.pointerId
            );

        }
    );


    viewport.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }


            const distance =
                event.clientX -
                startX;


            viewport.scrollLeft =
                scrollStart -
                distance;

        }
    );


    viewport.addEventListener(
        "pointerup",
        function () {

            stopDragging();

        }
    );


    viewport.addEventListener(
        "pointercancel",
        function () {

            stopDragging();

        }
    );


    function stopDragging() {

        isDragging =
            false;


        viewport.classList.remove(
            "dragging"
        );


        track.style.animationPlayState =
            "running";

    }


    const previous =
        document.querySelector(
            ".artist-marquee-prev"
        );


    const next =
        document.querySelector(
            ".artist-marquee-next"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            function () {

                viewport.scrollBy({

                    left: -260,

                    behavior: "smooth"

                });

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            function () {

                viewport.scrollBy({

                    left: 260,

                    behavior: "smooth"

                });

            }
        );

    }

}


/* ============================================================
   ERROR
   ============================================================ */

function showArtistError() {

    const container =
        document.getElementById(
            "artist-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="artists-loading">

            <p>
                Unable to load the artist roster.
            </p>

            <p>
                Please check the artist data.
            </p>

        </div>

    `;

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
