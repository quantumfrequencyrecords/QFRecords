/* ============================================================
   QFRECORDS — UNIVERSAL ARTISTS PAGE
   ============================================================ */


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeArtistsPage();

    }
);


/* ============================================================
   INITIALIZE
   ============================================================ */

async function initializeArtistsPage() {

    try {

        const artists =
            await QFRData.activeArtists();


        renderArtistTicker(
            artists
        );


        renderArtistRoster(
            artists
        );


    } catch (error) {

        console.error(
            "Artists page failed:",
            error
        );


        showArtistError();

    }

}


/* ============================================================
   ARTIST TICKER
   ============================================================ */

function renderArtistTicker(
    artists
) {

    const ticker =
        document.querySelector(
            "[data-artist-ticker]"
        );


    if (!ticker) {
        return;
    }


    if (!artists.length) {

        ticker.innerHTML =
            "<span>No artists available.</span>";

        return;

    }


    /*
        Duplicate the artists so the ticker can
        continuously loop without a visual gap.
    */

    const tickerArtists =
        [
            ...artists,
            ...artists
        ];


    ticker.innerHTML =
        tickerArtists
            .map(
                artist => `

                    <div class="artist-ticker-item">

                        <span class="artist-ticker-symbol">
                            QF
                        </span>

                        <span>
                            ${escapeHTML(artist.name)}
                        </span>

                    </div>

                `
            )
            .join("");

}


/* ============================================================
   ARTIST ROSTER
   ============================================================ */

function renderArtistRoster(
    artists
) {

    const container =
        document.querySelector(
            "#artist-list"
        );


    if (!container) {
        return;
    }


    if (!artists.length) {

        container.innerHTML = `
            <div class="artists-loading">
                <p>
                    No artists are currently available.
                </p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        artists
            .map(
                (artist, index) =>
                    createArtistCard(
                        artist,
                        index
                    )
            )
            .join("");

}


/* ============================================================
   CREATE ARTIST CARD
   ============================================================ */

function createArtistCard(
    artist,
    index
) {

    const reverse =
        index % 2 !== 0
            ? "reverse"
            : "";


    const number =
        String(index + 1)
            .padStart(2, "0");


    const image =
        artist.image ||
        artist.thumbnail ||
        "../assets/images/artists/artist-placeholder.jpg";


    return `

        <article
            class="
                artist-roster-card
                ${reverse}
            "
        >

            <div class="artist-roster-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(artist.name)}"
                    loading="lazy"
                >

                <div class="artist-roster-name">

                    ${escapeHTML(artist.name)}

                </div>

            </div>


            <div class="artist-roster-info">

                <div class="artist-roster-number">

                    ${number}

                </div>


                <div class="artist-roster-genre">

                    ${escapeHTML(
                        artist.genre ||
                        "Artist"
                    )}

                </div>


                <p class="artist-roster-bio">

                    ${escapeHTML(
                        artist.shortBio ||
                        "Explore the artist, their music and their story."
                    )}

                </p>


                <a
                    href="
                        artist.html?id=${encodeURIComponent(
                            artist.id
                        )}
                    "
                    class="artist-roster-button"
                >

                    Explore Artist

                </a>

            </div>

        </article>

    `;

}


/* ============================================================
   ERROR
   ============================================================ */

function showArtistError() {

    const container =
        document.querySelector(
            "#artist-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="artists-loading">

            <p>
                The artist roster could not be loaded.
            </p>

            <p>
                Please try again shortly.
            </p>

        </div>

    `;

}


/* ============================================================
   HTML ESCAPE
   ============================================================ */

function escapeHTML(
    value
) {

    if (value === null ||
        value === undefined) {

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
