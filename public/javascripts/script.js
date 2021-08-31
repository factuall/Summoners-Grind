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

//mouse
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
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
    }
    updatePlayer(){
        this.inPosition = (CollisionDetection(this, objects[1]));
        if(!this.inPosition){
            let destination = GetFacingVector(this, objects[1]);
            this.x -= destination.x * 4;
            this.y -= destination.y * 4;
        }
    }
};

class Enemy extends Live{
    constructor(){
        super();
        this.x = 400;
        this.y = 400;
        this.c = "#ff3333";
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

        
        }
        
    }
};

function render(){
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        drawRect(object.x, object.y, object.w, object.h, object.c);
    });
}

objects.push(new Player());
var cursor = new Live();
cursor.c = "rgba(225,225,225,0.1)";
objects.push(cursor);
objects.push(new Enemy());
var eeenemy = new Enemy();
eeenemy.x = 600;
objects.push(eeenemy);

function update(){
    objects[0].updatePlayer();
    objects.forEach(element => {
        if(element.name == "Enemy"){
            element.updateEnemy();
        }
    });

}