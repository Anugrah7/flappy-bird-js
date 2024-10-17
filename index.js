// Sound effects
const scoreSound = new Audio('sounds/point.mp3');
const gameOverSound = new Audio('sounds/die.mp3');

let move_speed = 10, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Initialize best score from localStorage, or set it to 0 if not present
let bestScore = localStorage.getItem('bestScore') || 0;
let bestScoreLabel = document.querySelector('.best_score');

// Display the best score at the start
bestScoreLabel.innerHTML = 'Best Score: ' + bestScore;

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        
        play();
    }
});
//moving function
function play() {
    function move() {
        if (game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((Element) => {
            let pipe_sprite_props = Element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                Element.remove();
            } else {
                // Collision detection
                if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top) {
                    
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';

                    gameOverSound.play();

                    // Check if current score is higher than best score
                    if (parseInt(score_val.innerHTML) > parseInt(bestScore)) {
                        bestScore = score_val.innerHTML;
                        localStorage.setItem('bestScore', bestScore); 
                    }

                    // Update and show the best score
                    bestScoreLabel.innerHTML = 'Best Score: ' + bestScore;

                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        Element.increase_score == '1') {
                        
                        scoreSound.play();
                        score_val.innerHTML = +score_val.innerHTML + 1;
                    }
                    Element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/bird.png';
            }
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

window.onload = function() {
   
    if (localStorage.getItem('bestScore') === null) {
        
        localStorage.setItem('bestScore', 0);
    }
    
   
    bestScore = localStorage.getItem('bestScore');
    bestScoreLabel.innerHTML = 'Best Score: ' + bestScore;
};
