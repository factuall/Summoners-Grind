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

canvas.addEventListener('mousedown', function(event){
    canvasPosition = canvas.getBoundingClientRect();
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
    objects[1].x = mouse.x-25;
    objects[1].y = mouse.y-25;
});

function drawRect(x, y, w, h, c){
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w , h);
}

let lastRender = Date.now();
var intervalId = window.setInterval(function(){
    //frame cap
    if(Date.now() > lastRender+15){
        update();
        render();
        
        lastRender = Date.now();
    }
}, 3);
//clearInterval(intervalId); 

class Live{
    constructor(){
        this.index = objects.length;
        this.name = "Object";
        this.x = 0; 
        this.y = 0;
        this.w = 50;
        this.h = 50;
        this.c = "#000000";
    }
}

class Player extends Live{
    constructor(){
        super();
        this.name = "Player";
        this.c = "#88ff88";
        this.inPosition = true;
        this.underAttack = true;
        //stats
        this.health = 1000;
        this.maxHealth = 1200;
        this.mana = 200;
        this.maxMana = 200;

        this.CooldownQ = 100;
        this.CooldownClockQ = 0;
    }

    damagePlayer(damage){
        if(this.health >= damage)
        this.health -= damage;

    }

    updatePlayer(){
        this.inPosition = (CollisionDetection(this, objects[1]));
        if(!this.inPosition){
            let destination = GetFacingVector(this, objects[1]);
            this.x -= destination.x * 4;
            this.y -= destination.y * 4;
        }
        this.CooldownClockQ++;
        this.updateGUI();
    }

    updateGUI(){
        //health and mana bars
        HPBar.innerHTML = this.health + " / " + this.maxHealth;
        HPBar.style.width = (100 * (this.health / this.maxHealth)) - 1 + "%";
        MPBar.innerHTML = this.mana + " / " + this.maxMana;
        MPBar.style.width = (100 * (this.mana / this.maxMana)) - 1 + "%";
        
        //skills
        SkillsGUI[0].style.backgroundColor = (this.CooldownClockQ > this.CooldownQ) ? "gray" : "rgb(55,55,55)";
    }

    inputKey(e){
        switch(e.code){
            case "KeyQ":
                if(this.CooldownClockQ > this.CooldownQ){
                    this.CooldownClockQ = 0;
                }
                break;
            default:
                break;
        }
    }
};

class Enemy extends Live{
    constructor(){
        super();
        this.x = 400;
        this.y = 400;
        this.c = "#ff3333";
        this.attackDamage = 200;
        this.attackSpeed = 20;
        this.lastAttack = 0;
        this.name = "Enemy";
        this.enemyname = "Range"
        this.target = "None"
    }
    updateEnemy(){
        if(this.target == "None"){
            let closest;
            let closestDist = Number.MAX_SAFE_INTEGER;
            objects.forEach(element => {
                if(element.name == "Player" || element.name == "Ally"){
                    let distance = GetDistanceBetweenObjects(this, element);
                    if(distance < closestDist){
                        closestDist = distance;
                        closest = element.index;
                    }
                }
            });

            this.target = closest;
        }

        let collided = false;
        objects.forEach(element => {
            if(CollisionDetection(this,element) && element!=this && objects[1] != element){
                if(element.name == "Player") collided = true;
                if(element.name == "Enemy" && !collided){
                    let destination = GetFacingVector(this, element);
                    this.x += destination.x * 1;
                    this.y += destination.y * 1;
                    collided = true;
                }
            }

        });
        if(!CollisionDetection(this,objects[this.target])){
            if(GetDistanceBetweenObjects(this,objects[this.target]) < 100){

            }else{
                let destination = GetFacingVector(this, objects[this.target]);
                this.x -= destination.x * 1;
                this.y -= destination.y * 1;
            }

        
        }else{
            if(this.lastAttack>(1000/this.attackSpeed)){
                player.damagePlayer(this.attackDamage);
                this.lastAttack = 0;
            }
        }
        
        this.lastAttack++;

    }
};

function render(){
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        drawRect(object.x, object.y, object.w, object.h, object.c);
    });
}

var player = new Player();
player.health = player.maxHealth;
objects.push(player);
var cursor = new Live();
cursor.c = "rgba(225,225,225,0.1)";
objects.push(cursor);
objects.push(new Enemy());
var eeenemy = new Enemy();
eeenemy.x = 600;
objects.push(eeenemy);

function update(){
    player.updatePlayer();
    objects.forEach(element => {
        if(element.name == "Enemy"){
            element.updateEnemy();
        }
    });

}