/* ============================================================
   MYSTERY LOVE ISLAND
   PIXEL-ART.JS
   ============================================================ */

"use strict";

window.PixelArt = (() => {

  const BASE_W = 384;
  const BASE_H = 216;


  const scenes = [

    ["beach", "PLAGE", ["#4aa6c7", "#e9cd78"]],
    ["beach", "CRIQUE", ["#5fb4cc", "#e5c873"]],

    ["forest", "FORÊT", ["#244e45", "#8eb35c"]],
    ["forest", "FORÊT LUXURIANTE", ["#173c32", "#7ea553"]],

    ["mountain", "MONTAGNES", ["#4d7190", "#d7b76c"]],
    ["lake", "LAC", ["#397d9c", "#cdb56e"]],

    ["forest", "JARDIN", ["#315d40", "#b5bd73"]],
    ["city", "VILLE", ["#315e88", "#8e8f8d"]],

    ["cinema", "CINÉMA", ["#273d59", "#76555c"]],
    ["village", "VILLAGE", ["#557b5a", "#c4aa6b"]],

    ["waterfall", "CASCADE", ["#3d7895", "#9ab86d"]],
    ["cannes", "CANNES", ["#4ea6c2", "#e5ca76"]],

    ["park", "PARC", ["#4e9d75", "#d7c47a"]],
    ["snow", "NEIGE", ["#536f89", "#e7edf0"]],

    ["memory", "SOUVENIR", ["#392e55", "#6e5a76"]],
    ["christmas", "NOËL", ["#172b3c", "#a34c4c"]],

    ["iris", "IRIS", ["#3d536f", "#d58aa4"]],
    ["stadium", "STADE", ["#324b59", "#75934e"]],

    ["stars", "SOUS LES ÉTOILES", ["#10152e", "#4b3867"]],
    ["treasure", "LE COFFRE", ["#1a1730", "#60402e"]]

  ];


  function rect(c, x, y, w, h, color){

    c.fillStyle = color;

    c.fillRect(
      x | 0,
      y | 0,
      w | 0,
      h | 0
    );

  }


  function poly(c, points, color){

    c.fillStyle = color;

    c.beginPath();

    c.moveTo(
      points[0],
      points[1]
    );

    for(
      let i = 2;
      i < points.length;
      i += 2
    ){

      c.lineTo(
        points[i],
        points[i + 1]
      );

    }

    c.closePath();

    c.fill();

  }


  function circle(c, x, y, r, color){

    c.fillStyle = color;

    c.beginPath();

    c.arc(
      x,
      y,
      r,
      0,
      Math.PI * 2
    );

    c.fill();

  }


  function drawPalm(c, x, y, s = 1){

    rect(
      c,
      x - 5 * s,
      y - 55 * s,
      10 * s,
      55 * s,
      "#714329"
    );

    for(
      let a = -1.2;
      a < 1.3;
      a += .45
    ){

      poly(
        c,
        [
          x,
          y - 52 * s,
          x + Math.cos(a) * 55 * s,
          y - 80 * s,
          x + Math.cos(a + .25) * 48 * s,
          y - 45 * s
        ],
        "#4c8b4f"
      );

    }

  }


  function drawTree(c, x, y, s = 1){

    rect(
      c,
      x - 5 * s,
      y - 58 * s,
      10 * s,
      58 * s,
      "#62402c"
    );

    for(
      let a = 0;
      a < 6;
      a++
    ){

      circle(
        c,
        x + (a - 2.5) * 12 * s,
        y - 67 * s - (a % 2) * 8 * s,
        18 * s,
        "#37744c"
      );

    }

  }


  function drawMountain(c, x, y, s = 1){

    poly(
      c,
      [
        x - 75 * s,
        y,

        x,
        y - 95 * s,

        x + 75 * s,
        y
      ],
      "#536c67"
    );

    poly(
      c,
      [
        x - 18 * s,
        y - 65 * s,

        x,
        y - 95 * s,

        x + 18 * s,
        y - 65 * s
      ],
      "#dfe0c4"
    );

  }


  function drawWaterfall(c, x, y, s = 1){

    poly(
      c,
      [
        x - 65 * s,
        y,

        x - 35 * s,
        y - 95 * s,

        x + 35 * s,
        y - 95 * s,

        x + 65 * s,
        y
      ],
      "#587c76"
    );

    rect(
      c,
      x - 16 * s,
      y - 95 * s,
      32 * s,
      95 * s,
      "#80c8d2"
    );

    rect(
      c,
      x - 4 * s,
      y - 95 * s,
      8 * s,
      95 * s,
      "#b8e8e5"
    );

  }


  function drawHouse(c, x, y, s = 1){

    rect(
      c,
      x - 28 * s,
      y - 32 * s,
      56 * s,
      32 * s,
      "#8a5a37"
    );

    poly(
      c,
      [
        x - 36 * s,
        y - 32 * s,

        x,
        y - 62 * s,

        x + 36 * s,
        y - 32 * s
      ],
      "#6b3c2c"
    );

    rect(
      c,
      x - 7 * s,
      y - 22 * s,
      14 * s,
      22 * s,
      "#3d2a22"
    );

  }


  function drawRuins(c, x, y, s = 1){

    rect(
      c,
      x - 45 * s,
      y - 58 * s,
      10 * s,
      58 * s,
      "#67546a"
    );

    rect(
      c,
      x + 35 * s,
      y - 58 * s,
      10 * s,
      58 * s,
      "#67546a"
    );

    rect(
      c,
      x - 50 * s,
      y - 65 * s,
      100 * s,
      10 * s,
      "#80666e"
    );

    for(
      let i = 0;
      i < 5;
      i++
    ){

      rect(
        c,
        x - 40 * s + i * 20 * s,
        y - 15 * s,
        8 * s,
        15 * s,
        "#473c51"
      );

    }

  }


  function drawChest(
    c,
    x,
    y,
    s = 1,
    open = false
  ){

    rect(
      c,
      x - 35 * s,
      y - 25 * s,
      70 * s,
      25 * s,
      "#74431f"
    );

    rect(
      c,
      x - 30 * s,
      y - 35 * s,
      60 * s,
      12 * s,
      "#9a632b"
    );

    rect(
      c,
      x - 4 * s,
      y - 20 * s,
      8 * s,
      10 * s,
      "#f2c55b"
    );

    if(open){

      poly(
        c,
        [
          x - 30 * s,
          y - 34 * s,

          x - 20 * s,
          y - 58 * s,

          x + 20 * s,
          y - 58 * s,

          x + 30 * s,
          y - 34 * s
        ],
        "#b77a31"
      );

    }

  }


  function drawCelena(
    c,
    x,
    y,
    frame = 0,
    scale = 1
  ){

    x |= 0;
    y |= 0;

    circle(
      c,
      x,
      y + 2,
      13 * scale,
      "#5a5137aa"
    );

    /* cheveux */

    circle(
      c,
      x,
      y - 52 * scale,
      15 * scale,
      "#3b241e"
    );

    rect(
      c,
      x - 15 * scale,
      y - 53 * scale,
      30 * scale,
      22 * scale,
      "#3b241e"
    );

    /* visage */

    circle(
      c,
      x,
      y - 49 * scale,
      11 * scale,
      "#f1b993"
    );

    /* chapeau */

    rect(
      c,
      x - 14 * scale,
      y - 64 * scale,
      28 * scale,
      6 * scale,
      "#d3a451"
    );

    rect(
      c,
      x - 9 * scale,
      y - 70 * scale,
      18 * scale,
      8 * scale,
      "#e1bd70"
    );

    /* corps */

    rect(
      c,
      x - 11 * scale,
      y - 38 * scale,
      22 * scale,
      29 * scale,
      "#c96a72"
    );

    rect(
      c,
      x + 9 * scale,
      y - 34 * scale,
      7 * scale,
      18 * scale,
      "#6b4c32"
    );

    /* bras */

    rect(
      c,
      x - 17 * scale,
      y - 36 * scale,
      6 * scale,
      25 * scale,
      "#f1b993"
    );

    rect(
      c,
      x + 11 * scale,
      y - 36 * scale,
      6 * scale,
      25 * scale,
      "#f1b993"
    );

    /* jambes */

    const step =
      Math.sin(frame * Math.PI) *
      3 *
      scale;

    rect(
      c,
      x - 10 * scale + step,
      y - 9 * scale,
      7 * scale,
      22 * scale,
      "#26364a"
    );

    rect(
      c,
      x + 3 * scale - step,
      y - 9 * scale,
      7 * scale,
      22 * scale,
      "#26364a"
    );

    /* bottes */

    rect(
      c,
      x - 12 * scale + step,
      y + 10 * scale,
      10 * scale,
      5 * scale,
      "#182333"
    );

    rect(
      c,
      x + 3 * scale - step,
      y + 10 * scale,
      10 * scale,
      5 * scale,
      "#182333"
    );

  }


  function drawKey(
    c,
    x,
    y,
    s = 1,
    glow = true
  ){

    if(glow){

      circle(
        c,
        x,
        y,
        13 * s,
        "#ffd75a22"
      );

    }

    rect(
      c,
      x - 2 * s,
      y - 12 * s,
      4 * s,
      22 * s,
      "#f5c85a"
    );

    circle(
      c,
      x - 1 * s,
      y - 13 * s,
      7 * s,
      "#f5c85a"
    );

    circle(
      c,
      x - 1 * s,
      y - 13 * s,
      3 * s,
      "#473522"
    );

    rect(
      c,
      x + 1 * s,
      y + 4 * s,
      9 * s,
      4 * s,
      "#f5c85a"
    );

    rect(
      c,
      x + 1 * s,
      y + 10 * s,
      6 * s,
      4 * s,
      "#f5c85a"
    );

  }


  function drawScene(
    ctx,
    w,
    h,
    scene,
    playerX,
    playerY,
    frame
  ){

    const [
      type,
      name,
      palette
    ] =
      scenes[
        Math.max(
          0,
          Math.min(19, scene)
        )
      ];

    const sx = BASE_W / w;
    const sy = BASE_H / h;

    ctx.save();

    ctx.scale(sx, sy);

    const cam =
      Math.max(
        0,
        Math.min(
          30,
          (playerX - 55) * .18
        )
      );

    ctx.translate(
      -cam,
      0
    );

    const c = ctx;

    const grad =
      c.createLinearGradient(
        0,
        0,
        0,
        BASE_H
      );

    grad.addColorStop(
      0,
      palette[0]
    );

    grad.addColorStop(
      .52,
      palette[0]
    );

    grad.addColorStop(
      .53,
      palette[1]
    );

    grad.addColorStop(
      1,
      palette[1]
    );

    c.fillStyle = grad;

    c.fillRect(
      0,
      0,
      BASE_W,
      BASE_H
    );


    if(
      type === "beach" ||
      type === "cannes"
    ){

      for(
        let y = 92;
        y < 132;
        y += 8
      ){

        rect(
          c,
          0,
          y,
          BASE_W,
          3,
          "#d9f3ed35"
        );

      }

      drawPalm(
        c,
        55,
        168,
        1.2
      );

      drawPalm(
        c,
        330,
        170,
        .9
      );

    }


    if(
      type === "forest" ||
      type === "garden" ||
      type === "village" ||
      type === "park"
    ){

      for(
        let x = 20;
        x < 390;
        x += 48
      ){

        drawTree(
          c,
          x,
          158,
          1
        );

      }

      for(
        let i = 0;
        i < 18;
        i++
      ){

        circle(
          c,
          (i * 71) % 384,
          180 - (i % 4) * 5,
          2,
          "#e8c85a"
        );

      }

    }


    if(type === "mountain"){

      drawMountain(
        c,
        100,
        130,
        1.1
      );

      drawMountain(
        c,
        280,
        133,
        .9
      );

      drawWaterfall(
        c,
        205,
        140,
        1
      );

    }


    if(type === "lake"){

      drawMountain(
        c,
        75,
        118,
        .8
      );

      drawMountain(
        c,
        315,
        125,
        .9
      );

      rect(
        c,
        0,
        116,
        384,
        55,
        "#4b9dbb"
      );

      for(
        let y = 125;
        y < 165;
        y += 12
      ){

        rect(
          c,
          0,
          y,
          384,
          2,
          "#b9e0dd55"
        );

      }

    }


    if(
      type === "city" ||
      type === "cinema" ||
      type === "stadium"
    ){

      for(
        let i = 0;
        i < 8;
        i++
      ){

        const x =
          i * 52 + 5;

        const hh =
          35 + (i % 4) * 13;

        rect(
          c,
          x,
          112 - hh,
          38,
          hh,
          "#243a4e"
        );

        for(
          let yy = 120 - hh;
          yy < 112;
          yy += 9
        ){

          rect(
            c,
            x + 6,
            yy,
            5,
            4,
            "#f7d56a"
          );

        }

      }

      if(type === "cinema"){

        drawHouse(
          c,
          190,
          150,
          1
        );

      }

    }


    if(type === "snow"){

      for(
        let i = 0;
        i < 60;
        i++
      ){

        circle(
          c,
          (i * 37) % 384,
          (i * 19) % 170,
          1.5,
          "#fff"
        );

      }

      rect(
        c,
        0,
        150,
        384,
        66,
        "#eef4f3"
      );

    }


    if(
      type === "memory" ||
      type === "iris"
    ){

      drawRuins(
        c,
        190,
        160,
        1
      );

      for(
        let i = 0;
        i < 12;
        i++
      ){

        circle(
          c,
          (i * 53) % 384,
          50 + (i % 4) * 18,
          2,
          "#f5c85a"
        );

      }

    }


    if(type === "christmas"){

      drawTree(
        c,
        70,
        168,
        1.2
      );

      drawTree(
        c,
        315,
        168,
        1
      );

      for(
        let i = 0;
        i < 18;
        i++
      ){

        circle(
          c,
          (i * 41) % 384,
          35 + (i % 6) * 20,
          2,
          "#f5c85a"
        );

      }

    }


    if(type === "stars"){

      c.fillStyle = "#11152f";

      c.fillRect(
        0,
        0,
        384,
        216
      );

      for(
        let i = 0;
        i < 75;
        i++
      ){

        circle(
          c,
          (i * 43) % 384,
          (i * 17) % 145,
          1.5,
          "#ffe99b"
        );

      }

      circle(
        c,
        310,
        40,
        18,
        "#f3e5bb"
      );

    }


    if(type === "treasure"){

      c.fillStyle = "#16132b";

      c.fillRect(
        0,
        0,
        384,
        216
      );

      for(
        let i = 0;
        i < 40;
        i++
      ){

        circle(
          c,
          (i * 47) % 384,
          (i * 29) % 170,
          1.5,
          "#ffd96a"
        );

      }

      drawRuins(
        c,
        192,
        165,
        1.2
      );

      drawChest(
        c,
        270,
        170,
        1.15,
        true
      );

    }


    if(scene < 19){

      for(
        let x = 20;
        x < 370;
        x += 18
      ){

        circle(
          c,
          x,
          183,
          2,
          "#f2e0a0"
        );

      }

    }


    if(
      scene === 0 &&
      !window.GameState?.bottleFound
    ){

      rect(
        c,
        112,
        171,
        7,
        18,
        "#7fc3a2"
      );

      rect(
        c,
        110,
        168,
        11,
        4,
        "#e7c77a"
      );

    }


    if(
      scene > 0 &&
      scene < 19
    ){

      const kx = 300;
      const ky = 153;

      circle(
        c,
        kx,
        ky,
        20,
        "#f5c85a14"
      );

      drawKey(
        c,
        kx,
        ky,
        1.05,
        true
      );

    }


    drawCelena(
      c,
      playerX + cam,
      playerY,
      frame,
      1.45
    );

    ctx.restore();

  }


  function drawMap(
    ctx,
    w,
    h,
    keys
  ){

    const sx = 384 / w;
    const sy = 216 / h;

    ctx.save();

    ctx.scale(
      sx,
      sy
    );

    ctx.fillStyle = "#83a96e";

    ctx.fillRect(
      0,
      0,
      384,
      216
    );


    poly(
      ctx,
      [
        22,30,
        70,12,
        130,22,
        185,10,
        252,27,
        335,20,
        365,55,
        350,100,
        366,145,
        335,190,
        278,202,
        220,188,
        165,205,
        105,188,
        55,196,
        25,160,
        35,110
      ],
      "#3f744b"
    );


    for(
      let i = 0;
      i < 20;
      i++
    ){

      const col =
        i < keys
          ? "#f5c85a"
          : "#392c21";

      const x =
        45 +
        (i % 5) * 62 +
        ((i / 5) | 0) * 3;

      const y =
        45 +
        ((i / 5) | 0) * 38;

      circle(
        ctx,
        x,
        y,
        7,
        col
      );

      ctx.fillStyle =
        i < keys
          ? "#3b2917"
          : "#9b886a";

      ctx.font =
        "bold 7px monospace";

      ctx.textAlign = "center";

      ctx.fillText(
        String(i + 1),
        x,
        y + 2
      );

    }


    ctx.restore();

  }


  return {
    BASE_W,
    BASE_H,
    scenes,
    drawScene,
    drawMap
  };

})();
