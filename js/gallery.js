document.addEventListener("DOMContentLoaded", function () {

    const artistCards =
        document.getElementById("artistCards");

    const artistGallery =
        document.getElementById("artistGallery");

    const artistGallerySelector =
        document.querySelector(
            ".artist-gallery-selector"
        );

    const selectedArtistName =
        document.getElementById(
            "selectedArtistName"
        );

    const selectedArtistLabel =
        document.getElementById(
            "selectedArtistLabel"
        );

    const galleryCategories =
        document.getElementById(
            "galleryCategories"
        );

    const galleryCollections =
        document.getElementById(
            "galleryCollections"
        );

    const galleryEmpty =
        document.getElementById(
            "galleryEmpty"
        );

    const backToArtists =
        document.getElementById(
            "backToArtists"
        );


    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const lightboxTitle =
        document.getElementById(
            "lightboxTitle"
        );

    const lightboxArtist =
        document.getElementById(
            "lightboxArtist"
        );

    const lightboxDescription =
        document.getElementById(
            "lightboxDescription"
        );

    const lightboxMeta =
        document.getElementById(
            "lightboxMeta"
        );

    const closeLightbox =
        document.getElementById(
            "closeLightbox"
        );

    const previousImage =
        document.getElementById(
            "previousImage"
        );

    const nextImage =
        document.getElementById(
            "nextImage"
        );


    let artists = [];

    let selectedArtist = null;

    let selectedCategory = "all";

    let currentPhotos = [];

    let currentPhotoIndex = 0;


    loadGallery();


    async function loadGallery() {

        try {

            const response =
                await fetch(
                    "../data/gallery/index.json"
                );


            if (!response.ok) {

                throw new Error(
                    "Gallery database unavailable."
                );

            }


            const data =
                await response.json();


            artists =
                data.artists || [];


            renderArtistCards();

        }

        catch (error) {

            console.error(error);

            artistCards.innerHTML = `

                <div class="gallery-error">

                    Unable to load the QFR
                    visual archive.

                </div>

            `;

        }

    }


    function renderArtistCards() {

        artistCards.innerHTML = "";


        artists.forEach(function (artist) {

            const card =
                document.createElement("button");


            card.className =
                "artist-gallery-card";


            card.innerHTML = `

                <div class="artist-gallery-image">

                    <img
                        src="${artist.heroImage}"
                        alt="${escapeHTML(
                            artist.artistName
                        )}"
                        loading="lazy"
                    >

                </div>


                <div class="artist-gallery-card-content">

                    <span>
                        QFR ARTIST
                    </span>

                    <h3>
                        ${escapeHTML(
                            artist.artistName
                        )}
                    </h3>

                    <strong>
                        EXPLORE →
                    </strong>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    openArtistGallery(
                        artist
                    );

                }
            );


            artistCards.appendChild(card);

        });

    }


    function openArtistGallery(artist) {

        selectedArtist =
            artist;


        selectedCategory =
            "all";


        selectedArtistName.textContent =
            artist.artistName;


        selectedArtistLabel.textContent =
            "VISUAL ARCHIVE";


        artistGallerySelector.hidden =
            true;


        artistGallery.hidden =
            false;


        renderCategoryTabs();


        renderGallery();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    function renderCategoryTabs() {

        galleryCategories.innerHTML = "";


        const allButton =
            createCategoryButton(
                "all",
                "ALL PHOTOS"
            );


        galleryCategories.appendChild(
            allButton
        );


        selectedArtist.categories
            .forEach(function (category) {

                const button =
                    createCategoryButton(
                        category.id,
                        category.name
                    );


                galleryCategories.appendChild(
                    button
                );

            });

    }


    function createCategoryButton(
        id,
        name
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            name;


        button.className =
            "gallery-category";


        if (
            id === selectedCategory
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function () {

                selectedCategory =
                    id;


                renderCategoryTabs();

                renderGallery();

            }
        );


        return button;

    }


    function renderGallery() {

        galleryCollections.innerHTML = "";


        const categories =
            selectedArtist.categories;


        let photosFound = 0;


        categories.forEach(
            function (category) {

                if (
                    selectedCategory !== "all" &&
                    selectedCategory !== category.id
                ) {

                    return;

                }


                const directPhotos =
                    category.photos || [];


                if (
                    directPhotos.length
                ) {

                    photosFound +=
                        directPhotos.length;


                    createCollection(
                        category.name,
                        directPhotos
                    );

                }


                const collections =
                    category.collections || [];


                collections.forEach(
                    function (collection) {

                        const photos =
                            collection.photos || [];


                        if (!photos.length) {

                            return;

                        }


                        photosFound +=
                            photos.length;


                        createCollection(

                            category.name +
                            " / " +
                            collection.name,

                            photos

                        );

                    }
                );

            }
        );


        galleryEmpty.hidden =
            photosFound !== 0;

    }


    function createCollection(
        title,
        photos
    ) {

        const collection =
            document.createElement(
                "section"
            );


        collection.className =
            "gallery-collection";


        collection.innerHTML = `

            <div class="collection-heading">

                <span>
                    QFR ARCHIVE
                </span>

                <h3>
                    ${escapeHTML(title)}
                </h3>

            </div>


            <div class="photo-grid"></div>

        `;


        const photoGrid =
            collection.querySelector(
                ".photo-grid"
            );


        photos.forEach(
            function (photo) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "gallery-photo";


                button.innerHTML = `

                    <img
                        src="${photo.image}"
                        alt="${escapeHTML(
                            photo.title
                        )}"
                        loading="lazy"
                    >

                    <span>
                        ${escapeHTML(
                            photo.title
                        )}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    function () {

                        openLightbox(
                            photo,
                            photos
                        );

                    }
                );


                photoGrid.appendChild(
                    button
                );

            }
        );


        galleryCollections.appendChild(
            collection
        );

    }


    function openLightbox(
        photo,
        photos
    ) {

        currentPhotos =
            photos;


        currentPhotoIndex =
            photos.findIndex(
                item =>
                    item.id === photo.id
            );


        showLightboxPhoto();


        lightbox.classList.add(
            "open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function showLightboxPhoto() {

        const photo =
            currentPhotos[
                currentPhotoIndex
            ];


        if (!photo) {

            return;

        }


        lightboxImage.src =
            photo.image;


        lightboxImage.alt =
            photo.title;


        lightboxTitle.textContent =
            photo.title;


        lightboxArtist.textContent =
            selectedArtist.artistName;


        lightboxDescription.textContent =
            photo.description || "";


        const metadata = [];


        if (photo.location) {

            metadata.push(
                photo.location
            );

        }


        if (photo.date) {

            metadata.push(
                photo.date
            );

        }


        lightboxMeta.textContent =
            metadata.join(" • ");

    }


    function closeGalleryLightbox() {

        lightbox.classList.remove(
            "open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        lightboxImage.src =
            "";

    }


    previousImage.addEventListener(
        "click",
        function () {

            if (
                !currentPhotos.length
            ) {

                return;

            }


            currentPhotoIndex--;

            if (
                currentPhotoIndex < 0
            ) {

                currentPhotoIndex =
                    currentPhotos.length - 1;

            }


            showLightboxPhoto();

        }
    );


    nextImage.addEventListener(
        "click",
        function () {

            if (
                !currentPhotos.length
            ) {

                return;

            }


            currentPhotoIndex++;


            if (
                currentPhotoIndex >=
                currentPhotos.length
            ) {

                currentPhotoIndex =
                    0;

            }


            showLightboxPhoto();

        }
    );


    closeLightbox.addEventListener(
        "click",
        closeGalleryLightbox
    );


    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox
            ) {

                closeGalleryLightbox();

            }

        }
    );


    backToArtists.addEventListener(
        "click",
        function () {

            artistGallery.hidden =
                true;


            artistGallerySelector.hidden =
                false;


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox.classList.contains(
                    "open"
                )
            ) {

                return;

            }


            if (
                event.key === "Escape"
            ) {

                closeGalleryLightbox();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousImage.click();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextImage.click();

            }

        }
    );


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
