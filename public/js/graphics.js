import { mouseAbsolute, mouseCursor } from "/js/mouse.js";
import * as msc from "/js/entities/MouseCursor.js";

//sprite
export class Sprite{
    constructor(url){
        this.url = url;
        this.image = new Image();
        this.image.src = this.url;
        this.ready = false;
        this.image.onload = function() {
            this.ready = true;
        };
    }
}

export class SpriteSheet{
    constructor(sprite, rows, columns, frameWidth, frameHeight){
        this.sprite = sprite
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.rows = rows;
        this.columns = columns;
        this.currentRow = 0;
        this.currentColumn = 0;
        this.name = "";
    }
    setOffset(x, y){
        this.currentColumn = x;
        this.currentRow = y;
    }
}

export class TextSprite{
    constructor(text, font, size, color){
        this.text = text;
        this.font = font;
        this.size = size;
        this.color = color;
    }
    getStyle(){
        return this.size + "px " + this.font;
    }
}

export class Camera{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    getViewPosition(objX, objY){
        let objViewX = objX - this.x;
        let objViewY = objY - this.y;
        return {
            objViewX: objViewX,
            objViewY: objViewY
        };
    }
    getView(){
        return{
            xA: this.x,
            yA: this.y,
            xB: this.x + this.width,
            yB: this.y + this.height
        };
    }
}

export let camera = new Camera(0, 0, 800, 600);

export function setUpCamera(w, h){
    camera.width = w;
    camera.height = h;
}

export function getScreenWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  
export function getScreenHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

export const canvas = document.getElementById('GameScreen');
export const ctx = canvas.getContext('2d');
canvas.width = getScreenWidth();
canvas.height = getScreenHeight();
ctx.font = '30px Arial'
export let zoom = 0.6;

setUpCamera(canvas.width, canvas.height);
let lockcam = true;

document.addEventListener('LockCam', e => {lockcam = !lockcam});

function drawRect(x, y, w, h, c){
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w , h);
}

function drawImage(x, y, w, h, s){
    ctx.drawImage(s, x, y, w, h);
}

export function drawSpriteFromSheet(x, y, fw, fh, r, c, w, h, s){
    ctx.drawImage(s, c*fw, r*fh, fw, fh, x, y, w, h);
}

function drawText(text, style, color, x, y){
    ctx.font = style;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function drawObject(x, y, w, h, content){
    let objViewPos = camera.getViewPosition(x, y);
    //Detect if object is in camera's view
    if(objViewPos.objViewX < 0 + camera.width &&
        objViewPos.objViewX + w > 0 &&
        objViewPos.objViewY < 0 + camera.height &&
        objViewPos.objViewY + h > 0){
        //if yes, then render it to canvas
        switch(content.constructor.name){
            case "Sprite":
                drawImage(objViewPos.objViewX, objViewPos.objViewY, w, h, content.image);
                break;
            case "TextSprite":
                drawText(content.text, content.getStyle(), content.color, objViewPos.objViewX, objViewPos.objViewY);
                break;
            case "String":
                drawRect(objViewPos.objViewX, objViewPos.objViewY, w, h, content);
                break;
            case "SpriteSheet":
                drawSpriteFromSheet(objViewPos.objViewX, objViewPos.objViewY,
                                    content.frameWidth, content.frameHeight,
                                    content.currentRow, content.currentColumn,
                                    w, h,
                                    content.sprite.image)
                break;
        }
    }
}

let prevZoom = zoom;
let camSpeed = 10;
export function camUpdate(deltaTime){
    if(!lockcam){
        let horizontal = 0, vertical = 0;
        if(mouseAbsolute.x < 75) { 
            camera.x -= camSpeed * deltaTime;
            mouseCursor.requestCursor(msc.CURSOR_ARROW);
            horizontal = -1;
        }else if(mouseAbsolute.x > getScreenWidth() - 75) { 
            camera.x += camSpeed * deltaTime; 
            mouseCursor.requestCursor(msc.CURSOR_ARROW);
            horizontal = 1;
        }
        
        if(mouseAbsolute.y < 75) { 
            camera.y -= camSpeed * deltaTime;
            mouseCursor.requestCursor(msc.CURSOR_ARROW);
            vertical = -1;
        }if(mouseAbsolute.y > getScreenHeight() - 75) { 
            camera.y += camSpeed * deltaTime; 
            mouseCursor.requestCursor(msc.CURSOR_ARROW);
            vertical = 1;
        }

        if(horizontal == 0){
            if(vertical == -1) mouseCursor.currentFrame = 5;
            if(vertical == 1) mouseCursor.currentFrame = 1;
        }else if(horizontal == -1){
            mouseCursor.currentFrame = 3;
            if(vertical == -1) mouseCursor.currentFrame = 4;
            if(vertical == 1) mouseCursor.currentFrame = 2;
        }else{ if(horizontal)
            mouseCursor.currentFrame = 7;
            if(vertical == -1) mouseCursor.currentFrame = 6;
            if(vertical == 1) mouseCursor.currentFrame = 0;
        }
    }
}

export function render(objects){
    //pre-rendering
    let player = objects.find(e => e.name == "Player");
    canvas.width = getScreenWidth()*zoom;
    canvas.height = getScreenHeight()*zoom;
    setUpCamera(canvas.width, canvas.height);
    if(lockcam){
        camera.x = player.x - (camera.width / 2) + (player.w / 2);
        camera.y = player.y - (camera.height / 2) + (player.h / 2); 
    }else if(prevZoom != zoom){
        let prevSW = getScreenWidth()*prevZoom;
        let prevSH = getScreenHeight()*prevZoom;
        camera.x += (prevSW - canvas.width) / 2;
        camera.y += (prevSH - canvas.height) / 2;
    }

    //rendering
    drawRect(0,0,canvas.width,canvas.height, "#505050");
    objects.forEach(object => {
        let objInfo = object.renderObject();
        if(Array.isArray(objInfo)){
            objInfo.forEach(e => {
                drawObject(e.x, e.y, e.w, e.h, e.drawContent);
            });
        }else{
            drawObject(objInfo.x, objInfo.y, objInfo.w, objInfo.h, objInfo.drawContent);
        }
    });

    //post-rendering
    prevZoom = zoom;
}

function shiftZoom(value){
    zoom += value
    if(zoom < 0.3) zoom = 0.3;
    if(zoom > 1) zoom = 1;
}

document.addEventListener("ZoomIn", () =>{
    shiftZoom(-0.1);
});

document.addEventListener("ZoomOut", () =>{
    shiftZoom(0.1);
});

document.addEventListener("MWheelUp", () =>{
    shiftZoom(0.05);
});

document.addEventListener("MWheelDown", () =>{
    shiftZoom(-0.05);
});
