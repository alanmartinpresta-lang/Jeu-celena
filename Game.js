/* ============================================================
   MYSTERY LOVE ISLAND
   GAME.JS — moteur complet du jeu
   ============================================================ */

"use strict";

(() => {

    /* ========================================================
       SÉCURITÉ : ATTENDRE LE HTML
       ======================================================== */

    function ready(callback) {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                callback
            );

        } else {

            callback();

        }

    }


    ready(() => {

        /* ====================================================
           VÉRIFICATION DES DONNÉES
           ==================================================== */

        if (!window.GAME_DATA) {

            console.error(
                "GAME ERROR : data.js n'est pas chargé."
            );

            return;
        }


        const DATA = window.GAME_DATA;


        /* ====================================================
           ÉTAT DU JEU
           ==================================================== */

        const game = {

            started: false,

            paused: false,

            scene: 0,

            keys: 0,

            currentQuestion: null,

            bottleFound: false,

            mapFound: false,

            chestOpened: false,

            dialogueActive: false,

            questionActive: false,

            transition: false,

            cameraX: 0,

            cameraY: 0,

            lastTime: 0,

            animationTime: 0,

            facing: 1,

            moving: false,

            interactionDistance: 170,

            worldWidth: 5200,

            worldHeight: 1100

        };


        /* ====================================================
           PERSONNAGE
           ==================================================== */

        const player = {

            x: 380,

            y: 780,

            width: 52,

            height: 105,

            speed: 285,

            vx: 0,

            vy: 0,

            walkTime: 0,

            bob: 0

        };


        /* ====================================================
           INPUT CLAVIER
           ==================================================== */

        const keyboard = {

            left: false,

            right: false,

            up: false,

            down: false

        };


        /* ====================================================
           INPUT JOYSTICK
           ==================================================== */

        const joystick = {

            active: false,

            pointerId: null,

            x: 0,

            y: 0

        };


        /* ====================================================
           DOM
           ==================================================== */

        const $ = selector =>
            document.querySelector(selector);


        const canvas =
            $("#world") ||
            document.querySelector("canvas");


        if (!canvas) {

            console.error(
                "GAME ERROR : canvas #world introuvable."
            );

            return;
        }


        const ctx =
            canvas.getContext("2d");


        /* ====================================================
           DIMENSIONS
           ==================================================== */

        let width = window.innerWidth;

        let height = window.innerHeight;

        let dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        function resizeCanvas() {

            width =
                window.innerWidth;

            height =
                window.innerHeight;

            dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

            canvas.width =
                Math.floor(
                    width * dpr
                );

            canvas.height =
                Math.floor(
                    height * dpr
                );

            canvas.style.width =
                width + "px";

            canvas.style.height =
                height + "px";

        }


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        resizeCanvas();


        /* ====================================================
           OUTILS DOM
           ==================================================== */

        function find(...selectors) {

            for (const selector of selectors) {

                const element =
                    document.querySelector(selector);

                if (element) return element;

            }

            return null;

        }


        function show(element) {

            if (!element) return;

            element.classList.remove("hidden");

            element.style.display = "";

        }


        function hide(element) {

            if (!element) return;

            element.classList.add("hidden");

        }


        function text(element, value) {

            if (!element) return;

            element.textContent =
                value;

        }


        /* ====================================================
           ÉLÉMENTS INTERFACE
           ==================================================== */

        const titleScreen =
            find(
                "#titleScreen",
                "#startScreen",
                ".title-screen"
            );


        const introScreen =
            find(
                "#introScreen",
                ".intro-screen"
            );


        const startButton =
            find(
                "#startBtn",
                "#startButton",
                "[data-action='start']"
            );


        const continueButton =
            find(
                "#enterBtn",
                "#continueBtn",
                "#continueButton",
                "[data-action='continue']"
            );


        const interactionButton =
            find(
                "#interactBtn",
                "#interactButton",
                "[data-action='interact']"
            );


        const mapButton =
            find(
                "#mapBtn",
                "#mapButton",
                "[data-action='map']"
            );


        const mapScreen =
            find(
                "#mapScreen",
                ".map-screen"
            );


        const closeMapButton =
            find(
                "#closeMapBtn",
                "#closeMap",
                "[data-action='close-map']"
            );


        const dialogueBox =
            find(
                "#dialog",
                "#dialogue",
                ".dialogue"
            );


        const dialogueText =
            find(
                "#dialogText",
                "#dialogueText",
                ".dialogue-text"
            );


        const dialogueNext =
            find(
                "#dialogNext",
                "#dialogueNext",
                "#nextDialogue",
                "[data-action='dialogue-next']"
            );


        const questionScreen =
            find(
                "#questionScreen",
                ".question-screen"
            );


        const questionNumber =
            find(
                "#questionNumber",
                ".question-number"
            );


        const questionText =
            find(
                "#questionText",
                ".question-text"
            );


        const answerInput =
            find(
                "#answerInput",
                "#answer",
                "input[name='answer']"
            );


        const validateButton =
            find(
                "#validateBtn",
                "#validateButton",
                "[data-action='validate']"
            );


        const revealButton =
            find(
                "#revealBtn",
                "#revealButton",
                "[data-action='reveal']"
            );


        const answerFeedback =
            find(
                "#answerFeedback",
                ".answerFeedback",
                ".answer-feedback"
            );


        const keyCounter =
            find(
                "#keyCount",
                "#keys",
                ".key-count"
            );


        const sceneName =
            find(
                "#sceneName",
                "#environmentName",
                ".scene-name"
            );


        const objective =
            find(
                "#objective",
                ".objective"
            );


        const toast =
            find(
                "#toast",
                ".toast"
            );


        const fade =
            find(
                "#fade",
                ".fade"
            );


        const joystickElement =
            find(
                "#joystick",
                ".joystick"
            );


        const joystickKnob =
            find(
                "#joystickKnob",
                ".joystick-knob"
            );


        const chestScreen =
            find(
                "#chestScreen",
                ".chest-screen"
            );


        const openChestButton =
            find(
                "#openChestBtn",
                "#openChest",
                "[data-action='open-chest']"
            );


        const finalMessage =
            find(
                "#finalMessage",
                ".final-message"
            );


        const treasureButton =
            find(
                "#treasureBtn",
                "#treasureButton",
                "[data-action='treasure']"
            );


        /* ====================================================
           NORMALISATION DES RÉPONSES
           ==================================================== */

        function normalize(value) {

            return String(value || "")

                .toLowerCase()

                .normalize("NFD")

                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )

                .replace(
                    /[’']/g,
                    "'"
                )

                .replace(
                    /[^a-z0-9' -]/g,
                    ""
                )

                .replace(
                    /\s+/g,
                    " "
                )

                .trim();

        }


        function answerIsCorrect(
            value,
            question
        ) {

            const user =
                normalize(value);

            if (!user) return false;


            if (
                normalize(question.answer) ===
                user
            ) {

                return true;

            }


            const accepted =
                question.acceptedAnswers ||
                [];


            return accepted.some(
                answer =>
                    normalize(answer) ===
                    user
            );

        }


        /* ====================================================
           AUDIO
           ==================================================== */

        function audio(name, argument) {

            if (
                !window.AudioEngine ||
                typeof window.AudioEngine[name] !==
                "function"
            ) {

                return;

            }


            try {

                window.AudioEngine[name](
                    argument
                );

            } catch (error) {

                console.warn(
                    "Audio error:",
                    error
                );

            }

        }


        /* ====================================================
           HUD
           ==================================================== */

        function updateHUD() {

            text(
                keyCounter,
                `${game.keys} / ${DATA.totalKeys}`
            );


            const environment =
                DATA.environments[
                    game.scene
                ];


            if (environment) {

                text(
                    sceneName,
                    environment.name
                );

                text(
                    objective,
                    game.scene === 19
                        ? "Approche-toi du coffre."
                        : "Explore les lieux et cherche l'élément lumineux."
                );

            }

        }


        /* ====================================================
           TOAST
           ==================================================== */

        let toastTimeout = null;


        function showToast(message) {

            if (!toast) {

                return;

            }


            text(
                toast,
                message
            );


            toast.classList.add(
                "visible"
            );


            clearTimeout(
                toastTimeout
            );


            toastTimeout =
                setTimeout(() => {

                    toast.classList.remove(
                        "visible"
                    );

                }, 2400);

        }


        /* ====================================================
           TRANSITION
           ==================================================== */

        function transition(callback) {

            if (game.transition) return;

            game.transition = true;


            if (fade) {

                fade.classList.add(
                    "active"
                );

            }


            audio("transition");


            setTimeout(() => {

                callback();

            }, 500);


            setTimeout(() => {

                if (fade) {

                    fade.classList.remove(
                        "active"
                    );

                }

                game.transition = false;

            }, 1050);

        }


        /* ====================================================
           DIALOGUE
           ==================================================== */

        let dialogueLines = [];

        let dialogueIndex = 0;

        let dialogueCallback = null;


        function startDialogue(
            lines,
            callback = null
        ) {

            if (!Array.isArray(lines)) {

                lines = [lines];

            }


            dialogueLines =
                lines.slice();

            dialogueIndex = 0;

            dialogueCallback =
                callback;


            game.dialogueActive = true;


            if (dialogueBox) {

                show(dialogueBox);

            }


            updateDialogue();

        }


        function updateDialogue() {

            if (!dialogueText) return;

            text(
                dialogueText,
                dialogueLines[
                    dialogueIndex
                ]
            );

        }


        function nextDialogue() {

            if (!game.dialogueActive) {

                return;

            }


            audio("button");


            dialogueIndex++;


            if (
                dialogueIndex >=
                dialogueLines.length
            ) {

                game.dialogueActive =
                    false;


                if (dialogueBox) {

                    hide(dialogueBox);

                }


                const callback =
                    dialogueCallback;

                dialogueCallback =
                    null;


                if (callback) {

                    callback();

                }


                return;

            }


            updateDialogue();

        }


        /* ====================================================
           INTRODUCTION
           ==================================================== */

        function startAdventure() {

            if (game.started) return;


            game.started = true;

            game.scene = 0;

            game.keys = 0;

            game.bottleFound = false;

            game.mapFound = false;

            game.chestOpened = false;


            player.x = 380;

            player.y = 780;


            if (titleScreen) {

                hide(titleScreen);

            }


            if (introScreen) {

                hide(introScreen);

            }


            canvas.classList.add(
                "game-active"
            );


            updateHUD();


            audio("resume");

            audio(
                "setEnvironment",
                "beach"
            );


            startDialogue(

                [

                    "La jeune femme ouvre lentement les yeux.",

                    "Le bruit des vagues l'entoure. Du sable est encore accroché à ses mains.",

                    "Elle regarde autour d'elle, complètement perdue.",

                    "« Mais qu'est-ce que je fais ici ? »",

                    "Elle se relève et aperçoit quelque chose au loin sur le sable."

                ],

                () => {

                    showToast(
                        "Approche-toi de la bouteille."
                    );

                }

            );

        }


        /* ====================================================
           POSITION DES OBJETS
           ==================================================== */

        function getObjectPosition() {

            switch (game.scene) {

                case 0:
                    return {
                        x: 1150,
                        y: 780
                    };

                case 1:
                    return {
                        x: 1250,
                        y: 760
                    };

                case 2:
                    return {
                        x: 1300,
                        y: 740
                    };

                case 3:
                    return {
                        x: 1450,
                        y: 760
                    };

                case 4:
                    return {
                        x: 1600,
                        y: 750
                    };

                case 5:
                    return {
                        x: 1450,
                        y: 760
                    };

                case 6:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 7:
                    return {
                        x: 1350,
                        y: 760
                    };

                case 8:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 9:
                    return {
                        x: 1600,
                        y: 760
                    };

                case 10:
                    return {
                        x: 1400,
                        y: 760
                    };

                case 11:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 12:
                    return {
                        x: 1550,
                        y: 760
                    };

                case 13:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 14:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 15:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 16:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 17:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 18:
                    return {
                        x: 1500,
                        y: 760
                    };

                case 19:
                    return {
                        x: 1700,
                        y: 760
                    };

                default:
                    return {
                        x: 1200,
                        y: 760
                    };

            }

        }


        /* ====================================================
           DISTANCE
           ==================================================== */

        function distanceToObject() {

            const object =
                getObjectPosition();


            return Math.hypot(

                player.x - object.x,

                player.y - object.y

            );

        }


        function nearObject() {

            return (
                distanceToObject() <=
                game.interactionDistance
            );

        }


        /* ====================================================
           INTERACTION
           ==================================================== */

        function interact() {

            if (!game.started) {

                return;

            }


            if (
                game.dialogueActive ||
                game.questionActive ||
                game.transition
            ) {

                return;

            }


            if (!nearObject()) {

                showToast(
                    "Approche-toi davantage."
                );

                return;

            }


            audio("button");


            /* ------------------------------------------------
               PREMIÈRE BOUTEILLE
               ------------------------------------------------ */

            if (
                game.scene === 0 &&
                !game.bottleFound
            ) {

                findBottle();

                return;

            }


            /* ------------------------------------------------
               COFFRE
               ------------------------------------------------ */

            if (game.scene === 19) {

                if (
                    game.keys >=
                    DATA.totalKeys
                ) {

                    openChest();

                } else {

                    showToast(
                        `Il te manque encore ${
                            DATA.totalKeys -
                            game.keys
                        } clé(s).`
                    );

                }

                return;

            }


            /* ------------------------------------------------
               ÉNIGME
               ------------------------------------------------ */

            openQuestion();

        }


        /* ====================================================
           BOUTEILLE
           ==================================================== */

        function findBottle() {

            game.bottleFound =
                true;

            audio("bottleFound");


            startDialogue(

                [

                    "Tu t'approches de la bouteille échouée sur le sable.",

                    "Elle contient quelque chose.",

                    "Une carte au trésor.",

                    "Tu la déroules doucement.",

                    "Une phrase apparaît :",

                    "« Trouve les 20 clés pour découvrir le trésor le plus inestimable. »"

                ],

                () => {

                    game.mapFound =
                        true;

                    openMap();

                }

            );

        }


        /* ====================================================
           CARTE
           ==================================================== */

        function openMap() {

            if (!mapScreen) {

                showToast(
                    "La carte est prête."
                );

                return;

            }


            show(mapScreen);

            audio("mapOpen");

            drawMap();

        }


        function closeMap() {

            if (mapScreen) {

                hide(mapScreen);

            }


            if (
                game.scene === 0 &&
                game.bottleFound
            ) {

                showToast(
                    "La première clé t'attend sur la plage."
                );

            }

        }


        /* ====================================================
           CARTE VISUELLE
           ==================================================== */

        function drawMap() {

            const map =
                document.querySelector(
                    "#mapCanvas"
                );


            if (!map) return;


            const mapContext =
                map.getContext("2d");


            const rect =
                map.getBoundingClientRect();


            const mapWidth =
                Math.max(
                    320,
                    rect.width || 320
                );


            const mapHeight =
                Math.max(
                    400,
                    rect.height || 400
                );


            map.width =
                mapWidth * dpr;

            map.height =
                mapHeight * dpr;


            mapContext.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            mapContext.clearRect(
                0,
                0,
                mapWidth,
                mapHeight
            );


            /* papier */

            const paper =
                mapContext.createLinearGradient(
                    0,
                    0,
                    0,
                    mapHeight
                );


            paper.addColorStop(
                0,
                "#f4e2ad"
            );


            paper.addColorStop(
                1,
                "#cba96b"
            );


            mapContext.fillStyle =
                paper;


            mapContext.fillRect(
                0,
                0,
                mapWidth,
                mapHeight
            );


            /* mer */

            mapContext.fillStyle =
                "rgba(70,145,166,.35)";


            mapContext.beginPath();

            mapContext.moveTo(
                0,
                mapHeight * .15
            );

            mapContext.bezierCurveTo(
                mapWidth * .25,
                mapHeight * .02,
                mapWidth * .55,
                mapHeight * .20,
                mapWidth,
                mapHeight * .08
            );

            mapContext.lineTo(
                mapWidth,
                0
            );

            mapContext.lineTo(
                0,
                0
            );

            mapContext.closePath();

            mapContext.fill();


            /* île */

            mapContext.fillStyle =
                "#a8a76f";


            mapContext.beginPath();

            mapContext.moveTo(
                mapWidth * .16,
                mapHeight * .27
            );

            mapContext.bezierCurveTo(
                mapWidth * .31,
                mapHeight * .12,
                mapWidth * .62,
                mapHeight * .17,
                mapWidth * .78,
                mapHeight * .29
            );

            mapContext.bezierCurveTo(
                mapWidth * .91,
                mapHeight * .43,
                mapWidth * .79,
                mapHeight * .68,
                mapWidth * .64,
                mapHeight * .79
            );

            mapContext.bezierCurveTo(
                mapWidth * .46,
                mapHeight * .91,
                mapWidth * .23,
                mapHeight * .82,
                mapWidth * .13,
                mapHeight * .62
            );

            mapContext.bezierCurveTo(
                mapWidth * .06,
                mapHeight * .49,
                mapWidth * .07,
                mapHeight * .35,
                mapWidth * .16,
                mapHeight * .27
            );

            mapContext.closePath();

            mapContext.fill();


            /* chemin */

            const points = [];


            for (
                let i = 0;
                i < DATA.environments.length;
                i++
            ) {

                const x =
                    mapWidth *
                    (
                        .16 +
                        .68 *
                        (
                            i /
                            (
                                DATA.environments.length -
                                1
                            )
                        )
                    );


                const y =
                    mapHeight *
                    (
                        .67 -
                        Math.sin(
                            i * .72
                        ) * .25
                    );


                points.push({
                    x,
                    y
                });

            }


            mapContext.strokeStyle =
                "#704b32";

            mapContext.lineWidth =
                5;

            mapContext.setLineDash([
                10,
                8
            ]);


            mapContext.beginPath();


            points.forEach(
                (point, index) => {

                    if (index === 0) {

                        mapContext.moveTo(
                            point.x,
                            point.y
                        );

                    } else {

                        mapContext.lineTo(
                            point.x,
                            point.y
                        );

                    }

                }
            );


            mapContext.stroke();

            mapContext.setLineDash([]);


            /* clés */

            points.forEach(
                (point, index) => {

                    mapContext.beginPath();

                    mapContext.arc(
                        point.x,
                        point.y,
                        13,
                        0,
                        Math.PI * 2
                    );


                    if (
                        index <
                        game.keys
                    ) {

                        mapContext.fillStyle =
                            "#74a65e";

                    } else if (
                        index ===
                        game.scene
                    ) {

                        mapContext.fillStyle =
                            "#e6bb4f";

                    } else {

                        mapContext.fillStyle =
                            "#655447";

                    }


                    mapContext.fill();


                    mapContext.strokeStyle =
                        "#4b3526";

                    mapContext.lineWidth =
                        2;

                    mapContext.stroke();


                    mapContext.fillStyle =
                        "#fff";

                    mapContext.font =
                        "bold 10px system-ui";

                    mapContext.textAlign =
                        "center";

                    mapContext.textBaseline =
                        "middle";


                    mapContext.fillText(
                        index + 1,
                        point.x,
                        point.y
                    );

                }
            );


            /* coffre */

            mapContext.font =
                "42px serif";


            mapContext.fillText(
                "🧰",
                mapWidth * .83,
                mapHeight * .87
            );


            /* titre */

            mapContext.fillStyle =
                "#493726";

            mapContext.font =
                "bold 22px Georgia";

            mapContext.textAlign =
                "center";

            mapContext.fillText(
                "LA CARTE DES 20 CLÉS",
                mapWidth / 2,
                38
            );

        }


        /* ====================================================
           QUESTION
           ==================================================== */

        function openQuestion() {

            if (
                game.questionActive ||
                game.dialogueActive
            ) {

                return;

            }


            const question =
                DATA.questions[
                    game.scene
                ];


            if (!question) {

                return;

            }


            game.questionActive =
                true;

            game.currentQuestion =
                question;


            if (questionNumber) {

                text(
                    questionNumber,
                    `ÉNIGME ${question.id} / ${DATA.totalKeys}`
                );

            }


            if (questionText) {

                text(
                    questionText,
                    question.question
                );

            }


            if (answerInput) {

                answerInput.value = "";

                setTimeout(
                    () => {

                        answerInput.focus();

                    },
                    150
                );

            }


            if (answerFeedback) {

                text(
                    answerFeedback,
                    ""
                );

                answerFeedback.className =
                    "answerFeedback";

            }


            if (questionScreen) {

                show(questionScreen);

            }


            audio("button");

        }


        /* ====================================================
           FERMER QUESTION
           ==================================================== */

        function closeQuestion() {

            if (questionScreen) {

                hide(questionScreen);

            }


            game.questionActive =
                false;

            game.currentQuestion =
                null;

        }


        /* ====================================================
           VALIDATION
           ==================================================== */

        function validateAnswer() {

            if (
                !game.questionActive ||
                !game.currentQuestion
            ) {

                return;

            }


            const value =
                answerInput
                    ? answerInput.value
                    : "";


            const correct =
                answerIsCorrect(
                    value,
                    game.currentQuestion
                );


            if (correct) {

                if (answerFeedback) {

                    text(
                        answerFeedback,
                        "✓ Bonne réponse ! La clé est à toi."
                    );

                    answerFeedback.classList.add(
                        "correct"
                    );

                }


                audio("correctAnswer");


                setTimeout(
                    () => {

                        collectKey();

                    },
                    750
                );

            } else {

                if (answerFeedback) {

                    text(
                        answerFeedback,
                        "Ce n'est pas la bonne réponse. Réessaie."
                    );

                    answerFeedback.classList.remove(
                        "correct"
                    );

                    answerFeedback.classList.add(
                        "wrong"
                    );

                }


                audio("wrongAnswer");

            }

        }


        /* ====================================================
           INDICE / RÉPONSE
           ==================================================== */

        function revealAnswer() {

            if (
                !game.currentQuestion
            ) {

                return;

            }


            if (answerFeedback) {

                text(
                    answerFeedback,
                    `Réponse : ${game.currentQuestion.answer}`
                );

            }


            audio("button");

        }


        /* ====================================================
           RÉCUPÉRATION CLÉ
           ==================================================== */

        function collectKey() {

            closeQuestion();


            game.keys++;


            audio("keyFound");


            updateHUD();


            if (
                game.keys >=
                DATA.totalKeys
            ) {

                transition(
                    () => {

                        game.scene = 19;

                        player.x =
                            520;

                        player.y =
                            780;


                        audio(
                            "setEnvironment",
                            "treasure"
                        );


                        updateHUD();


                        startDialogue(

                            [

                                "Les vingt clés sont maintenant réunies.",

                                "La carte t'a conduite jusqu'au dernier endroit.",

                                "Devant toi se trouve un coffre ancien.",

                                "Il semble attendre depuis toujours.",

                                "Approche-toi."

                            ]

                        );

                    }
                );


                return;

            }


            transition(
                () => {

                    game.scene =
                        Math.min(
                            game.scene + 1,
                            19
                        );


                    player.x =
                        400;

                    player.y =
                        780;


                    const environment =
                        DATA.environments[
                            game.scene
                        ];


                    audio(
                        "setEnvironment",
                        environment
                            ? environment.atmosphere
                            : "beach"
                    );


                    updateHUD();


                    startDialogue(

                        [

                            `Clé ${game.keys} / ${DATA.totalKeys} récupérée.`,

                            `La carte révèle maintenant un nouveau chemin.`,

                            environment
                                ? environment.name
                                : "Un nouveau lieu",

                            environment
                                ? environment.description
                                : ""

                        ],

                        () => {

                            showToast(
                                "Continue ton exploration."
                            );

                        }

                    );

                }
            );

        }


        /* ====================================================
           COFFRE
           ==================================================== */

        function openChest() {

            if (
                game.keys <
                DATA.totalKeys
            ) {

                showToast(
                    "Le coffre est encore verrouillé."
                );

                return;

            }


            if (game.chestOpened) {

                return;

            }


            game.chestOpened =
                true;


            audio("chestOpen");


            if (chestScreen) {

                show(chestScreen);

            }


            startDialogue(

                [

                    "Les vingt clés s'emboîtent dans le coffre.",

                    "Une dernière rotation…",

                    "Le mécanisme se déverrouille.",

                    "Le coffre s'ouvre."

                ],

                () => {

                    showFinalTreasure();

                }

            );

        }


        /* ====================================================
           TRÉSOR FINAL
           ==================================================== */

        function showFinalTreasure() {

            audio("treasure");


            if (finalMessage) {

                show(finalMessage);

            }


            if (treasureButton) {

                treasureButton.style.display =
                    "";

            }

        }


        function openTreasureLink() {

            const link =
                DATA.treasureLink;


            if (
                !link ||
                !/^https?:\/\//i.test(link)
            ) {

                showToast(
                    "Le lien vers « 100 raisons de t'aimer » n'a pas encore été ajouté."
                );

                return;

            }


            window.location.href =
                link;

        }


        /* ====================================================
           DÉPLACEMENT
           ==================================================== */

        function updateMovement(delta) {

            if (
                !game.started ||
                game.paused ||
                game.dialogueActive ||
                game.questionActive ||
                game.transition
            ) {

                player.vx = 0;

                player.vy = 0;

                game.moving =
                    false;

                return;

            }


            let x = 0;

            let y = 0;


            if (keyboard.left) {

                x -= 1;

            }


            if (keyboard.right) {

                x += 1;

            }


            if (keyboard.up) {

                y -= 1;

            }


            if (keyboard.down) {

                y += 1;

            }


            if (joystick.active) {

                x = joystick.x;

                y = joystick.y;

            }


            const length =
                Math.hypot(
                    x,
                    y
                );


            if (length > 1) {

                x /= length;

                y /= length;

            }


            player.vx =
                x *
                player.speed;

            player.vy =
                y *
                player.speed;


            game.moving =
                length > .05;


            if (Math.abs(x) > .05) {

                game.facing =
                    x > 0
                        ? 1
                        : -1;

            }


            player.x +=
                player.vx *
                delta;


            player.y +=
                player.vy *
                delta;


            /* limites */

            player.x =
                Math.max(
                    100,
                    Math.min(
                        game.worldWidth - 100,
                        player.x
                    )
                );


            player.y =
                Math.max(
                    570,
                    Math.min(
                        900,
                        player.y
                    )
                );


            if (game.moving) {

                player.walkTime +=
                    delta * 10;

            }

        }


        /* ====================================================
           CAMÉRA
           ==================================================== */

        function updateCamera() {

            const zoom =
                Math.max(
                    .72,
                    Math.min(
                        1.05,
                        width / 1050
                    )
                );


            const visibleWidth =
                width / zoom;


            const visibleHeight =
                height / zoom;


            const targetX =
                player.x -
                visibleWidth *
                .40;


            const targetY =
                player.y -
                visibleHeight *
                .52;


            game.cameraX +=
                (
                    targetX -
                    game.cameraX
                ) * .09;


            game.cameraY +=
                (
                    targetY -
                    game.cameraY
                ) * .09;


            game.cameraX =
                Math.max(
                    0,
                    Math.min(
                        game.worldWidth -
                        visibleWidth,
                        game.cameraX
                    )
                );


            game.cameraY =
                Math.max(
                    0,
                    Math.min(
                        game.worldHeight -
                        visibleHeight,
                        game.cameraY
                    )
                );

        }


        /* ====================================================
           DESSIN
           ==================================================== */

        function clearCanvas() {

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            ctx.clearRect(
                0,
                0,
                width,
                height
            );

        }


        function drawWorld() {

            clearCanvas();


            if (!game.started) {

                return;

            }


            const zoom =
                Math.max(
                    .72,
                    Math.min(
                        1.05,
                        width / 1050
                    )
                );


            ctx.save();


            ctx.translate(
                -game.cameraX * zoom,
                -game.cameraY * zoom
            );


            ctx.scale(
                zoom,
                zoom
            );


            drawBackground();


            drawEnvironment();


            drawInteractiveObject();


            drawPlayer();


            ctx.restore();


            drawInteractionHint();

        }


        /* ====================================================
           FOND
           ==================================================== */

        function drawBackground() {

            const environment =
                DATA.environments[
                    game.scene
                ];


            const type =
                environment
                    ? environment.type
                    : "beach";


            let skyTop =
                "#69b8d6";


            let skyBottom =
                "#d9d49d";


            if (
                type === "snow" ||
                type === "christmas"
            ) {

                skyTop =
                    "#9cc9e0";

                skyBottom =
                    "#edf3f4";

            }


            if (
                type === "stars" ||
                type === "treasure" ||
                type === "iris" ||
                type === "ellie"
            ) {

                skyTop =
                    "#263e67";

                skyBottom =
                    "#0e1728";

            }


            if (
                type === "city" ||
                type === "cinema"
            ) {

                skyTop =
                    "#526b88";

                skyBottom =
                    "#172331";

            }


            const gradient =
                ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    game.worldHeight
                );


            gradient.addColorStop(
                0,
                skyTop
            );


            gradient.addColorStop(
                1,
                skyBottom
            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                0,
                0,
                game.worldWidth,
                game.worldHeight
            );

        }


        /* ====================================================
           SOL / TERRAIN
           ==================================================== */

        function drawEnvironment() {

            const environment =
                DATA.environments[
                    game.scene
                ];


            if (!environment) return;


            const type =
                environment.type;


            /* plage */

            if (
                type === "beach" ||
                type === "cove" ||
                type === "cannes"
            ) {

                drawBeach();

            }


            else if (
                type === "forest"
            ) {

                drawForest();

            }


            else if (
                type === "mountain"
            ) {

                drawMountain();

            }


            else if (
                type === "lake"
            ) {

                drawLake();

            }


            else if (
                type === "garden" ||
                type === "park"
            ) {

                drawGarden();

            }


            else if (
                type === "city" ||
                type === "cinema"
            ) {

                drawCity();

            }


            else if (
                type === "village"
            ) {

                drawVillage();

            }


            else if (
                type === "waterfall"
            ) {

                drawWaterfall();

            }


            else if (
                type === "snow" ||
                type === "christmas"
            ) {

                drawSnow();

            }


            else if (
                type === "memory" ||
                type === "iris" ||
                type === "ellie"
            ) {

                drawMemory();

            }


            else if (
                type === "stadium"
            ) {

                drawStadium();

            }


            else if (
                type === "stars"
            ) {

                drawStars();

            }


            else if (
                type === "treasure"
            ) {

                drawTreasureEnvironment();

            }


            else {

                drawBeach();

            }

        }


        /* ====================================================
           PLAGE
           ==================================================== */

        function drawBeach() {

            ctx.fillStyle =
                "#e8cb78";


            ctx.fillRect(
                0,
                690,
                game.worldWidth,
                410
            );


            ctx.fillStyle =
                "#309fc0";


            ctx.fillRect(
                0,
                500,
                game.worldWidth,
                190
            );


            /* vagues */

            for (
                let y = 535;
                y < 690;
                y += 34
            ) {

                ctx.strokeStyle =
                    "rgba(255,255,255,.24)";

                ctx.lineWidth =
                    6;


                ctx.beginPath();


                for (
                    let x = 0;
                    x < game.worldWidth;
                    x += 90
                ) {

                    const yy =
                        y +
                        Math.sin(
                            x / 70 +
                            game.animationTime
                        ) *
                        5;


                    if (x === 0) {

                        ctx.moveTo(
                            x,
                            yy
                        );

                    } else {

                        ctx.lineTo(
                            x,
                            yy
                        );

                    }

                }


                ctx.stroke();

            }


            /* palmiers */

            drawPalm(
                250,
                700,
                1.1
            );


            drawPalm(
                1050,
                700,
                .8
            );


            drawPalm(
                2250,
                700,
                1
            );


            drawPalm(
                3500,
                700,
                .75
            );


            drawPalm(
                4550,
                700,
                1.1
            );

        }


        /* ====================================================
           FORÊT
           ==================================================== */

        function drawForest() {

            ctx.fillStyle =
                "#496f4e";


            ctx.fillRect(
                0,
                600,
                game.worldWidth,
                500
            );


            for (
                let x = 120;
                x < game.worldWidth;
                x += 230
            ) {

                drawPine(
                    x,
                    720,
                    .9
                );

            }


            ctx.strokeStyle =
                "#a68152";

            ctx.lineWidth =
                38;

            ctx.beginPath();

            ctx.moveTo(
                0,
                880
            );

            ctx.quadraticCurveTo(
                1800,
                710,
                5200,
                850
            );

            ctx.stroke();

        }


        /* ====================================================
           MONTAGNE
           ==================================================== */

        function drawMountain() {

            ctx.fillStyle =
                "#587183";


            ctx.beginPath();

            ctx.moveTo(
                0,
                700
            );

            ctx.lineTo(
                650,
                210
            );

            ctx.lineTo(
                1250,
                700
            );

            ctx.lineTo(
                1950,
                170
            );

            ctx.lineTo(
                2650,
                700
            );

            ctx.lineTo(
                3450,
                220
            );

            ctx.lineTo(
                4250,
                700
            );

            ctx.lineTo(
                5000,
                170
            );

            ctx.lineTo(
                5200,
                700
            );

            ctx.closePath();

            ctx.fill();


            ctx.fillStyle =
                "#eee9d6";


            ctx.beginPath();

            ctx.moveTo(
                1950,
                170
            );

            ctx.lineTo(
                1800,
                300
            );

            ctx.lineTo(
                1950,
                245
            );

            ctx.lineTo(
                2100,
                300
            );

            ctx.closePath();

            ctx.fill();


            ctx.fillStyle =
                "#71885d";


            ctx.fillRect(
                0,
                700,
                game.worldWidth,
                400
            );

        }


        /* ====================================================
           LAC
           ==================================================== */

        function drawLake() {

            ctx.fillStyle =
                "#76c4d9";


            ctx.fillRect(
                0,
                480,
                game.worldWidth,
                320
            );


            ctx.fillStyle =
                "#829f67";


            ctx.fillRect(
                0,
                800,
                game.worldWidth,
                300
            );


            for (
                let i = 0;
                i < 30;
                i++
            ) {

                const x =
                    (i * 240) %
                    game.worldWidth;


                ctx.strokeStyle =
                    "rgba(255,255,255,.18)";

                ctx.lineWidth =
                    5;


                ctx.beginPath();

                ctx.ellipse(
                    x,
                    580 + (i % 5) * 40,
                    80,
                    10,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();

            }

        }


        /* ====================================================
           JARDIN
           ==================================================== */

        function drawGarden() {

            ctx.fillStyle =
                "#75a56e";


            ctx.fillRect(
                0,
                590,
                game.worldWidth,
                510
            );


            for (
                let x = 80;
                x < game.worldWidth;
                x += 130
            ) {

                drawFlower(
                    x,
                    790,
                    [
                        "#e9788b",
                        "#f0c75e",
                        "#a786d5",
                        "#fff"
                    ][
                        Math.floor(
                            x / 130
                        ) % 4
                    ]
                );

            }

        }


        /* ====================================================
           VILLE
           ==================================================== */

        function drawCity() {

            ctx.fillStyle =
                "#26394a";


            ctx.fillRect(
                0,
                500,
                game.worldWidth,
                600
            );


            for (
                let i = 0;
                i < 14;
                i++
            ) {

                const x =
                    i * 400;

                const buildingHeight =
                    150 +
                    (i % 5) * 90;


                ctx.fillStyle =
                    [
                        "#314b61",
                        "#253a4c",
                        "#3d5365"
                    ][
                        i % 3
                    ];


                ctx.fillRect(
                    x,
                    700 -
                    buildingHeight,
                    300,
                    buildingHeight
                );


                for (
                    let row = 0;
                    row < 4;
                    row++
                ) {

                    for (
                        let column = 0;
                        column < 3;
                        column++
                    ) {

                        ctx.fillStyle =
                            "#e6c86e";


                        ctx.fillRect(
                            x +
                            45 +
                            column *
                            75,

                            735 -
                            buildingHeight +
                            row *
                            60,

                            30,
                            36
                        );

                    }

                }

            }

        }


        /* ====================================================
           VILLAGE
           ==================================================== */

        function drawVillage() {

            ctx.fillStyle =
                "#86a871";


            ctx.fillRect(
                0,
                650,
                game.worldWidth,
                450
            );


            drawHouse(
                650,
                700,
                1
            );


            drawHouse(
                1500,
                720,
                .8
            );


            drawHouse(
                2600,
                690,
                1.15
            );


            drawHouse(
                3900,
                710,
                .9
            );

        }


        /* ====================================================
           CASCADE
           ==================================================== */

        function drawWaterfall() {

            ctx.fillStyle =
                "#466d79";


            ctx.fillRect(
                0,
                0,
                game.worldWidth,
                1100
            );


            ctx.fillStyle =
                "#86d2e7";


            ctx.fillRect(
                2100,
                230,
                230,
                620
            );


            ctx.fillStyle =
                "rgba(255,255,255,.5)";


            for (
                let i = 0;
                i < 35;
                i++
            ) {

                ctx.beginPath();

                ctx.arc(
                    2050 +
                    Math.random() *
                    500,

                    650 +
                    Math.random() *
                    220,

                    3 +
                    Math.random() *
                    6,

                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            ctx.fillStyle =
                "#55805b";


            ctx.fillRect(
                0,
                850,
                game.worldWidth,
                250
            );

        }


        /* ====================================================
           NEIGE
           ==================================================== */

        function drawSnow() {

            ctx.fillStyle =
                "#edf3f5";


            ctx.fillRect(
                0,
                650,
                game.worldWidth,
                450
            );


            for (
                let x = 150;
                x < game.worldWidth;
                x += 280
            ) {

                drawPine(
                    x,
                    700,
                    .85
                );

            }


            for (
                let i = 0;
                i < 160;
                i++
            ) {

                const x =
                    (
                        i * 173
                    ) %
                    game.worldWidth;


                const y =
                    (
                        i * 71 +
                        game.animationTime *
                        80
                    ) %
                    700;


                ctx.fillStyle =
                    "rgba(255,255,255,.9)";


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    2 +
                    (i % 4),
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }


        /* ====================================================
           SOUVENIRS
           ==================================================== */

        function drawMemory() {

            ctx.fillStyle =
                "#3f4b68";


            ctx.fillRect(
                0,
                0,
                game.worldWidth,
                game.worldHeight
            );


            const colors = [
                "rgba(255,150,180,.18)",
                "rgba(170,130,255,.16)",
                "rgba(255,220,130,.15)"
            ];


            for (
                let i = 0;
                i < 25;
                i++
            ) {

                const x =
                    (
                        i * 317
                    ) %
                    game.worldWidth;


                const y =
                    (
                        i * 97
                    ) %
                    700;


                ctx.fillStyle =
                    colors[
                        i % 3
                    ];


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    20 +
                    (i % 5) * 10,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            ctx.fillStyle =
                "#657e70";


            ctx.fillRect(
                0,
                760,
                game.worldWidth,
                340
            );

        }


        /* ====================================================
           STADE
           ==================================================== */

        function drawStadium() {

            ctx.fillStyle =
                "#293c52";


            ctx.fillRect(
                0,
                400,
                game.worldWidth,
                700
            );


            ctx.fillStyle =
                "#4c8b52";


            ctx.fillRect(
                800,
                620,
                3600,
                300
            );


            ctx.strokeStyle =
                "#fff";

            ctx.lineWidth =
                7;

            ctx.strokeRect(
                1000,
                650,
                3200,
                240
            );


            for (
                let x = 0;
                x < game.worldWidth;
                x += 160
            ) {

                ctx.fillStyle =
                    [
                        "#d06c72",
                        "#6e87b0",
                        "#d8bd69"
                    ][
                        Math.floor(x / 160) % 3
                    ];


                ctx.fillRect(
                    x,
                    460,
                    110,
                    90
                );

            }

        }


        /* ====================================================
           ÉTOILES
           ==================================================== */

        function drawStars() {

            ctx.fillStyle =
                "#0b1628";


            ctx.fillRect(
                0,
                0,
                game.worldWidth,
                game.worldHeight
            );


            for (
                let i = 0;
                i < 180;
                i++
            ) {

                const x =
                    (
                        i * 313
                    ) %
                    game.worldWidth;


                const y =
                    (
                        i * 97
                    ) %
                    650;


                const pulse =
                    1 +
                    Math.sin(
                        game.animationTime * 2 +
                        i
                    ) *
                    .4;


                ctx.fillStyle =
                    "rgba(255,255,255,.8)";


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    pulse *
                    (
                        1 +
                        i % 3
                    ),
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            ctx.fillStyle =
                "#fff0b0";


            ctx.beginPath();

            ctx.arc(
                4300,
                190,
                75,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        /* ====================================================
           TRÉSOR
           ==================================================== */

        function drawTreasureEnvironment() {

            ctx.fillStyle =
                "#162336";


            ctx.fillRect(
                0,
                0,
                game.worldWidth,
                game.worldHeight
            );


            for (
                let i = 0;
                i < 100;
                i++
            ) {

                const x =
                    (
                        i * 313
                    ) %
                    game.worldWidth;


                const y =
                    (
                        i * 97
                    ) %
                    700;


                ctx.fillStyle =
                    "rgba(255,255,255,.7)";


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    1 +
                    i % 3,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            ctx.fillStyle =
                "#263c30";


            ctx.fillRect(
                0,
                720,
                game.worldWidth,
                380
            );

        }


        /* ====================================================
           OBJET INTERACTIF
           ==================================================== */

        function drawInteractiveObject() {

            const object =
                getObjectPosition();


            const pulse =
                1 +
                Math.sin(
                    game.animationTime * 4
                ) *
                .06;


            /* halo */

            const gradient =
                ctx.createRadialGradient(
                    object.x,
                    object.y - 80,
                    10,
                    object.x,
                    object.y - 80,
                    125
                );


            gradient.addColorStop(
                0,
                "rgba(255,220,100,.38)"
            );


            gradient.addColorStop(
                1,
                "rgba(255,220,100,0)"
            );


            ctx.fillStyle =
                gradient;


            ctx.beginPath();

            ctx.arc(
                object.x,
                object.y - 80,
                125,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.save();


            ctx.translate(
                object.x,
                object.y
            );


            ctx.scale(
                pulse,
                pulse
            );


            if (
                game.scene === 0 &&
                !game.bottleFound
            ) {

                drawBottle();

            }

            else if (
                game.scene === 19
            ) {

                drawChest();

            }

            else {

                drawKeyObject();

            }


            ctx.restore();

        }


        /* ====================================================
           BOUTEILLE
           ==================================================== */

        function drawBottle() {

            ctx.rotate(
                -.3
            );


            ctx.fillStyle =
                "#6cae78";


            ctx.beginPath();

            ctx.roundRect(
                -18,
                -90,
                36,
                100,
                10
            );

            ctx.fill();


            ctx.fillStyle =
                "#e2d0a6";


            ctx.fillRect(
                -12,
                -105,
                24,
                18
            );


            ctx.fillStyle =
                "rgba(255,255,255,.65)";


            ctx.fillRect(
                -12,
                -60,
                24,
                4
            );

        }


        /* ====================================================
           CLÉ
           ==================================================== */

        function drawKeyObject() {

            ctx.fillStyle =
                "#f0ca61";


            ctx.beginPath();

            ctx.arc(
                -10,
                -55,
                22,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillRect(
                8,
                -62,
                85,
                14
            );


            ctx.fillRect(
                65,
                -48,
                13,
                35
            );


            ctx.fillRect(
                84,
                -48,
                13,
                24
            );

        }


        /* ====================================================
           COFFRE
           ==================================================== */

        function drawChest() {

            ctx.fillStyle =
                "#825329";


            ctx.beginPath();

            ctx.roundRect(
                -105,
                -90,
                210,
                110,
                14
            );

            ctx.fill();


            ctx.fillStyle =
                "#bd8544";


            ctx.fillRect(
                -105,
                -90,
                210,
                30
            );


            ctx.fillStyle =
                "#f3d064";


            ctx.fillRect(
                -15,
                -48,
                30,
                42
            );


            ctx.strokeStyle =
                "#e9ca66";

            ctx.lineWidth =
                8;


            ctx.strokeRect(
                -90,
                -75,
                180,
                80
            );

        }


        /* ====================================================
           PERSONNAGE
           ==================================================== */

        function drawPlayer() {

            const walking =
                game.moving;


            const bob =
                walking
                    ? Math.sin(
                        player.walkTime
                    ) * 5
                    : Math.sin(
                        game.animationTime * 1.2
                    ) * 1.5;


            const x =
                player.x;


            const y =
                player.y +
                bob;


            ctx.save();


            ctx.translate(
                x,
                y
            );


            ctx.scale(
                game.facing,
                1
            );


            /* ombre */

            ctx.fillStyle =
                "rgba(0,0,0,.25)";


            ctx.beginPath();

            ctx.ellipse(
                0,
                8,
                36,
                12,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* jambes */

            const leg =
                walking
                    ? Math.sin(
                        player.walkTime
                    ) * 14
                    : 0;


            ctx.strokeStyle =
                "#27394c";

            ctx.lineWidth =
                14;

            ctx.lineCap =
                "round";


            ctx.beginPath();

            ctx.moveTo(
                -10,
                -5
            );

            ctx.lineTo(
                -15 + leg,
                15
            );

            ctx.stroke();


            ctx.beginPath();

            ctx.moveTo(
                10,
                -5
            );

            ctx.lineTo(
                15 - leg,
                15
            );

            ctx.stroke();


            /* corps */

            ctx.fillStyle =
                "#d9677d";


            ctx.beginPath();

            ctx.roundRect(
                -28,
                -125,
                56,
                70,
                13
            );

            ctx.fill();


            /* bras */

            const arm =
                walking
                    ? Math.sin(
                        player.walkTime
                    ) * 12
                    : 0;


            ctx.strokeStyle =
                "#efc09e";

            ctx.lineWidth =
                12;


            ctx.beginPath();

            ctx.moveTo(
                -26,
                -110
            );

            ctx.lineTo(
                -39,
                -65 + arm
            );

            ctx.stroke();


            ctx.beginPath();

            ctx.moveTo(
                26,
                -110
            );

            ctx.lineTo(
                39,
                -65 - arm
            );

            ctx.stroke();


            /* cou */

            ctx.fillStyle =
                "#efc09e";


            ctx.fillRect(
                -10,
                -145,
                20,
                25
            );


            /* tête */

            ctx.beginPath();

            ctx.arc(
                0,
                -170,
                32,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* cheveux */

            ctx.fillStyle =
                "#5b3828";


            ctx.beginPath();

            ctx.arc(
                0,
                -178,
                34,
                Math.PI,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillRect(
                -32,
                -178,
                64,
                16
            );


            /* yeux */

            ctx.fillStyle =
                "#30231f";


            ctx.beginPath();

            ctx.arc(
                -10,
                -168,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.beginPath();

            ctx.arc(
                10,
                -168,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* sourire */

            ctx.strokeStyle =
                "#9a4e52";

            ctx.lineWidth =
                2;


            ctx.beginPath();

            ctx.arc(
                0,
                -160,
                9,
                0.2,
                Math.PI - .2
            );

            ctx.stroke();


            ctx.restore();

        }


        /* ====================================================
           PALMIER
           ==================================================== */

        function drawPalm(
            x,
            y,
            scale = 1
        ) {

            ctx.save();


            ctx.translate(
                x,
                y
            );


            ctx.scale(
                scale,
                scale
            );


            ctx.strokeStyle =
                "#70462d";

            ctx.lineWidth =
                25;

            ctx.lineCap =
                "round";


            ctx.beginPath();

            ctx.moveTo(
                0,
                0
            );

            ctx.quadraticCurveTo(
                -50,
                -150,
                0,
                -290
            );

            ctx.stroke();


            for (
                let i = 0;
                i < 8;
                i++
            ) {

                ctx.save();


                ctx.rotate(
                    -1.55 +
                    i * .44
                );


                ctx.fillStyle =
                    i % 2
                        ? "#4c9654"
                        : "#67a95e";


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -275
                );

                ctx.quadraticCurveTo(
                    95,
                    -325,
                    175,
                    -280
                );

                ctx.quadraticCurveTo(
                    90,
                    -245,
                    0,
                    -255
                );

                ctx.closePath();

                ctx.fill();


                ctx.restore();

            }


            ctx.restore();

        }


        /* ====================================================
           SAPIN
           ==================================================== */

        function drawPine(
            x,
            y,
            scale = 1
        ) {

            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.scale(
                scale,
                scale
            );


            ctx.fillStyle =
                "#62432d";


            ctx.fillRect(
                -12,
                -180,
                24,
                180
            );


            for (
                let i = 0;
                i < 4;
                i++
            ) {

                ctx.fillStyle =
                    i % 2
                        ? "#356d4a"
                        : "#4b8354";


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -310 +
                    i * 60
                );

                ctx.lineTo(
                    -105,
                    -120 +
                    i * 60
                );

                ctx.lineTo(
                    105,
                    -120 +
                    i * 60
                );

                ctx.closePath();

                ctx.fill();

            }


            ctx.restore();

        }


        /* ====================================================
           FLEURS
           ==================================================== */

        function drawFlower(
            x,
            y,
            color
        ) {

            ctx.strokeStyle =
                "#477a4d";

            ctx.lineWidth =
                5;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y - 55
            );

            ctx.stroke();


            ctx.fillStyle =
                color;


            for (
                let i = 0;
                i < 5;
                i++
            ) {

                const angle =
                    i *
                    Math.PI *
                    2 /
                    5;


                ctx.beginPath();

                ctx.arc(
                    x +
                    Math.cos(angle) *
                    9,

                    y -
                    63 +
                    Math.sin(angle) *
                    9,

                    8,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            ctx.fillStyle =
                "#e9c95b";


            ctx.beginPath();

            ctx.arc(
                x,
                y - 63,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        /* ====================================================
           MAISON
           ==================================================== */

        function drawHouse(
            x,
            y,
            scale = 1
        ) {

            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.scale(
                scale,
                scale
            );


            ctx.fillStyle =
                "#ba704f";


            ctx.fillRect(
                -100,
                -150,
                200,
                150
            );


            ctx.fillStyle =
                "#714633";


            ctx.beginPath();

            ctx.moveTo(
                -125,
                -150
            );

            ctx.lineTo(
                0,
                -250
            );

            ctx.lineTo(
                125,
                -150
            );

            ctx.closePath();

            ctx.fill();


            ctx.fillStyle =
                "#f3d689";


            ctx.fillRect(
                -65,
                -110,
                45,
                55
            );


            ctx.fillRect(
                20,
                -110,
                45,
                55
            );


            ctx.fillStyle =
                "#68472f";


            ctx.fillRect(
                -15,
                -75,
                35,
                75
            );


            ctx.restore();

        }


        /* ====================================================
           INDICATION INTERACTION
           ==================================================== */

        function drawInteractionHint() {

            if (!game.started) {

                return;

            }


            if (
                game.dialogueActive ||
                game.questionActive
            ) {

                return;

            }


            if (!nearObject()) {

                return;

            }


            const object =
                getObjectPosition();


            const label =
                game.scene === 0 &&
                !game.bottleFound

                    ? "EXAMINER LA BOUTEILLE"

                    : game.scene === 19

                        ? "OUVRIR LE COFFRE"

                        : "DÉCOUVRIR L'ÉNIGME";


            const boxWidth =
                Math.min(
                    360,
                    width - 40
                );


            const x =
                width / 2 -
                boxWidth / 2;


            const y =
                height - 150;


            ctx.save();


            ctx.fillStyle =
                "rgba(12,24,35,.9)";


            ctx.beginPath();

            ctx.roundRect(
                x,
                y,
                boxWidth,
                58,
                18
            );

            ctx.fill();


            ctx.strokeStyle =
                "#efc85d";

            ctx.lineWidth =
                2;


            ctx.stroke();


            ctx.fillStyle =
                "#f7e5a4";


            ctx.font =
                "700 17px system-ui";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.fillText(
                `✦ ${label} ✦`,
                width / 2,
                y + 29
            );


            ctx.restore();

        }


        /* ====================================================
           JOYSTICK
           ==================================================== */

        function setupJoystick() {

            if (!joystickElement) {

                return;

            }


            function updateJoystick(
                event
            ) {

                const rect =
                    joystickElement
                        .getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                let dx =
                    event.clientX -
                    centerX;


                let dy =
                    event.clientY -
                    centerY;


                const max =
                    rect.width *
                    .34;


                const distance =
                    Math.hypot(
                        dx,
                        dy
                    );


                if (
                    distance >
                    max
                ) {

                    dx =
                        dx /
                        distance *
                        max;


                    dy =
                        dy /
                        distance *
                        max;

                }


                joystick.x =
                    dx / max;


                joystick.y =
                    dy / max;


                if (joystickKnob) {

                    joystickKnob.style.transform =
                        `translate(${dx}px, ${dy}px)`;

                }

            }


            function endJoystick(
                event
            ) {

                if (
                    event.pointerId !==
                    joystick.pointerId
                ) {

                    return;

                }


                joystick.active =
                    false;


                joystick.pointerId =
                    null;


                joystick.x = 0;

                joystick.y = 0;


                if (joystickKnob) {

                    joystickKnob.style.transform =
                        "translate(0, 0)";

                }

            }


            joystickElement.addEventListener(
                "pointerdown",
                event => {

                    joystick.active =
                        true;

                    joystick.pointerId =
                        event.pointerId;


                    joystickElement.setPointerCapture(
                        event.pointerId
                    );


                    updateJoystick(
                        event
                    );

                }
            );


            joystickElement.addEventListener(
                "pointermove",
                event => {

                    if (
                        joystick.active
                    ) {

                        updateJoystick(
                            event
                        );

                    }

                }
            );


            joystickElement.addEventListener(
                "pointerup",
                endJoystick
            );


            joystickElement.addEventListener(
                "pointercancel",
                endJoystick
            );

        }


        /* ====================================================
           CLAVIER
           ==================================================== */

        function setupKeyboard() {

            window.addEventListener(
                "keydown",
                event => {

                    const key =
                        event.key.toLowerCase();


                    if (
                        key === "arrowleft" ||
                        key === "q" ||
                        key === "a"
                    ) {

                        keyboard.left =
                            true;

                    }


                    if (
                        key === "arrowright" ||
                        key === "d"
                    ) {

                        keyboard.right =
                            true;

                    }


                    if (
                        key === "arrowup" ||
                        key === "z" ||
                        key === "w"
                    ) {

                        keyboard.up =
                            true;

                    }


                    if (
                        key === "arrowdown" ||
                        key === "s"
                    ) {

                        keyboard.down =
                            true;

                    }


                    if (
                        key === " " ||
                        key === "e"
                    ) {

                        if (
                            !event.repeat
                        ) {

                            interact();

                        }

                    }

                }
            );


            window.addEventListener(
                "keyup",
                event => {

                    const key =
                        event.key.toLowerCase();


                    if (
                        key === "arrowleft" ||
                        key === "q" ||
                        key === "a"
                    ) {

                        keyboard.left =
                            false;

                    }


                    if (
                        key === "arrowright" ||
                        key === "d"
                    ) {

                        keyboard.right =
                            false;

                    }


                    if (
                        key === "arrowup" ||
                        key === "z" ||
                        key === "w"
                    ) {

                        keyboard.up =
                            false;

                    }


                    if (
                        key === "arrowdown" ||
                        key === "s"
                    ) {

                        keyboard.down =
                            false;

                    }

                }
            );

        }


        /* ====================================================
           BOUTONS
           ==================================================== */

        if (startButton) {

            startButton.addEventListener(
                "click",
                () => {

                    audio("resume");

                    startAdventure();

                }
            );

        }


        if (continueButton) {

            continueButton.addEventListener(
                "click",
                () => {

                    audio("resume");

                    startAdventure();

                }
            );

        }


        if (dialogueNext) {

            dialogueNext.addEventListener(
                "click",
                nextDialogue
            );

        }


        if (dialogueBox) {

            dialogueBox.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        dialogueBox
                    ) {

                        nextDialogue();

                    }

                }
            );

        }


        if (interactionButton) {

            interactionButton.addEventListener(
                "click",
                interact
            );

        }


        if (mapButton) {

            mapButton.addEventListener(
                "click",
                openMap
            );

        }


        if (closeMapButton) {

            closeMapButton.addEventListener(
                "click",
                closeMap
            );

        }


        if (validateButton) {

            validateButton.addEventListener(
                "click",
                validateAnswer
            );

        }


        if (revealButton) {

            revealButton.addEventListener(
                "click",
                revealAnswer
            );

        }


        if (answerInput) {

            answerInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        validateAnswer();

                    }

                }
            );

        }


        if (openChestButton) {

            openChestButton.addEventListener(
                "click",
                openChest
            );

        }


        if (treasureButton) {

            treasureButton.addEventListener(
                "click",
                openTreasureLink
            );

        }


        /* ====================================================
           CLIC SUR LE CANVAS
           ==================================================== */

        canvas.addEventListener(
            "pointerdown",
            event => {

                if (!game.started) {

                    return;

                }


                if (
                    game.dialogueActive ||
                    game.questionActive
                ) {

                    return;

                }


                /*
                 * Sur mobile, toucher le personnage /
                 * environnement ne remplace pas le bouton.
                 * On garde le bouton "interagir" explicite.
                 */

            }
        );


        /* ====================================================
           BOUCLE DE JEU
           ==================================================== */

        function update(delta) {

            game.animationTime +=
                delta;


            updateMovement(
                delta
            );


            updateCamera();

        }


        function render() {

            drawWorld();

        }


        function loop(time) {

            if (!game.lastTime) {

                game.lastTime =
                    time;

            }


            const delta =
                Math.min(
                    0.033,
                    (
                        time -
                        game.lastTime
                    ) / 1000
                );


            game.lastTime =
                time;


            update(
                delta
            );


            render();


            requestAnimationFrame(
                loop
            );

        }


        /* ====================================================
           INITIALISATION
           ==================================================== */

        setupKeyboard();

        setupJoystick();

        updateHUD();

        requestAnimationFrame(
            loop
        );


        /* ====================================================
           API PUBLIQUE
           ==================================================== */

        window.MysteryLoveIsland = {

            start:
                startAdventure,

            interact,

            openMap,

            closeMap,

            openQuestion,

            validateAnswer,

            collectKey,

            openChest,

            showTreasure:
                showFinalTreasure,

            getState: () => ({
                scene:
                    game.scene,

                keys:
                    game.keys,

                started:
                    game.started,

                bottleFound:
                    game.bottleFound,

                chestOpened:
                    game.chestOpened,

                player: {
                    x:
                        player.x,

                    y:
                        player.y
                }
            })

        };


        /* ====================================================
           LOG DE CONTRÔLE
           ==================================================== */

        console.log(
            "🎮 MYSTERY LOVE ISLAND — game.js chargé"
        );

        console.log(
            `🔑 ${DATA.questions.length} énigmes disponibles`
        );

        console.log(
            `🌍 ${DATA.environments.length} environnements disponibles`
        );

    });

})();
