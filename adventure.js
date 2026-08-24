/*
============================================================
MYSTERY LOVE ISLAND
ADVENTURE.JS — VERSION PIXEL ADVENTURE

- déplacement AUTOMATIQUE uniquement
- caméra qui suit Celena
- rendu pixel-art basse résolution
- décors détaillés
- Celena aventurière
- animation de marche
- aucun souvenir révélé pendant l'aventure
- 20 clés
- coffre final
- révélation des souvenirs uniquement à la fin
============================================================
*/

"use strict";

(() => {

const $ = id => document.getElementById(id);

const canvas = $("world");
if (!canvas) return;

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;


/* =========================================================
   RENDU PIXEL
========================================================= */

const VW = 320;
const VH = 180;

const buffer = document.createElement("canvas");
buffer.width = VW;
buffer.height = VH;

const g = buffer.getContext("2d");
g.imageSmoothingEnabled = false;

function resize(){

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    ctx.imageSmoothingEnabled = false;
}

addEventListener("resize", resize);
resize();


/* =========================================================
   PALETTE
========================================================= */

const C = {

    sky: "#65b7d2",
    skyLight: "#91d4df",

    sea: "#2389ad",
    seaLight: "#54b5c7",
    seaDark: "#176f92",

    sand: "#e8c86d",
    sandLight: "#f2d98b",
    sandDark: "#c69e4d",

    grass: "#3f7748",
    grass2: "#5c9850",
    grass3: "#79ad58",
    grassDark: "#28583a",

    tree: "#245a38",
    tree2: "#397b46",
    tree3: "#579451",

    trunk: "#70442d",
    trunkDark: "#4d3024",

    stone: "#6d7780",
    stoneLight: "#90979a",
    stoneDark: "#4b565c",

    wood: "#75451f",
    woodLight: "#a96b32",
    woodDark: "#4d2d1c",

    gold: "#f6ca55",
    goldLight: "#ffe9a0",
    goldDark: "#bd862d",

    skin: "#f2b58d",
    skinLight: "#ffd0a9",
    skinDark: "#c87863",

    hair: "#33231f",
    hairLight: "#52372c",

    shirt: "#d85d76",
    shirtDark: "#a83f59",

    pants: "#263c5b",
    pantsDark: "#182b43",

    boot: "#202d42",

    bag: "#7b4d2d",
    bagLight: "#a86c37",

    white: "#fff7dc",
    black: "#17202a",

    purple: "#67558f",
    night: "#17213b"

};


/* =========================================================
   JEU
========================================================= */

const WORLD_W = 6000;

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

const environments = [

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

const targets = Array.from(
    {length:20},
    (_,i) => 260 + i * 285
);


/* =========================================================
   ETAT
========================================================= */

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

    lines:[],

    lineIndex:0,

    dialogDone:null,

    lastTime:0,

    mapOpen:false

};


/* =========================================================
   UTILITAIRES DOM
========================================================= */

function show(id,on=true){

    const el=$(id);

    if(el){
        el.classList.toggle("hidden",!on);
    }

}

function setText(id,value){

    const el=$(id);

    if(el){
        el.textContent=value;
    }

}

function play(name,arg){

    try{

        if(
            window.AudioEngine &&
            typeof window.AudioEngine[name] === "function"
        ){

            window.AudioEngine[name](arg);

        }

    }catch(e){}

}

function norm(v){

    return String(v || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9]+/g," ")
        .trim();

}


/* =========================================================
   HUD
========================================================= */

function updateHUD(){

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

    if(S.scene >= 19){

        setText(
            "objective",
            "Le coffre mystérieux t'attend."
        );

    }else{

        setText(
            "objective",
            "Celena marche automatiquement vers le prochain mystère."
        );

    }

}


/* =========================================================
   DIALOGUE
========================================================= */

function dialog(lines,done){

    S.lines = lines || [];
    S.lineIndex = 0;
    S.dialogDone = done || null;

    show("dialog",true);

    setText(
        "dialogText",
        S.lines[0] || ""
    );

}

function nextDialog(){

    if(!S.lines.length) return;

    S.lineIndex++;

    play("button");

    if(S.lineIndex >= S.lines.length){

        show("dialog",false);

        const done = S.dialogDone;

        S.lines=[];
        S.dialogDone=null;

        if(done) done();

        return;
    }

    setText(
        "dialogText",
        S.lines[S.lineIndex]
    );

}


/* =========================================================
   DESSIN PIXEL — OUTILS
========================================================= */

function rect(x,y,w,h,c){

    g.fillStyle=c;
    g.fillRect(
        Math.round(x),
        Math.round(y),
        Math.round(w),
        Math.round(h)
    );

}

function poly(points,c){

    g.fillStyle=c;
    g.beginPath();

    g.moveTo(points[0][0],points[0][1]);

    for(let i=1;i<points.length;i++){
        g.lineTo(points[i][0],points[i][1]);
    }

    g.closePath();
    g.fill();

}

function circle(x,y,r,c){

    g.fillStyle=c;
    g.beginPath();
    g.arc(x,y,r,0,Math.PI*2);
    g.fill();

}

function line(x1,y1,x2,y2,c,w=1){

    g.strokeStyle=c;
    g.lineWidth=w;
    g.beginPath();
    g.moveTo(x1,y1);
    g.lineTo(x2,y2);
    g.stroke();

}


/* =========================================================
   CIEL
========================================================= */

function sky(time){

    const e = environments[S.scene];

    let top=C.sky;
    let bottom=C.skyLight;

    if(
        e==="snow" ||
        e==="stars" ||
        e==="christmas"
    ){

        top="#263252";
        bottom="#596a8c";

    }

    if(
        e==="cinema" ||
        e==="cannes"
    ){

        top="#6aa7c4";
        bottom="#c6d8c2";

    }

    const grad=g.createLinearGradient(0,0,0,VH);

    grad.addColorStop(0,top);
    grad.addColorStop(1,bottom);

    g.fillStyle=grad;
    g.fillRect(0,0,VW,VH);

}


/* =========================================================
   SOLEIL / LUNE
========================================================= */

function celestial(){

    const e=environments[S.scene];

    if(
        e==="stars" ||
        e==="christmas" ||
        e==="snow"
    ){

        circle(260,27,14,"#f5edbd");

        for(let i=0;i<35;i++){

            const x=(i*83)%VW;
            const y=8+((i*37)%65);

            rect(
                x,
                y,
                1,
                1,
                i%3===0 ? C.gold : C.white
            );

        }

    }else{

        circle(
            267,
            29,
            15,
            "#ffe5a1"
        );

        circle(
            271,
            25,
            15,
            "rgba(255,255,255,.12)"
        );

    }

}


/* =========================================================
   NUAGES
========================================================= */

function clouds(){

    const shift = -(S.camera * .08)%400;

    for(let i=0;i<5;i++){

        const x=shift+i*105;

        circle(x,34,8,"rgba(255,255,255,.65)");
        circle(x+8,31,11,"rgba(255,255,255,.65)");
        circle(x+18,35,7,"rgba(255,255,255,.65)");

    }

}


/* =========================================================
   MER
========================================================= */

function sea(){

    rect(0,73,VW,65,C.sea);

    for(let y=78;y<136;y+=11){

        const off=(S.camera*.18+y)%30;

        for(let x=-40;x<VW+40;x+=42){

            line(
                x-off,
                y,
                x+18-off,
                y,
                C.seaLight,
                1
            );

        }

    }

    rect(
        0,
        73,
        VW,
        3,
        "rgba(255,255,255,.25)"
    );

}


/* =========================================================
   PLAGE
========================================================= */

function beachGround(){

    rect(
        0,
        115,
        VW,
        65,
        C.sand
    );

    for(let i=0;i<25;i++){

        const x=(i*47 - S.camera*.3)%VW;

        rect(
            x,
            125+(i%4)*9,
            2,
            1,
            i%2 ? C.sandDark : C.sandLight
        );

    }

}


/* =========================================================
   PALMIER DÉTAILLÉ
========================================================= */

function palm(x,y,scale=1){

    const trunkW=7*scale;

    poly([
        [x-trunkW,y],
        [x+trunkW,y],
        [x+4*scale,y-58*scale],
        [x-3*scale,y-58*scale]
    ],C.trunk);

    line(
        x,
        y-8*scale,
        x-1*scale,
        y-52*scale,
        C.trunkDark,
        2
    );

    const cy=y-60*scale;

    const leaves=[
        [-42,-12,-18,-3],
        [-34,-30,-15,-10],
        [-12,-43,-3,-13],
        [7,-43,12,-13],
        [26,-32,12,-8],
        [43,-11,14,-3]
    ];

    for(const p of leaves){

        poly([
            [x,cy],
            [x+p[0]*scale,cy+p[1]*scale],
            [x+p[2]*scale,cy+p[3]*scale],
            [x+7*scale,cy+3*scale]
        ],C.tree2);

    }

    circle(
        x,
        cy,
        5*scale,
        C.tree
    );

}


/* =========================================================
   FORÊT
========================================================= */

function forestBackground(){

    rect(
        0,
        74,
        VW,
        106,
        "#467d53"
    );

    for(let i=0;i<12;i++){

        const x=(i*37 - S.camera*.22)%VW;

        rect(
            x+13,
            95,
            5,
            48,
            C.trunkDark
        );

        circle(
            x+15,
            91,
            14,
            C.tree
        );

        circle(
            x+7,
            96,
            9,
            C.tree2
        );

        circle(
            x+24,
            96,
            9,
            C.tree3
        );

    }

    rect(
        0,
        129,
        VW,
        51,
        "#315f3d"
    );

}


/* =========================================================
   MONTAGNES
========================================================= */

function mountains(){

    poly([
        [0,112],
        [38,72],
        [75,107],
        [113,55],
        [157,110],
        [202,65],
        [245,108],
        [285,54],
        [320,111]
    ],"#536e76");

    poly([
        [0,112],
        [40,78],
        [75,108],
        [113,65],
        [155,111]
    ],"#687f83");

    poly([
        [0,112],
        [320,112],
        [320,180],
        [0,180]
    ],C.grassDark);

}


/* =========================================================
   LAC
========================================================= */

function lake(){

    rect(
        0,
        70,
        VW,
        75,
        "#398fa5"
    );

    for(let i=0;i<14;i++){

        const y=76+i*5;

        line(
            10+(i%3)*24,
            y,
            78+(i%4)*28,
            y,
            "#71c4cb",
            1
        );

    }

    rect(
        0,
        142,
        VW,
        38,
        C.grass
    );

}


/* =========================================================
   VILLE
========================================================= */

function city(){

    rect(
        0,
        72,
        VW,
        67,
        "#8db6c0"
    );

    for(let i=0;i<9;i++){

        const x=i*40-(S.camera*.18%40);

        const h=30+(i%4)*12;

        rect(
            x,
            139-h,
            28,
            h,
            i%2 ? "#806f68" : "#967b70"
        );

        for(let yy=145-h;yy<136;yy+=9){

            for(let xx=x+5;xx<x+25;xx+=9){

                rect(
                    xx,
                    yy,
                    4,
                    5,
                    i%3===0 ? C.gold : "#d4e5dc"
                );

            }

        }

    }

    rect(
        0,
        139,
        VW,
        41,
        "#77736c"
    );

    line(
        0,158,VW,158,
        "#d5c79d",
        2
    );

}


/* =========================================================
   NEIGE
========================================================= */

function snow(){

    rect(
        0,
        70,
        VW,
        110,
        "#8fa8c0"
    );

    poly([
        [0,120],
        [45,69],
        [90,119],
        [145,58],
        [200,119],
        [250,70],
        [320,120],
        [320,180],
        [0,180]
    ],"#dce8ed");

    for(let i=0;i<55;i++){

        const x=(i*67)%VW;
        const y=70+(i*31)%95;

        rect(
            x,
            y,
            1,
            1,
            C.white
        );

    }

}


/* =========================================================
   NOËL
========================================================= */

function christmas(){

    snow();

    const x=75;

    rect(
        x,
        85,
        7,
        61,
        C.trunk
    );

    for(let i=0;i<5;i++){

        poly([
            [x+3,75+i*11],
            [x-20-i*2,105+i*10],
            [x+26+i*3,105+i*10]
        ],C.tree);

    }

    for(let i=0;i<12;i++){

        circle(
            x-14+(i*17)%35,
            84+(i*19)%55,
            2,
            i%2 ? C.gold : C.pink
        );

    }

}


/* =========================================================
   CASCADE
========================================================= */

function waterfall(){

    mountains();

    rect(
        140,
        70,
        42,
        66,
        "#4d6267"
    );

    rect(
        153,
        80,
        17,
        57,
        "#70c7d4"
    );

    rect(
        158,
        82,
        4,
        53,
        "#b1e2e2"
    );

    for(let i=0;i<8;i++){

        circle(
            161+(i%3)*5,
            138+(i%4)*4,
            3+i%2,
            "#83cbd0"
        );

    }

}


/* =========================================================
   JARDIN
========================================================= */

function garden(){

    rect(
        0,
        70,
        VW,
        110,
        "#87a95f"
    );

    for(let i=0;i<14;i++){

        const x=(i*29-S.camera*.12)%VW;
        const y=92+(i%4)*14;

        circle(x,y,7,C.tree2);
        circle(x+7,y+2,6,C.tree3);

        circle(
            x+3,
            y-4,
            2,
            i%2 ? C.pink : C.gold
        );

    }

    rect(
        0,
        135,
        VW,
        45,
        "#c8b77a"
    );

}


/* =========================================================
   PARC
========================================================= */

function park(){

    rect(
        0,
        70,
        VW,
        110,
        "#71a85a"
    );

    rect(
        0,
        135,
        VW,
        45,
        "#c4a96a"
    );

    // bancs
    for(let i=0;i<3;i++){

        const x=40+i*110;

        rect(x,118,30,4,C.wood);
        rect(x+3,122,4,12,C.woodDark);
        rect(x+23,122,4,12,C.woodDark);

    }

}


/* =========================================================
   CINÉMA
========================================================= */

function cinema(){

    rect(
        0,
        70,
        VW,
        110,
        "#504a56"
    );

    rect(
        72,
        73,
        175,
        65,
        "#7a3e4d"
    );

    rect(
        82,
        83,
        155,
        40,
        "#d8c6a0"
    );

    rect(
        92,
        91,
        135,
        25,
        "#1e3043"
    );

    rect(
        0,
        138,
        VW,
        42,
        "#39333c"
    );

    for(let i=0;i<8;i++){

        circle(
            18+i*43,
            151,
            6,
            "#c18a44"
        );

    }

}


/* =========================================================
   VILLAGE
========================================================= */

function village(){

    rect(
        0,
        70,
        VW,
        110,
        "#6e9d65"
    );

    for(let i=0;i<4;i++){

        const x=25+i*82;

        rect(
            x,
            104,
            52,
            37,
            "#b8754a"
        );

        poly([
            [x-5,105],
            [x+26,82],
            [x+57,105]
        ],"#754032");

        rect(
            x+21,
            119,
            10,
            22,
            "#553428"
        );

        rect(
            x+7,
            111,
            10,
            8,
            "#c8e2dc"
        );

        rect(
            x+35,
            111,
            10,
            8,
            "#c8e2dc"
        );

    }

    rect(
        0,
        143,
        VW,
        37,
        "#c6aa72"
    );

}


/* =========================================================
   CANNES
========================================================= */

function cannes(){

    sea();

    rect(
        0,
        132,
        VW,
        48,
        "#d8c59a"
    );

    for(let i=0;i<5;i++){

        const x=15+i*70;

        rect(
            x,
            104,
            40,
            28,
            "#f0dfb0"
        );

        rect(
            x+5,
            111,
            30,
            21,
            "#6e9e9f"
        );

    }

}


/* =========================================================
   SOUVENIR
========================================================= */

function memoryScene(){

    rect(
        0,
        70,
        VW,
        110,
        "#9a7b70"
    );

    // ciel rose
    rect(
        0,
        70,
        VW,
        38,
        "#d99a87"
    );

    circle(
        240,
        82,
        14,
        "#ffd28a"
    );

    // chemin
    poly([
        [125,180],
        [160,115],
        [180,115],
        [220,180]
    ],"#c6a16d");

    // fleurs
    for(let i=0;i<20;i++){

        const x=(i*31)%VW;
        const y=120+(i*13)%45;

        circle(x,y,2,i%2 ? C.pink : C.gold);

    }

}


/* =========================================================
   STADE
========================================================= */

function stadium(){

    rect(
        0,
        70,
        VW,
        110,
        "#477b55"
    );

    rect(
        35,
        85,
        250,
        72,
        "#d8d0a5"
    );

    rect(
        45,
        94,
        230,
        55,
        "#3e9158"
    );

    g.strokeStyle="#f5e9b8";
    g.lineWidth=2;

    g.strokeRect(
        70,
        103,
        180,
        38
    );

    g.beginPath();
    g.arc(
        160,
        122,
        14,
        0,
        Math.PI*2
    );
    g.stroke();

}


/* =========================================================
   ÉTOILES
========================================================= */

function stars(){

    rect(
        0,
        70,
        VW,
        110,
        "#1d2846"
    );

    for(let i=0;i<70;i++){

        const x=(i*47)%VW;
        const y=72+(i*29)%70;

        rect(
            x,
            y,
            i%4===0 ? 2 : 1,
            i%4===0 ? 2 : 1,
            i%3===0 ? C.gold : C.white
        );

    }

    rect(
        0,
        140,
        VW,
        40,
        "#25345a"
    );

}


/* =========================================================
   TREASURE
========================================================= */

function treasureScene(){

    stars();

    // île
    poly([
        [0,150],
        [55,135],
        [105,145],
        [165,131],
        [225,142],
        [280,134],
        [320,148],
        [320,180],
        [0,180]
    ],"#315f43");

    // coffre
    const x=160;
    const y=118;

    rect(
        x-32,
        y,
        64,
        32,
        C.woodDark
    );

    rect(
        x-28,
        y+4,
        56,
        24,
        "#9b5c2c"
    );

    poly([
        [x-31,y+3],
        [x,y-13],
        [x+31,y+3]
    ],"#7d4825");

    rect(
        x-5,
        y+12,
        10,
        10,
        C.gold
    );

}


/* =========================================================
   DÉCOR PRINCIPAL
========================================================= */

function drawEnvironment(){

    const e=environments[S.scene];

    sky();
    celestial();

    if(
        e==="beach" ||
        e==="cove"
    ){

        sea();
        beachGround();

        palm(
            45,
            140,
            1.05
        );

        palm(
            282,
            142,
            .72
        );

        if(e==="cove"){

            // rochers
            circle(95,128,17,C.stoneDark);
            circle(105,124,12,C.stone);
            circle(248,126,19,C.stoneDark);

        }

    }

    else if(
        e==="forest" ||
        e==="forest2"
    ){

        forestBackground();

        if(e==="forest2"){

            for(let i=0;i<6;i++){

                const x=(i*61-S.camera*.25)%VW;

                circle(
                    x,
                    115,
                    17,
                    C.treeDark || C.tree
                );

            }

        }

    }

    else if(e==="mountain"){

        mountains();

    }

    else if(e==="lake"){

        lake();

    }

    else if(e==="garden"){

        garden();

    }

    else if(e==="city"){

        city();

    }

    else if(e==="cinema"){

        cinema();

    }

    else if(e==="village"){

        village();

    }

    else if(e==="waterfall"){

        waterfall();

    }

    else if(e==="cannes"){

        cannes();

    }

    else if(e==="park"){

        park();

    }

    else if(e==="snow"){

        snow();

    }

    else if(e==="memory"){

        memoryScene();

    }

    else if(e==="christmas"){

        christmas();

    }

    else if(e==="iris"){

        garden();

    }

    else if(e==="stadium"){

        stadium();

    }

    else if(e==="stars"){

        stars();

    }

    else if(e==="treasure"){

        treasureScene();

    }

}


/* =========================================================
   OBJETS DE ZONE
========================================================= */

function drawObjects(){

    const scene=S.scene;

    // bouteille pour le début
    if(scene===0 && !S.introDone){

        const x=245;

        // ombre
        rect(
            x-6,
            139,
            15,
            3,
            "rgba(40,30,20,.25)"
        );

        // bouteille
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
            x-2,
            119,
            5,
            1,
            C.gold
        );

        rect(
            x-5,
            115,
            12,
            4,
            C.woodDark
        );

    }

    // petits objets qui donnent de la profondeur
    for(let i=0;i<8;i++){

        const x=(i*91 - S.camera*.45)%VW;

        if(x<-10) continue;

        if(scene===0 || scene===1){

            circle(
                x,
                143+(i%3)*7,
                2+(i%2),
                i%2 ? C.sandLight : C.sandDark
            );

        }

        if(
            scene===2 ||
            scene===3 ||
            scene===6
        ){

            circle(
                x,
                134+(i%3)*7,
                3,
                i%2 ? C.tree2 : C.tree3
            );

        }

    }

}


