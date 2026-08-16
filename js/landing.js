/* ============================================================
   QUANTUM FREQUENCY RECORDS
   LANDING PAGE JAVASCRIPT
   ============================================================ */


/* ------------------------------------------------------------
   DOM ELEMENTS
------------------------------------------------------------ */

const landing = document.getElementById("landing");

const canvas = document.getElementById("particleCanvas");

const exploreButton =
    document.getElementById("exploreButton");

const backgroundImage =
    document.querySelector(".background-image");

const subtitleWords =
    document.querySelectorAll(".subtitle-word");


/* ------------------------------------------------------------
   OPTIONAL BACKGROUND IMAGE DETECTION
------------------------------------------------------------ */

if (backgroundImage) {

    const image =
        new Image();

    image.src =
        "assets/images/backgrounds/landing-background.jpg";

    image.onload = () => {

        document.body.classList.add(
            "background-loaded"
        );

    };

}


/* ------------------------------------------------------------
   SUBTITLE ANIMATION
------------------------------------------------------------ */

let currentWord = 0;

const WORD_DURATION = 2000;


function activateNextWord() {

    subtitleWords.forEach(
        word => word.classList.remove("active")
    );

    currentWord++;

    if (
        currentWord >= subtitleWords.length
    ) {
        currentWord = 0;
    }

    subtitleWords[currentWord]
        .classList.add("active");
}


setInterval(
    activateNextWord,
    WORD_DURATION
);


/* ------------------------------------------------------------
   PARTICLE SYSTEM
------------------------------------------------------------ */

const context =
    canvas.getContext("2d");

let particles = [];

let animationFrame;

let width = 0;

let height = 0;

let devicePixelRatioValue = 1;


/* ------------------------------------------------------------
   PARTICLE SETTINGS
------------------------------------------------------------ */

const particleSettings = {

    desktopCount: 115,

    mobileCount: 65,

    minSize: 0.4,

    maxSize: 1.7,

    minSpeed: 0.05,

    maxSpeed: 0.25,

    connectionDistance: 105

};


/* ------------------------------------------------------------
   RESIZE CANVAS
------------------------------------------------------------ */

function resizeCanvas() {

    devicePixelRatioValue =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    width =
        window.innerWidth;

    height =
        window.innerHeight;

    canvas.width =
        width * devicePixelRatioValue;

    canvas.height =
        height * devicePixelRatioValue;

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    context.setTransform(
        devicePixelRatioValue,
        0,
        0,
        devicePixelRatioValue,
        0,
        0
    );

    createParticles();
}


/* ------------------------------------------------------------
   CREATE PARTICLES
------------------------------------------------------------ */

function createParticles() {

    particles = [];

    const isMobile =
        width < 700;

    const particleCount =
        isMobile
            ? particleSettings.mobileCount
            : particleSettings.desktopCount;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        particles.push({

            x:
                Math.random() * width,

            y:
                Math.random() * height,

            radius:
                particleSettings.minSize +
                Math.random() *
                (
                    particleSettings.maxSize -
                    particleSettings.minSize
                ),

            speed:
                particleSettings.minSpeed +
                Math.random() *
                (
                    particleSettings.maxSpeed -
                    particleSettings.minSpeed
                ),

            angle:
                Math.random() *
                Math.PI *
                2,

            opacity:
                0.18 +
                Math.random() *
                0.55,

            drift:
                (
                    Math.random() -
                    0.5
                ) * 0.12

        });

    }

}


/* ------------------------------------------------------------
   UPDATE PARTICLES
------------------------------------------------------------ */

function updateParticles() {

    particles.forEach(
        particle => {

            particle.y -=
                particle.speed;

            particle.x +=
                Math.sin(
                    particle.angle
                ) *
                particle.drift;

            particle.angle +=
                0.003;


            /*
             * Wrap around the screen.
             */

            if (
                particle.y < -10
            ) {

                particle.y =
                    height + 10;

                particle.x =
                    Math.random() *
                    width;

            }


            if (
                particle.x < -10
            ) {

                particle.x =
                    width + 10;

            }


            if (
                particle.x > width + 10
            ) {

                particle.x =
                    -10;

            }

        }
    );

}


/* ------------------------------------------------------------
   DRAW PARTICLES
------------------------------------------------------------ */

function drawParticles() {

    context.clearRect(
        0,
        0,
        width,
        height
    );


    /*
     * Draw particles.
     */

    particles.forEach(
        particle => {

            context.beginPath();

            context.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            context.fillStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${particle.opacity}
                )`;

            context.fill();

        }
    );


    /*
     * Draw extremely subtle connections.
     */

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const particleA =
                particles[i];

            const particleB =
                particles[j];


            const dx =
                particleA.x -
                particleB.x;

            const dy =
                particleA.y -
                particleB.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                particleSettings.connectionDistance
            ) {

                const opacity =
                    (
                        1 -
                        distance /
                        particleSettings.connectionDistance
                    ) *
                    0.045;


                context.beginPath();

                context.moveTo(
                    particleA.x,
                    particleA.y
                );

                context.lineTo(
                    particleB.x,
                    particleB.y
                );

                context.strokeStyle =
                    `rgba(
                        255,
                        255,
                        255,
                        ${opacity}
                    )`;

                context.lineWidth =
                    0.5;

                context.stroke();

            }

        }

    }

}


/* ------------------------------------------------------------
   ANIMATION LOOP
------------------------------------------------------------ */

function animateParticles() {

    updateParticles();

    drawParticles();

    animationFrame =
        requestAnimationFrame(
            animateParticles
        );

}


/* ------------------------------------------------------------
   START PARTICLES
------------------------------------------------------------ */

resizeCanvas();

animateParticles();


/* ------------------------------------------------------------
   HANDLE RESIZE
------------------------------------------------------------ */

let resizeTimeout;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimeout
        );

        resizeTimeout =
            setTimeout(
                resizeCanvas,
                200
            );

    }
);


/* ------------------------------------------------------------
   EXPLORE BUTTON
------------------------------------------------------------ */

if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        () => {

            /*
             * Prepare the cinematic transition.
             */

            landing.classList.add(
                "is-exiting"
            );


            /*
             * Give the animation time to play.
             *
             * For Phase 2 this will become:
             *
             * home.html
             *
             */

            setTimeout(
                () => {

                    window.location.href =
                        "pages/home.html";

                },
                1100
            );

        }
    );

}


/* ------------------------------------------------------------
   CLEANUP
------------------------------------------------------------ */

window.addEventListener(
    "beforeunload",
    () => {

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

        }

    }
);