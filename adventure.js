/*
============================================================
MYSTERY LOVE ISLAND
ADVENTURE.JS — VERSION PIXEL ART CELENA
============================================================
- déplacement automatique
- caméra fluide
- vrai rendu pixel art basse résolution
- Celena dessinée en sprite pixel détaillé
- 20 scènes / 20 clés
- aucune correspondance souvenir pendant l'aventure
- souvenirs uniquement après l'ouverture du coffre
- compatible avec GAME_DATA.questions / GAME_DATA.memories
============================================================
*/

"use strict";

(() => {
  const $ = id => document.getElementById(id);
  const canvas = $("world");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = false;

  /* --------------------------------------------------------
     PIXEL BUFFER
  -------------------------------------------------------- */

  const VW = 320;
  const VH = 180;

  const buffer = document.createElement("canvas");
  buffer.width = VW;
  buffer.height = VH;

  const g = buffer.getContext("2d", { alpha: false });
  g.imageSmoothingEnabled = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
      Math.max(1, Math.floor(innerWidth * dpr));

    canvas.height =
      Math.max(1, Math.floor(innerHeight * dpr));

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    ctx.imageSmoothingEnabled = false;
  }

  addEventListener("resize", resize);
  resize();


  /* --------------------------------------------------------
     PALETTE
  -------------------------------------------------------- */

  const C = {

    sky:"#68b9d6",
    sky2:"#b8e0df",

    sea:"#2588aa",
    sea2:"#55b8c8",

    sand:"#e9cb76",
    sand2:"#f5dc91",
    sand3:"#c59b4d",

    grass:"#477d4b",
    grass2:"#639851",
    grass3:"#82ae5d",
    darkGrass:"#2b5d3d",

    trunk:"#70462e",
    trunkDark:"#4a2e22",

    stone:"#68767b",
    stone2:"#94a2a4",
    stoneDark:"#46535a",

    wood:"#75471f",
    wood2:"#a96b31",

    gold:"#f7ca55",
    gold2:"#ffe69a",

    skin:"#efad88",
    skin2:"#ffd0a8",
    skin3:"#d4846d",

    hair:"#3a211d",
    hair2:"#62382a",
    hair3:"#8b5639",

    shirt:"#d55b75",
    shirt2:"#ed7488",
    shirtDark:"#9e3f56",

    pants:"#29415f",
    pants2:"#3e5c7c",

    boots:"#202c42",

    white:"#fff5dc",
    ink:"#171d26",
    night:"#202b4b",

    purple:"#635485"
  };


  /* --------------------------------------------------------
     NOMS DES ZONES
  -------------------------------------------------------- */

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


  const envs = [

    "beach",
    "cove",
    "forest",
    "forest2",
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


  /* --------------------------------------------------------
     POSITIONS DES 20 DESTINATIONS
  -------------------------------------------------------- */

  const targets =
    Array.from(
      { length:20 },
      (_,i) => 260 + i * 285
    );


  /* --------------------------------------------------------
     ÉTAT DU JEU
  -------------------------------------------------------- */

  const S = {

    started:false,

    scene:0,

    keys:0,

    x:70,

    target:260,

    camera:0,

    walking:false,

    walkFrame:0,

    walkClock:0,

    arriving:false,

    question:false,

    ending:false,

    introDone:false,

    dialogLines:[],

    dialogIndex:0,

    dialogDone:null,

    last:0

  };


  /* ========================================================
     OUTILS DE DESSIN
  ======================================================== */

  function rect(x,y,w,h,c) {

    g.fillStyle = c;

    g.fillRect(
      Math.round(x),
      Math.round(y),
      Math.round(w),
      Math.round(h)
    );

  }


  function poly(points,c) {

    g.fillStyle = c;

    g.beginPath();

    g.moveTo(
      points[0][0],
      points[0][1]
    );

    for(
      let i=1;
      i<points.length;
      i++
    ) {

      g.lineTo(
        points[i][0],
        points[i][1]
      );

    }

    g.closePath();

    g.fill();

  }


  function circle(x,y,r,c) {

    g.fillStyle = c;

    g.beginPath();

    g.arc(
      x,
      y,
      r,
      0,
      Math.PI * 2
    );

    g.fill();

  }


  function line(
    x1,
    y1,
    x2,
    y2,
    c,
    w=1
  ) {

    g.strokeStyle = c;

    g.lineWidth = w;

    g.beginPath();

    g.moveTo(x1,y1);

    g.lineTo(x2,y2);

    g.stroke();

  }


  function setText(id,v) {

    const el = $(id);

    if (el) {

      el.textContent = v;

    }

  }


  function show(id,on=true) {

    const el = $(id);

    if (el) {

      el.classList.toggle(
        "hidden",
        !on
      );

    }

  }


  function play(name,arg) {

    try {

      if (
        window.AudioEngine &&
        typeof window.AudioEngine[name] === "function"
      ) {

        window.AudioEngine[name](arg);

      }

    }

    catch (_) {}

  }


  function norm(v) {

    return String(v || "")
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


  /* ========================================================
     HUD
  ======================================================== */

  function updateHUD() {

    setText(
      "keyCounter",
      `🔑 ${S.keys}/20`
    );

    setText(
      "sceneBadge",
      names[S.scene] || "LE COFFRE"
    );

    setText(
      "mapKeys",
      `${S.keys} / 20`
    );

    setText(
      "objective",

      S.scene >= 19

        ? "Le coffre mystérieux t'attend."

        : "Celena marche automatiquement vers le prochain mystère."

    );

  }


  /* ========================================================
     DIALOGUE
  ======================================================== */

  function dialog(lines,done) {

    S.dialogLines = lines || [];

    S.dialogIndex = 0;

    S.dialogDone = done || null;

    show(
      "dialog",
      true
    );

    setText(
      "dialogText",
      S.dialogLines[0] || ""
    );

  }


  function nextDialog() {

    if (!S.dialogLines.length) return;

    S.dialogIndex++;

    play("button");

    if (
      S.dialogIndex >=
      S.dialogLines.length
    ) {

      show(
        "dialog",
        false
      );

      const done =
        S.dialogDone;

      S.dialogLines = [];

      S.dialogDone = null;

      if (done) done();

      return;

    }

    setText(
      "dialogText",
      S.dialogLines[
        S.dialogIndex
      ]
    );

  }


  /* ========================================================
     CIEL / ATMOSPHÈRE
  ======================================================== */

  function sky() {

    const e =
      envs[S.scene];

    let top = C.sky;

    let bottom = C.sky2;


    if (
      [
        "snow",
        "christmas",
        "stars"
      ].includes(e)
    ) {

      top = "#1e2947";

      bottom = "#657796";

    }


    else if (
      e === "cinema" ||
      e === "cannes"
    ) {

      top = "#6ba9c3";

      bottom = "#d0dfd1";

    }


    else if (
      e === "iris"
    ) {

      top = "#75b9d2";

      bottom = "#f1d59c";

    }


    const gr =
      g.createLinearGradient(
        0,
        0,
        0,
        VH
      );


    gr.addColorStop(
      0,
      top
    );

    gr.addColorStop(
      1,
      bottom
    );


    g.fillStyle = gr;

    g.fillRect(
      0,
      0,
      VW,
      VH
    );


    if (
      [
        "stars",
        "christmas"
      ].includes(e)
    ) {

      circle(
        258,
        27,
        13,
        "#f8edbf"
      );


      for(
        let i=0;
        i<45;
        i++
      ) {

        const x =
          (i*71+17)%VW;

        const y =
          7+(i*29)%65;


        rect(
          x,
          y,
          i%4===0 ? 2 : 1,
          i%4===0 ? 2 : 1,
          i%3===0
            ? C.gold
            : C.white
        );

      }

    }

    else {

      circle(
        267,
        28,
        13,
        "#ffe4a0"
      );

      circle(
        272,
        24,
        12,
        "rgba(255,255,255,.12)"
      );

    }


    const shift =
      -(S.camera * .08) % 380;


    for(
      let i=0;
      i<5;
      i++
    ) {

      const x =
        shift + i*105;


      circle(
        x,
        34,
        7,
        "rgba(255,255,255,.55)"
      );

      circle(
        x+8,
        31,
        10,
        "rgba(255,255,255,.55)"
      );

      circle(
        x+18,
        35,
        6,
        "rgba(255,255,255,.55)"
      );

    }

  }


  /* ========================================================
     PLAGE
  ======================================================== */

  function beachBase() {

    rect(
      0,
      73,
      VW,
      45,
      C.sea
    );


    for(
      let y=78;
      y<116;
      y+=9
    ) {

      const off =
        (S.camera*.16+y)%34;


      for(
        let x=-35;
        x<VW+35;
        x+=42
      ) {

        line(
          x-off,
          y,
          x+17-off,
          y,
          C.sea2,
          1
        );

      }

    }


    rect(
      0,
      115,
      VW,
      65,
      C.sand
    );


    for(
      let i=0;
      i<30;
      i++
    ) {

      const x =
        (i*43-S.camera*.28)%VW;


      rect(
        x,
        124+(i%5)*10,
        2,
        1,
        i%2
          ? C.sand3
          : C.sand2
      );

    }

  }


  /* ========================================================
     PALMIER PIXEL
  ======================================================== */

  function palm(
    x,
    y,
    s=1
  ) {

    poly(
      [
        [x-5*s,y],
        [x+5*s,y],
        [x+3*s,y-51*s],
        [x-3*s,y-51*s]
      ],
      C.trunk
    );


    line(
      x,
      y-5*s,
      x,
      y-50*s,
      C.trunkDark,
      2
    );


    const cy =
      y-54*s;


    const leaves = [

      [-39,-10],
      [-31,-28],
      [-11,-39],
      [11,-39],
      [31,-27],
      [40,-8]

    ];


    leaves.forEach(
      ([dx,dy]) => {

        poly(
          [
            [x,cy],
            [
              x+dx*s,
              cy+dy*s
            ],
            [
              x+(dx*.45)*s,
              cy+(dy*.1)*s
            ],
            [
              x+6*s,
              cy+3*s
            ]
          ],
          C.grass2
        );

      }
    );


    circle(
      x,
      cy,
      5*s,
      C.grass
    );

  }


  /* ========================================================
     FORÊT
  ======================================================== */

  function forestBase() {

    rect(
      0,
      72,
      VW,
      108,
      C.grass
    );


    for(
      let i=0;
      i<14;
      i++
    ) {

      const x =
        (i*31-S.camera*.2)%VW;


      rect(
        x+12,
        96,
        5,
        45,
        C.trunkDark
      );


      circle(
        x+15,
        91,
        15,
        C.darkGrass
      );


      circle(
        x+6,
        96,
        10,
        C.grass2
      );


      circle(
        x+24,
        96,
        10,
        C.grass3
      );

    }


    rect(
      0,
      130,
      VW,
      50,
      C.darkGrass
    );

  }


  /* ========================================================
     MONTAGNES
  ======================================================== */

  function mountains() {

    poly(
      [
        [0,116],
        [38,68],
        [75,108],
        [113,53],
        [158,110],
        [203,62],
        [246,108],
        [286,52],
        [320,114]
      ],
      "#566f78"
    );


    poly(
      [
        [0,116],
        [39,76],
        [75,108],
        [113,63],
        [157,111],
        [0,116]
      ],
      "#6d8589"
    );


    poly(
      [
        [0,116],
        [320,116],
        [320,180],
        [0,180]
      ],
      C.darkGrass
    );

  }


  /* ========================================================
     LAC
  ======================================================== */

  function drawLake() {

    rect(
      0,
      70,
      VW,
      76,
      "#3d91a7"
    );


    for(
      let i=0;
      i<15;
      i++
    ) {

      const y =
        76+i*5;


      line(
        (i*23)%45,
        y,
        80+(i%4)*29,
        y,
        "#71c4cc",
        1
      );

    }


    rect(
      0,
      143,
      VW,
      37,
      C.grass
    );

  }


  /* ========================================================
     VILLE
  ======================================================== */

  function drawCity() {

    rect(
      0,
      72,
      VW,
      68,
      "#8fb9c2"
    );


    for(
      let i=0;
      i<10;
      i++
    ) {

      const x =
        i*35 -
        (S.camera*.18%35);

      const h =
        28+(i%4)*12;


      rect(
        x,
        140-h,
        27,
        h,
        i%2
          ? "#806e68"
          : "#967a70"
      );


      for(
        let yy=140-h+7;
        yy<137;
        yy+=10
      ) {

        for(
          let xx=x+5;
          xx<x+24;
          xx+=9
        ) {

          rect(
            xx,
            yy,
            4,
            5,
            i%3===0
              ? C.gold
              : "#dce5d8"
          );

        }

      }

    }


    rect(
      0,
      140,
      VW,
      40,
      "#77736e"
    );


    line(
      0,
      158,
      VW,
      158,
      "#d8c99c",
      2
    );

  }


  /* ========================================================
     NEIGE
  ======================================================== */

  function drawSnow() {

    rect(
      0,
      70,
      VW,
      110,
      "#8fa9c0"
    );


    poly(
      [
        [0,121],
        [45,69],
        [90,120],
        [145,57],
        [201,120],
        [251,69],
        [320,120],
        [320,180],
        [0,180]
      ],
      "#e0eaee"
    );


    for(
      let i=0;
      i<70;
      i++
    ) {

      rect(
        (i*61)%VW,
        72+(i*37)%98,
        i%5===0 ? 2 : 1,
        i%5===0 ? 2 : 1,
        C.white
      );

    }

  }


  /* ========================================================
     NOËL
  ======================================================== */

  function drawChristmas() {

    drawSnow();

    const x=80;


    rect(
      x-3,
      86,
      7,
      60,
      C.trunk
    );


    for(
      let i=0;
      i<5;
      i++
    ) {

      poly(
        [
          [x,73+i*10],
          [x-20-i*2,105+i*10],
          [x+24+i*2,105+i*10]
        ],
        C.darkGrass
      );

    }


    for(
      let i=0;
      i<13;
      i++
    ) {

      circle(
        x-14+(i*17)%38,
        82+(i*17)%55,
        2,
        i%2
          ? C.gold
          : C.white
      );

    }

  }


  /* ========================================================
     JARDIN
  ======================================================== */

  function drawGarden() {

    rect(
      0,
      78,
      VW,
      102,
      "#79b060"
    );


    rect(
      0,
      129,
      VW,
      51,
      "#477f4c"
    );


    for(
      let i=0;
      i<9;
      i++
    ) {

      const x =
        (i*45-S.camera*.25)%VW;


      rect(
        x,
        101,
        3,
        34,
        C.trunk
      );


      circle(
        x+2,
        98,
        11,
        C.grass2
      );


      circle(
        x-5,
        103,
        7,
        C.grass3
      );


      circle(
        x+9,
        103,
        7,
        C.grass
      );

    }


    for(
      let i=0;
      i<20;
      i++
    ) {

      const x =
        (i*29-S.camera*.5)%VW;


      circle(
        x,
        137+(i%3)*8,
        2,
        i%2
          ? "#e6a6b6"
          : "#f5d66e"
      );

    }

  }


  /* ========================================================
     VILLAGE
  ======================================================== */

  function drawVillage() {

    rect(
      0,
      75,
      VW,
      65,
      "#91b6c0"
    );


    rect(
      0,
      140,
      VW,
      40,
      "#8b806d"
    );


    for(
      let i=0;
      i<6;
      i++
    ) {

      const x =
        (i*57-S.camera*.18)%VW;


      rect(
        x,
        105-(i%2)*9,
        38,
        36,
        C.wood2
      );


      poly(
        [
          [x-4,105-(i%2)*9],
          [x+19,88-(i%2)*9],
          [x+42,105-(i%2)*9]
        ],
        C.trunkDark
      );


      rect(
        x+9,
        117-(i%2)*9,
        7,
        15,
        C.wood
      );


      rect(
        x+24,
        112-(i%2)*9,
        6,
        6,
        C.gold2
      );

    }

  }


  /* ========================================================
     CASCADE
  ======================================================== */

  function drawWaterfall() {

    mountains();


    rect(
      138,
      73,
      45,
      54,
      C.stoneDark
    );


    rect(
      151,
      78,
      18,
      56,
      "#67c2d1"
    );


    rect(
      157,
      80,
      5,
      52,
      "#b7e6e5"
    );


    for(
      let i=0;
      i<10;
      i++
    ) {

      circle(
        158+(i%3)*6,
        135+(i%4)*4,
        2+i%2,
        "#83cdd3"
      );

    }

  }


  /* ========================================================
     CANNES
  ======================================================== */

  function drawCannes() {

    rect(
      0,
      74,
      VW,
      68,
      "#9fc7ce"
    );


    rect(
      0,
      142,
      VW,
      38,
      "#d4b779"
    );


    for(
      let i=0;
      i<6;
      i++
    ) {

      const x =
        (i*63-S.camera*.2)%VW;


      rect(
        x,
        104,
        42,
        38,
        i%2
          ? "#cdb39b"
          : "#b98f76"
      );


      rect(
        x+8,
        113,
        7,
        8,
        C.white
      );


      rect(
        x+25,
        113,
        7,
        8,
        C.gold2
      );


      rect(
        x+18,
        128,
        7,
        14,
        C.trunkDark
      );

    }


    for(
      let i=0;
      i<5;
      i++
    ) {

      palm(
        35+i*75,
        142,
        0.42
      );

    }

  }


  /* ========================================================
     PARC
  ======================================================== */

  function drawPark() {

    rect(
      0,
      76,
      VW,
      104,
      "#7fae68"
    );


    rect(
      0,
      132,
      VW,
      48,
      "#5b8f50"
    );


    for(
      let i=0;
      i<7;
      i++
    ) {

      const x =
        (i*54-S.camera*.2)%VW;


      rect(
        x+13,
        96,
        5,
        40,
        C.trunk
      );


      circle(
        x+15,
        92,
        14,
        C.grass
      );


      circle(
        x+7,
        97,
        9,
        C.grass2
      );


      circle(
        x+23,
        97,
        9,
        C.grass3
      );

    }


    rect(
      0,
      153,
      VW,
      5,
      "#c6a96c"
    );

  }


  /* ========================================================
     STADE
  ======================================================== */

  function drawStadium() {

    rect(
      0,
      74,
      VW,
      67,
      "#607a8c"
    );


    rect(
      0,
      111,
      VW,
      69,
      "#477b4d"
    );


    for(
      let i=0;
      i<6;
      i++
    ) {

      const x =
        i*62 -
        (S.camera*.18%62);


      rect(
        x,
        91,
        48,
        8,
        "#b9c5c7"
      );


      rect(
        x+5,
        99,
        38,
        15,
        "#8b969a"
      );

    }


    rect(
      0,
      150,
      VW,
      4,
      "#d8c77f"
    );


    rect(
      0,
      165,
      VW,
      3,
      "#d8c77f"
    );

  }


  /* ========================================================
     CINÉMA
  ======================================================== */

  function drawCinema() {

    rect(
      0,
      74,
      VW,
      66,
      "#a8c6c5"
    );


    rect(
      0,
      140,
      VW,
      40,
      "#6e6c6a"
    );


    rect(
      38,
      88,
      244,
      50,
      "#6b403a"
    );


    rect(
      48,
      96,
      224,
      32,
      "#2d2832"
    );


    for(
      let i=0;
      i<8;
      i++
    ) {

      circle(
        62+i*27,
        112,
        2,
        C.gold
      );

    }


    rect(
      0,
      137,
      VW,
      3,
      C.gold
    );

  }


  /* ========================================================
     ÉTOILES
  ======================================================== */

  function drawStars() {

    rect(
      0,
      74,
      VW,
      106,
      "#27314d"
    );


    for(
      let i=0;
      i<55;
      i++
    ) {

      rect(
        (i*73)%VW,
        77+(i*31)%68,
        1+(i%5===0),
        1,
        C.white
      );

    }


    rect(
      0,
      141,
      VW,
      39,
      "#263746"
    );


    for(
      let i=0;
      i<8;
      i++
    ) {

      const x =
        (i*48-S.camera*.15)%VW;


      rect(
        x,
        122,
        5,
        22,
        C.trunkDark
      );


      circle(
        x+2,
        120,
        12,
        C.darkGrass
      );

    }

  }


  /* ========================================================
     COFFRE
  ======================================================== */

  function drawTreasure() {

    rect(
      0,
      72,
      VW,
      108,
      "#242a43"
    );


    for(
      let i=0;
      i<40;
      i++
    ) {

      rect(
        (i*53)%VW,
        76+(i*23)%58,
        1,
        1,
        i%3
          ? C.white
          : C.gold
      );

    }


    rect(
      0,
      135,
      VW,
      45,
      "#493d50"
    );


    rect(
      111,
      105,
      98,
      47,
      C.trunkDark
    );


    rect(
      116,
      101,
      88,
      45,
      C.wood
    );


    rect(
      123,
      106,
      74,
      32,
      "#5a321e"
    );


    rect(
      150,
      115,
      20,
      8,
      C.gold
    );


    rect(
      155,
      119,
      10,
      10,
      C.gold2
    );


    for(
      let i=0;
      i<12;
      i++
    ) {

      const a =
        i*Math.PI/6;


      circle(
        160+Math.cos(a)*43,
        113+Math.sin(a)*29,
        2,
        C.gold
      );

    }

  }


  /* ========================================================
     ENVIRONNEMENT PRINCIPAL
  ======================================================== */

  function drawEnvironment() {

    sky();

    const e =
      envs[S.scene];


    if(
      e==="beach" ||
      e==="cove"
    ) {

      beachBase();

    }


    else if(
      e==="forest" ||
      e==="forest2"
    ) {

      forestBase();

    }


    else if(
      e==="mountain"
    ) {

      mountains();

    }


    else if(
      e==="lake"
    ) {

      drawLake();

    }


    else if(
      e==="garden"
    ) {

      drawGarden();

    }


    else if(
      e==="city"
    ) {

      drawCity();

    }


    else if(
      e==="cinema"
    ) {

      drawCinema();

    }


    else if(
      e==="village"
    ) {

      drawVillage();

    }


    else if(
      e==="waterfall"
    ) {

      drawWaterfall();

    }


    else if(
      e==="cannes"
    ) {

      drawCannes();

    }


    else if(
      e==="park"
    ) {

      drawPark();

    }


    else if(
      e==="snow"
    ) {

      drawSnow();

    }


    else if(
      e==="memory"
    ) {

      drawGarden();

      rect(
        0,
        75,
        VW,
        10,
        "rgba(255,220,150,.25)"
      );

    }


    else if(
      e==="christmas"
    ) {

      drawChristmas();

    }


    else if(
      e==="iris"
    ) {

      drawPark();

    }


    else if(
      e==="stadium"
    ) {

      drawStadium();

    }


    else if(
      e==="stars"
    ) {

      drawStars();

    }


    else if(
      e==="treasure"
    ) {

      drawTreasure();

    }


    if(
      (
        e==="beach" ||
        e==="cove"
      ) &&
      S.scene===0
    ) {

      palm(
        58,
        142,
        0.95
      );


      palm(
        292,
        143,
        0.55
      );

    }

  }


  /* ========================================================
     OBJETS
  ======================================================== */

  function drawObjects() {

    const scene =
      S.scene;


    /* bouteille de départ */

    if(
      scene===0 &&
      !S.introDone
    ) {

      const x=245;


      rect(
        x-7,
        139,
        17,
        3,
        "rgba(40,30,20,.3)"
      );


      rect(
        x-4,
        121,
        10,
        18,
        "#dce4cf"
      );


      rect(
        x-2,
        117,
        6,
        5,
        "#f2e8b7"
      );


      rect(
        x-5,
        115,
        12,
        4,
        C.trunkDark
      );


      rect(
        x-1,
        119,
        4,
        1,
        C.gold
      );

    }


    /* petits détails du décor */

    for(
      let i=0;
      i<12;
      i++
    ) {

      const x =
        (i*47-S.camera*.42)%VW;


      if(scene<=1) {

        circle(
          x,
          145+(i%3)*6,
          1+(i%2),
          i%2
            ? C.sand2
            : C.sand3
        );

      }


      else if(
        scene===2 ||
        scene===3 ||
        scene===6 ||
        scene===12
      ) {

        circle(
          x,
          137+(i%3)*7,
          2,
          i%2
            ? C.grass2
            : C.grass3
        );

      }

    }

  }


  /* ========================================================
     CELENA — SPRITE PIXEL ART
  ======================================================== */

  function drawCelena() {

    const px =
      Math.round(VW/2);

    const ground=143;

    const moving =
      S.walking;


    const f =
      moving
        ? S.walkFrame%4
        : 1;


    let ll=0;
    let rl=0;
    let la=0;
    let ra=0;


    if(f===0) {

      ll=-4;
      rl=4;
      la=3;
      ra=-3;

    }


    if(f===1) {

      ll=-1;
      rl=1;
      la=1;
      ra=-1;

    }


    if(f===2) {

      ll=4;
      rl=-4;
      la=-3;
      ra=3;

    }


    if(f===3) {

      ll=1;
      rl=-1;
      la=-1;
      ra=1;

    }


    const P = {

      outline:"#241a20",

      outline2:"#38242a",

      hairDark:"#3a211c",
      hair:"#633525",
      hairLight:"#8b5438",

      skinShadow:"#d4876c",
      skin:"#f2b08c",
      skinLight:"#ffd0a8",

      eye:"#241b22",
      eyeLight:"#fff7df",

      mouth:"#9a4d58",

      hatDark:"#a76b31",
      hat:"#d9aa52",
      hatLight:"#f2cd79",

      hatBand:"#a95343",

      shirtDark:"#9e3d56",
      shirt:"#d65c76",
      shirtLight:"#ed7488",

      beltDark:"#5a3527",
      belt:"#9b6030",

      pantsDark:"#1d2b43",
      pants:"#29415f",
      pantsLight:"#3f5d7c",

      boots:"#273448",
      bootsLight:"#4a5d70",

      bagDark:"#593522",
      bag:"#86512e",
      bagLight:"#b7743d",

      gold:"#f7ca55"

    };


    /* =====================================================
       OMBRE
    ===================================================== */

    rect(
      px-21,
      ground+1,
      42,
      6,
      "rgba(28,23,27,.32)"
    );


    rect(
      px-14,
      ground+6,
      28,
      2,
      "rgba(28,23,27,.18)"
    );


    /* =====================================================
       BOTTES
    ===================================================== */

    rect(
      px-14+ll,
      ground-5,
      14,
      7,
      P.outline
    );


    rect(
      px-12+ll,
      ground-5,
      10,
      5,
      P.boots
    );


    rect(
      px+1+rl,
      ground-5,
      14,
      7,
      P.outline
    );


    rect(
      px+3+rl,
      ground-5,
      10,
      5,
      P.boots
    );


    /* =====================================================
       JAMBES
    ===================================================== */

    rect(
      px-12+ll,
      ground-29,
      11,
      27,
      P.outline
    );


    rect(
      px-10+ll,
      ground-27,
      7,
      24,
      P.pants
    );


    rect(
      px-10+ll,
      ground-25,
      3,
      16,
      P.pantsLight
    );


    rect(
      px+1+rl,
      ground-29,
      11,
      27,
      P.outline
    );


    rect(
      px+3+rl,
      ground-27,
      7,
      24,
      P.pants
    );


    rect(
      px+7+rl,
      ground-25,
      3,
      16,
      P.pantsLight
    );


    /* =====================================================
       SAC À DOS
    ===================================================== */

    rect(
      px+13,
      ground-60,
      14,
      31,
      P.outline
    );


    rect(
      px+15,
      ground-58,
      10,
      27,
      P.bagDark
    );


    rect(
      px+17,
      ground-55,
      8,
      19,
      P.bag
    );


    rect(
      px+18,
      ground-52,
      6,
      10,
      P.bagLight
    );


    rect(
      px+18,
      ground-43,
      6,
      2,
      P.bagDark
    );


    rect(
      px+19,
      ground-59,
      4,
      3,
      P.gold
    );


    /* =====================================================
       CORPS
    ===================================================== */

    rect(
      px-18,
      ground-64,
      36,
      40,
      P.outline
    );


    rect(
      px-15,
      ground-61,
      30,
      35,
      P.shirt
    );


    rect(
      px-12,
      ground-59,
      6,
      28,
      P.shirtLight
    );


    rect(
      px+9,
      ground-59,
      6,
      31,
      P.shirtDark
    );


    /* =====================================================
       CEINTURE
    ===================================================== */

    rect(
      px-15,
      ground-33,
      30,
      6,
      P.beltDark
    );


    rect(
      px-14,
      ground-32,
      28,
      3,
      P.belt
    );


    rect(
      px-3,
      ground-33,
      6,
      6,
      P.gold
    );


    rect(
      px-1,
      ground-32,
      3,
      4,
      P.beltDark
    );


    /* =====================================================
       COL
    ===================================================== */

    rect(
      px-8,
      ground-67,
      16,
      9,
      P.shirtDark
    );


    rect(
      px-6,
      ground-65,
      12,
      5,
      P.hatBand
    );


    /* =====================================================
       BRAS GAUCHE
    ===================================================== */

    rect(
      px-24+la,
      ground-62,
      10,
      29,
      P.outline
    );


    rect(
      px-22+la,
      ground-60,
      7,
      23,
      P.skin
    );


    rect(
      px-21+la,
      ground-58,
      4,
      14,
      P.skinLight
    );


    rect(
      px-21+la,
      ground-39,
      7,
      7,
      P.skinShadow
    );


    rect(
      px-20+la,
      ground-38,
      5,
      6,
      P.skin
    );


    /* =====================================================
       BRAS DROIT
    ===================================================== */

    rect(
      px+14+ra,
      ground-62,
      10,
      29,
      P.outline
    );


    rect(
      px+15+ra,
      ground-60,
      7,
      23,
      P.skin
    );


    rect(
      px+16+ra,
      ground-58,
      4,
      14,
      P.skinLight
    );


    rect(
      px+15+ra,
      ground-39,
      7,
      7,
      P.skinShadow
    );


    rect(
      px+16+ra,
      ground-38,
      5,
      6,
      P.skin
    );


    /* =====================================================
       COU
    ===================================================== */

    rect(
      px-8,
      ground-74,
      16,
      13,
      P.outline
    );


    rect(
      px-6,
      ground-72,
      12,
      11,
      P.skin
    );


    rect(
      px-4,
      ground-71,
      8,
      7,
      P.skinLight
    );


    /* =====================================================
       CHEVEUX ARRIÈRE
    ===================================================== */

    rect(
      px-21,
      ground-100,
      42,
      37,
      P.outline
    );


    rect(
      px-19,
      ground-98,
      38,
      34,
      P.hairDark
    );


    rect(
      px-23,
      ground-91,
      8,
      27,
      P.hair
    );


    rect(
      px-25,
      ground-83,
      8,
      18,
      P.hair
    );


    rect(
      px-20,
      ground-82,
      5,
      14,
      P.hairLight
    );


    rect(
      px+15,
      ground-91,
      8,
      28,
      P.hair
    );


    rect(
      px+17,
      ground-83,
      8,
      18,
      P.hairDark
    );


    rect(
      px+15,
      ground-79,
      5,
      13,
      P.hairLight
    );


    /* =====================================================
       VISAGE
    ===================================================== */

    rect(
      px-18,
      ground-92,
      36,
      30,
      P.outline
    );


    rect(
      px-16,
      ground-90,
      32,
      26,
      P.skin
    );


    rect(
      px-12,
      ground-88,
      19,
      17,
      P.skinLight
    );


    rect(
      px-16,
      ground-90,
      32,
      5,
      P.skinShadow
    );


    /* =====================================================
       SOURCILS
    ===================================================== */

    rect(
      px-12,
      ground-82,
      8,
      2,
      P.hairDark
    );


    rect(
      px+4,
      ground-82,
      8,
      2,
      P.hairDark
    );


    /* =====================================================
       YEUX PIXEL
    ===================================================== */

    rect(
      px-11,
      ground-79,
      7,
      6,
      P.eye
    );


    rect(
      px-9,
      ground-78,
      3,
      3,
      P.eyeLight
    );


    rect(
      px+4,
      ground-79,
      7,
      6,
      P.eye
    );


    rect(
      px+5,
      ground-78,
      3,
      3,
      P.eyeLight
    );


    /* =====================================================
       NEZ
    ===================================================== */

    rect(
      px-1,
      ground-73,
      4,
      3,
      P.skinShadow
    );


    rect(
      px+1,
      ground-72,
      3,
      2,
      P.skin
    );


    /* =====================================================
       SOURIRE
    ===================================================== */

    rect(
      px-6,
      ground-67,
      12,
      2,
      P.mouth
    );


    rect(
      px-4,
      ground-65,
      8,
      2,
      P.mouth
    );


    rect(
      px-2,
      ground-65,
      4,
      1,
      P.skinLight
    );


    /* =====================================================
       FRANGE
    ===================================================== */

    rect(
      px-17,
      ground-96,
      34,
      10,
      P.outline
    );


    rect(
      px-15,
      ground-95,
      30,
      8,
      P.hairDark
    );


    rect(
      px-13,
      ground-92,
      5,
      3,
      P.hairLight
    );


    rect(
      px+7,
      ground-92,
      5,
      3,
      P.hairLight
    );


    /* =====================================================
       CHAPEAU
    ===================================================== */

    rect(
      px-26,
      ground-105,
      52,
      9,
      P.outline
    );


    rect(
      px-24,
      ground-104,
      48,
      6,
      P.hat
    );


    rect(
      px-19,
      ground-105,
      38,
      3,
      P.hatLight
    );


    rect(
      px-18,
      ground-114,
      36,
      13,
      P.outline
    );


    rect(
      px-16,
      ground-112,
      32,
      10,
      P.hat
    );


    rect(
      px-12,
      ground-110,
      24,
      6,
      P.hatLight
    );


    rect(
      px-16,
      ground-104,
      32,
      4,
      P.hatBand
    );


    rect(
      px-12,
      ground-103,
      24,
      2,
      "#c8644e"
    );


    rect(
      px+12,
      ground-104,
      5,
      5,
      P.hatDark
    );


    rect(
      px+15,
      ground-102,
      5,
      4,
      P.hatBand
    );


    rect(
      px-18,
      ground-102,
      3,
      3,
      P.gold
    );


    /* =====================================================
       PETITS PIXELS DE LUMIÈRE
    ===================================================== */

    rect(
      px-17,
      ground-58,
      3,
      7,
      "#f2a4a8"
    );


    rect(
      px+11,
      ground-57,
      3,
      7,
      "#b74762"
    );


    rect(
      px-9,
      ground-24,
      2,
      10,
      P.pantsLight
    );


    rect(
      px+5,
      ground-24,
      2,
      10,
      P.pantsLight
    );

  }


  /* ========================================================
     CLÉ À LA DESTINATION
  ======================================================== */

  function drawDestination() {

    if(
      S.scene>=20 ||
      S.x<S.target-45
    ) {

      return;

    }


    const x=272;
    const y=111;


    for(
      let r=15;
      r>=4;
      r-=3
    ) {

      circle(
        x,
        y,
        r,
        `rgba(247,202,85,${(16-r)/22})`
      );

    }


    circle(
      x,
      y,
      5,
      C.gold
    );


    rect(
      x+4,
      y-2,
      13,
      4,
      C.gold
    );


    rect(
      x+13,
      y+1,
      3,
      6,
      C.gold
    );


    rect(
      x+8,
      y+2,
      3,
      6,
      C.gold
    );

  }


  /* ========================================================
     MONDE
  ======================================================== */

  function renderWorld() {

    drawEnvironment();

    drawObjects();

    drawDestination();

    drawCelena();

  }


  /* ========================================================
     CAMÉRA
  ======================================================== */

  function updateCamera() {

    const desired =
      S.x-110;


    S.camera +=
      (desired-S.camera)*0.09;


    S.camera =
      Math.max(
        0,
        Math.min(
          WORLD_W()-VW,
          S.camera
        )
      );

  }


  function WORLD_W() {

    return 6000;

  }


  /* ========================================================
     DÉPLACEMENT
  ======================================================== */

  function updateMovement(dt) {

    if(
      !S.started ||
      !S.walking ||
      S.question ||
      S.ending
    ) {

      return;

    }


    S.x +=
      34*dt;


    S.walkClock +=
      dt;


    if(
      S.walkClock>=0.13
    ) {

      S.walkClock=0;

      S.walkFrame++;

    }


    updateCamera();


    if(
      S.x>=S.target
    ) {

      S.x=S.target;

      arrive();

    }

  }


  /* ========================================================
     DÉBUT
  ======================================================== */

  function start() {

    if(S.started)
      return;


    S.started=true;


    show(
      "titleScreen",
      false
    );


    show(
      "gameScreen",
      true
    );


    play("resume");


    play(
      "startAmbience",
      "beach"
    );


    updateHUD();


    dialog(
      [
        "Mais qu'est-ce que je fais ici ?"
      ],
      () => {

        S.target =
          targets[0];

        S.walking=true;

      }
    );

  }


  /* ========================================================
     ARRIVÉE
  ======================================================== */

  function arrive() {

    if(S.arriving)
      return;


    S.arriving=true;

    S.walking=false;


    play("button");


    if(!S.introDone) {

      S.introDone=true;


      dialog(
        [
          "Mais qu'est-ce que je fais ici ?",
          "Quelque chose brille près du rivage...",
          "Une mystérieuse clé semble attendre Celena."
        ],
        () => {

          show(
            "mapIntro",
            true
          );

        }
      );


      return;

    }


    openQuestion();

  }


  /* ========================================================
     QUESTION
  ======================================================== */

  function openQuestion() {

    if(
      S.question ||
      S.ending
    ) {

      return;

    }


    const data =
      window.GAME_DATA;


    const q =
      data &&
      data.questions
        ? data.questions[S.scene]
        : null;


    if(!q) {

      /*
       * Aucun souvenir révélé.
       * On passe simplement à la clé.
       */

      collectKey();

      return;

    }


    S.question=true;


    show(
      "questionScreen",
      true
    );


    setText(
      "questionNumber",
      `ÉNIGME ${q.id || S.scene+1}/20`
    );


    setText(
      "questionText",
      q.question || ""
    );


    setText(
      "answerFeedback",
      ""
    );


    const input =
      $("answerInput");


    if(input) {

      input.value="";


      setTimeout(
        () => input.focus(),
        120
      );

    }

  }


  /* ========================================================
     INDICE
  ======================================================== */

  function revealAnswer() {

    const data =
      window.GAME_DATA;


    const q =
      data &&
      data.questions
        ? data.questions[S.scene]
        : null;


    if(!q)
      return;


    /*
     * IMPORTANT :
     * uniquement la réponse.
     *
     * Aucun souvenir.
     * Aucune correspondance.
     */

    setText(
      "answerFeedback",
      `💡 Réponse : ${q.answer}`
    );

  }


  /* ========================================================
     VALIDATION
  ======================================================== */

  function validate() {

    if(!S.question)
      return;


    const data =
      window.GAME_DATA;


    const q =
      data &&
      data.questions
        ? data.questions[S.scene]
        : null;


    if(!q)
      return;


    const value =
      norm(
        $("answerInput")
          ? $("answerInput").value
          : ""
      );


    const accepted =
      (
        q.acceptedAnswers ||
        [q.answer]
      ).map(norm);


    if(
      !accepted.includes(value)
    ) {

      setText(
        "answerFeedback",
        "❌ Mauvaise réponse. Essaie encore."
      );


      play(
        "wrongAnswer"
      );


      return;

    }


    collectKey();

  }


  /* ========================================================
     CLÉ OBTENUE
  ======================================================== */

  function collectKey() {

    S.question=false;


    S.keys =
      Math.min(
        20,
        S.keys+1
      );


    show(
      "questionScreen",
      false
    );


    play(
      "keyFound"
    );


    updateHUD();


    /*
     * TRÈS IMPORTANT :
     *
     * aucune correspondance avec
     * le souvenir n'est affichée ici.
     */

    dialog(
      [
        `Bravo ! 🔑 Clé ${S.keys}/20 obtenue.`
      ],
      () => {

        if(
          S.keys>=20
        ) {

          openChest();

        }

        else {

          beginNextScene();

        }

      }
    );

  }


  /* ========================================================
     SCÈNE SUIVANTE
  ======================================================== */

  function beginNextScene() {

    S.scene++;


    S.arriving=false;


    S.x =
      Math.max(
        60,
        targets[S.scene]-150
      );


    S.target =
      targets[S.scene];


    S.walking=true;


    S.walkFrame=0;


    updateHUD();


    play(
      "startAmbience",
      envs[S.scene]
    );

  }


  /* ========================================================
     OUVERTURE DU COFFRE
  ======================================================== */

  function openChest() {

    S.ending=true;

    S.walking=false;


    S.scene=19;


    updateHUD();


    show(
      "chestScreen",
      true
    );


    play(
      "startAmbience",
      "treasure"
    );


    const orbit =
      $("keyOrbit");


    if(!orbit)
      return;


    orbit.innerHTML="";


    for(
      let i=0;
      i<20;
      i++
    ) {

      const key =
        document.createElement(
          "span"
        );


      key.className =
        "orbit-key";


      key.textContent =
        "🔑";


      key.style.setProperty(
        "--i",
        i
      );


      orbit.appendChild(
        key
      );

    }

  }


  /* ========================================================
     COFFRE OUVERT
  ======================================================== */

  function chest() {

    play(
      "chestOpen"
    );


    const graphic =
      $("chestGraphic");


    if(graphic) {

      graphic.classList.add(
        "open"
      );

    }


    setTimeout(
      () => {

        show(
          "chestScreen",
          false
        );


        revealMemories();

      },
      1900
    );

  }


  /* ========================================================
     SOUVENIRS
  ======================================================== */

  function revealMemories() {

    const list =
      $("memoryList");


    if(!list)
      return;


    list.innerHTML="";


    show(
      "memoriesScreen",
      true
    );


    const data =
      window.GAME_DATA;


    const memories =
      data &&
      data.memories
        ? data.memories.slice(0,20)
        : [];


    let i=0;


    function add() {

      if(
        i>=memories.length
      ) {

        const btn =
          $("treasureBtn");


        if(btn) {

          btn.classList.remove(
            "hidden"
          );

        }


        return;

      }


      const m =
        memories[i] || {};


      const card =
        document.createElement(
          "article"
        );


      card.className =
        "memory-item";


      card.innerHTML = `

        <div class="memory-number">
          ${i+1}
        </div>

        <div class="memory-content">

          <h3>
            ${m.title || `Souvenir ${i+1}`}
          </h3>

          <p>
            ${m.text || m.description || ""}
          </p>

        </div>

      `;


      list.appendChild(
        card
      );


      i++;


      setTimeout(
        add,
        250
      );

    }


    add();

  }


  /* ========================================================
     CARTE
  ======================================================== */

  function drawMap() {

    const map =
      $("mapCanvas");


    if(!map)
      return;


    const dpr =
      Math.min(
        devicePixelRatio || 1,
        2
      );


    const w =
      Math.max(
        1,
        Math.floor(
          map.clientWidth*dpr
        )
      );


    const h =
      Math.max(
        1,
        Math.floor(
          map.clientHeight*dpr
        )
      );


    map.width=w;
    map.height=h;


    const mc =
      map.getContext("2d");


    mc.imageSmoothingEnabled=false;


    mc.fillStyle =
      "#2b7898";


    mc.fillRect(
      0,
      0,
      w,
      h
    );


    mc.fillStyle =
      "#6f9959";


    mc.beginPath();


    mc.moveTo(
      w*.08,
      h*.72
    );


    mc.lineTo(
      w*.17,
      h*.39
    );


    mc.lineTo(
      w*.31,
      h*.18
    );


    mc.lineTo(
      w*.55,
      h*.13
    );


    mc.lineTo(
      w*.83,
      h*.29
    );


    mc.lineTo(
      w*.91,
      h*.59
    );


    mc.lineTo(
      w*.76,
      h*.84
    );


    mc.lineTo(
      w*.43,
      h*.91
    );


    mc.lineTo(
      w*.17,
      h*.84
    );


    mc.closePath();

    mc.fill();


    mc.strokeStyle =
      "#ead28b";


    mc.lineWidth=5;


    mc.beginPath();


    for(
      let i=0;
      i<20;
      i++
    ) {

      const x =
        w*.15 +
        (w*.68/19)*i;


      const y =
        h*.75 -
        Math.sin(i*.65) *
        h*.28;


      if(i===0) {

        mc.moveTo(
          x,
          y
        );

      }

      else {

        mc.lineTo(
          x,
          y
        );

      }

    }


    mc.stroke();


    for(
      let i=0;
      i<20;
      i++
    ) {

      const x =
        w*.15 +
        (w*.68/19)*i;


      const y =
        h*.75 -
        Math.sin(i*.65) *
        h*.28;


      mc.fillStyle =
        i<S.keys
          ? "#f7ca55"
          : "#fff1bd";


      mc.beginPath();


      mc.arc(
        x,
        y,
        6,
        0,
        Math.PI*2
      );


      mc.fill();


      mc.fillStyle =
        "#27352f";


      mc.font =
        "bold 8px sans-serif";


      mc.textAlign =
        "center";


      mc.textBaseline =
        "middle";


      mc.fillText(
        String(i+1),
        x,
        y
      );

    }

  }


  /* ========================================================
     BOUCLE PRINCIPALE
  ======================================================== */

  function loop(t) {

    if(!S.last)
      S.last=t;


    const dt =
      Math.min(
        (t-S.last)/1000,
        .05
      );


    S.last=t;


    updateMovement(dt);


    g.clearRect(
      0,
      0,
      VW,
      VH
    );


    renderWorld();


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    /*
     * Agrandissement NEAREST :
     * le pixel art reste net.
     */

    const scale =
      Math.max(
        canvas.width/VW,
        canvas.height/VH
      );


    const dw =
      VW*scale;


    const dh =
      VH*scale;


    const dx =
      (canvas.width-dw)/2;


    const dy =
      (canvas.height-dh)/2;


    ctx.drawImage(
      buffer,
      0,
      0,
      VW,
      VH,
      dx,
      dy,
      dw,
      dh
    );


    requestAnimationFrame(
      loop
    );

  }


  /* ========================================================
     ÉVÉNEMENTS
  ======================================================== */

  $("startBtn")
    ?.addEventListener(
      "click",
      start
    );


  $("dialogNext")
    ?.addEventListener(
      "click",
      nextDialog
    );


  $("mapContinue")
    ?.addEventListener(
      "click",
      () => {

        show(
          "mapIntro",
          false
        );


        S.target =
          targets[0];


        S.walking=true;


        S.arriving=false;

      }
    );


  $("validateBtn")
    ?.addEventListener(
      "click",
      validate
    );


  $("revealBtn")
    ?.addEventListener(
      "click",
      revealAnswer
    );


  $("openChestBtn")
    ?.addEventListener(
      "click",
      chest
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
      () => {

        show(
          "mapScreen",
          false
        );

      }
    );


  $("treasureBtn")
    ?.addEventListener(
      "click",
      () => {

        const data =
          window.GAME_DATA;


        if(
          data &&
          data.treasureLink
        ) {

          window.location.href =
            data.treasureLink;

        }

      }
    );


  $("answerInput")
    ?.addEventListener(
      "keydown",
      e => {

        if(
          e.key==="Enter"
        ) {

          e.preventDefault();

          validate();

        }

      }
    );


  /* ========================================================
     API PUBLIQUE
  ======================================================== */

  window.MysteryLoveIsland = {

    state:S,

    start,

    openQuestion,

    revealAnswer,

    validate,

    drawMap

  };


  /* ========================================================
     INITIALISATION
  ======================================================== */

  updateHUD();


  requestAnimationFrame(
    loop
  );

})();
