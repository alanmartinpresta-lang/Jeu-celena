/* MYSTERY LOVE ISLAND — moteur visuel définitif de cette version */

"use strict";

(() => {

const $ = id => document.getElementById(id);

const canvas = $("world");

const ctx = canvas.getContext("2d");


/* =========================================================
   ÉTAT DU JEU
   ========================================================= */

const S = {

  started:false,

  scene:0,

  keys:0,

  x:105,

  target:240,

  walking:false,

  frame:0,

  question:false,

  ending:false,

  introDone:false,

  last:0

};


/* =========================================================
   ENVIRONNEMENTS
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

const targets = [

  240,
  330,
  420,
  510,
  600,
  690,
  780,
  870,
  960,
  1050,
  1140,
  1230,
  1320,
  1410,
  1500,
  1590,
  1680,
  1770,
  1860,
  1950

];


/* =========================================================
   INTRODUCTION
   ========================================================= */

const intro = [

  "Mais qu'est-ce que je fais ici ?",

  "Une bouteille à la mer… échouée sur le sable.",

  "Elle l'ouvre. À l'intérieur, une vieille carte au trésor.",

  "« Trouve les 20 clés pour découvrir le trésor le plus inestimable. »"

];


/* =========================================================
   CANVAS
   ========================================================= */

function resize(){

  const d =
    Math.min(
      devicePixelRatio || 1,
      2
    );

  canvas.width =
    innerWidth * d;

  canvas.height =
    innerHeight * d;

  ctx.setTransform(
    d,
    0,
    0,
    d,
    0,
    0
  );

}

addEventListener(
  "resize",
  resize
);

resize();


/* =========================================================
   UTILITAIRES DOM
   ========================================================= */

function show(
  id,
  on = true
){

  $(id)?.classList.toggle(
    "hidden",
    !on
  );

}

function text(
  id,
  value
){

  if($(id))
    $(id).textContent = value;

}


/* =========================================================
   AUDIO
   ========================================================= */

function audio(
  name,
  argument
){

  try{

    if(
      window.AudioEngine &&
      typeof AudioEngine[name] ===
      "function"
    ){

      AudioEngine[name](
        argument
      );

    }

  }catch(e){}

}


/* =========================================================
   NORMALISATION
   ========================================================= */

function norm(value){

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

function hud(){

  text(
    "keyCounter",
    `🔑 ${S.keys}/20`
  );

  text(
    "sceneBadge",
    names[S.scene]
  );

  text(
    "objective",

    S.scene === 19

      ? "Le coffre t'attend…"

      : "Celena marche automatiquement vers le prochain mystère."

  );

  text(
    "mapKeys",
    `${S.keys} / 20`
  );

}


/* =========================================================
   DIALOGUES
   ========================================================= */

function say(
  lines,
  done
){

  S.lines = lines;

  S.li = 0;

  S.done = done;

  show(
    "dialog"
  );

  text(
    "dialogText",
    lines[0]
  );

}


function next(){

  S.li++;

  audio(
    "button"
  );

  if(
    S.li >=
    S.lines.length
  ){

    show(
      "dialog",
      false
    );

    const done =
      S.done;

    S.done = null;

    if(done)
      done();

  }else{

    text(
      "dialogText",
      S.lines[S.li]
    );

  }

}


/* =========================================================
   DÉMARRAGE
   ========================================================= */

function start(){

  if(S.started)
    return;

  S.started = true;

  show(
    "titleScreen",
    false
  );

  show(
    "gameScreen"
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
      intro[0]
    ],

    () => {

      S.target = 240;

      S.walking = true;

    }

  );

}


/* =========================================================
   ARRIVÉE SUR UN POINT
   ========================================================= */

function arrive(){

  S.walking = false;

  if(!S.introDone){

    S.introDone = true;

    say(

      [
        intro[1],
        intro[2],
        intro[3]
      ],

      () => {

        show(
          "mapIntro"
        );

        text(
          "objective",
          "La carte est trouvée. La chasse aux 20 clés commence."
        );

      }

    );

    return;

  }

  if(
    S.scene < 20
  ){

    openQuestion();

  }

}


/* =========================================================
   NOUVELLE SCÈNE
   ========================================================= */

function beginScene(i){

  S.scene = i;

  S.x =
    Math.max(
      60,
      targets[i] - 120
    );

  S.target =
    targets[i];

  S.walking = true;

  hud();

  audio(
    "startAmbience",
    types[i]
  );

}


/* =========================================================
   QUESTION
   ========================================================= */

function openQuestion(){

  if(S.question)
    return;

  S.question = true;

  const q =
    GAME_DATA.questions[S.scene];

  show(
    "questionScreen"
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

  $("answerInput").value = "";

  setTimeout(
    () =>
      $("answerInput")?.focus(),
    100
  );

}


/* =========================================================
   RÉVÉLER LA RÉPONSE
   ========================================================= */

function reveal(){

  const q =
    GAME_DATA.questions[S.scene];

  text(
    "answerFeedback",

    `💡 ${q.answer} — ${q.explanation || ""}`

  );

}


/* =========================================================
   VALIDATION
   ========================================================= */

function validate(){

  if(!S.question)
    return;

  const q =
    GAME_DATA.questions[S.scene];

  const v =
    norm(
      $("answerInput").value
    );

  const ok =

    (
      q.acceptedAnswers ||
      [q.answer]
    )
      .map(norm)
      .includes(v)

    ||

    norm(q.answer) === v;


  if(!ok){

    text(
      "answerFeedback",
      "❌ Mauvaise réponse. Essaie encore."
    );

    audio(
      "wrongAnswer"
    );

    return;

  }


  S.question = false;

  S.keys++;

  show(
    "questionScreen",
    false
  );

  audio(
    "keyFound"
  );

  hud();

  say(

    [
      `Bravo ! 🔑 Clé ${S.keys}/20 obtenue.`,

      q.explanation ||
      "Un nouveau morceau de votre histoire vient d'être retrouvé."

    ],

    () => {

      if(
        S.keys === 20
      ){

        openChest();

      }else{

        beginScene(
          S.scene + 1
        );

      }

    }

  );

}


/* =========================================================
   COFFRE
   ========================================================= */

function openChest(){

  S.ending = true;

  show(
    "chestScreen"
  );

  audio(
    "startAmbience",
    "treasure"
  );

  const orbit =
    $("keyOrbit");

  orbit.innerHTML = "";

  for(
    let i = 0;
    i < 20;
    i++
  ){

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

    orbit.appendChild(
      k
    );

  }

}


/* =========================================================
   OUVERTURE DU COFFRE
   ========================================================= */

function chest(){

  audio(
    "chestOpen"
  );

  $("chestGraphic")
    .classList
    .add("open");

  setTimeout(

    () => {

      show(
        "chestScreen",
        false
      );

      memories();

    },

    1500

  );

}


/* =========================================================
   SOUVENIRS
   ========================================================= */

function memories(){

  const list =
    $("memoryList");

  list.innerHTML = "";

  GAME_DATA.memories
    .slice(0,20)
    .forEach(

      (m,i) => {

        const article =
          document.createElement(
            "article"
          );

        article.className =
          "memory-item reveal-memory";

        article.style.animationDelay =
          `${i * 55}ms`;

        article.innerHTML =

          `<span class="memory-icon">
            ${m.icon || "♥"}
          </span>

          <div>

            <strong>
              ${i + 1}. ${m.titleShort || m.title}
            </strong>

            <p>
              ${m.text || ""}
            </p>

          </div>`;

        list.appendChild(
          article
        );

      }

    );


  show(
    "memoriesScreen"
  );


  $("treasureBtn")
    .classList
    .remove("hidden");


  $("treasureBtn").onclick =

    () =>

      location.href =
        GAME_DATA.treasureLink;

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

      if(
        e.key === "Enter"
      ){

        validate();

      }

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
        "mapScreen"
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


/* =========================================================
   CARTE
   ========================================================= */

function drawMap(){

  const m =
    $("mapCanvas");

  const r =
    m.getBoundingClientRect();

  const d =
    Math.min(
      devicePixelRatio || 1,
      2
    );

  m.width =
    r.width * d;

  m.height =
    r.height * d;

  const x =
    m.getContext("2d");

  x.setTransform(
    d,
    0,
    0,
    d,
    0,
    0
  );


  x.fillStyle =
    "#b9d49b";

  x.fillRect(
    0,
    0,
    r.width,
    r.height
  );


  x.fillStyle =
    "#3d7d4b";

  x.beginPath();

  x.moveTo(
    r.width * .1,
    r.height * .7
  );

  x.quadraticCurveTo(
    r.width * .2,
    r.height * .15,
    r.width * .6,
    r.height * .12
  );

  x.quadraticCurveTo(
    r.width * .95,
    r.height * .18,
    r.width * .85,
    r.height * .75
  );

  x.quadraticCurveTo(
    r.width * .45,
    r.height * .98,
    r.width * .1,
    r.height * .7
  );

  x.fill();


  x.strokeStyle =
    "#f8df86";

  x.lineWidth = 6;

  x.setLineDash([
    3,
    8
  ]);

  x.beginPath();


  for(
    let i = 0;
    i < 20;
    i++
  ){

    const px =
      r.width *
      (
        .16 +
        (i % 5) * .17
      );

    const py =
      r.height *
      (
        .78 -
        Math.floor(i / 5) * .16
      );


    if(i)

      x.lineTo(
        px,
        py
      );

    else

      x.moveTo(
        px,
        py
      );

  }


  x.stroke();

  x.setLineDash([]);


  for(
    let i = 0;
    i < 20;
    i++
  ){

    const px =
      r.width *
      (
        .16 +
        (i % 5) * .17
      );

    const py =
      r.height *
      (
        .78 -
        Math.floor(i / 5) * .16
      );


    x.fillStyle =
      i < S.keys
        ? "#e4b33d"
        : "#fff0ae";

    x.beginPath();

    x.arc(
      px,
      py,
      11,
      0,
      Math.PI * 2
    );

    x.fill();


    x.fillStyle =
      "#392819";

    x.font =
      "bold 10px monospace";

    x.textAlign =
      "center";

    x.textBaseline =
      "middle";

    x.fillText(
      i + 1,
      px,
      py
    );

  }

}


/* =========================================================
   OUTILS DE DESSIN
   ========================================================= */

function R(
  x,
  y,
  w,
  h,
  col
){

  ctx.fillStyle =
    col;

  ctx.fillRect(
    Math.round(x),
    Math.round(y),
    Math.round(w),
    Math.round(h)
  );

}


function P(
  p,
  col
){

  ctx.fillStyle =
    col;

  ctx.beginPath();

  ctx.moveTo(
    p[0],
    p[1]
  );

  for(
    let i = 2;
    i < p.length;
    i += 2
  ){

    ctx.lineTo(
      p[i],
      p[i + 1]
    );

  }

  ctx.closePath();

  ctx.fill();

}


function C(
  x,
  y,
  r,
  col
){

  ctx.fillStyle =
    col;

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


/* =========================================================
   PALMIER
   ========================================================= */

function palm(
  x,
  y,
  s = 1
){

  P(

    [
      x,
      y - 120 * s,

      x + 80 * s,
      y - 145 * s,

      x + 38 * s,
      y - 105 * s,

      x + 100 * s,
      y - 85 * s,

      x + 24 * s,
      y - 88 * s,

      x + 78 * s,
      y - 35 * s,

      x + 4 * s,
      y - 76 * s,

      x - 60 * s,
      y - 48 * s,

      x - 15 * s,
      y - 88 * s,

      x - 80 * s,
      y - 88 * s,

      x - 25 * s,
      y - 104 * s

    ],

    "#3d8146"

  );


  P(

    [
      x - 9 * s,
      y,

      x + 9 * s,
      y,

      x + 20 * s,
      y - 85 * s,

      x - 4 * s,
      y - 95 * s

    ],

    "#70472c"

  );

}


/* =========================================================
   ARBRE
   ========================================================= */

function tree(
  x,
  y,
  s = 1
){

  R(
    x - 8 * s,
    y - 80 * s,
    16 * s,
    80 * s,
    "#67422a"
  );


  for(
    let i = 0;
    i < 8;
    i++
  ){

    C(

      x +
      (i - 3.5) *
      13 *
      s,

      y -
      90 *
      s -
      (i % 2) *
      10 *
      s,

      24 * s,

      i % 2
        ? "#2d7144"
        : "#3e844a"

    );

  }

}


/* =========================================================
   CELENA
   ========================================================= */

function celena(
  x,
  y,
  f
){

  const step =
    Math.sin(
      f * 1.7
    ) * 5;


  C(
    x,
    y - 78,
    19,
    "#f0b58f"
  );


  C(
    x,
    y - 93,
    22,
    "#39251f"
  );


  R(
    x - 25,
    y - 100,
    50,
    9,
    "#d8a557"
  );


  R(
    x - 17,
    y - 109,
    34,
    12,
    "#e5bd6d"
  );


  R(
    x - 18,
    y - 58,
    36,
    48,
    "#c95f70"
  );


  R(
    x - 27,
    y - 55,
    9,
    33,
    "#f0b58f"
  );


  R(
    x + 18,
    y - 55,
    9,
    33,
    "#f0b58f"
  );


  R(
    x - 17 + step,
    y - 10,
    12,
    38,
    "#293a50"
  );


  R(
    x + 5 - step,
    y - 10,
    12,
    38,
    "#293a50"
  );


  R(
    x - 21 + step,
    y + 22,
    18,
    8,
    "#172337"
  );


  R(
    x + 5 - step,
    y + 22,
    18,
    8,
    "#172337"
  );


  R(
    x + 18,
    y - 45,
    17,
    10,
    "#72502f"
  );


  R(
    x + 25,
    y - 40,
    9,
    28,
    "#72502f"
  );

}


/* =========================================================
   BOUTEILLE
   ========================================================= */

function bottle(
  x,
  y
){

  C(
    x,
    y,
    18,
    "#f2d98c"
  );

  R(
    x - 5,
    y - 26,
    10,
    16,
    "#b7d4b8"
  );

  R(
    x - 8,
    y - 31,
    16,
    6,
    "#6c4c34"
  );

  R(
    x - 13,
    y - 2,
    26,
    18,
    "#7da9a2"
  );

}


/* =========================================================
   CLÉ
   ========================================================= */

function key(
  x,
  y
){

  C(
    x,
    y,
    18,
    "rgba(255,220,90,.18)"
  );

  R(
    x - 3,
    y - 15,
    6,
    32,
    "#f3c44d"
  );

  C(
    x,
    y - 16,
    9,
    "#f3c44d"
  );

  C(
    x,
    y - 16,
    4,
    "#49301d"
  );

  R(
    x + 1,
    y + 8,
    12,
    6,
    "#f3c44d"
  );

  R(
    x + 1,
    y + 15,
    7,
    6,
    "#f3c44d"
  );

}


/* =========================================================
   COFFRE
   ========================================================= */

function chestGraphic(
  x,
  y,
  open
){

  R(
    x - 70,
    y - 45,
    140,
    55,
    "#6c3c20"
  );

  R(
    x - 60,
    y - 57,
    120,
    17,
    "#9a602b"
  );

  R(
    x - 10,
    y - 31,
    20,
    25,
    "#efc75b"
  );


  if(open){

    P(

      [
        x - 58,
        y - 57,

        x - 45,
        y - 105,

        x + 45,
        y - 105,

        x + 58,
        y - 57

      ],

      "#b47732"

    );

  }

}


/* =========================================================
   MONDE
   ========================================================= */

function drawWorld(){

  const w =
    canvas.clientWidth;

  const h =
    canvas.clientHeight;


  const d =
    Math.max(
      w / 960,
      h / 540
    );


  const cam =
    Math.max(
      0,

      Math.min(
        2040 - w / d,

        S.x -
        w / d * .48
      )

    );


  ctx.clearRect(
    0,
    0,
    w,
    h
  );


  ctx.save();

  ctx.scale(
    d,
    d
  );

  ctx.translate(
    -cam,
    0
  );


  const type =
    types[S.scene];


  let sky =
    "#67b9d7";

  let ground =
    "#e8c975";


  if(
    [
      "forest",
      "garden",
      "village"
    ].includes(type)
  ){

    sky =
      "#477e70";

    ground =
      "#4e7748";

  }


  if(
    [
      "mountain",
      "lake",
      "waterfall"
    ].includes(type)
  ){

    sky =
      "#557f9a";

    ground =
      "#758c70";

  }


  if(
    [
      "snow",
      "christmas",
      "memory",
      "iris",
      "stars",
      "treasure"
    ].includes(type)
  ){

    sky =
      "#142441";

    ground =
      "#4d4054";

  }


  R(
    cam,
    0,
    2300,
    370,
    sky
  );


  R(
    cam,
    370,
    2300,
    170,
    ground
  );


  for(
    let i = 0;
    i < 14;
    i++
  ){

    const xx =
      cam -
      100 +
      i * 180;


    if(
      [
        "beach",
        "cannes",
        "park"
      ].includes(type)
    ){

      palm(
        xx,
        470,
        1.15
      );

    }else{

      tree(
        xx,
        485,
        1.05
      );

    }

  }


  /* montagnes */

  if(
    [
      "mountain",
      "waterfall"
    ].includes(type)
  ){

    for(
      let i = 0;
      i < 5;
      i++
    ){

      P(

        [
          cam + i * 250,
          370,

          cam + 100 + i * 250,
          150,

          cam + 210 + i * 250,
          370

        ],

        i % 2
          ? "#536a65"
          : "#3f5c59"

      );

    }


    if(
      type === "waterfall"
    ){

      R(
        cam + 520,
        190,
        70,
        180,
        "#a9e2e2"
      );

      R(
        cam + 535,
        190,
        18,
        180,
        "#e1ffff"
      );

    }

  }


  /* ville */

  if(
    [
      "city",
      "cinema"
    ].includes(type)
  ){

    for(
      let i = 0;
      i < 10;
      i++
    ){

      const xx =
        cam +
        30 +
        i * 120;


      R(
        xx,
        220 -
        (i % 3) * 35,

        70,

        150 +
        (i % 3) * 35,

        "#40506a"
      );


      for(
        let j = 0;
        j < 4;
        j++
      ){

        R(

          xx +
          10 +
          j * 14,

          235 -
          (i % 3) * 35,

          7,
          9,

          "#f5d36d"

        );

      }

    }

  }


  /* neige */

  if(
    type === "snow"
  ){

    for(
      let i = 0;
      i < 25;
      i++
    ){

      C(

        cam +
        (i * 83) % 2200,

        100 +
        (i * 31) % 250,

        3,

        "#fff"

      );

    }

  }


  /* étoiles */

  if(
    [
      "stars",
      "treasure"
    ].includes(type)
  ){

    for(
      let i = 0;
      i < 40;
      i++
    ){

      C(

        cam +
        (i * 137) % 2200,

        60 +
        (i * 47) % 230,

        2,

        "#ffe9a2"

      );

    }

  }


  /* objet */

  if(
    type === "treasure"
  ){

    chestGraphic(
      S.x + 110,
      365,
      S.ending
    );

  }else if(
    S.scene === 0 &&
    !S.introDone
  ){

    bottle(
      240,
      410
    );

  }else{

    key(
      targets[S.scene],
      405
    );

  }


  /* Celena */

  celena(
    S.x,
    420,
    S.frame
  );


  ctx.restore();

}


/* =========================================================
   BOUCLE
   ========================================================= */

function loop(t){

  const dt =
    Math.min(
      .04,
      (t - S.last) / 1000 || 0
    );

  S.last = t;


  if(
    S.started &&
    !S.question &&
    !S.ending &&
    S.walking
  ){

    const dx =
      S.target -
      S.x;


    if(
      Math.abs(dx) < 3
    ){

      S.x =
        S.target;

      S.walking =
        false;

      setTimeout(
        arrive,
        300
      );

    }else{

      S.x +=
        Math.sign(dx) *
        (70 + S.scene * 2) *
        dt;

      S.frame +=
        dt * 8;

    }

  }


  drawWorld();

  requestAnimationFrame(
    loop
  );

}


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
