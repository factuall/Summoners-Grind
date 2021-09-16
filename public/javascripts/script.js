const Entityname = {
    Active: 'Active',
    Static: 'Static',
    Ghost: 'Ghost'
  };

//canvas setup
const canvas = document.getElementById('GameScreen');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
ctx.font = '30px Arial'
var objects = [];

//gui
const HTMLBEAK = "<br/>"
const HPBar = document.getElementById('HealthBar');
const MPBar = document.getElementById('ManaBar');
MPBar.style.backgroundColor = "rgb(75,75,255)";

const SkillsGUI = document.getElementsByClassName('Skill');

//mouse
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}


//keyboard
document.addEventListener('keypress', keyPressed);
function keyPressed(e) {
  console.log(e.code);
  if(e.code == "KeyQ" ||
    e.code == "KeyW" ||
    e.code == "KeyE" ||
    e.code == "KeyR"){
        player.inputKey(e);
    }
}

//update and render setup
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;
function start() {
    requestAnimationFrame(update);
}
var intervalId = window.setInterval(function(){
    render();
}, 3);
//clearInterval(intervalId); 


function drawRect(x, y, w, h, c){
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w , h);
}


function render(){
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        if(object.sprite != "none"){
            ctx.drawImage(object.sprite.image, object.x, object.y, object.sprite.width, object.sprite.height);
        }else{
            drawRect(object.x, object.y, object.w, object.h, object.c);
        }
    });
    player.updateGUI();
}

var player = new Player();
player.health = player.maxHealth;
objects.push(player);
var cursor = new Life();
cursor.w = 10;
cursor.h = 10;
cursor.c = "rgba(225,225,225,0.4)";
objects.push(cursor);
canvas.addEventListener('mousedown', function(event){
    canvasPosition = canvas.getBoundingClientRect();
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
    cursor.setCentralPosition(mouse.x, mouse.y)

});

objects.push(new Enemy());
var eeenemy = new Enemy();
eeenemy.x = 600;
eeenemy.sprite = new Sprite("/img/miecznik.png", 50, 50);
eeenemy.enemyType = "melee";
objects.push(eeenemy);

function update(timestamp){
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    
    lastTimestamp = timestamp;
    player.updatePlayer();
    objects.forEach(element => {
        if(element.name == "Enemy"){
            element.updateEnemy();
        }
        if(element.name == "Projectile"){
            element.updateProjectile();
        }
    });

}

start();