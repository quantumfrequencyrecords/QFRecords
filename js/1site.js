/* ============================================================
   QUANTUM FREQUENCY RECORDS
   UNIVERSAL SITE JAVASCRIPT
   ============================================================ */


/* ------------------------------------------------------------
   HEADER SCROLL EFFECT
------------------------------------------------------------ */

const header =
    document.querySelector(".qfr-header");


function updateHeader() {

    if (!header) {
        return;
    }


    if (window.scrollY > 30) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);


updateHeader();


/* ------------------------------------------------------------
   MOBILE MENU
------------------------------------------------------------ */

const menuButton =
    document.querySelector(".qfr-menu-button");

const mobileNavigation =
    document.querySelector(
        ".qfr-mobile-navigation"
    );


if (
    menuButton &&
    mobileNavigation
) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                menuButton.classList.contains(
                    "open"
                );


            if (isOpen) {

                menuButton.classList.remove(
                    "open"
                );

                mobileNavigation.classList.remove(
                    "open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            } else {

                menuButton.classList.add(
                    "open"
                );

                mobileNavigation.classList.add(
                    "open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );


    /*
     * Close the mobile menu after
     * selecting a navigation link.
     */

    mobileNavigation
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        menuButton.classList.remove(
                            "open"
                        );

                        mobileNavigation.classList.remove(
                            "open"
                        );

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* ------------------------------------------------------------
   ESCAPE KEY
------------------------------------------------------------ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        if (
            menuButton &&
            mobileNavigation
        ) {

            menuButton.classList.remove(
                "open"
            );

            mobileNavigation.classList.remove(
                "open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* ------------------------------------------------------------
   NEWSLETTER DEMO HANDLER
------------------------------------------------------------ */

const newsletterForms =
    document.querySelectorAll(
        ".qfr-newsletter-form"
    );


newsletterForms.forEach(
    form => {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const email =
                    form.querySelector(
                        "input"
                    );


                if (!email) {
                    return;
                }


                /*
                 * This is intentionally only
                 * a temporary front-end handler.
                 *
                 * We will connect this to a
                 * genuinely free newsletter
                 * service later.
                 */

                alert(
                    "Thank you for joining the Quantum Frequency Records universe."
                );


                email.value = "";

            }
        );

    }
);
