document.addEventListener("DOMContentLoaded", function () {

    loadAboutPage();


    async function loadAboutPage() {

        try {

            const response =
                await fetch(
                    "../data/about/index.json"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load About data."
                );

            }


            const data =
                await response.json();


            populateHero(data.hero);


            console.log(
                "QFR About page loaded."
            );

        }

        catch (error) {

            console.error(
                "About page error:",
                error
            );

        }

    }


    function populateHero(hero) {

        const eyebrow =
            document.getElementById(
                "aboutHeroEyebrow"
            );


        const title =
            document.getElementById(
                "aboutHeroTitle"
            );


        const highlight =
            document.getElementById(
                "aboutHeroHighlight"
            );


        const description =
            document.getElementById(
                "aboutHeroDescription"
            );


        if (eyebrow) {

            eyebrow.textContent =
                hero.eyebrow;

        }


        if (title) {

            title.textContent =
                hero.title;

        }


        if (highlight) {

            highlight.textContent =
                hero.highlight;

        }


        if (description) {

            description.textContent =
                hero.description;

        }

    }

});
