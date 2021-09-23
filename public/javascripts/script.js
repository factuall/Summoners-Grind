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
SkillsGUI[0].style.backgroundImage = "url('img/skillQ.png')"
SkillsGUI[1].style.backgroundImage = "url('img/skillW.png')"
SkillsGUI[2].style.backgroundImage = "url('img/skillE.png')"
SkillsGUI[3].style.backgroundImage = "url('img/skillR.png')"

//mouse
//replace right context menu
window.addEventListener('contextmenu', function (e) { 
    // do something here... 
    e.preventDefault(); 
}, false);
//left mouseclick
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}


//keyboard
document.addEventListener('keypress', keyPressed);
function keyPressed(e) {
    switch(e.code){
        case "KeyL":
            cam.x += 10;
            break;
        case "KeyJ":
            cam.x -= 10;
            break;
        case "KeyI":
            cam.y -= 10;
            break;
        case "KeyK":
            cam.y += 10;
            break;
        
    }
    player.inputKey(e);
}

//update and render setup
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;
var cam = new Camera(0, 0, canvas.width, canvas.height);
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

function drawImage(x, y, w, h, s){
    ctx.drawImage(s, x, y, w, h);
}

function drawObject(x, y, w, h, content){
    let objViewPos = cam.getViewPosition(x, y);
    //Detect if object is in camera's view
    if(objViewPos.objViewX < 0 + cam.width &&
        objViewPos.objViewX + w > 0 &&
        objViewPos.objViewY < 0 + cam.height &&
        objViewPos.objViewY + h > 0){
        //if yes, then render it to canvas
        if(typeof content == "string") drawRect(objViewPos.objViewX, objViewPos.objViewY, w, h, content);
        else drawImage(objViewPos.objViewX, objViewPos.objViewY, w, h, content.image);
    }
}

function render(){
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        object.renderObject();
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
    if(event.button === 0){

    }else{
        canvasPosition = canvas.getBoundingClientRect();
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        
        cursor.setCentralPosition(mouse.x, mouse.y)
    }
});

objects.push(new Enemy());
var eeenemy = new Enemy();
eeenemy.x = 600;
eeenemy.drawContent = new Sprite("/img/miecznik.png", 50, 50);
eeenemy.enemyType = "melee";
objects.push(eeenemy);

function update(timestamp){
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    objects.forEach(element => {
        element.updateObject();
    });

}

start();