// Versão 1.1

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let speedBall = 7.9;
let speedPlayer = 10;
let speedIa = 5;

//Sons de bola de tênis
const colliderSong = new Audio('../audio/Tênis.mp3');
const scorePlus = new Audio('audio/pont.mp3');

//Código da tecla
let keyPress;

//Status de movimentação
let pressed = {
    top: false,
    bottom: false
};

//Dimensões canvas
let width = canvas.width;
let height = canvas.height;

// Classe do player do usuário
class Player {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.width = 10;
        this.height = 50;
    }

    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
};

//Classe da bola
class Ball {

    constructor() {
        this.position = {
            x: 505,
            y: 225
        }
        this.width = 15;
        this.height = 15;
    }
    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
};

//Classe da IA do jogo
class Ia {
    constructor() {
        this.position = {
            x: 890,
            y: 0
        }
        this.width = 10;
        this.height = 50;
    }

    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

//Demarcação do campo
class Line {
    constructor() {
        this.position = {
            x: 440,
            y: 0
        }

        this.width = 2;
        this.height = 500;
    }

    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

//Player do usuário
const player = new Player();
//IA
const iaplayer = new Ia();
//Bola
const ball = new Ball();
//Linha central
const line = new Line();

//Aceleração da bola y
let a = -1.7;

// Sentido vetorial
let vector = 'left';

//Pontuação
let score = {
    player1: 0,
    player2: 0
}


function scoreBoard() {
    ctx.strokeStyle = '#ffff'
    ctx.font = "60px Silkscreen, cursive";
    ctx.fillText(`${score.player1}  ${score.player2}`, 370, 55);
}

function movePlayer() {
    //Movimentação do personagem do player
    if (pressed.top && player.position.y > 0) {
        player.position.y -= speedPlayer
    }

    if (pressed.bottom && player.position.y < 450) {
        player.position.y += speedPlayer;
    }
}


function ballRoll() {
    if (vector == "left") {
        ball.position.x -= speedBall;
    } else if (vector == 'right') {
        ball.position.x += speedBall;
    } else if (vector == 'stop') {
        ball.position.x = 400;
    }
}

//Função de desenho
function draw() {

    //Limpar tela
    ctx.clearRect(0, 0, width, height);

    //Chmando função de desenho das classes
    line.draw();
    player.draw();
    iaplayer.draw();
    ball.draw();

    // Placar de pontuação
    scoreBoard();

    //Movimentação do player no campo
    movePlayer();

    //Colisões
    collider();

    //Sentido de rolágem da bola
    ballRoll();

    //Sentido ininicial da bola
    ball.position.y += a;

    //Marcação de pontos
    Win();

    //Movimentação da IA
    movimentationIA()

    requestAnimationFrame(draw);
}

function movimentationIA() {
    if (ball.position.x >= 400) {
        if (ball.position.y >= iaplayer.position.y && ball.position.y <= height - iaplayer.height) {
            iaplayer.position.y += speedIa;
        }
        if (ball.position.y <= iaplayer.position.y && ball.position.y >= 0) {
            iaplayer.position.y -= speedIa;
        }
    }
};

function collider() {

    //Colisão com a IA
    if (ball.position.x + ball.width >= iaplayer.position.x &&
        ball.position.x <= iaplayer.position.x + iaplayer.width &&
        ball.position.y + ball.height >= iaplayer.position.y &&
        ball.position.y <= iaplayer.position.y + iaplayer.height) {
        //Mudando sentido de rolagem da bola para +
        vector = "left"
        audioActive()
    }

    //Colisão com o jogador do usuário
    if (ball.position.x + ball.width >= player.position.x &&
        ball.position.x <= player.position.x + player.width &&
        ball.position.y + ball.height >= player.position.y &&
        ball.position.y <= player.position.y + player.height) {
        //Mudando sentido de rolagem da bola para +
        vector = "right"
        audioActive()
    }

    //Colisão da bola no top
    if (ball.position.y <= 0) {
        a = a * (-1);
        audioActive()
    }
    //Colisão da bola no bottom
    if (ball.position.y >= height - 20) {
        a = a * (-1);
        audioActive()
    }
}

function audioActive() {
    colliderSong.pause();
    colliderSong.currentTime = 0;
    colliderSong.play();
}

function Win() {
    if (ball.position.x <= 0) {
        contScore(0);
    }

    if (ball.position.x >= width) {
        contScore(1);
    }
}

function contScore(x) {
    if (x) {
        ball.position.x = 400;
        vector = 'left';
        score.player1++
        if (score.player1 == 5) location.reload();
        scorePlus.play();
        return
    } else {
        ball.position.x = 400
        vector = 'right';
        score.player2++
        if (score.player2 == 5) location.reload();
        scorePlus.play();
        return
    }
}

//Captura de teclas I/O
document.addEventListener('keydown', (e) => {
    keyPress = e.keyCode;
    switch (keyPress) {

        //arrow up
        case 38:
            return pressed = {
                top: true,
                bottom: false
            }
            break;

        //arrow down
        case 40:
            return pressed = {
                top: false,
                bottom: true
            }
            break;

        // W
        case 87:
            return pressed = {
                top: true,
                bottom: false
            }
            break;

        //S
        case 83:
            return pressed = {
                top: false,
                bottom: true
            }
            break;
    }
});

//Captura de soltagem da tecla
document.addEventListener('keyup', (e) => {
    return pressed = {
        top: false,
        bottom: false
    };
});

draw();
