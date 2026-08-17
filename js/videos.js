document.addEventListener("DOMContentLoaded", function () {

    const videoGrid =
        document.getElementById("videoGrid");

    const videoSearch =
        document.getElementById("videoSearch");

    const artistFilter =
        document.getElementById("videoArtistFilter");

    const categoryFilter =
        document.getElementById("videoCategoryFilter");

    const featuredVideo =
        document.getElementById("featuredVideo");

    const videoEmpty =
        document.getElementById("videoEmpty");

    const modal =
        document.getElementById("videoModal");

    const player =
        document.getElementById("videoPlayer");

    const closeModal =
        document.getElementById("closeVideoModal");

    const modalTitle =
        document.getElementById("modalVideoTitle");

    const modalArtist =
        document.getElementById("modalVideoArtist");

    const modalDescription =
        document.getElementById("modalVideoDescription");


    let videos = [];


    loadVideos();


    async function loadVideos() {

        try {

            const response =
                await fetch("../data/videos/index.json");

            if (!response.ok) {
                throw new Error("Video database unavailable.");
            }

            const data =
                await response.json();

            videos =
                data.videos || [];


            buildFilters();

            renderFeatured();

            renderVideos();

        }

        catch (error) {

            console.error(error);

            videoEmpty.hidden = false;

        }

    }


    function buildFilters() {

        const artists =
            [...new Set(
                videos.map(video => video.artistName)
            )].sort();


        const categories =
            [...new Set(
                videos.map(video => video.category)
            )].sort();


        artists.forEach(function (artist) {

            const option =
                document.createElement("option");

            option.value = artist;

            option.textContent = artist;

            artistFilter.appendChild(option);

        });


        categories.forEach(function (category) {

            const option =
                document.createElement("option");

            option.value = category;

            option.textContent = category;

            categoryFilter.appendChild(option);

        });

    }


    function filteredVideos() {

        const search =
            videoSearch.value
                .trim()
                .toLowerCase();


        return videos.filter(function (video) {

            const searchable = (

                video.title +
                " " +
                video.artistName +
                " " +
                video.category +
                " " +
                (video.description || "")

            ).toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(search);


            const matchesArtist =
                artistFilter.value === "all" ||
                video.artistName === artistFilter.value;


            const matchesCategory =
                categoryFilter.value === "all" ||
                video.category === categoryFilter.value;


            return (
                matchesSearch &&
                matchesArtist &&
                matchesCategory
            );

        });

    }


    function renderFeatured() {

        const featured =
            videos.find(
                video => video.featured
            );


        if (!featured) {

            featuredVideo.innerHTML = `

                <div class="video-placeholder">

                    <span>
                        QFR VIDEO UNIVERSE
                    </span>

                    <p>
                        Featured video coming soon.
                    </p>

                </div>

            `;

            return;

        }


        featuredVideo.innerHTML = `

            <button
                class="featured-video-button"
                data-video-id="${featured.id}"
            >

                <img
                    src="${featured.thumbnail || ""}"
                    alt="${escapeHTML(featured.title)}"
                >

                <div class="featured-overlay">

                    <span>
                        ▶
                    </span>

                    <strong>
                        ${escapeHTML(featured.title)}
                    </strong>

                </div>

            </button>

        `;


        featuredVideo
            .querySelector("button")
            .addEventListener(
                "click",
                function () {

                    openVideo(featured);

                }
            );

    }


    function renderVideos() {

        const filtered =
            filteredVideos();


        videoGrid.innerHTML = "";


        videoEmpty.hidden =
            filtered.length !== 0;


        filtered.forEach(function (video) {

            const card =
                document.createElement("article");

            card.className =
                "video-card";


            card.innerHTML = `

                <button
                    class="video-card-image"
                    data-video-id="${video.id}"
                >

                    <img
                        src="${video.thumbnail || ""}"
                        alt="${escapeHTML(video.title)}"
                        loading="lazy"
                    >

                    <span>
                        ▶
                    </span>

                </button>


                <div class="video-card-info">

                    <small>
                        ${escapeHTML(video.artistName)}
                    </small>

                    <h3>
                        ${escapeHTML(video.title)}
                    </h3>

                    <p>
                        ${escapeHTML(video.category || "")}
                    </p>

                </div>

            `;


            videoGrid.appendChild(card);


            card
                .querySelector("button")
                .addEventListener(
                    "click",
                    function () {

                        openVideo(video);

                    }
                );

        });

    }


    function openVideo(video) {

        if (!video.youtubeId) {

            return;

        }


        player.innerHTML = `

            <iframe

                src="https://www.youtube.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1&rel=0"

                title="${escapeHTML(video.title)}"

                allow="
                    autoplay;
                    encrypted-media;
                    picture-in-picture
                "

                allowfullscreen

            ></iframe>

        `;


        modalTitle.textContent =
            video.title;


        modalArtist.textContent =
            video.artistName;


        modalDescription.textContent =
            video.description || "";


        modal.classList.add("open");

    }


    function closeVideo() {

        modal.classList.remove("open");

        player.innerHTML = "";

    }


    closeModal.addEventListener(
        "click",
        closeVideo
    );


    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeVideo();

            }

        }
    );


    videoSearch.addEventListener(
        "input",
        renderVideos
    );


    artistFilter.addEventListener(
        "change",
        renderVideos
    );


    categoryFilter.addEventListener(
        "change",
        renderVideos
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