/* =========================================================
   CELENA — SPRITE PIXEL ART
========================================================= */

function drawCelena(){

   /* =========================================================
   CELENA — VRAI SPRITE PIXEL ART 16-BIT
   Version détaillée : héroïne aventurière
========================================================= */

function drawCelena(){

    const px = Math.round(VW / 2);
    const ground = 143;

    const walking = S.walking;
    const frame = walking ? S.walkFrame : 0;

    /*
     * Animation :
     * 0 = jambe gauche devant
     * 1 = position centrale
     * 2 = jambe droite devant
     * 3 = position centrale
     */
    const step = walking ? frame % 4 : 1;

    let leftLeg = 0;
    let rightLeg = 0;
    let leftArm = 0;
    let rightArm = 0;

    if(walking){

        if(step === 0){
            leftLeg = -4;
            rightLeg = 4;
            leftArm = 3;
            rightArm = -3;
        }

        else if(step === 1){
            leftLeg = -1;
            rightLeg = 1;
            leftArm = 1;
            rightArm = -1;
        }

        else if(step === 2){
            leftLeg = 4;
            rightLeg = -4;
            leftArm = -3;
            rightArm = 3;
        }

        else{
            leftLeg = 1;
            rightLeg = -1;
            leftArm = -1;
            rightArm = 1;
        }

    }


    /* =====================================================
       PALETTE SPÉCIALE CELENA
    ===================================================== */

    const P = {

        outline: "#241b22",

        outline2: "#35232a",

        hairDark: "#3a211c",
        hair: "#633525",
        hairLight: "#875036",
        hairGold: "#a8683e",

        skinShadow: "#d58b70",
        skin: "#f2b08c",
        skinLight: "#ffd0a8",

        eye: "#241b22",
        eyeLight: "#fff5df",

        mouth: "#9b4b55",

        hatDark: "#a86e32",
        hat: "#d8a84e",
        hatLight: "#f0ca72",

        hatBand: "#a95542",

        shirtDark: "#9e3d56",
        shirt: "#d65c76",
        shirtLight: "#ec7186",

        beltDark: "#5b3527",
        belt: "#9a6030",
        buckle: "#f1c65c",

        pantsDark: "#1d2b43",
        pants: "#29405f",
        pantsLight: "#395678",

        bootsDark: "#3a241d",
        boots: "#68422d",
        bootsLight: "#8a5a37",

        bagDark: "#593522",
        bag: "#85502d",
        bagLight: "#b8733b",

        gold: "#f6c94f"

    };


    /* =====================================================
       OMBRE AU SOL
    ===================================================== */

    rect(
        px - 20,
        ground + 1,
        40,
        5,
        "rgba(30,24,25,.32)"
    );

    rect(
        px - 15,
        ground + 5,
        30,
        2,
        "rgba(30,24,25,.18)"
    );


    /* =====================================================
       JAMBES
    ===================================================== */

    /*
     * Jambe gauche
     */

    rect(
        px - 12 + leftLeg,
        ground - 28,
        10,
        27,
        P.outline
    );

    rect(
        px - 10 + leftLeg,
        ground - 27,
        7,
        25,
        P.pants
    );

    rect(
        px - 10 + leftLeg,
        ground - 25,
        3,
        18,
        P.pantsLight
    );


    /*
     * Jambe droite
     */

    rect(
        px + 2 + rightLeg,
        ground - 28,
        10,
        27,
        P.outline
    );

    rect(
        px + 4 + rightLeg,
        ground - 27,
        7,
        25,
        P.pants
    );

    rect(
        px + 8 + rightLeg,
        ground - 25,
        3,
        18,
        P.pantsLight
    );


    /* =====================================================
       BOTTES
    ===================================================== */

    /*
     * gauche
     */

    rect(
        px - 14 + leftLeg,
        ground - 4,
        13,
        6,
        P.outline
    );

    rect(
        px - 12 + leftLeg,
        ground - 4,
        10,
        4,
        P.boots
    );

    rect(
        px - 11 + leftLeg,
        ground - 4,
        8,
        2,
        P.bootsLight
    );


    /*
     * droite
     */

    rect(
        px + 1 + rightLeg,
        ground - 4,
        14,
        6,
        P.outline
    );

    rect(
        px + 3 + rightLeg,
        ground - 4,
        10,
        4,
        P.boots
    );

    rect(
        px + 4 + rightLeg,
        ground - 4,
        8,
        2,
        P.bootsLight
    );


    /* =====================================================
       SAC À DOS
    ===================================================== */

    /*
     * Le sac est derrière son épaule.
     */

    rect(
        px + 13,
        ground - 59,
        12,
        29,
        P.outline
    );

    rect(
        px + 15,
        ground - 57,
        10,
        25,
        P.bagDark
    );

    rect(
        px + 17,
        ground - 54,
        8,
        17,
        P.bag
    );

    rect(
        px + 18,
        ground - 52,
        6,
        10,
        P.bagLight
    );

    rect(
        px + 18,
        ground - 43,
        6,
        2,
        P.bagDark
    );

    /*
     * petite boucle du sac
     */

    rect(
        px + 19,
        ground - 58,
        4,
        3,
        P.gold
    );


    /* =====================================================
       CORPS
    ===================================================== */

    /*
     * contour noir du torse
     */

    rect(
        px - 17,
        ground - 63,
        34,
        39,
        P.outline
    );

    /*
     * tunique
     */

    rect(
        px - 15,
        ground - 61,
        30,
        35,
        P.shirt
    );

    /*
     * lumière sur la tunique
     */

    rect(
        px - 12,
        ground - 59,
        6,
        29,
        P.shirtLight
    );

    /*
     * ombre côté droit
     */

    rect(
        px + 9,
        ground - 59,
        6,
        31,
        P.shirtDark
    );


    /* =====================================================
       COL / FOULARD
    ===================================================== */

    rect(
        px - 8,
        ground - 66,
        16,
        8,
        P.shirtDark
    );

    rect(
        px - 6,
        ground - 65,
        12,
        5,
        P.hatBand
    );


    /* =====================================================
       CEINTURE
    ===================================================== */

    rect(
        px - 15,
        ground - 32,
        30,
        5,
        P.beltDark
    );

    rect(
        px - 14,
        ground - 31,
        28,
        3,
        P.belt
    );

    /*
     * boucle dorée
     */

    rect(
        px - 3,
        ground - 32,
        6,
        6,
        P.gold
    );

    rect(
        px - 1,
        ground - 31,
        3,
        4,
        P.beltDark
    );


    /* =====================================================
       BRAS GAUCHE
    ===================================================== */

    rect(
        px - 23 + leftArm,
        ground - 61,
        9,
        27,
        P.outline
    );

    rect(
        px - 21 + leftArm,
        ground - 59,
        6,
        22,
        P.skin
    );

    rect(
        px - 20 + leftArm,
        ground - 58,
        4,
        14,
        P.skinLight
    );

    /*
     * main
     */

    rect(
        px - 21 + leftArm,
        ground - 37,
        7,
        7,
        P.skinShadow
    );

    rect(
        px - 20 + leftArm,
        ground - 38,
        5,
        6,
        P.skin
    );


    /* =====================================================
       BRAS DROIT
    ===================================================== */

    rect(
        px + 14 + rightArm,
        ground - 61,
        9,
        27,
        P.outline
    );

    rect(
        px + 15 + rightArm,
        ground - 59,
        6,
        22,
        P.skin
    );

    rect(
        px + 16 + rightArm,
        ground - 58,
        4,
        14,
        P.skinLight
    );

    /*
     * main
     */

    rect(
        px + 15 + rightArm,
        ground - 37,
        7,
        7,
        P.skinShadow
    );

    rect(
        px + 16 + rightArm,
        ground - 38,
        5,
        6,
        P.skin
    );


    /* =====================================================
       COU
    ===================================================== */

    rect(
        px - 7,
        ground - 73,
        14,
        12,
        P.outline
    );

    rect(
        px - 5,
        ground - 72,
        10,
        11,
        P.skin
    );

    rect(
        px - 4,
        ground - 71,
        8,
        7,
        P.skinLight
    );


    /* =====================================================
       CHEVEUX ARRIÈRE
    ===================================================== */

    /*
     * Grande masse de cheveux
     */

    rect(
        px - 20,
        ground - 98,
        40,
        33,
        P.outline
    );

    rect(
        px - 18,
        ground - 96,
        36,
        31,
        P.hairDark
    );

    /*
     * mèches gauche
     */

    rect(
        px - 21,
        ground - 91,
        8,
        26,
        P.hair
    );

    rect(
        px - 23,
        ground - 84,
        7,
        18,
        P.hair
    );

    rect(
        px - 19,
        ground - 82,
        6,
        14,
        P.hairLight
    );

    /*
     * mèches droite
     */

    rect(
        px + 13,
        ground - 91,
        8,
        27,
        P.hair
    );

    rect(
        px + 16,
        ground - 83,
        7,
        17,
        P.hairDark
    );

    rect(
        px + 14,
        ground - 79,
        5,
        13,
        P.hairLight
    );


    /* =====================================================
       VISAGE
    ===================================================== */

    rect(
        px - 17,
        ground - 91,
        34,
        28,
        P.outline
    );

    rect(
        px - 15,
        ground - 89,
        30,
        25,
        P.skin
    );

    /*
     * lumière du visage
     */

    rect(
        px - 11,
        ground - 87,
        18,
        17,
        P.skinLight
    );

    /*
     * ombre sous les cheveux
     */

    rect(
        px - 15,
        ground - 89,
        30,
        5,
        P.skinShadow
    );


    /* =====================================================
       YEUX — PLUS EXPRESSIFS
    ===================================================== */

    /*
     * sourcil gauche
     */

    rect(
        px - 11,
        ground - 81,
        7,
        2,
        P.hairDark
    );

    /*
     * sourcil droit
     */

    rect(
        px + 4,
        ground - 81,
        7,
        2,
        P.hairDark
    );

    /*
     * oeil gauche
     */

    rect(
        px - 10,
        ground - 78,
        6,
        6,
        P.eye
    );

    rect(
        px - 9,
        ground - 78,
        2,
        2,
        P.eyeLight
    );

    /*
     * oeil droit
     */

    rect(
        px + 4,
        ground - 78,
        6,
        6,
        P.eye
    );

    rect(
        px + 5,
        ground - 78,
        2,
        2,
        P.eyeLight
    );


    /* =====================================================
       NEZ
    ===================================================== */

    rect(
        px - 1,
        ground - 72,
        4,
        3,
        P.skinShadow
    );

    rect(
        px + 1,
        ground - 71,
        3,
        2,
        P.skin
    );


    /* =====================================================
       SOURIRE
    ===================================================== */

    rect(
        px - 5,
        ground - 66,
        10,
        2,
        P.mouth
    );

    rect(
        px - 3,
        ground - 64,
        6,
        2,
        P.mouth
    );

    rect(
        px - 2,
        ground - 64,
        4,
        1,
        P.skinLight
    );


    /* =====================================================
       CHEVEUX DEVANT
    ===================================================== */

    /*
     * Frange
     */

    rect(
        px - 16,
        ground - 93,
        32,
        8,
        P.hairDark
    );

    rect(
        px - 13,
        ground - 95,
        11,
        7,
        P.hair
    );

    rect(
        px + 2,
        ground - 95,
        11,
        7,
        P.hair
    );

    /*
     * reflets pixel
     */

    rect(
        px - 12,
        ground - 92,
        4,
        3,
        P.hairLight
    );

    rect(
        px + 7,
        ground - 92,
        4,
        3,
        P.hairLight
    );


    /* =====================================================
       CHAPEAU D'AVENTURIÈRE
    ===================================================== */

    /*
     * contour du chapeau
     */

    rect(
        px - 25,
        ground - 103,
        50,
        8,
        P.outline
    );

    /*
     * large bord
     */

    rect(
        px - 24,
        ground - 102,
        48,
        6,
        P.hat
    );

    rect(
        px - 19,
        ground - 103,
        38,
        3,
        P.hatLight
    );

    /*
     * couronne
     */

    rect(
        px - 17,
        ground - 111,
        34,
        12,
        P.outline
    );

    rect(
        px - 15,
        ground - 110,
        30,
        10,
        P.hat
    );

    rect(
        px - 11,
        ground - 109,
        22,
        6,
        P.hatLight
    );

    /*
     * bande rouge
     */

    rect(
        px - 15,
        ground - 103,
        30,
        4,
        P.hatBand
    );

    rect(
        px - 12,
        ground - 102,
        24,
        2,
        "#c7644d"
    );


    /* =====================================================
       PETIT RUBAN DU CHAPEAU
    ===================================================== */

    rect(
        px + 12,
        ground - 103,
        5,
        5,
        P.hatDark
    );

    rect(
        px + 15,
        ground - 101,
        5,
        4,
        P.hatBand
    );

}
    /* =====================================================
       PETIT DÉTAIL DORÉ
    ===================================================== */

    rect(
        px - 18,
        ground - 101,
        3,
        3,
        P.gold
    );

}


