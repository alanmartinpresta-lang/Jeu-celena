/* ============================================================
   MYSTERY LOVE ISLAND
   DATA.JS
   Toutes les données du jeu
   ============================================================ */

"use strict";

/* ============================================================
   CONFIGURATION GÉNÉRALE
   ============================================================ */

const GAME_DATA = {

    title: "MYSTERY LOVE ISLAND",

    totalKeys: 20,

    /* --------------------------------------------------------
       LIEN FINAL
       À remplacer lorsque Alan donnera le véritable lien
       vers "100 raisons de t'aimer".
       -------------------------------------------------------- */

    treasureLink: "https://alanmartinpresta-lang.github.io/Celena-app/?utm_source=chatgpt.com",


    /* ========================================================
       LES 20 ÉNIGMES
       ======================================================== */

    questions: [

        {
            id: 1,

            question: "Quel nombre obtient-on en additionnant 11 et 2 ?",

            answer: "13",

            acceptedAnswers: [
                "13"
            ],

            explanation:
                "13 est le jour de votre date de couple : 13/06/2018.",

            environment: "beach",

            key: 1
        },


        {
            id: 2,

            question:
                "Quel est le nom de la basilique située sur les hauteurs de Lyon ?",

            answer: "Fourvière",

            acceptedAnswers: [
                "fourviere",
                "fourvière",
                "basilique de fourviere",
                "basilique de fourvière",
                "notre dame de fourviere",
                "notre dame de fourvière"
            ],

            explanation:
                "Fourvière est le lieu de votre premier rendez-vous.",

            environment: "lyon",

            key: 2
        },


        {
            id: 3,

            question:
                "Quel chanteur britannique est notamment connu pour la chanson « Perfect » ?",

            answer: "Ed Sheeran",

            acceptedAnswers: [
                "ed sheeran"
            ],

            explanation:
                "Ed Sheeran est le chanteur préféré.",

            environment: "forest",

            key: 3
        },


        {
            id: 4,

            question:
                "Quel pays d'Amérique du Nord était votre premier grand voyage ?",

            answer: "Canada",

            acceptedAnswers: [
                "canada"
            ],

            explanation:
                "Le Canada est votre premier grand voyage.",

            environment: "mountain",

            key: 4
        },


        {
            id: 5,

            question:
                "Combien font 8 moins 2 ?",

            answer: "6",

            acceptedAnswers: [
                "6"
            ],

            explanation:
                "6 correspond au mois de juin dans votre date de couple : 13/06/2018.",

            environment: "lake",

            key: 5
        },


        {
            id: 6,

            question:
                "Quel dessert est préparé avec une base biscuitée et une garniture au fromage frais ?",

            answer: "Cheesecake",

            acceptedAnswers: [
                "cheesecake",
                "cheese cake"
            ],

            explanation:
                "Le cheesecake est son dessert préféré.",

            environment: "garden",

            key: 6
        },


        {
            id: 7,

            question:
                "Comment s'appelle la série avec Ross, Rachel, Monica, Chandler, Joey et Phoebe ?",

            answer: "Friends",

            acceptedAnswers: [
                "friends"
            ],

            explanation:
                "Friends est votre série préférée.",

            environment: "city",

            key: 7
        },


        {
            id: 8,

            question:
                "Quel film romantique raconte l'histoire d'amour de Noah et Allie ?",

            answer: "N'oublie jamais",

            acceptedAnswers: [
                "n'oublie jamais",
                "n oublie jamais",
                "the notebook"
            ],

            explanation:
                "N'oublie jamais est votre film romantique préféré.",

            environment: "cinema",

            key: 8
        },


        {
            id: 9,

            question:
                "Quel nombre obtient-on en soustrayant 1 à 20 ?",

            answer: "19",

            acceptedAnswers: [
                "19"
            ],

            explanation:
                "19 correspond au jour de naissance d'Iris : 19/02/2022.",

            environment: "village",

            key: 9
        },


        {
            id: 10,

            question:
                "Quelle chanteuse interprète « Love Me Like You Do » ?",

            answer: "Ellie Goulding",

            acceptedAnswers: [
                "ellie goulding"
            ],

            explanation:
                "Ellie Goulding est associée au souvenir de la grossesse d'Ellie.",

            environment: "waterfall",

            key: 10
        },


        {
            id: 11,

            question:
                "Quelle ville française est célèbre pour son Festival international du cinéma ?",

            answer: "Cannes",

            acceptedAnswers: [
                "cannes"
            ],

            explanation:
                "Cannes correspond à vos vacances d'été.",

            environment: "cannes",

            key: 11
        },


        {
            id: 12,

            question:
                "Quel célèbre parc d'attractions Disney se trouve en France ?",

            answer: "Disneyland",

            acceptedAnswers: [
                "disneyland",
                "disneyland paris"
            ],

            explanation:
                "Disneyland est votre parc d'attractions préféré.",

            environment: "park",

            key: 12
        },


        {
            id: 13,

            question:
                "Combien font 1 + 1 ?",

            answer: "2",

            acceptedAnswers: [
                "2"
            ],

            explanation:
                "2 correspond au mois de naissance d'Iris : février.",

            environment: "snow",

            key: 13
        },


        {
            id: 14,

            question:
                "Dans Desperate Housewives, quel surnom Susan donne-t-elle à Mike ?",

            answer: "Petit pois",

            acceptedAnswers: [
                "petit pois",
                "petitpoids"
            ],

            explanation:
                "Petit pois est le premier surnom qu'elle t'a donné.",

            environment: "memory",

            key: 14
        },


        {
            id: 15,

            question:
                "Quelle période de l'année est associée aux sapins, aux cadeaux et aux illuminations ?",

            answer: "Noël",

            acceptedAnswers: [
                "noel",
                "noël"
            ],

            explanation:
                "Noël est sa période préférée.",

            environment: "christmas",

            key: 15
        },


        {
            id: 16,

            question:
                "Quel est le plus grand titre du groupe Goo Goo Dolls ?",

            answer: "Iris",

            acceptedAnswers: [
                "iris"
            ],

            explanation:
                "« Iris » est la musique associée à la grossesse d'Iris.",

            environment: "iris",

            key: 16
        },


        {
            id: 17,

            question:
                "Combien font 1 + 2 ?",

            answer: "3",

            acceptedAnswers: [
                "3"
            ],

            explanation:
                "3 correspond au mois de naissance d'Ellie : octobre est le 10e mois, et cette clé prépare la suite des chiffres de sa date.",

            environment: "ellie",

            key: 17
        },


        {
            id: 18,

            question:
                "En quelle année la France a-t-elle remporté la Coupe du monde de football ?",

            answer: "2018",

            acceptedAnswers: [
                "2018"
            ],

            explanation:
                "2018 correspond à l'année de votre date de couple : 13/06/2018.",

            environment: "stadium",

            key: 18
        },


        {
            id: 19,

            question:
                "Combien font 5 × 405 ?",

            answer: "2025",

            acceptedAnswers: [
                "2025"
            ],

            explanation:
                "2025 correspond à l'année de naissance d'Ellie : 03/10/2025.",

            environment: "stars",

            key: 19
        },


        {
            id: 20,

            question:
                "Qui est le mari le plus incroyable ?",

            answer: "Alan",

            acceptedAnswers: [
                "alan",
                "alan martin",
                "martin alan"
            ],

            explanation:
                "La dernière clé ne pouvait être qu'une question dont la réponse est évidente. ❤️",

            environment: "treasure",

            key: 20
        }

    ],


    /* ========================================================
       SOUVENIRS
       ======================================================== */

    memories: [

        {
            id: 1,
            title: "13/06/2018",
            titleShort: "Le début de votre histoire",
            text:
                "La date qui marque le début de votre histoire.",
            icon: "❤️"
        },

        {
            id: 2,
            title: "19/02/2022",
            titleShort: "La naissance d'Iris",
            text:
                "Le jour où Iris est entrée dans votre vie.",
            icon: "🌸"
        },

        {
            id: 3,
            title: "03/10/2025",
            titleShort: "La naissance d'Ellie",
            text:
                "Le jour où Ellie est venue agrandir votre famille.",
            icon: "🩷"
        },

        {
            id: 4,
            title: "Canada",
            titleShort: "Votre premier grand voyage",
            text:
                "Un voyage devenu un morceau de votre histoire.",
            icon: "🍁"
        },

        {
            id: 5,
            title: "Punta Cana",
            titleShort: "Un autre grand voyage",
            text:
                "Un souvenir de soleil, de mer et de vacances.",
            icon: "🌴"
        },

        {
            id: 6,
            title: "Friends",
            titleShort: "Votre série préférée",
            text:
                "Un univers que vous aimez partager.",
            icon: "📺"
        },

        {
            id: 7,
            title: "N'oublie jamais",
            titleShort: "Votre film romantique préféré",
            text:
                "Une histoire d'amour qui traverse le temps.",
            icon: "🎬"
        },

        {
            id: 8,
            title: "Fourvière",
            titleShort: "Votre premier rendez-vous",
            text:
                "Un lieu qui appartient désormais à votre histoire.",
            icon: "⛪"
        },

        {
            id: 9,
            title: "Cheesecake",
            titleShort: "Son dessert préféré",
            text:
                "Une petite chose simple, mais qui fait partie des souvenirs.",
            icon: "🍰"
        },

        {
            id: 10,
            title: "Disneyland",
            titleShort: "Votre parc préféré",
            text:
                "Un endroit rempli de souvenirs et de magie.",
            icon: "🏰"
        },

        {
            id: 11,
            title: "Cannes",
            titleShort: "Vos vacances d'été",
            text:
                "Le soleil, la mer et les vacances ensemble.",
            icon: "☀️"
        },

        {
            id: 12,
            title: "Petit pois",
            titleShort: "Le premier surnom",
            text:
                "Un petit surnom devenu un souvenir.",
            icon: "🫛"
        },

        {
            id: 13,
            title: "Noël",
            titleShort: "Sa période préférée",
            text:
                "Les lumières, le sapin, les cadeaux et cette atmosphère particulière.",
            icon: "🎄"
        },

        {
            id: 14,
            title: "Ed Sheeran",
            titleShort: "Son chanteur préféré",
            text:
                "Un artiste qui fait partie de ses goûts musicaux.",
            icon: "🎵"
        },

        {
            id: 15,
            title: "Iris — Goo Goo Dolls",
            titleShort: "La musique d'Iris",
            text:
                "Une chanson associée à la grossesse d'Iris.",
            icon: "🎶"
        },

        {
            id: 16,
            title: "Ellie Goulding",
            titleShort: "Le souvenir d'Ellie",
            text:
                "Une artiste associée à la grossesse d'Ellie.",
            icon: "🎼"
        },

        {
            id: 17,
            title: "Susan → Mike",
            titleShort: "Petit pois",
            text:
                "Le clin d'œil à Desperate Housewives et au surnom.",
            icon: "📺"
        },

        {
            id: 18,
            title: "Iris",
            titleShort: "Goo Goo Dolls",
            text:
                "Le titre qui porte aussi le prénom d'Iris.",
            icon: "🌹"
        },

        {
            id: 19,
            title: "2018",
            titleShort: "Une année importante",
            text:
                "Une année cachée dans plusieurs souvenirs de votre histoire.",
            icon: "🔢"
        },

        {
            id: 20,
            title: "Alan",
            titleShort: "Le mari le plus incroyable",
            text:
                "La dernière clé mène au véritable trésor.",
            icon: "💖"
        }

    ],


    /* ========================================================
       LES 20 ENVIRONNEMENTS
       ======================================================== */

    environments: [

        {
            id: 1,
            name: "La plage",
            type: "beach",
            atmosphere: "waves",
            description:
                "Une plage calme baignée par la lumière du soleil.",
            object: "bottle"
        },

        {
            id: 2,
            name: "La crique des souvenirs",
            type: "cove",
            atmosphere: "waves",
            description:
                "Une petite crique cachée entre les rochers.",
            object: "shell"
        },

        {
            id: 3,
            name: "La forêt",
            type: "forest",
            atmosphere: "birds",
            description:
                "Une forêt lumineuse où les oiseaux chantent.",
            object: "lantern"
        },

        {
            id: 4,
            name: "La montagne",
            type: "mountain",
            atmosphere: "wind",
            description:
                "Un sentier montagneux balayé par le vent.",
            object: "key"
        },

        {
            id: 5,
            name: "Le lac",
            type: "lake",
            atmosphere: "water",
            description:
                "Un lac calme reflète le ciel.",
            object: "boat"
        },

        {
            id: 6,
            name: "Le jardin",
            type: "garden",
            atmosphere: "birds",
            description:
                "Un jardin fleuri rempli de petites touches de couleur.",
            object: "flowers"
        },

        {
            id: 7,
            name: "La ville",
            type: "city",
            atmosphere: "city",
            description:
                "Les lumières de la ville apparaissent au loin.",
            object: "building"
        },

        {
            id: 8,
            name: "Le cinéma",
            type: "cinema",
            atmosphere: "city",
            description:
                "Une vieille salle de cinéma rappelle les histoires d'amour.",
            object: "film"
        },

        {
            id: 9,
            name: "Le village",
            type: "village",
            atmosphere: "birds",
            description:
                "Un petit village paisible semble cacher quelque chose.",
            object: "house"
        },

        {
            id: 10,
            name: "La cascade",
            type: "waterfall",
            atmosphere: "waterfall",
            description:
                "Le bruit de l'eau accompagne chacun de tes pas.",
            object: "waterfall"
        },

        {
            id: 11,
            name: "Cannes",
            type: "cannes",
            atmosphere: "waves",
            description:
                "Une ambiance méditerranéenne rappelle les vacances.",
            object: "shell"
        },

        {
            id: 12,
            name: "Le parc",
            type: "park",
            atmosphere: "birds",
            description:
                "Un parc rempli de souvenirs heureux.",
            object: "wheel"
        },

        {
            id: 13,
            name: "La neige",
            type: "snow",
            atmosphere: "wind",
            description:
                "La neige tombe doucement autour de toi.",
            object: "tree"
        },

        {
            id: 14,
            name: "Le souvenir",
            type: "memory",
            atmosphere: "soft",
            description:
                "Le décor devient progressivement irréel.",
            object: "heart"
        },

        {
            id: 15,
            name: "Noël",
            type: "christmas",
            atmosphere: "soft",
            description:
                "Des lumières chaudes illuminent le chemin.",
            object: "tree"
        },

        {
            id: 16,
            name: "Le souvenir d'Iris",
            type: "iris",
            atmosphere: "soft",
            description:
                "Une lumière douce fait apparaître un souvenir.",
            object: "heart"
        },

        {
            id: 17,
            name: "Le souvenir d'Ellie",
            type: "ellie",
            atmosphere: "soft",
            description:
                "Une nouvelle lumière apparaît devant toi.",
            object: "heart"
        },

        {
            id: 18,
            name: "Le stade",
            type: "stadium",
            atmosphere: "crowd",
            description:
                "Un stade immense apparaît au bout du chemin.",
            object: "stadium"
        },

        {
            id: 19,
            name: "Le ciel étoilé",
            type: "stars",
            atmosphere: "night",
            description:
                "Le ciel se couvre progressivement d'étoiles.",
            object: "stars"
        },

        {
            id: 20,
            name: "Le coffre",
            type: "treasure",
            atmosphere: "soft",
            description:
                "Le chemin s'arrête devant le coffre.",
            object: "chest"
        }

    ]

};


