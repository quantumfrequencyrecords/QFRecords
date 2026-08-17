document.addEventListener("DOMContentLoaded", function () {

    const reasonSelect =
        document.getElementById("contactReason");

    const dynamicFields =
        document.getElementById("dynamicFields");

    const contactForm =
        document.getElementById("contactForm");

    const formSuccess =
        document.getElementById("formSuccess");

    const newMessage =
        document.getElementById("newMessage");


    let contactConfig = null;

    let artists = [];

    let songs = [];

    let albums = [];


    initialize();


    async function initialize() {

        await loadContactConfig();

        await loadSiteData();

        populateReasonSelector();

    }


    async function loadContactConfig() {

        try {

            const response =
                await fetch(
                    "../data/contact/index.json"
                );


            if (!response.ok) {

                throw new Error(
                    "Contact configuration unavailable."
                );

            }


            contactConfig =
                await response.json();

        }

        catch (error) {

            console.error(error);

        }

    }


    async function loadSiteData() {

        /*
         * We intentionally try to load the
         * master data independently.
         *
         * This means the Contact page can
         * continue working even if one data
         * source isn't ready yet.
         */

        try {

            const response =
                await fetch(
                    "../data/artists/index.json"
                );


            if (response.ok) {

                const data =
                    await response.json();

                artists =
                    data.artists || [];

            }

        }

        catch (error) {

            console.log(
                "Artist database not available yet."
            );

        }


        try {

            const response =
                await fetch(
                    "../data/music/index.json"
                );


            if (response.ok) {

                const data =
                    await response.json();

                songs =
                    data.songs || [];

            }

        }

        catch (error) {

            console.log(
                "Music database not available yet."
            );

        }


        try {

            const response =
                await fetch(
                    "../data/albums/index.json"
                );


            if (response.ok) {

                const data =
                    await response.json();

                albums =
                    data.albums || [];

            }

        }

        catch (error) {

            console.log(
                "Album database not available yet."
            );

        }

    }


    function populateReasonSelector() {

        if (
            !contactConfig ||
            !contactConfig.contactReasons
        ) {

            return;

        }


        contactConfig.contactReasons.forEach(
            function (reason) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    reason.id;


                option.textContent =
                    reason.label;


                reasonSelect.appendChild(
                    option
                );

            }
        );

    }


    reasonSelect.addEventListener(
        "change",
        function () {

            renderDynamicFields(
                reasonSelect.value
            );

        }
    );


    function renderDynamicFields(reason) {

        dynamicFields.innerHTML = "";


        if (!reason) {

            return;

        }


        switch (reason) {


            case "artist-feedback":

                addArtistSelector(
                    "ARTIST",
                    "artist"
                );

                addRatingField();

                break;



            case "album-feedback":

                addArtistSelector(
                    "ARTIST",
                    "artist"
                );

                addAlbumSelector();

                addRatingField();

                break;



            case "song-feedback":

                addArtistSelector(
                    "ARTIST",
                    "artist"
                );

                addSongSelector();

                addRatingField();

                break;



            case "complaint":

                addPriorityField();

                addField(
                    "issueType",
                    "ISSUE TYPE",
                    "select",
                    [
                        "Website",
                        "Music",
                        "Artist",
                        "Store",
                        "Purchase",
                        "Copyright",
                        "Content",
                        "Other"
                    ]
                );

                break;



            case "collaboration":

                addField(
                    "organization",
                    "ORGANIZATION / COMPANY",
                    "text"
                );

                addField(
                    "website",
                    "WEBSITE / SOCIAL PROFILE",
                    "url"
                );

                addField(
                    "collaborationType",
                    "COLLABORATION TYPE",
                    "select",
                    [
                        "Music",
                        "Video",
                        "Photography",
                        "Design",
                        "Marketing",
                        "Live Event",
                        "Brand Partnership",
                        "Technology",
                        "Other"
                    ]
                );

                break;



            case "content-use":

                addField(
                    "contentType",
                    "CONTENT TYPE",
                    "select",
                    [
                        "Song",
                        "Video",
                        "Album Artwork",
                        "Artist Image",
                        "Other"
                    ]
                );


                addSongSelector();

                addField(
                    "intendedUse",
                    "HOW WILL THE CONTENT BE USED?",
                    "textarea"
                );

                addField(
                    "projectName",
                    "PROJECT / PRODUCTION NAME",
                    "text"
                );

                break;



            case "purchase-song":

                addSongSelector();

                addField(
                    "usageType",
                    "INTENDED USE",
                    "select",
                    [
                        "Personal",
                        "Commercial",
                        "Film / TV",
                        "YouTube / Social Media",
                        "Advertising",
                        "Podcast",
                        "Other"
                    ]
                );

                break;



            case "purchase-stems":

                addSongSelector();

                addField(
                    "stemPurpose",
                    "WHAT ARE YOU PLANNING TO DO WITH THE STEMS?",
                    "textarea"
                );

                break;



            case "store-suggestion":

                addField(
                    "storeCategory",
                    "STORE CATEGORY",
                    "select",
                    [
                        "Clothing",
                        "Music",
                        "Physical Media",
                        "Collectibles",
                        "Artwork",
                        "Accessories",
                        "Other"
                    ]
                );

                break;



            case "store-feedback":

                addRatingField();

                addField(
                    "orderNumber",
                    "ORDER NUMBER (OPTIONAL)",
                    "text"
                );

                break;



            case "press":

                addField(
                    "publication",
                    "PUBLICATION / MEDIA OUTLET",
                    "text"
                );

                addField(
                    "website",
                    "PUBLICATION WEBSITE",
                    "url"
                );

                addField(
                    "deadline",
                    "DEADLINE",
                    "date"
                );

                break;



            case "business":

                addField(
                    "organization",
                    "ORGANIZATION / COMPANY",
                    "text"
                );

                addField(
                    "website",
                    "WEBSITE",
                    "url"
                );

                break;



            case "fan-message":

                addArtistSelector(
                    "ARTIST (OPTIONAL)",
                    "artist"
                );

                break;



            case "general-feedback":

                addRatingField();

                break;



            case "other":

                addField(
                    "subject",
                    "SUBJECT",
                    "text"
                );

                break;

        }

    }


    function addArtistSelector(
        label,
        name
    ) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "form-group dynamic-field";


        const labelElement =
            document.createElement(
                "label"
            );


        labelElement.textContent =
            label;


        const select =
            document.createElement(
                "select"
            );


        select.name =
            name;


        select.required =
            label === "ARTIST";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value =
            "";


        defaultOption.textContent =
            "Select artist...";


        select.appendChild(
            defaultOption
        );


        artists.forEach(
            function (artist) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    artist.id ||
                    artist.artistId ||
                    artist.name;


                option.textContent =
                    artist.name ||
                    artist.artistName;


                select.appendChild(
                    option
                );

            }
        );


        wrapper.appendChild(
            labelElement
        );


        wrapper.appendChild(
            select
        );


        dynamicFields.appendChild(
            wrapper
        );

    }


    function addAlbumSelector() {

        addField(
            "album",
            "ALBUM",
            "select",
            albums.map(
                album =>
                    album.title ||
                    album.name
            )
        );

    }


    function addSongSelector() {

        addField(
            "song",
            "SONG",
            "select",
            songs.map(
                song =>
                    song.title
            )
        );

    }


    function addRatingField() {

        addField(
            "rating",
            "RATING",
            "select",
            [
                "★★★★★ — Excellent",
                "★★★★ — Very Good",
                "★★★ — Good",
                "★★ — Needs Improvement",
                "★ — Poor"
            ]
        );

    }


    function addPriorityField() {

        addField(
            "priority",
            "PRIORITY",
            "select",
            [
                "General",
                "Important",
                "Urgent"
            ]
        );

    }


    function addField(
        name,
        label,
        type,
        options
    ) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "form-group dynamic-field";


        const labelElement =
            document.createElement(
                "label"
            );


        labelElement.setAttribute(
            "for",
            name
        );


        labelElement.textContent =
            label;


        let field;


        if (type === "textarea") {

            field =
                document.createElement(
                    "textarea"
                );

            field.rows =
                5;

        }

        else {

            field =
                document.createElement(
                    type
                );

        }


        field.id =
            name;


        field.name =
            name;


        field.required =
            true;


        if (
            type === "select"
        ) {

            const placeholder =
                document.createElement(
                    "option"
                );


            placeholder.value =
                "";


            placeholder.textContent =
                "Select...";


            field.appendChild(
                placeholder
            );


            options.forEach(
                function (optionText) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        optionText;


                    option.textContent =
                        optionText;


                    field.appendChild(
                        option
                    );

                }
            );

        }


        wrapper.appendChild(
            labelElement
        );


        wrapper.appendChild(
            field
        );


        dynamicFields.appendChild(
            wrapper
        );

    }


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !contactForm.checkValidity()
            ) {

                contactForm.reportValidity();

                return;

            }


            /*
             * Phase one:
             * display the success state.
             *
             * We will connect this to a
             * free form backend in the next
             * step.
             */

            contactForm.hidden =
                true;


            formSuccess.hidden =
                false;


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    newMessage.addEventListener(
        "click",
        function () {

            contactForm.reset();

            dynamicFields.innerHTML = "";

            formSuccess.hidden =
                true;

            contactForm.hidden =
                false;

        }
    );

});
