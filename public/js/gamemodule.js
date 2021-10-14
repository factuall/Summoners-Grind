import './keybinding.js';
import { setUpCamera, Sprite, render, canvas } from './graphics.js';
import { Entity } from "/js/entities/bases/Entity.js";
import { Player } from "/js/entities/EntityPlayer.js";
import { Enemy } from "/js/entities/EntityEnemy.js";
import { Trash } from "/js/entities/Trash.js";
import * as mouse from "/js/mouse.js";
import * as wrapper from "/js/wrapper.js";

//update and render setup
const perfectFrameTime = 1000 / 60;
var deltaTime = 0;
var lastTimestamp = 0;

export var objects = [];
document.addEventListener("pushObject", objEvent => {
    pushObject(objEvent.detail);
});

function pushObject(obj){
    objects.push(obj);
    wrapper.syncObjects(objects);
}

var renderInterval = window.setInterval(function(){
    render(objects);
}, 3);

function update(timestamp){
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    objects.forEach(element => {
        if(element.entityType == "TrashEntity") return;
        element.updateObject(deltaTime);
        if(element.entityType == "CombatEntity"){
            if(element.health <= 0) objects[element.index] = new Trash(); 
        }
    });
    wrapper.syncObjects(objects);
}

function start() {
    requestAnimationFrame(update);

    var grassbg = new Entity(objects.length);
    grassbg.w = 800;
    grassbg.h = 600;
    grassbg.drawContent = new Sprite("/img/trawa.png", 800, 600);
    pushObject(grassbg);

    var player = new Player(objects.length);
    pushObject(player);

    var cursor = new Entity(objects.length);
    cursor.w = 10;
    cursor.h = 10;
    cursor.c = "rgba(225,225,225,0.4)";
    pushObject(cursor);
    mouse.setCursor(cursor);
    mouse.canvasReady(canvas);

    pushObject(new Enemy(objects.length));

    var secondEnemy = new Enemy(objects.length);
    secondEnemy.x = 600;
    secondEnemy.drawContent = new Sprite("/img/miecznik.png", 50, 50);
    secondEnemy.combatType = "melee";
    pushObject(secondEnemy);

    document.addEventListener('SkillQ', e => {player.playerInput(e)});
    document.addEventListener('SkillW', e => {player.playerInput(e)});
    document.addEventListener('SkillE', e => {player.playerInput(e)});
    document.addEventListener('SkillR', e => {player.playerInput(e)});
    document.addEventListener('LockCam', e => {lockcam = !lockcam});
}

start();