/* ============================================================
   COMPATIBILITÉ AVEC LES AUTRES FICHIERS
   ============================================================ */

/*
   On expose les données sous plusieurs noms afin que game.js
   puisse les utiliser sans devoir réécrire toutes les données.
*/

window.GAME_DATA = GAME_DATA;

window.questions = GAME_DATA.questions;

window.memories = GAME_DATA.memories;

window.environments = GAME_DATA.environments;

window.totalKeys = GAME_DATA.totalKeys;


/* ============================================================
   OUTILS POUR LES RÉPONSES
   ============================================================ */

window.normalizeAnswer = function(value) {

    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[’']/g, "'")
        .replace(/[^a-z0-9' -]/g, "")
        .replace(/\s+/g, " ")
        .trim();

};


window.checkAnswer = function(userAnswer, question) {

    const normalizedUser =
        window.normalizeAnswer(userAnswer);

    if (!normalizedUser) {
        return false;
    }

    const accepted =
        question.acceptedAnswers || [question.answer];

    return accepted.some(answer => {

        return window.normalizeAnswer(answer) === normalizedUser;

    });

};


/* ============================================================
   VÉRIFICATION DES DONNÉES
   ============================================================ */

console.log(
    "❤️ MYSTERY LOVE ISLAND — data.js chargé"
);

console.log(
    "🔑 Nombre d'énigmes :",
    GAME_DATA.questions.length
);

console.log(
    "💝 Nombre de souvenirs :",
    GAME_DATA.memories.length
);

console.log(
    "🌍 Nombre d'environnements :",
    GAME_DATA.environments.length
);
