$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })
})

var gametype = true;
var red = -1;
var green = -1;
var blue = -1;
var gamedifficulty = "easy";
var correctchoice = "none";

function toggletype() {
    var btn = document.getElementById('color-rgb');
    if(btn.classList.contains('color')) {
        btn.classList.remove('color');
        btn.classList.add('rgb');
        btn.innerHTML = 'RGB';
        gametype = false;
    } else {
        btn.classList.remove('rgb');
        btn.classList.add('color');
        btn.innerHTML = 'COLOR';
        gametype = true;
    }
}

function cleargame() {
    red = -1;
    blue = -1;
    green = -1;
    correctchoice = "none";
}

function newgame() {
    red   = Math.floor(Math.random()*256);
    blue  = Math.floor(Math.random()*256);
    green = Math.floor(Math.random()*256);
    var antired   = 255 - red;
    var antiblue  = 255 - blue;
    var antigreen = 255 - green;
    var pickelement = document.getElementById('pick');
    if(gametype) {
        pickelement.innerHTML = "RED:"+red+", GREEN:"+green+", BLUE:"+blue+".";
        pickelement.setAttribute("style", "background-color:none;");
    } else {
        pickelement.innerHTML = "color to guess";
        pickelement.setAttribute("style", "color: rgb("+red+","+green+","+blue+"); background-color:rgb("+red+","+green+","+blue+");");
    }
    var choices = ['a','b','c','d'];
    correctchoice = choices[Math.floor(Math.random()*4)];
    for(ans of choices) {
        var tempred = red + 0;
        var tempblue = blue + 0;
        var tempgreen = green + 0;
        if(correctchoice != ans) {
            tempred = Math.floor(Math.random()*256);
            tempblue = Math.floor(Math.random()*256);
            tempgreen = Math.floor(Math.random()*256);
        }
        if(gametype) {
            document.getElementById(ans).innerHTML = 'RED: ???, GREEN: ???, BLUE: ???.';
            document.getElementById(ans).setAttribute("style", "color: rgb("+tempred+","+tempgreen+","+tempblue+"); background-color:rgb("+tempred+","+tempgreen+","+tempblue+");");
        } else {
            document.getElementById(ans).innerHTML = "RED:"+tempred+", GREEN:"+tempgreen+", BLUE:"+tempblue+".";
            document.getElementById(ans).setAttribute("style", "background-color:none;");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.keyCode === 84) {toggletype(); newgame();}    // 't' on keyboard.
    else if (e.keyCode === 78) newgame();               // 'n' on keyboard.
});

document.getElementById('color-rgb').addEventListener('click', function (event) {
    toggletype();
    newgame();
});

document.getElementById('togglemode').addEventListener('click', function (event) {
    toggletype();
    newgame();
});

document.getElementById('newgame').addEventListener('click', function (event) {
    newgame();
});

document.getElementById('pick').addEventListener('click', function (event) {
    newgame();
});

newgame();