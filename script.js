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
        this.type = "Object";
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
        this.type = "Player";
        this.c = "#88ff88";
        this.inPosition = true;
        this.underAttack = true;
    }
    updatePlayer(){
        this.inPosition = (CollisionDetection(this, objects[1]));
        if(!this.inPosition){
            let distX = this.x - objects[1].x;
            let distY = this.y - objects[1].y;
            let destination = new Vector(distX, distY);
            destination.normalize();
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
        this.type = "Enemy";
        this.enemyType = "Mage"
        this.target = "None"
    }
    updateEnemy(){
        switch(this.enemyType){
            case "Mage":
                if(this.target == "None"){
                    let closest;
                    let closestDist = 9999999;
                    objects.forEach(element => {
                        if(element.type == "Player" || element.type == "Ally"){
                            let distX = this.x - element.x;
                            let distY = this.y - element.y;
                            let lengthXY = Math.sqrt(distX * distY);
                            if(lengthXY < closestDist){
                                closestDist = lengthXY;
                                closest = element.index;
                            }
                        }
                    });
                    this.target = closest;
                }else if(!CollisionDetection(this,objects[this.target])){

                    let distX = this.x - objects[this.target].x;
                    let distY = this.y - objects[this.target].y;
                    let destination = new Vector(distX, distY);
                    destination.normalize();
                    this.x -= destination.x * 1;
                    this.y -= destination.y * 1;
                
                }
                break;
            default:
                break;
        }
    }
};

function render(){
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        drawRect(object.x, object.y, object.w, object.h, object.c);
    });
}

function CollisionDetection(colA, colB){
    if (colA.x < colB.x + colB.w &&
        colA.x + colB.w > colB.x &&
        colA.y < colB.y + colB.h &&
        colA.y + colA.h > colB.y) {
            return true;
    }
    return false;    
}

function GetFacingVector(objectFacing, target){
    let distX = objectFacing.x - this.target.x;
    let distY = objectFacing.y - this.target.y;
    let destination = new Vector(distX, distY);
    destination.normalize();
    return(destination);
}

function GetXYDistanceBetweenObjects(origin, destination){
    let distX = objectFacing.x - this.target.x;
    let distY = objectFacing.y - this.target.y;
    return({distX, distY});
}

function GetDistanceBetweenObjects(origin, destination){
    let distanceXY = GetXYDistanceBetweenObjects(origin, destination);
    return(Math.sqrt(distanceXY[0] * distanceXY[1]));
}


objects.push(new Player());
var cursor = new Live();
cursor.c = "rgba(225,225,225,0.1)";

objects.push(cursor);
//objects.push(new Enemy());
var eeenemy = new Enemy();
eeenemy.x = 600;
//objects.push(eeenemy);

/////////////////////////////////////////
//vector normalizing by Max Maximilian
/////////////////////////////////////////
var Vector = function(x,y) {
    this.x = x;
    this.y = y;
    }     
Vector.prototype.normalize = function() {
var length = Math.sqrt(this.x*this.x+this.y*this.y); //calculating length
this.x = this.x/length; //assigning new value to x (dividing x by length of the vector)
this.y= this.y/length; //assigning new value to y
}

function update(){
    objects[0].updatePlayer();
    objects.forEach(element => {
        if(element.type == "Enemy"){
            element.updateEnemy();
        }
    });

}