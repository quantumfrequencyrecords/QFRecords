/* ============================================================
   QFRECORDS DATA ENGINE
   ============================================================

   This file is the central connection between the website
   and the JSON data stored in /data/.

   HTML pages should not contain large amounts of music,
   artist, album, video or news information.

   Instead:

       JSON = Data
       JavaScript = Logic
       HTML = Presentation

   ============================================================ */

const QFRData = {

    cache: {},


    /* --------------------------------------------------------
       Load a JSON file
    -------------------------------------------------------- */

    async load(path) {

        if (this.cache[path]) {
            return this.cache[path];
        }


        try {

            const response = await fetch(path);


            if (!response.ok) {

                throw new Error(
                    `Unable to load ${path}`
                );

            }


            const data = await response.json();


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
       SITE DATA
    -------------------------------------------------------- */

    async site() {

        return await this.load(
            "../data/site.json"
        );

    },


    /* --------------------------------------------------------
       ARTIST INDEX
    -------------------------------------------------------- */

    async artists() {

        const data = await this.load(
            "../data/artists.json"
        );


        if (!data) {
            return [];
        }


        return data.artists || [];

    },


    /* --------------------------------------------------------
       INDIVIDUAL ARTIST
    -------------------------------------------------------- */

    async artist(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/artists/${id}.json`
        );

    },


    /* --------------------------------------------------------
       ALBUM
    -------------------------------------------------------- */

    async album(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/albums/${id}.json`
        );

    },


    /* --------------------------------------------------------
       SONG
    -------------------------------------------------------- */

    async song(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/songs/${id}.json`
        );

    },


    /* --------------------------------------------------------
       VIDEO
    -------------------------------------------------------- */

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

    async news(id) {

        if (!id) {
            return null;
        }


        return await this.load(
            `../data/news/${id}.json`
        );

    },


    /* --------------------------------------------------------
       GENERIC COLLECTION LOADER
    -------------------------------------------------------- */

    async collection(folder) {

        /*
            GitHub Pages cannot automatically list the files
            inside a directory.

            Therefore individual content will eventually be
            registered through an index file.

            This function is reserved for those collections.
        */

        return await this.load(
            `../data/${folder}.json`
        );

    },


    /* --------------------------------------------------------
       FIND ARTIST IN MASTER INDEX
    -------------------------------------------------------- */

    async findArtist(id) {

        const artists =
            await this.artists();


        return artists.find(
            artist =>
                artist.id === id
        ) || null;

    },


    /* --------------------------------------------------------
       ACTIVE ARTISTS
    -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       FEATURED ARTISTS
    -------------------------------------------------------- */

    async featuredArtists() {

        const artists =
            await this.artists();


        return artists.filter(
            artist =>
                artist.featured === true &&
                artist.active !== false
        );

    }

};


/* ============================================================
   GLOBAL HELPER
   ============================================================ */

window.QFRData = QFRData;