/* =========================================================
   CLE VISUELLE À LA DESTINATION
========================================================= */

function drawDestination(){

    if(S.scene>=20) return;

    if(
        S.x >
        S.target-45
    ){

        const x=VW/2+42;

        const y=111;

        // halo
        for(let r=14;r>3;r-=3){

            circle(
                x,
                y,
                r,
                `rgba(246,202,85,${(16-r)/20})`
            );

        }

        // clé
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
            C.goldDark
        );

        rect(
            x+8,
            y+2,
            3,
            6,
            C.goldDark
        );

    }

}


/* =========================================================
   DESSIN MONDE
========================================================= */

function renderWorld(){

    drawEnvironment();
    drawObjects();
    drawDestination();
    drawCelena();

}


/* =========================================================
   CAMÉRA
========================================================= */

function updateCamera(){

    const desired=
        S.x - 110;

    S.camera +=
        (desired-S.camera)*0.08;

    if(S.camera<0)
        S.camera=0;

    const maxCamera=
        WORLD_W-VW;

    if(S.camera>maxCamera)
        S.camera=maxCamera;

}


/* =========================================================
   ANIMATION / MOUVEMENT AUTOMATIQUE
========================================================= */

function updateMovement(dt){

    if(
        !S.started ||
        !S.walking ||
        S.question ||
        S.ending
    ){

        return;
    }

    const speed=
        32;

    S.x +=
        speed*dt;

    S.walkClock+=dt;

    if(S.walkClock>.14){

        S.walkClock=0;

        S.walkFrame++;

    }

    updateCamera();

    if(
        S.x >= S.target
    ){

        S.x=S.target;

        arrive();

    }

}


