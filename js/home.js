/* ============================================================
   QFRECORDS — HOME PAGE
   Home-page interactions
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ========================================================
       DATA
    ======================================================== */

    const philosophyData = {
        independent: {
            title: "Independent",
            text:
                "We do not get in the way of an artist's creative process. Our artists are given room to create, evolve and discover their sound without unnecessary restrictions."
        },

        artistDriven: {
            title: "Artist Driven",
            text:
                "The artist remains at the center of the process. Their voice, identity, ideas and creative direction help shape everything we build together."
        },

        beyondGenre: {
            title: "Beyond Genre",
            text:
                "Great music does not always fit neatly into a category. We embrace artists who move between genres, blend influences and create something difficult to label."
        },

        experimental: {
            title: "Experimental",
            text:
                "We encourage experimentation, new approaches and unexpected combinations. Sometimes the most interesting music begins where the familiar ends."
        },

        authentic: {
            title: "Authentic",
            text:
                "Every artist has a story worth hearing. We value music that feels honest, personal and unmistakably connected to the person or people who created it."
        },

        fearless: {
            title: "Fearless",
            text:
                "Taking creative risks is part of the journey. We support artists willing to challenge expectations and follow an idea wherever it leads."
        },

        evolving: {
            title: "Evolving",
            text:
                "An artist's sound should be allowed to change. We believe growth, experimentation and evolution are essential parts of a meaningful creative career."
        },

        connected: {
            title: "Connected",
            text:
                "Music creates connections between artists, listeners and ideas. QFRecords exists to build a community around those connections."
        },

        frequency: {
            title: "Our Frequency",
            text:
                "Every artist has a frequency — a distinct energy, perspective and sound. QFRecords brings those different frequencies together without forcing them to become the same."
        }
    };


    /* ========================================================
       PHILOSOPHY CARDS
    ======================================================== */

    const philosophyCards =
        document.querySelectorAll(".qfr-philosophy-card");

    const philosophyDetail =
        document.querySelector(".qfr-philosophy-detail");

    const philosophyDetailEyebrow =
        philosophyDetail
            ? philosophyDetail.querySelector(".qfr-detail-eyebrow")
            : null;

    const philosophyDetailTitle =
        philosophyDetail
            ? philosophyDetail.querySelector("h3")
            : null;

    const philosophyDetailText =
        philosophyDetail
            ? philosophyDetail.querySelector("p")
            : null;

    const philosophyClose =
        document.querySelector(".qfr-detail-close");


    function closePhilosophyDetail() {
        philosophyCards.forEach((card) => {
            card.classList.remove("active");
            card.setAttribute("aria-expanded", "false");
        });

        if (philosophyDetail) {
            philosophyDetail.classList.remove("open");
        }
    }


    function openPhilosophyDetail(card) {
        if (!card || !philosophyDetail) {
            return;
        }

        const key = card.dataset.philosophy;

        if (!key || !philosophyData[key]) {
            return;
        }

        const information = philosophyData[key];

        philosophyCards.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-expanded", "false");
        });

        card.classList.add("active");
        card.setAttribute("aria-expanded", "true");

        if (philosophyDetailEyebrow) {
            philosophyDetailEyebrow.textContent = "QFRECORDS / PHILOSOPHY";
        }

        if (philosophyDetailTitle) {
            philosophyDetailTitle.textContent = information.title;
        }

        if (philosophyDetailText) {
            philosophyDetailText.textContent = information.text;
        }

        philosophyDetail.classList.add("open");

        setTimeout(() => {
            philosophyDetail.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 50);
    }


    philosophyCards.forEach((card) => {
        card.addEventListener("click", () => {
            const isActive = card.classList.contains("active");

            if (isActive) {
                closePhilosophyDetail();
                return;
            }

            openPhilosophyDetail(card);
        });

        card.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                const isActive =
                    card.classList.contains("active");

                if (isActive) {
                    closePhilosophyDetail();
                } else {
                    openPhilosophyDetail(card);
                }
            }

            if (event.key === "Escape") {
                closePhilosophyDetail();
            }
        });
    });


    if (philosophyClose) {
        philosophyClose.addEventListener(
            "click",
            closePhilosophyDetail
        );
    }


    /* ========================================================
       LATEST CONTENT
    ======================================================== */

    const latestCards =
        document.querySelectorAll(".qfr-latest-card");

    const latestImage =
        document.querySelector(".latest-display-image img");

    const latestCategory =
        document.querySelector(".latest-display-category");

    const latestTitle =
        document.querySelector(".latest-display-content h3");

    const latestDescription =
        document.querySelector(".latest-display-content p");

    const latestMeta =
        document.querySelector(".latest-display-meta");

    const latestLink =
        document.querySelector(".latest-display-link");


    /*
       These are intentionally placeholder values.

       Later, this section can be connected directly
       to JSON rather than editing this JavaScript.
    */

    const latestData = {
        signing: {
            category: "LATEST SIGNING",
            title: "Buckshot Bourbon",
            description:
                "A new voice joins the QFRecords roster, bringing a distinct perspective, energy and sound to the label's growing frequency.",
            meta: "NEW ARTIST",
            image: "assets/images/artists/buckshot-bourbon.jpg",
            link: "pages/artist.html?id=buckshot-bourbon"
        },

        album: {
            category: "LATEST ALBUM RELEASED",
            title: "New Frequency",
            description:
                "A placeholder album release ready to be replaced with the latest official album information from the label catalog.",
            meta: "LATEST RELEASE",
            image: "assets/images/placeholders/latest-album.jpg",
            link: "pages/music.html"
        },

        single: {
            category: "LATEST SINGLE RELEASED",
            title: "New Signal",
            description:
                "A placeholder single entry. Replace this information later with the latest song from the QFRecords catalog.",
            meta: "LATEST SINGLE",
            image: "assets/images/placeholders/latest-single.jpg",
            link: "pages/music.html"
        },

        news: {
            category: "LATEST NEWS",
            title: "Inside The Frequency",
            description:
                "The latest stories, announcements and developments from the artists and world surrounding QFRecords.",
            meta: "QFRECORDS NEWS",
            image: "assets/images/placeholders/latest-news.jpg",
            link: "pages/news.html"
        }
    };


    function updateLatestCard(card) {
        if (!card) {
            return;
        }

        const key = card.dataset.latest;

        if (!key || !latestData[key]) {
            return;
        }

        const data = latestData[key];

        latestCards.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-selected", "false");
        });

        card.classList.add("active");
        card.setAttribute("aria-selected", "true");


        if (latestImage) {
            latestImage.style.opacity = "0";

            setTimeout(() => {
                latestImage.src = data.image;
                latestImage.alt = data.title;
                latestImage.style.opacity = "";
            }, 160);
        }


        if (latestCategory) {
            latestCategory.textContent = data.category;
        }


        if (latestTitle) {
            latestTitle.textContent = data.title;
        }


        if (latestDescription) {
            latestDescription.textContent =
                data.description;
        }


        if (latestMeta) {
            latestMeta.innerHTML =
                `<span>${data.meta}</span>`;
        }


        if (latestLink) {
            latestLink.href = data.link;
        }
    }


    latestCards.forEach((card) => {
        card.addEventListener("click", () => {
            stopLatestRotation();
            updateLatestCard(card);
        });

        card.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                stopLatestRotation();
                updateLatestCard(card);
            }
        });
    });


    /* ========================================================
       AUTOMATIC LATEST ROTATION
    ======================================================== */

    let latestIndex = 0;
    let latestTimer = null;
    let latestUserInteraction = false;


    function rotateLatest() {
        if (
            latestUserInteraction ||
            latestCards.length === 0
        ) {
            return;
        }

        latestIndex++;

        if (latestIndex >= latestCards.length) {
            latestIndex = 0;
        }

        updateLatestCard(
            latestCards[latestIndex]
        );
    }


    function startLatestRotation() {
        if (
            latestCards.length <= 1 ||
            latestUserInteraction
        ) {
            return;
        }

        stopLatestRotation();

        latestTimer = setInterval(
            rotateLatest,
            5000
        );
    }


    function stopLatestRotation() {
        if (latestTimer) {
            clearInterval(latestTimer);
            latestTimer = null;
        }

        latestUserInteraction = true;
    }


    if (latestCards.length > 0) {
        updateLatestCard(latestCards[0]);

        latestIndex = 0;

        setTimeout(() => {
            latestUserInteraction = false;
            startLatestRotation();
        }, 5000);
    }


    /* ========================================================
       TRENDING
    ======================================================== */

    const trendingButtons =
        document.querySelectorAll(
            ".qfr-trending-filter button"
        );

    const trendingCards =
        document.querySelectorAll(
            ".qfr-trending-card"
        );


    const trendingData = {
        week: {
            artist: {
                title: "Buckshot Bourbon",
                by: "Country Rock",
                stat: "38,241 streams",
                timeframe: "This Week"
            },

            song: {
                title: "Placeholder Song",
                by: "Buckshot Bourbon",
                stat: "24,892 streams",
                timeframe: "This Week"
            },

            video: {
                title: "Placeholder Video",
                by: "Buckshot Bourbon",
                stat: "8,472 views",
                timeframe: "This Week"
            }
        },

        month: {
            artist: {
                title: "Buckshot Bourbon",
                by: "Country Rock",
                stat: "120,567 streams",
                timeframe: "This Month"
            },

            song: {
                title: "Placeholder Song",
                by: "Buckshot Bourbon",
                stat: "89,341 streams",
                timeframe: "This Month"
            },

            video: {
                title: "Placeholder Video",
                by: "Buckshot Bourbon",
                stat: "32,842 views",
                timeframe: "This Month"
            }
        },

        ytd: {
            artist: {
                title: "Buckshot Bourbon",
                by: "Country Rock",
                stat: "1,284,562 streams",
                timeframe: "YTD"
            },

            song: {
                title: "Placeholder Song",
                by: "Buckshot Bourbon",
                stat: "764,220 streams",
                timeframe: "YTD"
            },

            video: {
                title: "Placeholder Video",
                by: "Buckshot Bourbon",
                stat: "284,193 views",
                timeframe: "YTD"
            }
        }
    };


    function updateTrending(period) {
        const data =
            trendingData[period] ||
            trendingData.month;

        trendingCards.forEach((card) => {
            const type = card.dataset.trending;

            if (!type || !data[type]) {
                return;
            }

            const item = data[type];

            const title =
                card.querySelector(
                    ".trending-card-title"
                );

            const by =
                card.querySelector(
                    ".trending-card-by"
                );

            const stat =
                card.querySelector(
                    ".trending-stat"
                );

            const timeframe =
                card.querySelector(
                    ".trending-timeframe"
                );


            if (title) {
                title.textContent = item.title;
            }

            if (by) {
                by.textContent = `By: ${item.by}`;
            }

            if (stat) {
                stat.textContent = item.stat;
            }

            if (timeframe) {
                timeframe.textContent =
                    item.timeframe;
            }
        });
    }


    trendingButtons.forEach((button) => {
        button.addEventListener("click", () => {

            trendingButtons.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute(
                    "aria-selected",
                    "false"
                );
            });

            button.classList.add("active");
            button.setAttribute(
                "aria-selected",
                "true"
            );

            const period =
                button.dataset.period ||
                "month";

            updateTrending(period);
        });
    });


    /* ========================================================
       DEFAULT TRENDING FILTER
    ======================================================== */

    const defaultTrending =
        document.querySelector(
            '.qfr-trending-filter button[data-period="month"]'
        );

    if (defaultTrending) {
        defaultTrending.classList.add("active");
        defaultTrending.setAttribute(
            "aria-selected",
            "true"
        );
    }

    updateTrending("month");


    /* ========================================================
       NEWSLETTER
    ======================================================== */

    const newsletterForm =
        document.querySelector(
            ".qfr-newsletter-form"
        );

    const newsletterInput =
        document.querySelector(
            ".qfr-newsletter-input input"
        );

    const newsletterMessage =
        document.querySelector(
            ".qfr-newsletter-message"
        );


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const email =
                    newsletterInput
                        ? newsletterInput.value.trim()
                        : "";


                if (!email) {

                    if (newsletterMessage) {
                        newsletterMessage.textContent =
                            "Please enter your email address.";
                    }

                    return;
                }


                if (!email.includes("@")) {

                    if (newsletterMessage) {
                        newsletterMessage.textContent =
                            "Please enter a valid email address.";
                    }

                    return;
                }


                /*
                   This is intentionally a front-end
                   placeholder.

                   Later we can connect this to a
                   completely free newsletter service.
                */

                if (newsletterMessage) {
                    newsletterMessage.textContent =
                        "You're on the list. Welcome to the frequency.";
                }


                newsletterForm.reset();
            }
        );
    }


    /* ========================================================
       IMAGE FALLBACK
    ======================================================== */

    const homeImages =
        document.querySelectorAll(
            ".qfr-home-hero img, " +
            ".latest-display-image img, " +
            ".trending-card-image img"
        );


    homeImages.forEach((image) => {

        image.addEventListener(
            "error",
            () => {

                /*
                   Prevent broken-image icons from
                   ruining the visual layout while
                   placeholders are being replaced.
                */

                image.style.opacity = "0";

            },
            {
                once: true
            }
        );

    });


    /* ========================================================
       KEYBOARD ESCAPE
    ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            closePhilosophyDetail();

        }
    );


    /* ========================================================
       PAUSE LATEST ROTATION WHEN TAB IS HIDDEN
    ======================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                if (latestTimer) {
                    clearInterval(latestTimer);
                    latestTimer = null;
                }

            } else if (!latestUserInteraction) {

                startLatestRotation();

            }

        }
    );


    /* ========================================================
       HOME PAGE READY
    ======================================================== */

    document.documentElement.classList.add(
        "qfr-home-ready"
    );

});
