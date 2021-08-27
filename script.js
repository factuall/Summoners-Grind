//canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;
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
    update();
    //frame cap
    if(Date.now() > lastRender+15){
        render();
        lastRender = Date.now();
    }
}, 3);
//clearInterval(intervalId); 

class Live{
    constructor(){
        this.x = 0; 
        this.y = 0;
        this.w = 50;
        this.h = 50;
        this.c = "#88ff88";
    }
}

function render(){
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        drawRect(object.x, object.y, object.w, object.h, object.c);
    });
}

function collisionDetection(colA, colB){
    if (colA.x < colB.x + colB.w &&
        colA.x + colB.w > colB.x &&
        colA.y < colB.y + colB.h &&
        colA.y + colA.h > colB.y) {
            return true;
    }
    return false;    
}


class Player{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.w = 70;
        this.h = 70;
        this.c = "#88ff88";
        this.inPosition = true;
        this.underAttack = true;
    }
};

var cursor = new Live();
cursor.c = "#000000";
objects.push(new Player());
objects.push(cursor);

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

var deltaTime = Date.now();
function update(){
    deltaTime = Date.now() - deltaTime;
    objects[0].inPosition = (collisionDetection(objects[0], objects[1]));
    if(!objects[0].inPosition){
        let distX = objects[0].x - objects[1].x;
        let distY = objects[0].y - objects[1].y;
        let destination = new Vector(distX, distY);
        destination.normalize();

        objects[0].x -= destination.x * 3;
        objects[0].y -= destination.y * 3;
    }
    deltaTime = Date.now();
}