/* =========================================================
   ARRIVÉE
========================================================= */

function arrive(){

    if(S.arriving)
        return;

    S.arriving=true;
    S.walking=false;

    play("button");

    if(!S.introDone){

        S.introDone=true;

        dialog(

            [
                "Mais qu'est-ce que je fais ici ?",
                "Une bouteille échouée sur le sable attire son attention.",
                "À l'intérieur… une mystérieuse carte au trésor."
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


/* =========================================================
   DÉBUT
========================================================= */

function start(){

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
    play("startAmbience","beach");

    updateHUD();

    dialog(
        [
            "Mais qu'est-ce que je fais ici ?"
        ],
        () => {

            S.target=targets[0];
            S.walking=true;

        }
    );

}


/* =========================================================
   QUESTION
========================================================= */

function openQuestion(){

    if(
        S.question ||
        S.ending
    )
        return;

    const q=
        window.GAME_DATA &&
        GAME_DATA.questions
        ? GAME_DATA.questions[S.scene]
        : null;

    if(!q)
        return;

    S.question=true;

    show(
        "questionScreen",
        true
    );

    setText(
        "questionNumber",
        `ÉNIGME ${q.id}/20`
    );

    setText(
        "questionText",
        q.question
    );

    setText(
        "answerFeedback",
        ""
    );

    const input=$("answerInput");

    if(input){

        input.value="";

        setTimeout(
            () => input.focus(),
            150
        );

    }

}


/* =========================================================
   INDICE
========================================================= */

function revealAnswer(){

    const q=
        GAME_DATA.questions[S.scene];

    if(!q) return;

    /*
       IMPORTANT :
       On donne uniquement la réponse.
       Aucun souvenir.
       Aucune explication.
    */

    setText(
        "answerFeedback",
        `💡 Réponse : ${q.answer}`
    );

}


/* =========================================================
   VALIDATION
========================================================= */

function validate(){

    if(!S.question)
        return;

    const q=
        GAME_DATA.questions[S.scene];

    if(!q)
        return;

    const value=
        norm(
            $("answerInput")
            ? $("answerInput").value
            : ""
        );

    const accepted=
        (
            q.acceptedAnswers ||
            [q.answer]
        ).map(norm);

    const correct=
        accepted.includes(value);

    if(!correct){

        setText(
            "answerFeedback",
            "❌ Mauvaise réponse. Essaie encore."
        );

        play("wrongAnswer");

        return;

    }

    S.question=false;

    S.keys++;

    show(
        "questionScreen",
        false
    );

    play("keyFound");

    updateHUD();

    /*
       PAS DE q.explanation ICI.
       LE SOUVENIR RESTE SECRET.
    */

    dialog(
        [
            `Bravo ! 🔑 Clé ${S.keys}/20 obtenue.`
        ],
        () => {

            if(S.keys>=20){

                openChest();

            }else{

                beginNextScene();

            }

        }
    );

}


/* =========================================================
   SCÈNE SUIVANTE
========================================================= */

function beginNextScene(){

    S.scene++;

    S.arriving=false;

    S.x=
        targets[S.scene]-150;

    if(S.x<60)
        S.x=60;

    S.target=
        targets[S.scene];

    S.walking=true;

    S.walkFrame=0;

    updateHUD();

    play(
        "startAmbience",
        environments[S.scene]
    );

}


/* =========================================================
   COFFRE
========================================================= */

function openChest(){

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

    const orbit=
        $("keyOrbit");

    if(!orbit)
        return;

    orbit.innerHTML="";

    for(let i=0;i<20;i++){

        const key=
            document.createElement("span");

        key.className="orbit-key";

        key.textContent="🔑";

        key.style.setProperty(
            "--i",
            i
        );

        orbit.appendChild(key);

    }

}


/* =========================================================
   OUVERTURE DU COFFRE
========================================================= */

function chest(){

    play("chestOpen");

    const graphic=
        $("chestGraphic");

    if(graphic){

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


/* =========================================================
   SOUVENIRS
========================================================= */

function revealMemories(){

    const list=
        $("memoryList");

    if(!list)
        return;

    list.innerHTML="";

    show(
        "memoriesScreen",
        true
    );

    const memories=
        GAME_DATA.memories
        ? GAME_DATA.memories.slice(0,20)
        : [];

    let index=0;

    function addMemory(){

        if(index>=memories.length){

            const btn=
                $("treasureBtn");

            if(btn)
                btn.classList.remove("hidden");

            return;

        }

        const m=
            memories[index];

        const card=
            document.createElement("article");

        card.className=
            "memory-item";

        /*
           LES SOUVENIRS N'APPARAISSENT
           QU'ICI, APRÈS LE COFFRE.
        */

        card.innerHTML=`

            <div class="memory-number">
                ${index+1}
            </div>

            <div class="memory-content">

                <h3>
                    ${m.title || `Souvenir ${index+1}`}
                </h3>

                <p>
                    ${m.text || m.description || ""}
                </p>

            </div>

        `;

        list.appendChild(card);

        index++;

        setTimeout(
            addMemory,
            250
        );

    }

    addMemory();

}


/* =========================================================
   CARTE
========================================================= */

function drawMap(){

    const map=
        $("mapCanvas");

    if(!map)
        return;

    const mc=
        map.getContext("2d");

    const w=
        map.width=
        map.clientWidth*
        Math.min(
            devicePixelRatio||1,
            2
        );

    const h=
        map.height=
        map.clientHeight*
        Math.min(
            devicePixelRatio||1,
            2
        );

    mc.imageSmoothingEnabled=false;

    mc.fillStyle="#497b58";
    mc.fillRect(0,0,w,h);

    // mer
    mc.fillStyle="#287fa3";

    for(let i=0;i<7;i++){

        mc.beginPath();

        mc.moveTo(
            0,
            i*h/7
        );

        mc.lineTo(
            w,
            i*h/7+8
        );

        mc.lineTo(
            w,
            (i+1)*h/7
        );

        mc.lineTo(
            0,
            (i+1)*h/7-8
        );

        mc.fill();

    }

    // île
    mc.fillStyle="#719957";

    mc.beginPath();

    mc.moveTo(w*.08,h*.72);
    mc.lineTo(w*.16,h*.40);
    mc.lineTo(w*.30,h*.20);
    mc.lineTo(w*.55,h*.14);
    mc.lineTo(w*.82,h*.28);
    mc.lineTo(w*.90,h*.58);
    mc.lineTo(w*.76,h*.83);
    mc.lineTo(w*.43,h*.90);
    mc.lineTo(w*.18,h*.84);

    mc.closePath();
    mc.fill();

    // chemin
    mc.strokeStyle="#ead18a";
    mc.lineWidth=5;

    mc.beginPath();

    for(let i=0;i<20;i++){

        const px=
            w*.15+
            (w*.68/19)*i;

        const py=
            h*.75-
            Math.sin(i*.65)*h*.28;

        if(i===0)
            mc.moveTo(px,py);
        else
            mc.lineTo(px,py);

    }

    mc.stroke();

    // points
    for(let i=0;i<20;i++){

        const px=
            w*.15+
            (w*.68/19)*i;

        const py=
            h*.75-
            Math.sin(i*.65)*h*.28;

        mc.fillStyle=
            i<S.keys
            ? "#f5c94f"
            : "#fff1bd";

        mc.beginPath();
        mc.arc(
            px,
            py,
            5,
            0,
            Math.PI*2
        );
        mc.fill();

        mc.fillStyle="#28352f";
        mc.font="bold 8px sans-serif";
        mc.textAlign="center";
        mc.textBaseline="middle";

        mc.fillText(
            String(i+1),
            px,
            py
        );

    }

}


/* =========================================================
   BOUCLE
========================================================= */

function loop(time){

    if(!S.lastTime)
        S.lastTime=time;

    const dt=
        Math.min(
            (time-S.lastTime)/1000,
            .05
        );

    S.lastTime=time;

    updateMovement(dt);

    g.clearRect(
        0,
        0,
        VW,
        VH
    );

    renderWorld();

    /*
       Le monde est dessiné dans une résolution
       320x180 puis agrandi sans lissage.
    */

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const scale=
        Math.max(
            canvas.width/VW,
            canvas.height/VH
        );

    const dw=
        VW*scale;

    const dh=
        VH*scale;

    const dx=
        (canvas.width-dw)/2;

    const dy=
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

    requestAnimationFrame(loop);

}

requestAnimationFrame(loop);


/* =========================================================
   ÉVÉNEMENTS
========================================================= */

$("startBtn")?.addEventListener(
    "click",
    start
);

$("dialogNext")?.addEventListener(
    "click",
    nextDialog
);

$("mapContinue")?.addEventListener(
    "click",
    () => {

        show(
            "mapIntro",
            false
        );

        S.target=
            targets[0];

        S.walking=true;

    }
);

$("validateBtn")?.addEventListener(
    "click",
    validate
);

$("revealBtn")?.addEventListener(
    "click",
    revealAnswer
);

$("openChestBtn")?.addEventListener(
    "click",
    chest
);

$("mapBtn")?.addEventListener(
    "click",
    () => {

        S.mapOpen=true;

        show(
            "mapScreen",
            true
        );

        drawMap();

    }
);

$("closeMapBtn")?.addEventListener(
    "click",
    () => {

        S.mapOpen=false;

        show(
            "mapScreen",
            false
        );

    }
);

$("treasureBtn")?.addEventListener(
    "click",
    () => {

        if(
            GAME_DATA &&
            GAME_DATA.treasureLink
        ){

            window.location.href=
                GAME_DATA.treasureLink;

        }

    }
);


/* =========================================================
   CLAVIER
   UNIQUEMENT POUR VALIDER / INTERAGIR.
   AUCUN DÉPLACEMENT.
========================================================= */

$("answerInput")?.addEventListener(
    "keydown",
    e => {

        if(
            e.key==="Enter"
        ){

            e.preventDefault();

            validate();

        }

    }
);


/* =========================================================
   EXPOSITION DEBUG
========================================================= */

window.MysteryLoveIsland={
    state:S,
    start,
    openQuestion,
    revealAnswer,
    validate
};

})();
