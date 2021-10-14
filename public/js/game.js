import * as mathhelper from './math-helper.js';
import './keybinding.js';
import { Skill } from './skill.js';
import { getScreenWidth, getScreenHeight, camera, setUpCamera, Sprite } from './graphics.js';
import './sounds.js';
//import { Entity, updateObjectList, Player, Enemy, updateCursor, dTime, Trash } from './objects.js';
import { Entity } from "/js/entities/bases/Entity.js";
import { Player } from "/js/entities/EntityPlayer.js";
import { Enemy } from "/js/entities/EntityEnemy.js";
import * as wrapper from "/js/wrapper.js";

//canvas setup
const canvas = document.getElementById('GameScreen');
const ctx = canvas.getContext('2d');
canvas.width = getScreenWidth();
canvas.height = getScreenHeight();
ctx.font = '30px Arial'
export var objects = [];
setUpCamera(canvas.width, canvas.height);

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

//mouse
//replace right context menu
window.addEventListener('contextmenu', function (e) { 
    // do something here... 
    e.preventDefault(); 
}, false);
//left mouseclick
/*
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}*/

document.addEventListener("pushObject", objEvent => {
    pushObject(objEvent.detail);
});

function pushObject(obj){
    objects.push(obj);
    wrapper.setObjects(objects);
}

function drawRect(x, y, w, h, c){
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w , h);
}

function drawImage(x, y, w, h, s){
    ctx.drawImage(s, x, y, w, h);
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
        }
    }
}

var lockcam = false;
function render(){
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
    if(lockcam){
        camera.x = player.x - (camera.width / 2) + (player.w / 2);
        camera.y = player.y - (camera.height / 2) + (player.h / 2); 
    }
}

var trawusia = new Entity(objects.length);
trawusia.w = 800;
trawusia.h = 600;
trawusia.drawContent = new Sprite("/img/trawa.png", 800, 600);
pushObject(trawusia);
var player = new Player(objects.length);
player.health = player.maxHealth;
pushObject(player);

var cursor = new Entity(objects.length);
cursor.w = 10;
cursor.h = 10;
cursor.c = "rgba(225,225,225,0.4)";
pushObject(cursor);

import * as mouse from "/js/mouse.js";

mouse.setCursor(cursor);
mouse.setCanvas(canvas);

pushObject(new Enemy(objects.length));
var eeenemy = new Enemy(objects.length);
eeenemy.x = 600;
eeenemy.drawContent = new Sprite("/img/miecznik.png", 50, 50);
//eeenemy.combatType = "melee";
pushObject(eeenemy);


import { Trash } from "/js/entities/Trash.js";
function update(timestamp){
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    //updateCursor(objects);
    objects.forEach(element => {
        if(element.entityType == "TrashEntity") return;
        element.updateObject(deltaTime);
        if(element.entityType == "CombatEntity"){
            if(element.health <= 0) objects[element.index] = new Trash(); 
        }
    });
    wrapper.setObjects(objects);
}

start();

document.addEventListener('SkillQ', e => {player.playerInput(e)});
document.addEventListener('SkillW', e => {player.playerInput(e)});
document.addEventListener('SkillE', e => {player.playerInput(e)});
document.addEventListener('SkillR', e => {player.playerInput(e)});
document.addEventListener('LockCam', e => {lockcam = !lockcam});
