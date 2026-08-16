/* ============================================================
   QFRECORDS HOMEPAGE DATA
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadHomepageData();

    }
);


/* ------------------------------------------------------------
   LOAD HOMEPAGE
------------------------------------------------------------ */

async function loadHomepageData() {

    try {

        const artists =
            await QFRData.activeArtists();

        const songs =
            await QFRData.featuredSongs();

        const albums =
            await QFRData.featuredAlbums();

        const videos =
            await QFRData.featuredVideos();

        const news =
            await QFRData.featuredNews();


        console.log(
            "QFRecords homepage data loaded:",
            {
                artists,
                songs,
                albums,
                videos,
                news
            }
        );


        renderFeaturedArtist(
            artists
        );


        renderFeaturedSong(
            songs
        );


        renderFeaturedAlbum(
            albums
        );


        renderFeaturedVideo(
            videos
        );


    } catch (error) {

        console.error(
            "Homepage initialization failed:",
            error
        );

    }

}


/* ------------------------------------------------------------
   FEATURED ARTIST
------------------------------------------------------------ */

function renderFeaturedArtist(
    artists
) {

    const element =
        document.querySelector(
            "[data-home-featured-artist]"
        );


    if (!element || !artists.length) {
        return;
    }


    const artist =
        artists.find(
            item =>
                item.featured === true
        ) || artists[0];


    element.textContent =
        artist.name;

}


/* ------------------------------------------------------------
   FEATURED SONG
------------------------------------------------------------ */

function renderFeaturedSong(
    songs
) {

    const element =
        document.querySelector(
            "[data-home-featured-song]"
        );


    if (!element || !songs.length) {
        return;
    }


    const song =
        songs[0];


    element.textContent =
        song.title || song.id;

}


/* ------------------------------------------------------------
   FEATURED ALBUM
------------------------------------------------------------ */

function renderFeaturedAlbum(
    albums
) {

    const element =
        document.querySelector(
            "[data-home-featured-album]"
        );


    if (!element || !albums.length) {
        return;
    }


    const album =
        albums[0];


    element.textContent =
        album.title || album.id;

}


/* ------------------------------------------------------------
   FEATURED VIDEO
------------------------------------------------------------ */

function renderFeaturedVideo(
    videos
) {

    const element =
        document.querySelector(
            "[data-home-featured-video]"
        );


    if (!element || !videos.length) {
        return;
    }


    const video =
        videos[0];


    element.textContent =
        video.title || video.id;

}
