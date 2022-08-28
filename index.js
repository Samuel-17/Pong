let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let keyPress;
let pressed = {
    top: false,
    bottom: false
};

let width = canvas.width;
let height = canvas.height;


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

class Line {
    constructor() {
        this.position = {
            x: 440,
            y: 0
        }

        this.width = 10;
        this.height = 500;
    }

    draw() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
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
let a = -2;

let vector = 'left';

let score = {
    player1:0,
    player2:0
}

function draw() {

    //Limpar tela
    ctx.clearRect(0, 0, width, height);


    //Chmando função de desenho
    line.draw();
    player.draw();
    iaplayer.draw();
    ball.draw();

    // Printando score na tela
    ctx.strokeStyle = '#ffff'
    ctx.font = "60px Silkscreen, cursive";
    ctx.fillText(`${score.player1}  ${score.player2}`,370, 55);


    //Movimentação do personagem do player
    if (pressed.top && player.position.y > 0) {
        player.position.y -= 10
    }

    if (pressed.bottom && player.position.y < 450) {
        player.position.y += 10;
    }

    //Sentido de rolágem da bola
    if (vector == "left") {
        ball.position.x -= 5;
    } else if (vector == 'right') {
        ball.position.x += 5
    } else if (vector == 'stop') {
        ball.position.x = 450;
    }

    //Sentido ininicial da bola
    ball.position.y += a;


    //Colisão do eixo y no topo
    if (ball.position.y <= 0) {
        a = a * (-1);
    }
    //Colisão do eixo y em baixo
    if (ball.position.y >= height - 20) {
        a = a * (-1);
    }

    collider();
    Win();

    if (ball.position.x > 500) {
        movimentationIA()
    }

    //Movimentação da IA
    requestAnimationFrame(draw);
}

function movimentationIA() {
    if (ball.position.y >= iaplayer.position.y && ball.position.y <= 450) {
        iaplayer.position.y += 5
    }
    if (ball.position.y <= iaplayer.position.y > 0) {
        iaplayer.position.y -= 5
    }
};


//Função de colisão
function collider() {
    if (ball.position.x + ball.width >= iaplayer.position.x &&
        ball.position.x <= iaplayer.position.x + iaplayer.width &&
        ball.position.y + ball.height >= iaplayer.position.y &&
        ball.position.y <= iaplayer.position.y + iaplayer.height) {
        //Mudando sentido de rolagem da bola para +
        vector = "left"
    }

      //Colisão com o jogador do usuário
      if (ball.position.x + ball.width >= player.position.x &&
        ball.position.x <= player.position.x + player.width &&
        ball.position.y + ball.height >= player.position.y &&
        ball.position.y <= player.position.y + player.height) {
        //Mudando sentido de rolagem da bola para +
        vector = "right"
    }
}



function Win() {
    if (ball.position.x <= -1) {
        initialization(0);
    }

    if (ball.position.x >= width - 20) {
        initialization(1);
    }
}

function initialization(x) {
    if (x) {
        ball.position.x = 450
        vector = 'left';
        score.player1++
        return
    } else {
        ball.position.x = 450
        vector = 'right';
        score.player2++
        return
    }
}

//Captura de teclas I/O
document.addEventListener('keydown', (e) => {
    keyPress = e.keyCode;
    switch (keyPress) {
        case 38:
            return pressed = {
                top: true,
                bottom: false
            }
            break;

        case 40:
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
