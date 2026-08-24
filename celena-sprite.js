"use strict";

/*
============================================================
MYSTERY LOVE ISLAND
CELENA SPRITE — 16 BIT / CHIBI
============================================================

Ce fichier ajoute un sprite Celena beaucoup plus détaillé :
- silhouette chibi 16-bit
- cheveux détaillés
- visage
- yeux
- tenue d'aventurière
- sac à dos
- chapeau
- ombres
- lumière
- 4 frames de marche
- respiration au repos
- petit flottement du sac
- rendu pixel net

Le déplacement reste celui de adventure.js.
============================================================
*/

(() => {

  const WORLD_W = 320;
  const WORLD_H = 180;

  let layer = null;
  let ctx = null;

  let frame = 0;
  let last = performance.now();

  const P = {

    outline: "#201820",
    outline2: "#30232a",

    hairDark: "#35201d",
    hair: "#5a3027",
    hairMid: "#754133",
    hairLight: "#9b6046",

    skinShadow: "#c87563",
    skin: "#efa587",
    skinLight: "#ffd0ac",
    skinHighlight: "#ffe0c0",

    eye: "#211a24",
    eyeLight: "#fff8e8",
    eyeBlue: "#496b83",

    mouth: "#9a4a55",
    blush: "#e28a87",

    hatDark: "#9b5c2c",
    hat: "#d5a14d",
    hatLight: "#f2cc76",
    hatShadow: "#bc7c36",
    hatBand: "#a84d43",

    shirtDark: "#963c55",
    shirt: "#d45b76",
    shirtLight: "#ef8092",
    shirtHighlight: "#f49baa",

    beltDark: "#4b2b24",
    belt: "#8f562e",
    beltLight: "#bd7940",

    pantsDark: "#1c293e",
    pants: "#2d4664",
    pantsLight: "#486784",

    bootsDark: "#1d2738",
    boots: "#34465c",
    bootsLight: "#52677a",

    bagDark: "#4d2c21",
    bag: "#80502e",
    bagLight: "#b26e3a",

    gold: "#f5c653",
    goldLight: "#ffe59a"

  };


  /*
  ==========================================================
  CRÉATION DU CANVAS
  ==========================================================
  */

  function createLayer() {

    if (layer) return;

    layer = document.createElement("canvas");

    layer.id = "celenaPixelLayer";

    layer.style.position = "fixed";
    layer.style.left = "0";
    layer.style.top = "0";
    layer.style.width = "100%";
    layer.style.height = "100%";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "5";

    document.body.appendChild(layer);

    ctx = layer.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    resize();

    window.addEventListener(
      "resize",
      resize
    );

  }


  function resize() {

    if (!layer) return;

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    layer.width =
      Math.floor(
        window.innerWidth * dpr
      );

    layer.height =
      Math.floor(
        window.innerHeight * dpr
      );

    ctx.imageSmoothingEnabled = false;

  }


  /*
  ==========================================================
  PIXEL RECT
  ==========================================================
  */

  function px(
    x,
    y,
    w,
    h,
    color
  ) {

    ctx.fillStyle = color;

    ctx.fillRect(
      Math.round(x),
      Math.round(y),
      Math.round(w),
      Math.round(h)
    );

  }


  /*
  ==========================================================
  DESSIN DU PERSONNAGE
  ==========================================================
  */

  function drawCelena(
    x,
    y,
    scale,
    walkFrame,
    walking
  ) {

    /*
      Sprite de référence :
      environ 44 × 86 pixels.
    */

    const s = scale;

    const bob =
      walking
        ? Math.sin(
            walkFrame * Math.PI / 2
          ) * 1.2
        : Math.sin(
            performance.now() / 650
          ) * .6;

    const B =
      y + bob;


    /*
    ----------------------------------------------------------
    OMBRE
    ----------------------------------------------------------
    */

    px(
      x - 24*s,
      B + 1*s,
      48*s,
      4*s,
      "rgba(20,18,24,.32)"
    );


    /*
    ----------------------------------------------------------
    JAMBES / MARCHE
    ----------------------------------------------------------
    */

    let leftLeg = 0;
    let rightLeg = 0;

    let leftFoot = 0;
    let rightFoot = 0;

    if (walking) {

      if (walkFrame === 0) {

        leftLeg = -3;
        rightLeg = 3;

        leftFoot = -4;
        rightFoot = 4;

      }

      else if (walkFrame === 1) {

        leftLeg = -1;
        rightLeg = 1;

        leftFoot = -1;
        rightFoot = 1;

      }

      else if (walkFrame === 2) {

        leftLeg = 3;
        rightLeg = -3;

        leftFoot = 4;
        rightFoot = -4;

      }

      else {

        leftLeg = 1;
        rightLeg = -1;

        leftFoot = 1;
        rightFoot = -1;

      }

    }


    /*
    ----------------------------------------------------------
    BOTTES GAUCHE
    ----------------------------------------------------------
    */

    px(
      x - 13*s + leftFoot*s,
      B - 3*s,
      12*s,
      7*s,
      P.outline
    );

    px(
      x - 11*s + leftFoot*s,
      B - 3*s,
      9*s,
      5*s,
      P.boots
    );

    px(
      x - 10*s + leftFoot*s,
      B - 3*s,
      5*s,
      2*s,
      P.bootsLight
    );


    /*
    ----------------------------------------------------------
    BOTTE DROITE
    ----------------------------------------------------------
    */

    px(
      x + 1*s + rightFoot*s,
      B - 3*s,
      12*s,
      7*s,
      P.outline
    );

    px(
      x + 3*s + rightFoot*s,
      B - 3*s,
      9*s,
      5*s,
      P.boots
    );

    px(
      x + 4*s + rightFoot*s,
      B - 3*s,
      5*s,
      2*s,
      P.bootsLight
    );


    /*
    ----------------------------------------------------------
    JAMBES
    ----------------------------------------------------------
    */

    px(
      x - 12*s + leftLeg*s,
      B - 29*s,
      11*s,
      28*s,
      P.outline
    );

    px(
      x - 10*s + leftLeg*s,
      B - 27*s,
      7*s,
      25*s,
      P.pants
    );

    px(
      x - 9*s + leftLeg*s,
      B - 25*s,
      3*s,
      16*s,
      P.pantsLight
    );


    px(
      x + 1*s + rightLeg*s,
      B - 29*s,
      11*s,
      28*s,
      P.outline
    );

    px(
      x + 3*s + rightLeg*s,
      B - 27*s,
      7*s,
      25*s,
      P.pants
    );

    px(
      x + 6*s + rightLeg*s,
      B - 25*s,
      3*s,
      16*s,
      P.pantsLight
    );


    /*
    ----------------------------------------------------------
    SAC À DOS
    ----------------------------------------------------------
    */

    px(
      x + 13*s,
      B - 61*s,
      15*s,
      34*s,
      P.outline
    );

    px(
      x + 15*s,
      B - 59*s,
      11*s,
      30*s,
      P.bagDark
    );

    px(
      x + 16*s,
      B - 56*s,
      9*s,
      22*s,
      P.bag
    );

    px(
      x + 18*s,
      B - 53*s,
      5*s,
      12*s,
      P.bagLight
    );

    px(
      x + 17*s,
      B - 43*s,
      8*s,
      3*s,
      P.bagDark
    );

    px(
      x + 19*s,
      B - 58*s,
      4*s,
      3*s,
      P.gold
    );


    /*
    ----------------------------------------------------------
    CORPS
    ----------------------------------------------------------
    */

    px(
      x - 19*s,
      B - 64*s,
      38*s,
      40*s,
      P.outline
    );

    px(
      x - 16*s,
      B - 61*s,
      32*s,
      35*s,
      P.shirt
    );

    px(
      x - 13*s,
      B - 59*s,
      8*s,
      27*s,
      P.shirtLight
    );

    px(
      x + 9*s,
      B - 59*s,
      6*s,
      31*s,
      P.shirtDark
    );


    /*
    ----------------------------------------------------------
    CEINTURE
    ----------------------------------------------------------
    */

    px(
      x - 16*s,
      B - 34*s,
      32*s,
      7*s,
      P.beltDark
    );

    px(
      x - 14*s,
      B - 33*s,
      28*s,
      4*s,
      P.belt
    );

    px(
      x - 3*s,
      B - 34*s,
      7*s,
      7*s,
      P.gold
    );

    px(
      x - 1*s,
      B - 33*s,
      3*s,
      5*s,
      P.beltDark
    );


    /*
    ----------------------------------------------------------
    BRAS GAUCHE
    ----------------------------------------------------------
    */

    let armL = 0;
    let armR = 0;

    if (walking) {

      armL =
        walkFrame === 0
          ? 3
          : walkFrame === 2
          ? -3
          : 0;

      armR =
        walkFrame === 0
          ? -3
          : walkFrame === 2
          ? 3
          : 0;

    }

    px(
      x - 25*s + armL*s,
      B - 62*s,
      11*s,
      30*s,
      P.outline
    );

    px(
      x - 23*s + armL*s,
      B - 60*s,
      7*s,
      23*s,
      P.skin
    );

    px(
      x - 22*s + armL*s,
      B - 58*s,
      3*s,
      14*s,
      P.skinLight
    );

    px(
      x - 22*s + armL*s,
      B - 39*s,
      7*s,
      8*s,
      P.skinShadow
    );


    /*
    ----------------------------------------------------------
    BRAS DROIT
    ----------------------------------------------------------
    */

    px(
      x + 14*s + armR*s,
      B - 62*s,
      11*s,
      30*s,
      P.outline
    );

    px(
      x + 16*s + armR*s,
      B - 60*s,
      7*s,
      23*s,
      P.skin
    );

    px(
      x + 17*s + armR*s,
      B - 58*s,
      3*s,
      14*s,
      P.skinLight
    );

    px(
      x + 16*s + armR*s,
      B - 39*s,
      7*s,
      8*s,
      P.skinShadow
    );


    /*
    ----------------------------------------------------------
    COU
    ----------------------------------------------------------
    */

    px(
      x - 9*s,
      B - 76*s,
      18*s,
      14*s,
      P.outline
    );

    px(
      x - 7*s,
      B - 74*s,
      14*s,
      11*s,
      P.skin
    );

    px(
      x - 4*s,
      B - 72*s,
      8*s,
      6*s,
      P.skinLight
    );


    /*
    ----------------------------------------------------------
    CHEVEUX ARRIÈRE
    ----------------------------------------------------------
    */

    px(
      x - 22*s,
      B - 102*s,
      44*s,
      40*s,
      P.outline
    );

    px(
      x - 20*s,
      B - 100*s,
      40*s,
      36*s,
      P.hairDark
    );


    /*
      Mèches gauche
    */

    px(
      x - 25*s,
      B - 94*s,
      9*s,
      32*s,
      P.hair
    );

    px(
      x - 27*s,
      B - 86*s,
      8*s,
      22*s,
      P.hair
    );

    px(
      x - 22*s,
      B - 83*s,
      5*s,
      17*s,
      P.hairLight
    );


    /*
      Mèches droite
    */

    px(
      x + 16*s,
      B - 94*s,
      9*s,
      33*s,
      P.hair
    );

    px(
      x + 19*s,
      B - 86*s,
      8*s,
      22*s,
      P.hairDark
    );

    px(
      x + 16*s,
      B - 82*s,
      5*s,
      16*s,
      P.hairLight
    );


    /*
    ----------------------------------------------------------
    VISAGE
    ----------------------------------------------------------
    */

    px(
      x - 19*s,
      B - 95*s,
      38*s,
      33*s,
      P.outline
    );

    px(
      x - 17*s,
      B - 93*s,
      34*s,
      29*s,
      P.skin
    );

    px(
      x - 14*s,
      B - 91*s,
      25*s,
      23*s,
      P.skinLight
    );

    px(
      x - 17*s,
      B - 92*s,
      34*s,
      7*s,
      P.skinShadow
    );


    /*
    ----------------------------------------------------------
    FRANGE
    ----------------------------------------------------------
    */

    px(
      x - 18*s,
      B - 99*s,
      36*s,
      12*s,
      P.outline
    );

    px(
      x - 16*s,
      B - 97*s,
      32*s,
      9*s,
      P.hairDark
    );

    px(
      x - 13*s,
      B - 94*s,
      7*s,
      5*s,
      P.hairMid
    );

    px(
      x + 7*s,
      B - 94*s,
      6*s,
      5*s,
      P.hairLight
    );


    /*
    ----------------------------------------------------------
    SOURCILS
    ----------------------------------------------------------
    */

    px(
      x - 12*s,
      B - 83*s,
      9*s,
      2*s,
      P.hairDark
    );

    px(
      x + 4*s,
      B - 83*s,
      9*s,
      2*s,
      P.hairDark
    );


    /*
    ----------------------------------------------------------
    YEUX
    ----------------------------------------------------------
    */

    px(
      x - 12*s,
      B - 80*s,
      8*s,
      7*s,
      P.eye
    );

    px(
      x - 10*s,
      B - 79*s,
      3*s,
      3*s,
      P.eyeLight
    );

    px(
      x + 4*s,
      B - 80*s,
      8*s,
      7*s,
      P.eye
    );

    px(
      x + 5*s,
      B - 79*s,
      3*s,
      3*s,
      P.eyeLight
    );


    /*
    ----------------------------------------------------------
    PETITES JOUES
    ----------------------------------------------------------
    */

    px(
      x - 14*s,
      B - 73*s,
      5*s,
      3*s,
      P.blush
    );

    px(
      x + 9*s,
      B - 73*s,
      5*s,
      3*s,
      P.blush
    );


    /*
    ----------------------------------------------------------
    NEZ
    ----------------------------------------------------------
    */

    px(
      x - 1*s,
      B - 74*s,
      4*s,
      4*s,
      P.skinShadow
    );

    px(
      x + 1*s,
      B - 73*s,
      3*s,
      2*s,
      P.skinLight
    );


    /*
    ----------------------------------------------------------
    SOURIRE
    ----------------------------------------------------------
    */

    px(
      x - 6*s,
      B - 68*s,
      12*s,
      2*s,
      P.mouth
    );

    px(
      x - 4*s,
      B - 66*s,
      8*s,
      2*s,
      P.mouth
    );

    px(
      x - 2*s,
      B - 66*s,
      4*s,
      1*s,
      P.skinLight
    );


    /*
    ----------------------------------------------------------
    CHAPEAU
    ----------------------------------------------------------
    */

    px(
      x - 27*s,
      B - 108*s,
      54*s,
      10*s,
      P.outline
    );

    px(
      x - 25*s,
      B - 107*s,
      50*s,
      7*s,
      P.hat
    );

    px(
      x - 19*s,
      B - 108*s,
      38*s,
      4*s,
      P.hatLight
    );


    /*
      Couronne du chapeau
    */

    px(
      x - 19*s,
      B - 118*s,
      38*s,
      14*s,
      P.outline
    );

    px(
      x - 17*s,
      B - 116*s,
      34*s,
      11*s,
      P.hat
    );

    px(
      x - 12*s,
      B - 114*s,
      24*s,
      6*s,
      P.hatLight
    );


    /*
      Ruban
    */

    px(
      x - 17*s,
      B - 108*s,
      34*s,
      5*s,
      P.hatBand
    );

    px(
      x - 13*s,
      B - 107*s,
      26*s,
      2*s,
      "#c85d4d"
    );


    /*
    ----------------------------------------------------------
    PETIT PIN DORÉ
    ----------------------------------------------------------
    */

    px(
      x + 10*s,
      B - 108*s,
      6*s,
      6*s,
      P.gold
    );

    px(
      x + 13*s,
      B - 106*s,
      5*s,
      3*s,
      P.goldLight
    );


    /*
    ----------------------------------------------------------
    LUMIÈRE SUR LES VÊTEMENTS
    ----------------------------------------------------------
    */

    px(
      x - 15*s,
      B - 58*s,
      3*s,
      12*s,
      P.shirtHighlight
    );

    px(
      x + 10*s,
      B - 57*s,
      3*s,
      10*s,
      P.shirtDark
    );


    /*
    ----------------------------------------------------------
    PETITS DÉTAILS
    ----------------------------------------------------------
    */

    px(
      x - 17*s,
      B - 31*s,
      3*s,
      7*s,
      P.pantsLight
    );

    px(
      x + 8*s,
      B - 31*s,
      3*s,
      7*s,
      P.pantsLight
    );

  }


  /*
  ==========================================================
  POSITION DU SPRITE
  ==========================================================
  */

  function getState() {

    if (
      !window.MysteryLoveIsland ||
      !window.MysteryLoveIsland.state
    ) {

      return null;

    }

    return window.MysteryLoveIsland.state;

  }


  function render() {

    if (!ctx || !layer) return;

    ctx.clearRect(
      0,
      0,
      layer.width,
      layer.height
    );


    const game =
      document.getElementById(
        "gameScreen"
      );


    if (
      !game ||
      game.classList.contains("hidden")
    ) {

      requestAnimationFrame(
        render
      );

      return;

    }


    const S =
      getState();


    if (!S) {

      requestAnimationFrame(
        render
      );

      return;

    }


    /*
      adventure.js utilise un monde logique
      de 320 × 180.

      Celena reste volontairement légèrement
      à gauche du centre lorsque la caméra suit.
    */

    const scale =
      Math.max(
        layer.width / WORLD_W,
        layer.height / WORLD_H
      );


    const logicalX = 110;

    const logicalY = 146;


    const screenX =
      (
        layer.width -
        WORLD_W * scale
      ) / 2
      +
      logicalX * scale;


    const screenY =
      (
        layer.height -
        WORLD_H * scale
      ) / 2
      +
      logicalY * scale;


    /*
      Taille volontairement plus grande que
      l'ancien sprite afin de couvrir son rendu.
    */

    const spriteScale =
      Math.max(
        1.65,
        scale * .92
      );


    const now =
      performance.now();


    if (
      now-last >
      125
    ) {

      frame =
        (frame+1)%4;

      last=now;

    }


    const walking =
      !!S.walking;


    drawCelena(
      screenX,
      screenY,
      spriteScale,
      frame,
      walking
    );


    requestAnimationFrame(
      render
    );

  }


  /*
  ==========================================================
  INITIALISATION
  ==========================================================
  */

  function init() {

    createLayer();

    requestAnimationFrame(
      render
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  }

  else {

    init();

  }

})();
