/* ============================================================
   MYSTERY LOVE ISLAND
   AUDIO.JS
   Musique + ambiances + effets sonores
   ============================================================ */

"use strict";

/* ============================================================
   MOTEUR AUDIO
   ============================================================ */

const AudioEngine = (() => {

    let ctx = null;

    let master = null;
    let musicBus = null;
    let ambienceBus = null;
    let effectsBus = null;

    let musicGain = null;
    let ambienceGain = null;
    let effectsGain = null;

    let musicStarted = false;
    let currentEnvironment = null;

    let ambienceTimer = null;
    let melodyTimer = null;

    let enabled = true;

    /* --------------------------------------------------------
       Initialisation
       -------------------------------------------------------- */

    function init() {

        if (ctx) return;

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            console.warn("Web Audio API non disponible.");
            return;
        }

        ctx = new AudioContext();

        master = ctx.createGain();
        musicBus = ctx.createGain();
        ambienceBus = ctx.createGain();
        effectsBus = ctx.createGain();

        musicGain = ctx.createGain();
        ambienceGain = ctx.createGain();
        effectsGain = ctx.createGain();

        musicGain.gain.value = 0.045;
        ambienceGain.gain.value = 0.16;
        effectsGain.gain.value = 0.25;

        musicBus.connect(musicGain);
        ambienceBus.connect(ambienceGain);
        effectsBus.connect(effectsGain);

        musicGain.connect(master);
        ambienceGain.connect(master);
        effectsGain.connect(master);

        master.gain.value = 0.72;

        master.connect(ctx.destination);
    }


    /* --------------------------------------------------------
       Réveil audio après interaction utilisateur
       -------------------------------------------------------- */

    async function resume() {

        init();

        if (!ctx) return;

        if (ctx.state === "suspended") {
            try {
                await ctx.resume();
            } catch (error) {
                console.warn("Impossible de reprendre l'audio.", error);
            }
        }

        if (!musicStarted) {
            startMusic();
        }
    }


    /* ========================================================
       OUTILS AUDIO
       ======================================================== */

    function createOscillator(
        frequency,
        type,
        duration,
        volume,
        destination,
        startTime = null
    ) {

        if (!ctx || !enabled) return;

        const now =
            startTime !== null
                ? startTime
                : ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(0.0001, now);

        gain.gain.exponentialRampToValueAtTime(
            Math.max(volume, 0.0001),
            now + 0.035
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        osc.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + duration + 0.03);
    }


    function noise(
        duration,
        volume,
        destination,
        filterFrequency = 1000
    ) {

        if (!ctx || !enabled) return;

        const bufferSize =
            Math.max(
                1,
                Math.floor(ctx.sampleRate * duration)
            );

        const buffer =
            ctx.createBuffer(
                1,
                bufferSize,
                ctx.sampleRate
            );

        const data =
            buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source =
            ctx.createBufferSource();

        const filter =
            ctx.createBiquadFilter();

        const gain =
            ctx.createGain();

        source.buffer = buffer;

        filter.type = "lowpass";
        filter.frequency.value = filterFrequency;

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            Math.max(volume, 0.0001),
            ctx.currentTime + 0.08
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + duration
        );

        source.connect(filter);
        filter.connect(gain);
        gain.connect(destination);

        source.start();
        source.stop(ctx.currentTime + duration + 0.03);
    }


    /* ========================================================
       MUSIQUE ROMANTIQUE
       Style boîte à musique très légère
       ======================================================== */

    const melody = [

        523.25, // C5
        659.25, // E5
        783.99, // G5
        659.25,

        587.33, // D5
        698.46, // F5
        880.00, // A5
        698.46,

        523.25,
        659.25,
        783.99,
        987.77,

        880.00,
        783.99,
        659.25,
        587.33

    ];


    let melodyIndex = 0;


    function playMelodyNote() {

        if (!ctx || !enabled) return;

        const frequency =
            melody[melodyIndex];

        melodyIndex =
            (melodyIndex + 1) %
            melody.length;

        /*
         * Son cristallin très court.
         * Le volume reste volontairement extrêmement faible
         * afin que l'ambiance du lieu reste dominante.
         */

        createOscillator(
            frequency,
            "sine",
            1.8,
            0.08,
            musicBus
        );

        /*
         * Petite harmonique très discrète,
         * comme une boîte à musique.
         */

        createOscillator(
            frequency * 2,
            "triangle",
            0.75,
            0.018,
            musicBus
        );
    }


    function startMusic() {

        if (!ctx || musicStarted || !enabled) {
            return;
        }

        musicStarted = true;

        melodyIndex = 0;

        playMelodyNote();

        melodyTimer =
            setInterval(
                playMelodyNote,
                1450
            );
    }


    function stopMusic() {

        if (melodyTimer) {

            clearInterval(melodyTimer);

            melodyTimer = null;
        }

        musicStarted = false;
    }


    /* ========================================================
       AMBIANCES
       ======================================================== */

    function clearAmbience() {

        if (ambienceTimer) {

            clearInterval(ambienceTimer);

            ambienceTimer = null;
        }
    }


    function startAmbience(environment) {

        if (!ctx || !enabled) return;

        clearAmbience();

        currentEnvironment =
            environment || "beach";

        /*
         * Première ambiance immédiatement.
         */

        playAmbientEvent(currentEnvironment);

        /*
         * Puis événements irréguliers.
         */

        ambienceTimer =
            setInterval(() => {

                playAmbientEvent(
                    currentEnvironment
                );

            }, getAmbientInterval(currentEnvironment));
    }


    function getAmbientInterval(environment) {

        switch (environment) {

            case "beach":
            case "cove":
            case "cannes":
                return 4200;

            case "forest":
            case "garden":
            case "village":
            case "park":
                return 3500;

            case "mountain":
                return 5000;

            case "lake":
            case "waterfall":
                return 3800;

            case "snow":
            case "christmas":
                return 5200;

            case "city":
            case "cinema":
            case "stadium":
                return 4500;

            case "stars":
                return 6000;

            default:
                return 5000;
        }
    }


    function playAmbientEvent(environment) {

        if (!ctx || !enabled) return;

        switch (environment) {

            /* ------------------------------------------------
               PLAGE
               ------------------------------------------------ */

            case "beach":
            case "cove":
            case "cannes":

                playWave();

                break;


            /* ------------------------------------------------
               FORÊT
               ------------------------------------------------ */

            case "forest":
            case "garden":
            case "village":
            case "park":

                playBirds();

                break;


            /* ------------------------------------------------
               MONTAGNE
               ------------------------------------------------ */

            case "mountain":

                playWind();

                break;


            /* ------------------------------------------------
               LAC
               ------------------------------------------------ */

            case "lake":

                playWater();

                break;


            /* ------------------------------------------------
               CASCADE
               ------------------------------------------------ */

            case "waterfall":

                playWaterfall();

                break;


            /* ------------------------------------------------
               VILLE
               ------------------------------------------------ */

            case "city":
            case "cinema":

                playCity();

                break;


            /* ------------------------------------------------
               STADE
               ------------------------------------------------ */

            case "stadium":

                playCrowd();

                break;


            /* ------------------------------------------------
               NEIGE
               ------------------------------------------------ */

            case "snow":
            case "christmas":

                playSoftWind();

                break;


            /* ------------------------------------------------
               CIEL ÉTOILÉ
               ------------------------------------------------ */

            case "stars":

                playStars();

                break;


            /* ------------------------------------------------
               SOUVENIRS
               ------------------------------------------------ */

            case "memory":
            case "iris":
            case "ellie":

                playMagic();

                break;


            /* ------------------------------------------------
               TRÉSOR
               ------------------------------------------------ */

            case "treasure":

                playTreasureAmbience();

                break;


            default:

                playSoftWind();

                break;
        }
    }


    /* ========================================================
       SON DES VAGUES
       ======================================================== */

    function playWave() {

        if (!ctx) return;

        noise(
            2.5,
            0.035,
            ambienceBus,
            750
        );
    }


    /* ========================================================
       OISEAUX
       ======================================================== */

    function playBirds() {

        if (!ctx) return;

        const base =
            1200 +
            Math.random() * 700;

        createOscillator(
            base,
            "sine",
            0.16,
            0.055,
            ambienceBus
        );

        setTimeout(() => {

            if (!ctx) return;

            createOscillator(
                base * 1.25,
                "sine",
                0.20,
                0.045,
                ambienceBus
            );

        }, 150);

        setTimeout(() => {

            if (!ctx) return;

            createOscillator(
                base * 1.5,
                "sine",
                0.27,
                0.035,
                ambienceBus
            );

        }, 300);
    }


    /* ========================================================
       VENT
       ======================================================== */

    function playWind() {

        noise(
            2.8,
            0.055,
            ambienceBus,
            900
        );
    }


    function playSoftWind() {

        noise(
            3.5,
            0.025,
            ambienceBus,
            650
        );
    }


    /* ========================================================
       EAU
       ======================================================== */

    function playWater() {

        noise(
            1.8,
            0.028,
            ambienceBus,
            1200
        );
    }


    function playWaterfall() {

        noise(
            3.0,
            0.065,
            ambienceBus,
            1600
        );
    }


    /* ========================================================
       VILLE
       ======================================================== */

    function playCity() {

        noise(
            1.2,
            0.018,
            ambienceBus,
            500
        );

        createOscillator(
            90 + Math.random() * 30,
            "sine",
            0.45,
            0.012,
            ambienceBus
        );
    }


    /* ========================================================
       STADE
       ======================================================== */

    function playCrowd() {

        noise(
            1.8,
            0.028,
            ambienceBus,
            1100
        );
    }


    /* ========================================================
       CIEL ÉTOILÉ
       ======================================================== */

    function playStars() {

        createOscillator(
            1046.50,
            "sine",
            1.4,
            0.025,
            ambienceBus
        );
    }


    /* ========================================================
       AMBIANCE MAGIQUE
       ======================================================== */

    function playMagic() {

        createOscillator(
            659.25,
            "sine",
            1.8,
            0.025,
            ambienceBus
        );

        setTimeout(() => {

            createOscillator(
                783.99,
                "sine",
                1.5,
                0.018,
                ambienceBus
            );

        }, 300);
    }


    /* ========================================================
       AMBIANCE DU TRÉSOR
       ======================================================== */

    function playTreasureAmbience() {

        createOscillator(
            261.63,
            "sine",
            3,
            0.025,
            ambienceBus
        );

        setTimeout(() => {

            createOscillator(
                392,
                "sine",
                3,
                0.022,
                ambienceBus
            );

        }, 400);

        setTimeout(() => {

            createOscillator(
                523.25,
                "sine",
                3,
                0.018,
                ambienceBus
            );

        }, 800);
    }


    /* ========================================================
       EFFETS SONORES
       ======================================================== */

    function keyFound() {

        resume();

        setTimeout(() => {

            createOscillator(
                523.25,
                "sine",
                0.25,
                0.18,
                effectsBus
            );

        }, 0);

        setTimeout(() => {

            createOscillator(
                659.25,
                "sine",
                0.25,
                0.18,
                effectsBus
            );

        }, 110);

        setTimeout(() => {

            createOscillator(
                783.99,
                "sine",
                0.45,
                0.22,
                effectsBus
            );

        }, 220);
    }


    function button() {

        resume();

        createOscillator(
            420,
            "sine",
            0.09,
            0.055,
            effectsBus
        );
    }


    function wrongAnswer() {

        resume();

        createOscillator(
            180,
            "sine",
            0.25,
            0.09,
            effectsBus
        );

        setTimeout(() => {

            createOscillator(
                130,
                "sine",
                0.3,
                0.07,
                effectsBus
            );

        }, 120);
    }


    function correctAnswer() {

        resume();

        createOscillator(
            523.25,
            "sine",
            0.22,
            0.12,
            effectsBus
        );

        setTimeout(() => {

            createOscillator(
                659.25,
                "sine",
                0.22,
                0.14,
                effectsBus
            );

        }, 100);

        setTimeout(() => {

            createOscillator(
                783.99,
                "sine",
                0.42,
                0.17,
                effectsBus
            );

        }, 200);
    }


    function bottleFound() {

        resume();

        createOscillator(
            392,
            "triangle",
            0.5,
            0.12,
            effectsBus
        );

        setTimeout(() => {

            createOscillator(
                523.25,
                "triangle",
                0.7,
                0.15,
                effectsBus
            );

        }, 180);
    }


    function mapOpen() {

        resume();

        createOscillator(
            329.63,
            "sine",
            0.4,
            0.10,
            effectsBus
        );

        setTimeout(() => {

            createOscillator(
                493.88,
                "sine",
                0.6,
                0.12,
                effectsBus
            );

        }, 180);

        setTimeout(() => {

            createOscillator(
                659.25,
                "sine",
                0.9,
                0.15,
                effectsBus
            );

        }, 350);
    }


    function transition() {

        resume();

        createOscillator(
            220,
            "sine",
            0.5,
            0.035,
            effectsBus
        );

        setTimeout(() => {

            createOscillator(
                330,
                "sine",
                0.6,
                0.045,
                effectsBus
            );

        }, 150);

        setTimeout(() => {

            createOscillator(
                440,
                "sine",
                0.8,
                0.055,
                effectsBus
            );

        }, 300);
    }


    function chestOpen() {

        resume();

        const notes = [
            261.63,
            329.63,
            392.00,
            523.25,
            659.25,
            783.99
        ];

        notes.forEach((note, index) => {

            setTimeout(() => {

                createOscillator(
                    note,
                    "sine",
                    0.8,
                    0.15,
                    effectsBus
                );

            }, index * 120);

        });
    }


    function treasure() {

        resume();

        const notes = [
            392,
            523.25,
            659.25,
            783.99,
            1046.50
        ];

        notes.forEach((note, index) => {

            setTimeout(() => {

                createOscillator(
                    note,
                    "sine",
                    1.6,
                    0.13,
                    effectsBus
                );

            }, index * 180);

        });
    }


    /* ========================================================
       VOLUME
       ======================================================== */

    function setMasterVolume(value) {

        if (!ctx || !master) return;

        const volume =
            Math.max(
                0,
                Math.min(1, Number(value))
            );

        master.gain.setTargetAtTime(
            volume,
            ctx.currentTime,
            0.08
        );
    }


    function setMusicVolume(value) {

        if (!ctx || !musicGain) return;

        musicGain.gain.setTargetAtTime(
            Number(value),
            ctx.currentTime,
            0.1
        );
    }


    function setAmbienceVolume(value) {

        if (!ctx || !ambienceGain) return;

        ambienceGain.gain.setTargetAtTime(
            Number(value),
            ctx.currentTime,
            0.1
        );
    }


    function setEffectsVolume(value) {

        if (!ctx || !effectsGain) return;

        effectsGain.gain.setTargetAtTime(
            Number(value),
            ctx.currentTime,
            0.1
        );
    }


    function mute() {

        enabled = false;

        if (master) {
            master.gain.value = 0;
        }
    }


    function unmute() {

        enabled = true;

        if (master) {
            master.gain.value = 0.72;
        }

        resume();
    }


    function toggle() {

        if (enabled) {
            mute();
        } else {
            unmute();
        }

        return enabled;
    }


    /* ========================================================
       API PUBLIQUE
       ======================================================== */

    return {

        init,
        resume,

        startMusic,
        stopMusic,

        startAmbience,
        clearAmbience,

        setEnvironment: startAmbience,

        button,
        correctAnswer,
        wrongAnswer,
        keyFound,

        bottleFound,
        mapOpen,

        transition,

        chestOpen,
        treasure,

        setMasterVolume,
        setMusicVolume,
        setAmbienceVolume,
        setEffectsVolume,

        mute,
        unmute,
        toggle

    };

})();


/* ============================================================
   API GLOBALE
   ============================================================ */

window.AudioEngine = AudioEngine;


/* ============================================================
   RACCOURCIS POUR GAME.JS
   ============================================================ */

window.initAudio = function() {

    return AudioEngine.resume();

};


window.startMusic = function() {

    return AudioEngine.resume();

};


window.setEnvironmentSound = function(environment) {

    return AudioEngine.setEnvironment(environment);

};


window.playKeySound = function() {

    return AudioEngine.keyFound();

};


window.playCorrectSound = function() {

    return AudioEngine.correctAnswer();

};


window.playWrongSound = function() {

    return AudioEngine.wrongAnswer();

};


window.playButtonSound = function() {

    return AudioEngine.button();

};


window.playBottleSound = function() {

    return AudioEngine.bottleFound();

};


window.playMapSound = function() {

    return AudioEngine.mapOpen();

};


window.playTransitionSound = function() {

    return AudioEngine.transition();

};


window.playChestSound = function() {

    return AudioEngine.chestOpen();

};


window.playTreasureSound = function() {

    return AudioEngine.treasure();

};


/* ============================================================
   LOG
   ============================================================ */

console.log(
    "🎵 MYSTERY LOVE ISLAND — audio.js chargé"
);
