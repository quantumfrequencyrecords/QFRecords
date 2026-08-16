/* ============================================================
   QFRECORDS DATA ENGINE
   ============================================================ */

const QFRData = {

    cache: {},


    /* --------------------------------------------------------
       BASIC JSON LOADER
    -------------------------------------------------------- */

    async load(path) {

        if (this.cache[path]) {
            return this.cache[path];
        }


        try {

            const response =
                await fetch(path);


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}: ${path}`
                );

            }


            const data =
                await response.json();


            this.cache[path] = data;


            return data;

        } catch (error) {

            console.error(
                "QFRecords Data Error:",
                error
            );


            return null;

        }

    },


    /* --------------------------------------------------------
       SITE
    -------------------------------------------------------- */

    async site() {

        return await this.load(
            "../data/site.json"
        );

    },


    /* --------------------------------------------------------
       ARTISTS
    -------------------------------------------------------- */

    async artists() {

        const data =
            await this.load(
                "../data/artists.json"
            );


        return data?.artists || [];

    },


    async artist(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/artists/${id}.json`
        );

    },


    async activeArtists() {

        const artists =
            await this.artists();


        return artists

            .filter(
                artist =>
                    artist.active !== false
            )

            .sort(
                (a, b) =>
                    (a.sortOrder || 999)
                    -
                    (b.sortOrder || 999)
            );

    },


    async featuredArtists() {

        const artists =
            await this.activeArtists();


        return artists.filter(
            artist =>
                artist.featured === true
        );

    },


    async findArtist(id) {

        const artists =
            await this.artists();


        return artists.find(
            artist =>
                artist.id === id
        ) || null;

    },


    /* --------------------------------------------------------
       ALBUMS
    -------------------------------------------------------- */

    async albums() {

        const data =
            await this.load(
                "../data/albums.json"
            );


        return data?.albums || [];

    },


    async album(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/albums/${id}.json`
        );

    },


    /* --------------------------------------------------------
       SONGS
    -------------------------------------------------------- */

    async songs() {

        const data =
            await this.load(
                "../data/songs.json"
            );


        return data?.songs || [];

    },


    async song(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/songs/${id}.json`
        );

    },


    /* --------------------------------------------------------
       VIDEOS
    -------------------------------------------------------- */

    async videos() {

        const data =
            await this.load(
                "../data/videos.json"
            );


        return data?.videos || [];

    },


    async video(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/videos/${id}.json`
        );

    },


    /* --------------------------------------------------------
       NEWS
    -------------------------------------------------------- */

    async newsItems() {

        const data =
            await this.load(
                "../data/news.json"
            );


        return data?.news || [];

    },


    async news(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/news/${id}.json`
        );

    },


    /* --------------------------------------------------------
       FILTER SONGS BY ARTIST
    -------------------------------------------------------- */

    async songsByArtist(artistId) {

        const songs =
            await this.songs();


        return songs.filter(
            song =>
                song.artistId === artistId &&
                song.active !== false
        );

    },


    /* --------------------------------------------------------
       FILTER ALBUMS BY ARTIST
    -------------------------------------------------------- */

    async albumsByArtist(artistId) {

        const albums =
            await this.albums();


        return albums.filter(
            album =>
                album.artistId === artistId &&
                album.active !== false
        );

    },


    /* --------------------------------------------------------
       FILTER VIDEOS BY ARTIST
    -------------------------------------------------------- */

    async videosByArtist(artistId) {

        const videos =
            await this.videos();


        return videos.filter(
            video =>
                video.artistId === artistId &&
                video.active !== false
        );

    },


    /* --------------------------------------------------------
       FILTER NEWS BY ARTIST
    -------------------------------------------------------- */

    async newsByArtist(artistId) {

        const news =
            await this.newsItems();


        return news.filter(
            item =>
                item.artistId === artistId &&
                item.active !== false
        );

    },


    /* --------------------------------------------------------
       FEATURED CONTENT
    -------------------------------------------------------- */

    async featuredSongs() {

        const songs =
            await this.songs();


        return songs.filter(
            song =>
                song.featured === true &&
                song.active !== false
        );

    },


    async featuredAlbums() {

        const albums =
            await this.albums();


        return albums.filter(
            album =>
                album.featured === true &&
                album.active !== false
        );

    },


    async featuredVideos() {

        const videos =
            await this.videos();


        return videos.filter(
            video =>
                video.featured === true &&
                video.active !== false
        );

    },


    async featuredNews() {

        const news =
            await this.newsItems();


        return news.filter(
            item =>
                item.featured === true &&
                item.active !== false
        );

    }

};


window.QFRData = QFRData;
