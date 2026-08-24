/*
  MYSTERY LOVE ISLAND
  ADVENTURE.JS — moteur de jeu + rendu pixel-art procédural

  PRINCIPES :
  - déplacement automatique uniquement
  - aucune révélation du souvenir pendant l'aventure
  - le bouton indice ne révèle que la réponse
  - les explications des souvenirs restent secrètes
  - les 20 souvenirs sont révélés uniquement à la fin
*/

"use strict";

(() => {

  const $ = id => document.getElementById(id);

  const canvas = $("world");

  if (!canvas) return;

  const ctx = canvas.getContext("2d", {
    alpha: false
  });


  /* =========================================================
     DIMENSIONS DU MONDE
     ========================================================= */

  const W = 480;
  const H = 270;

  const WORLD_W = 4800;


  /* =========================================================
     NOMS DES ZONES
     ========================================================= */

  const names = [

    "LA PLAGE",
    "LA CRIQUE",
    "LA FORÊT",
    "LA FORÊT LUXURIANTE",
    "LES MONTAGNES",
    "LE LAC",
    "LE JARDIN",
    "LA VILLE",
    "LE CINÉMA",
    "LE VILLAGE",
    "LA CASCADE",
    "CANNES",
    "LE PARC",
    "LA NEIGE",
    "LE SOUVENIR",
    "NOËL",
    "IRIS",
    "LE STADE",
    "SOUS LES ÉTOILES",
    "LE COFFRE"

  ];


  const types = [

    "beach",
    "beach",
    "forest",
    "forest",
    "mountain",
    "lake",
    "garden",
    "city",
    "cinema",
    "village",
    "waterfall",
    "cannes",
    "park",
    "snow",
    "memory",
    "christmas",
    "iris",
    "stadium",
    "stars",
    "treasure"

  ];


  /* Position des 20 énigmes */

  const targets = Array.from(
    { length: 20 },
    (_, i) => 250 + i * 225
  );


  /* =========================================================
     ÉTAT DU JEU
     ========================================================= */

  const S = {

    started: false,

    scene: 0,

    keys: 0,

    x: 72,

    target: 250,

    walking: false,

    frame: 0,

    question: false,

    ending: false,

    introDone: false,

    arriving: false,

    last: 0,

    lines: [],

    li: 0,

    done: null,

    memoryTimer: null

  };


  /* =========================================================
     PALETTE
     ========================================================= */

  const COLORS = {

    ink: "#102033",

    deep: "#07131f",

    gold: "#f6cf67",

    cream: "#fff1bd",

    sand: "#e9cc7a",

    sea: "#3f9cc0",

    sea2: "#76c5d5",

    leaf: "#3d7e4c",

    leaf2: "#5b9854",

    trunk: "#6b432d",

    skin: "#efb28b",

    hair: "#34231f",

    pink: "#d56678",

    blue: "#263b5b"

  };


  /* =========================================================
     CANVAS
     ========================================================= */

  function resize() {

    const d =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width =
      Math.floor(
        innerWidth * d
      );

    canvas.height =
      Math.floor(
        innerHeight * d
      );

    canvas.style.imageRendering =
      "pixelated";

    ctx.imageSmoothingEnabled =
      false;

  }


  addEventListener(
    "resize",
    resize
  );

  resize();


  /* =========================================================
     UTILITAIRES
     ========================================================= */

  function show(
    id,
    on = true
  ) {

    $(id)?.classList.toggle(
      "hidden",
      !on
    );

  }


  function text(
    id,
    value
  ) {

    if ($(id))
      $(id).textContent = value;

  }


  function audio(
    name,
    argument
  ) {

    try {

      if (
        window.AudioEngine &&
        typeof window.AudioEngine[name] ===
        "function"
      ) {

        window.AudioEngine[name](
          argument
        );

      }

    } catch (e) {}

  }


  function norm(value) {

    return String(value || "")

      .toLowerCase()

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .replace(
        /[^a-z0-9]+/g,
        " "
      )

      .trim();

  }


  /* =========================================================
     HUD
     ========================================================= */

  function hud() {

    text(
      "keyCounter",
      `🔑 ${S.keys}/20`
    );

    text(
      "sceneBadge",
      names[
        Math.min(
          S.scene,
          19
        )
      ]
    );

    text(
      "mapKeys",
      `${S.keys} / 20`
    );

    text(

      "objective",

      S.scene === 19

        ? "Le dernier mystère t'attend…"

        : "Celena marche automatiquement vers le prochain mystère."

    );

  }


  /* =========================================================
     DIALOGUES
     ========================================================= */

  function say(
    lines,
    done
  ) {

    S.lines =
      lines;

    S.li =
      0;

    S.done =
      done ||
      null;

    show(
      "dialog",
      true
    );

    text(
      "dialogText",
      lines[0] || ""
    );

  }


  function next() {

    if (!S.lines.length)
      return;

    S.li++;

    audio(
      "button"
    );


    if (
      S.li >=
      S.lines.length
    ) {

      show(
        "dialog",
        false
      );

      const done =
        S.done;

      S.done =
        null;

      S.lines =
        [];

      if (done)
        done();

    }

    else {

      text(
        "dialogText",
        S.lines[S.li]
      );

    }

  }


  /* =========================================================
     DÉMARRAGE
     ========================================================= */

  function start() {

    if (S.started)
      return;

    S.started =
      true;

    show(
      "titleScreen",
      false
    );

    show(
      "gameScreen",
      true
    );

    audio(
      "resume"
    );

    audio(
      "startAmbience",
      "beach"
    );

    hud();


    say(

      [
        "Mais qu'est-ce que je fais ici ?"
      ],

      () => {

        S.target =
          250;

        S.walking =
          true;

      }

    );

  }


  /* =========================================================
     ARRIVÉE À UNE DESTINATION
     ========================================================= */

  function arrive() {

    if (S.arriving)
      return;

    S.arriving =
      true;

    S.walking =
      false;


    /*
      PREMIÈRE ARRIVÉE :
      bouteille + carte.
    */

    if (!S.introDone) {

      S.introDone =
        true;


      say(

        [

          "Une bouteille à la mer… échouée sur le sable.",

          "Elle l'ouvre. À l'intérieur, une vieille carte au trésor.",

          "« Trouve les 20 clés pour découvrir le trésor le plus inestimable. »"

        ],

        () => {

          show(
            "mapIntro",
            true
          );

          text(
            "objective",
            "La carte est trouvée. La chasse aux 20 clés commence."
          );

        }

      );

      return;

    }


    openQuestion();

  }


  /* =========================================================
     NOUVELLE ZONE
     ========================================================= */

  function beginScene(i) {

    if (
      i < 0 ||
      i >= 20
    )
      return;


    S.scene =
      i;


    S.x =
      Math.max(
        48,
        targets[i] - 165
      );


    S.target =
      targets[i];


    S.walking =
      true;


    S.arriving =
      false;


    hud();


    audio(
      "startAmbience",
      types[i]
    );

  }


  /* =========================================================
     QUESTION
     ========================================================= */

  function openQuestion() {

    if (
      S.question ||
      S.ending
    )
      return;


    const q =
      GAME_DATA.questions[
        S.scene
      ];


    if (!q)
      return;


    S.question =
      true;


    show(
      "questionScreen",
      true
    );


    text(
      "questionNumber",
      `ÉNIGME ${q.id}/20`
    );


    text(
      "questionText",
      q.question
    );


    text(
      "answerFeedback",
      ""
    );


    if (
      $("answerInput")
    ) {

      $("answerInput").value =
        "";

    }


    setTimeout(
      () =>
        $("answerInput")?.focus(),
      120
    );

  }


  /* =========================================================
     INDICE

     IMPORTANT :
     L'explication du souvenir NE DOIT PAS être montrée ici.
     ========================================================= */

  function reveal() {

    const q =
      GAME_DATA.questions[
        S.scene
      ];


    if (!q)
      return;


    text(

      "answerFeedback",

      `💡 Réponse : ${q.answer}`

    );

  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validate() {

    if (!S.question)
      return;


    const q =
      GAME_DATA.questions[
        S.scene
      ];


    if (!q)
      return;


    const v =
      norm(
        $("answerInput")?.value
      );


    const accepted =
      (
        q.acceptedAnswers ||
        [q.answer]
      )
        .map(norm);


    const ok =

      accepted.includes(v)

      ||

      norm(q.answer) === v;


    if (!ok) {

      text(

        "answerFeedback",

        "❌ Mauvaise réponse. Essaie encore."

      );


      audio(
        "wrongAnswer"
      );


      return;

    }


    /* ================================================
       BONNE RÉPONSE
       ================================================ */

    S.question =
      false;


    S.keys++;


    show(
      "questionScreen",
      false
    );


    audio(
      "keyFound"
    );


    hud();


    /*
      TRÈS IMPORTANT :

      q.explanation N'EST PAS UTILISÉ ICI.

      Le joueur obtient uniquement la clé.
      Le souvenir reste secret jusqu'au coffre.
    */

    say(

      [
        `Bravo ! 🔑 Clé ${S.keys}/20 obtenue.`
      ],

      () => {

        if (
          S.keys === 20
        ) {

          openChest();

        }

        else {

          beginScene(
            S.scene + 1
          );

        }

      }

    );

  }


  /* =========================================================
     COFFRE FINAL
     ========================================================= */

  function openChest() {

    S.ending =
      true;

    S.walking =
      false;


    show(
      "chestScreen",
      true
    );


    audio(
      "startAmbience",
      "treasure"
    );


    const orbit =
      $("keyOrbit");


    if (!orbit)
      return;


    orbit.innerHTML =
      "";


    for (
      let i = 0;
      i < 20;
      i++
    ) {

      const k =
        document.createElement(
          "span"
        );


      k.textContent =
        "🔑";


      k.style.setProperty(
        "--i",
        i
      );


      k.className =
        "orbit-key";


      orbit.appendChild(
        k
      );

    }

  }


  /* =========================================================
     OUVERTURE DU COFFRE
     ========================================================= */

  function chest() {

    audio(
      "chestOpen"
    );


    $("chestGraphic")
      ?.classList
      .add("open");


    setTimeout(

      () => {

        show(
          "chestScreen",
          false
        );


        memories();

      },

      1800

    );

  }


  /* =========================================================
     RÉVÉLATION FINALE DES 20 SOUVENIRS
     ========================================================= */

  function memories() {

    const list =
      $("memoryList");


    if (!list)
      return;


    list.innerHTML =
      "";


    show(
      "memoriesScreen",
      true
    );


    $("treasureBtn")
      ?.classList
      .add("hidden");


    const memories =
      GAME_DATA.memories
        .slice(0,20);


    let i =
      0;


    function addOne() {

      if (
        i >=
        memories.length
      ) {

        $("treasureBtn")
          ?.classList
          .remove("hidden");

        return;

      }


      const m =
        memories[i];


      const article =
        document.createElement(
          "article"
        );


      article.className =
        "memory-item reveal-memory memory-reveal-in";


      article.innerHTML =

        `

        <span class="memory-icon">

          ${m.icon || "♥"}

        </span>

        <div>

          <strong>

            ${i + 1}.
            ${m.titleShort || m.title}

          </strong>

          <p>

            ${m.text || ""}

          </p>

        </div>

        `;


      list.appendChild(
        article
      );


      i++;


      setTimeout(
        addOne,
        180
      );

    }


    setTimeout(
      addOne,
      700
    );


    $("treasureBtn").onclick =

      () =>
        location.href =
          GAME_DATA.treasureLink;

  }


  /* =========================================================
     OUTILS PIXEL ART
     ========================================================= */

  function px(
    x,
    y,
    w,
    h,
    c
  ) {

    ctx.fillStyle =
      c;


    ctx.fillRect(

      Math.round(x),
      Math.round(y),
      Math.round(w),
      Math.round(h)

    );

  }


  function poly(
    points,
    c
  ) {

    ctx.fillStyle =
      c;


    ctx.beginPath();


    ctx.moveTo(
      points[0],
      points[1]
    );


    for (
      let i = 2;
      i < points.length;
      i += 2
    ) {

      ctx.lineTo(
        points[i],
        points[i + 1]
      );

    }


    ctx.closePath();

    ctx.fill();

  }


  function circle(
    x,
    y,
    r,
    c
  ) {

    ctx.fillStyle =
      c;


    ctx.beginPath();


    ctx.arc(
      x,
      y,
      r,
      0,
      Math.PI * 2
    );


    ctx.fill();

  }


  function line(
    x1,
    y1,
    x2,
    y2,
    c,
    w = 2
  ) {

    ctx.strokeStyle =
      c;


    ctx.lineWidth =
      w;


    ctx.beginPath();


    ctx.moveTo(
      x1,
      y1
    );


    ctx.lineTo(
      x2,
      y2
    );


    ctx.stroke();

  }


  /* =========================================================
     ÉTOILES
     ========================================================= */

  function stars(
    seed,
    count,
    top,
    bottom
  ) {

    for (
      let i = 0;
      i < count;
      i++
    ) {

      const x =
        (
          seed * 31 +
          i * 83
        ) % WORLD_W;


      const y =
        top +
        (
          (
            i * 47 +
            seed * 17
          )
          %
          Math.max(
            1,
            bottom - top
          )
        );


      const s =
        i % 3 === 0
          ? 2
          : 1;


      px(

        x,
        y,
        s,
        s,

        i % 4 === 0
          ? COLORS.gold
          : COLORS.cream

      );

    }

  }


  /* =========================================================
     NUAGES
     ========================================================= */

  function clouds(
    offset
  ) {

    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const x =
        offset +
        i * 260;


      circle(
        x,
        55,
        13,
        "#dff4f4"
      );


      circle(
        x + 15,
        51,
        18,
        "#eaf8f8"
      );


      circle(
        x + 34,
        57,
        11,
        "#dff4f4"
      );


      px(
        x - 2,
        58,
        39,
        9,
        "#e5f6f5"
      );

    }

  }


  /* =========================================================
     PALMIER
     ========================================================= */

  function palm(
    x,
    base,
    s = 1
  ) {

    poly(

      [
        x - 5*s,
        base,

        x + 6*s,
        base,

        x + 14*s,
        base - 92*s,

        x + 3*s,
        base - 96*s

      ],

      "#70472f"

    );


    poly(

      [
        x + 8*s,
        base - 92*s,

        x - 45*s,
        base - 120*s,

        x - 52*s,
        base - 114*s,

        x + 3*s,
        base - 88*s

      ],

      "#3b7e48"

    );


    poly(

      [
        x + 9*s,
        base - 92*s,

        x + 55*s,
        base - 125*s,

        x + 62*s,
        base - 118*s,

        x + 16*s,
        base - 86*s

      ],

      "#4e914d"

    );


    poly(

      [
        x + 8*s,
        base - 94*s,

        x + 28*s,
        base - 145*s,

        x + 35*s,
        base - 145*s,

        x + 16*s,
        base - 91*s

      ],

      "#4a8d4a"

    );


    poly(

      [
        x + 6*s,
        base - 94*s,

        x - 5*s,
        base - 144*s,

        x + 2*s,
        base - 146*s,

        x + 13*s,
        base - 94*s

      ],

      "#5b9b50"

    );

  }


  /* =========================================================
     ARBRE
     ========================================================= */

  function broadleafTree(
    x,
    base,
    s = 1
  ) {

    px(
      x - 7*s,
      base - 78*s,
      14*s,
      78*s,
      "#66432d"
    );


    circle(
      x - 25*s,
      base - 92*s,
      26*s,
      "#2f7042"
    );


    circle(
      x + 2*s,
      base - 105*s,
      32*s,
      "#3e8248"
    );


    circle(
      x + 30*s,
      base - 88*s,
      25*s,
      "#4d914d"
    );


    circle(
      x - 2*s,
      base - 125*s,
      22*s,
      "#5b9a50"
    );

  }


  /* =========================================================
     MONTAGNES
     ========================================================= */

  function mountainRange(
    offset,
    snowy = false
  ) {

    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const x =
        offset +
        i * 360;


      poly(

        [
          x,
          205,

          x + 120,
          80,

          x + 240,
          205

        ],

        i % 2
          ? "#416b6d"
          : "#355c61"

      );


      poly(

        [
          x + 120,
          80,

          x + 88,
          118,

          x + 120,
          105,

          x + 154,
          120

        ],

        snowy
          ? "#f4f1e1"
          : "#5b7776"

      );


      poly(

        [
          x + 120,
          80,

          x + 145,
          205,

          x + 240,
          205

        ],

        "#2e5359"

      );

    }

  }


  /* =========================================================
     EAU
     ========================================================= */

  function water(
    x,
    y,
    w,
    h
  ) {

    px(
      x,
      y,
      w,
      h,
      COLORS.sea
    );


    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const yy =
        y +
        12 +
        i * 19;


      for (
        let j = 0;
        j < 8;
        j++
      ) {

        line(

          x + j*110,
          yy,

          x + j*110 + 55,
          yy + 3,

          "#73c7d7",
          2

        );

      }

    }

  }


  /* =========================================================
     ENVIRONNEMENTS
     ========================================================= */

  function drawEnvironment(
    type,
    cam
  ) {

    let sky =
      "#79bfd4";


    let ground =
      COLORS.sand;


    if (
      type === "forest" ||
      type === "garden" ||
      type === "village"
    ) {

      sky =
        "#6a9b8c";

      ground =
        "#507b49";

    }


    if (
      type === "mountain" ||
      type === "lake" ||
      type === "waterfall"
    ) {

      sky =
        "#6f9fb3";

      ground =
        "#6f8069";

    }


    if (

      [

        "snow",
        "christmas",
        "memory",
        "iris",
        "stars",
        "treasure"

      ].includes(type)

    ) {

      sky =
        "#172743";

      ground =
        "#493d50";

    }


    px(
      0,
      0,
      WORLD_W,
      H,
      sky
    );


    /* =====================================================
       PLAGE / CANNES / PARC
       ===================================================== */

    if (

      [
        "beach",
        "cannes",
        "park"
      ].includes(type)

    ) {

      water(
        0,
        155,
        WORLD_W,
        78
      );


      px(
        0,
        233,
        WORLD_W,
        37,
        ground
      );


      clouds(
        cam - 80
      );


      for (
        let i = 0;
        i < 18;
        i++
      ) {

        palm(
          cam - 120 + i*290,
          258,
          .65 +
          (i%3)*.08
        );

      }

    }


    /* =====================================================
       FORÊT / JARDIN / VILLAGE
       ===================================================== */

    else if (

      type === "forest" ||
      type === "garden" ||
      type === "village"

    ) {

      px(
        0,
        205,
        WORLD_W,
        65,
        ground
      );


      for (
        let i = 0;
        i < 24;
        i++
      ) {

        broadleafTree(

          cam - 80 + i*220,
          245,

          .62 +
          (i%4)*.08

        );

      }


      if (
        type === "garden"
      ) {

        for (
          let i = 0;
          i < 14;
          i++
        ) {

          const x =
            cam +
            40 +
            i*170;


          circle(
            x,
            229,
            5,
            "#e9788c"
          );


          circle(
            x + 8,
            232,
            4,
            "#f5c55f"
          );

        }

      }


      if (
        type === "village"
      ) {

        for (
          let i = 0;
          i < 7;
          i++
        ) {

          const x =
            cam +
            30 +
            i*190;


          px(
            x,
            177,
            72,
            62,
            "#c68b5d"
          );


          poly(

            [
              x - 8,
              177,

              x + 36,
              145,

              x + 80,
              177

            ],

            "#7a4936"

          );


          px(
            x + 12,
            192,
            15,
            16,
            "#6d4932"
          );


          px(
            x + 45,
            190,
            12,
            11,
            "#e6c76d"
          );

        }

      }

    }


    /* =====================================================
       MONTAGNES / CASCADE
       ===================================================== */

    else if (

      type === "mountain" ||
      type === "waterfall"

    ) {

      px(
        0,
        205,
        WORLD_W,
        65,
        ground
      );


      mountainRange(
        cam - 120,
        type === "mountain"
      );


      if (
        type === "waterfall"
      ) {

        px(
          cam + 650,
          130,
          42,
          75,
          "#9fe0e4"
        );


        px(
          cam + 662,
          130,
          9,
          75,
          "#eaffff"
        );


        poly(

          [
            cam + 650,
            205,

            cam + 690,
            205,

            cam + 720,
            240,

            cam + 620,
            240

          ],

          "#62a5a2"

        );

      }

    }


    /* =====================================================
       LAC
       ===================================================== */

    else if (
      type === "lake"
    ) {

      px(
        0,
        195,
        WORLD_W,
        75,
        "#557c72"
      );


      water(
        0,
        145,
        WORLD_W,
        70
      );


      mountainRange(
        cam - 180,
        false
      );


      for (
        let i = 0;
        i < 8;
        i++
      ) {

        broadleafTree(
          cam + i*280,
          258,
          .7
        );

      }

    }


    /* =====================================================
       VILLE / CINÉMA
       ===================================================== */

    else if (

      type === "city" ||
      type === "cinema"

    ) {

      px(
        0,
        215,
        WORLD_W,
        55,
        "#55545e"
      );


      for (
        let i = 0;
        i < 12;
        i++
      ) {

        const x =
          cam +
          i*150;


        const bh =
          65 +
          (i%4)*25;


        px(
          x,
          215-bh,
          80,
          bh,
          "#33465a"
        );


        for (
          let r = 0;
          r < 3;
          r++
        ) {

          for (
            let c = 0;
            c < 3;
            c++
          ) {

            px(

              x + 12 + c*20,
              230-bh + r*20,

              8,
              10,

              "#f0ca66"

            );

          }

        }

      }


      if (
        type === "cinema"
      ) {

        px(
          cam + 720,
          150,
          170,
          65,
          "#8a3e55"
        );


        px(
          cam + 740,
          164,
          130,
          35,
          "#241a25"
        );


        for (
          let i = 0;
          i < 8;
          i++
        ) {

          px(
            cam + 748 + i*15,
            169,
            7,
            4,
            "#f2c96d"
          );

        }

      }

    }


    /* =====================================================
       NEIGE
       ===================================================== */

    else if (
      type === "snow"
    ) {

      px(
        0,
        210,
        WORLD_W,
        60,
        "#e7e4da"
      );


      mountainRange(
        cam - 120,
        true
      );


      for (
        let i = 0;
        i < 100;
        i++
      ) {

        const x =
          (
            cam*.3 +
            i*53
          ) % WORLD_W;


        const y =
          35 +
          (i*37)%180;


        px(
          x,
          y,
          2,
          2,
          "#fff"
        );

      }


      for (
        let i = 0;
        i < 12;
        i++
      ) {

        broadleafTree(
          cam + i*270,
          258,
          .6
        );

      }

    }


    /* =====================================================
       NOËL
       ===================================================== */

    else if (
      type === "christmas"
    ) {

      px(
        0,
        205,
        WORLD_W,
        65,
        "#dfe7ed"
      );


      for (
        let i = 0;
        i < 8;
        i++
      ) {

        const x =
          cam +
          60 +
          i*300;


        poly(

          [
            x,
            205,

            x + 45,
            105,

            x + 90,
            205

          ],

          "#28563e"

        );


        poly(

          [
            x + 45,
            105,

            x + 65,
            155,

            x + 25,
            155

          ],

          "#34714d"

        );


        for (
          let j = 0;
          j < 6;
          j++
        ) {

          circle(

            x + 22 + j*8,
            165 + (j%2)*13,
            3,

            j%2
              ? "#f06f78"
              : "#f4cc5c"

          );

        }

      }


      stars(
        16,
        35,
        25,
        150
      );

    }


    /* =====================================================
       SOUVENIR / IRIS
       ===================================================== */

    else if (

      type === "memory" ||
      type === "iris"

    ) {

      px(
        0,
        205,
        WORLD_W,
        65,
        "#59455d"
      );


      stars(
        22,
        45,
        28,
        180
      );


      for (
        let i = 0;
        i < 9;
        i++
      ) {

        const x =
          cam +
          50 +
          i*280;


        circle(
          x,
          192,
          35,
          "#6b4b75"
        );


        circle(
          x - 9,
          190,
          9,
          "#f1b18b"
        );


        circle(
          x + 9,
          190,
          9,
          "#f1b18b"
        );


        circle(
          x,
          190,
          12,
          "#d56878"
        );

      }


      if (
        type === "iris"
      ) {

        for (
          let i = 0;
          i < 16;
          i++
        ) {

          const x =
            cam +
            30 +
            i*150;


          circle(
            x,
            235,
            6,
            "#8c5aa3"
          );


          circle(
            x + 5,
            232,
            6,
            "#a66ac0"
          );

        }

      }

    }


    /* =====================================================
       STADE
       ===================================================== */

    else if (
      type === "stadium"
    ) {

      px(
        0,
        210,
        WORLD_W,
        60,
        "#467247"
      );


      px(
        cam + 120,
        105,
        330,
        105,
        "#8c8d92"
      );


      poly(

        [
          cam + 100,
          210,

          cam + 470,
          210,

          cam + 430,
          150,

          cam + 140,
          150

        ],

        "#4d9b56"

      );


      for (
        let i = 0;
        i < 10;
        i++
      ) {

        circle(
          cam + 130 + i*34,
          135,
          4,
          "#f0d06a"
        );

      }


      px(
        cam + 250,
        185,
        75,
        25,
        "#6b8cc0"
      );

    }


    /* =====================================================
       NUIT / ÉTOILES
       ===================================================== */

    else if (
      type === "stars"
    ) {

      px(
        0,
        215,
        WORLD_W,
        55,
        "#2c2438"
      );


      stars(
        29,
        90,
        18,
        205
      );


      circle(
        cam + 760,
        70,
        25,
        "#f7e6b0"
      );


      circle(
        cam + 770,
        63,
        25,
        "#172743"
      );


      for (
        let i = 0;
        i < 10;
        i++
      ) {

        broadleafTree(
          cam + i*280,
          258,
          .55
        );

      }

    }


    /* =====================================================
       TRÉSOR
       ===================================================== */

    else if (
      type === "treasure"
    ) {

      px(
        0,
        215,
        WORLD_W,
        55,
        "#33263c"
      );


      stars(
        41,
        90,
        18,
        205
      );


      circle(
        cam + 740,
        65,
        27,
        "#f7e5ad"
      );


      circle(
        cam + 750,
        58,
        27,
        "#172743"
      );


      for (
        let i = 0;
        i < 8;
        i++
      ) {

        broadleafTree(
          cam + i*310,
          258,
          .55
        );

      }

    }


    /* petits détails au sol */

    for (
      let i = 0;
      i < 20;
      i++
    ) {

      const x =
        cam - 50 + i*130;


      px(

        x,
        251 + (i%3)*4,
        7,
        2,

        type === "snow"
          ? "#c9c9c2"
          : "#3d5b3d"

      );

    }

  }


  /* =========================================================
     BOUTEILLE
     ========================================================= */

  function drawBottle(
    x,
    y
  ) {

    circle(
      x,
      y,
      12,
      "#d7ebd7"
    );


    px(
      x - 6,
      y - 2,
      12,
      13,
      "#9ac6bf"
    );


    px(
      x - 3,
      y - 19,
      6,
      10,
      "#c4d9c7"
    );


    px(
      x - 6,
      y - 23,
      12,
      5,
      "#714b31"
    );


    px(
      x - 4,
      y + 3,
      8,
      5,
      "#f5e5a2"
    );

  }


  /* =========================================================
     CLÉ LUMINEUSE
     ========================================================= */

  function drawKey(
    x,
    y,
    pulse = 0
  ) {

    const glow =
      3 +
      Math.sin(pulse)*2;


    circle(
      x,
      y,
      13 + glow,
      "rgba(255,215,91,.13)"
    );


    ctx.save();


    ctx.translate(
      x,
      y
    );


    ctx.rotate(
      -0.15
    );


    circle(
      0,
      -10,
      7,
      COLORS.gold
    );


    circle(
      0,
      -10,
      3,
      "#49301d"
    );


    px(
      -2,
      -4,
      4,
      25,
      COLORS.gold
    );


    px(
      2,
      8,
      11,
      4,
      COLORS.gold
    );


    px(
      2,
      15,
      7,
      4,
      COLORS.gold
    );


    ctx.restore();

  }


  /* =========================================================
     CELENA — PERSONNAGE
     ========================================================= */

  function drawCelena(
    x,
    base,
    frame
  ) {

    const moving =
      S.walking;


    const phase =
      moving
        ? Math.sin(
            frame*1.7
          )
        : 0;


    const leg =
      phase*5;


    const arm =
      -phase*3;


    /* ombre */

    circle(
      x,
      base + 4,
      19,
      "rgba(25,25,30,.25)"
    );


    /* jambes */

    px(
      x - 11 + leg,
      base - 35,
      9,
      35,
      COLORS.blue
    );


    px(
      x + 2 - leg,
      base - 35,
      9,
      35,
      COLORS.blue
    );


    /* chaussures */

    px(
      x - 14 + leg,
      base - 3,
      13,
      6,
      "#18243a"
    );


    px(
      x + 2 - leg,
      base - 3,
      13,
      6,
      "#18243a"
    );


    /* corps */

    px(
      x - 17,
      base - 80,
      34,
      48,
      COLORS.pink
    );


    px(
      x - 17,
      base - 33,
      34,
      10,
      "#ba5365"
    );


    /* bras */

    px(
      x - 25,
      base - 75 + arm,
      8,
      29,
      COLORS.skin
    );


    px(
      x + 17,
      base - 75 - arm,
      8,
      29,
      COLORS.skin
    );


    /* sac à dos */

    px(
      x + 18,
      base - 78,
      10,
      34,
      "#745036"
    );


    px(
      x + 23,
      base - 69,
      8,
      22,
      "#8c6039"
    );


    /* cou */

    px(
      x - 6,
      base - 90,
      12,
      13,
      COLORS.skin
    );


    /* visage */

    px(
      x - 19,
      base - 118,
      38,
      31,
      COLORS.skin
    );


    /* cheveux */

    px(
      x - 20,
      base - 121,
      40,
      17,
      COLORS.hair
    );


    px(
      x - 22,
      base - 113,
      8,
      25,
      COLORS.hair
    );


    px(
      x + 14,
      base - 113,
      8,
      25,
      COLORS.hair
    );


    px(
      x - 16,
      base - 126,
      32,
      8,
      COLORS.hair
    );


    /* yeux */

    px(
      x - 10,
      base - 103,
      3,
      3,
      "#241b1a"
    );


    px(
      x + 7,
      base - 103,
      3,
      3,
      "#241b1a"
    );


    /* bouche */

    px(
      x - 3,
      base - 95,
      7,
      2,
      "#b55d68"
    );


    /* chapeau aventurière */

    px(
      x - 24,
      base - 128,
      48,
      7,
      "#d9aa59"
    );


    px(
      x - 17,
      base - 139,
      34,
      12,
      "#e8c16f"
    );


    px(
      x - 11,
      base - 138,
      24,
      5,
      "#c28a40"
    );

  }


  /* =========================================================
     COFFRE
     ========================================================= */

  function drawChest(
    x,
    y,
    open
  ) {

    ctx.save();


    ctx.shadowColor =
      "#f6ce63";


    ctx.shadowBlur =
      18;


    /* coffre */

    px(
      x - 48,
      y - 8,
      96,
      40,
      "#6d3f25"
    );


    px(
      x - 43,
      y - 13,
      86,
      10,
      "#a6662e"
    );


    px(
      x - 42,
      y - 4,
      84,
      27,
      "#81502a"
    );


    for (
      let i = -30;
      i <= 30;
      i += 15
    ) {

      px(
        x + i,
        y - 1,
        4,
        24,
        "#b87935"
      );

    }


    px(
      x - 6,
      y + 4,
      12,
      17,
      COLORS.gold
    );


    if (open) {

      poly(

        [
          x - 43,
          y - 13,

          x - 32,
          y - 58,

          x + 32,
          y - 58,

          x + 43,
          y - 13

        ],

        "#a86a31"

      );


      poly(

        [
          x - 30,
          y - 17,

          x - 20,
          y - 49,

          x + 20,
          y - 49,

          x + 30,
          y - 17

        ],

        "#f4c85d"

      );


      for (
        let i = 0;
        i < 14;
        i++
      ) {

        const a =
          i /
          14 *
          Math.PI *
          2;


        circle(

          x +
          Math.cos(a)*70,

          y - 30 +
          Math.sin(a)*32,

          3,

          COLORS.gold

        );

      }

    }


    ctx.restore();

  }


  /* =========================================================
     MONDE
     ========================================================= */

  function drawWorld() {

    const d =
      Math.max(
        innerWidth / W,
        innerHeight / H
      );


    const sw =
      innerWidth / d;


    const sh =
      innerHeight / d;


    const maxCam =
      Math.max(
        0,
        WORLD_W - sw
      );


    const cam =
      Math.max(

        0,

        Math.min(

          maxCam,

          S.x -
          sw*0.48

        )

      );


    ctx.setTransform(
      d,
      0,
      0,
      d,
      0,
      0
    );


    ctx.clearRect(
      0,
      0,
      sw,
      sh
    );


    ctx.imageSmoothingEnabled =
      false;


    ctx.save();


    ctx.translate(
      -cam,
      0
    );


    drawEnvironment(
      types[S.scene],
      cam
    );


    /* bouteille */

    if (
      S.scene === 0 &&
      !S.introDone
    ) {

      drawBottle(
        250,
        220
      );

    }


    /* clé */

    else if (
      !S.ending
    ) {

      drawKey(
        targets[S.scene],
        214,
        S.frame
      );

    }


    /* coffre */

    if (
      S.scene === 19 &&
      S.ending
    ) {

      drawChest(
        S.x + 100,
        215,
        true
      );

    }


    /* personnage */

    drawCelena(
      S.x,
      224,
      S.frame
    );


    ctx.restore();

  }


  /* =========================================================
     CARTE
     ========================================================= */

  function drawMap() {

    const m =
      $("mapCanvas");


    if (!m)
      return;


    const r =
      m.getBoundingClientRect();


    const d =
      Math.min(
        devicePixelRatio || 1,
        2
      );


    m.width =
      Math.floor(
        r.width*d
      );


    m.height =
      Math.floor(
        r.height*d
      );


    const c =
      m.getContext("2d");


    c.setTransform(
      d,
      0,
      0,
      d,
      0,
      0
    );


    c.imageSmoothingEnabled =
      false;


    /* mer */

    c.fillStyle =
      "#6fa9b0";


    c.fillRect(
      0,
      0,
      r.width,
      r.height
    );


    /* île */

    c.fillStyle =
      "#d9c68b";


    c.beginPath();


    c.moveTo(
      r.width*.08,
      r.height*.68
    );


    c.quadraticCurveTo(
      r.width*.15,
      r.height*.15,
      r.width*.55,
      r.height*.10
    );


    c.quadraticCurveTo(
      r.width*.93,
      r.height*.15,
      r.width*.86,
      r.height*.75
    );


    c.quadraticCurveTo(
      r.width*.45,
      r.height*.98,
      r.width*.08,
      r.height*.68
    );


    c.fill();


    /* végétation */

    for (
      let i = 0;
      i < 35;
      i++
    ) {

      const x =
        r.width*
        (
          .12 +
          ((i*37)%76)/100
        );


      const y =
        r.height*
        (
          .15 +
          ((i*53)%65)/100
        );


      c.fillStyle =
        i%3
          ? "#4c884c"
          : "#356d43";


      c.fillRect(
        x,
        y,
        6+(i%3)*3,
        5+(i%2)*3
      );

    }


    /* chemin */

    const pts=[];


    for (
      let i=0;
      i<20;
      i++
    ) {

      const px =
        r.width*
        (
          .15+
          (i%5)*.17
        );


      const py =
        r.height*
        (
          .80-
          Math.floor(i/5)*.16
        );


      pts.push([
        px,
        py
      ]);

    }


    c.strokeStyle =
      "#fff0ae";


    c.lineWidth =
      3;


    c.setLineDash([
      4,
      7
    ]);


    c.beginPath();


    pts.forEach(
      (p,i) => {

        if (i)
          c.lineTo(
            p[0],
            p[1]
          );

        else
          c.moveTo(
            p[0],
            p[1]
          );

      }
    );


    c.stroke();


    c.setLineDash([]);


    /* points */

    pts.forEach(
      (p,i) => {

        c.fillStyle =
          i<S.keys
            ? "#e6b944"
            : "#fff0ae";


        c.beginPath();


        c.arc(
          p[0],
          p[1],
          10,
          0,
          Math.PI*2
        );


        c.fill();


        c.fillStyle =
          "#3c2a1b";


        c.font =
          "bold 9px monospace";


        c.textAlign =
          "center";


        c.textBaseline =
          "middle";


        c.fillText(
          i+1,
          p[0],
          p[1]
        );

      }
    );

  }


  /* =========================================================
     BOUCLE
     ========================================================= */

  function loop(t) {

    const dt =
      Math.min(

        .04,

        (
          t-S.last
        )/1000 || 0

      );


    S.last =
      t;


    if (

      S.started &&
      !S.question &&
      !S.ending &&
      S.walking

    ) {

      const dx =
        S.target -
        S.x;


      if (
        Math.abs(dx)<2
      ) {

        S.x =
          S.target;


        S.walking =
          false;


        if (!S.arriving) {

          setTimeout(
            arrive,
            260
          );

        }

      }

      else {

        S.x +=

          Math.sign(dx) *
          (
            48 +
            S.scene*.7
          ) *
          dt;


        S.frame +=
          dt*9;

      }

    }

    else if (
      S.started
    ) {

      S.frame +=
        dt*1.5;

    }


    drawWorld();


    requestAnimationFrame(
      loop
    );

  }


  /* =========================================================
     ÉVÉNEMENTS
     ========================================================= */

  $("startBtn")
    ?.addEventListener(
      "click",
      start
    );


  $("dialogNext")
    ?.addEventListener(
      "click",
      next
    );


  $("validateBtn")
    ?.addEventListener(
      "click",
      validate
    );


  $("revealBtn")
    ?.addEventListener(
      "click",
      reveal
    );


  $("answerInput")
    ?.addEventListener(
      "keydown",
      e => {

        if (
          e.key === "Enter"
        )
          validate();

      }
    );


  $("openChestBtn")
    ?.addEventListener(
      "click",
      chest
    );


  $("mapContinue")
    ?.addEventListener(
      "click",
      () => {

        show(
          "mapIntro",
          false
        );


        beginScene(
          0
        );

      }
    );


  $("mapBtn")
    ?.addEventListener(
      "click",
      () => {

        show(
          "mapScreen",
          true
        );


        drawMap();

      }
    );


  $("closeMapBtn")
    ?.addEventListener(
      "click",
      () =>
        show(
          "mapScreen",
          false
        )
    );


  addEventListener(
    "resize",
    () => {

      if (
        !$("mapScreen")
          ?.classList
          .contains("hidden")
      ) {

        drawMap();

      }

    }
  );


  /* =========================================================
     API
     ========================================================= */

  window.MysteryLoveIsland = {

    getState:
      () => S,

    start,

    interact:
      arrive

  };


  requestAnimationFrame(
    loop
  );

})();
