import './keybinding.js';
import { camUpdate, Sprite, render, canvas } from './graphics.js';
import { Entity } from "/js/entities/bases/Entity.js";
import { Player } from "/js/entities/EntityPlayer.js";
import { Enemy } from "/js/entities/EntityEnemy.js";
import { Trash } from "/js/entities/Trash.js";
import * as mouse from "/js/mouse.js";
import * as wrapper from "/js/wrapper.js";

//update and render setup
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

export let objects = [];
document.addEventListener("pushObject", objEvent => {
    pushObject(objEvent.detail);
});

function pushObject(obj){
    objects.push(obj);
    wrapper.syncObjects(objects);
}

let renderInterval = window.setInterval(function(){
    render(objects);
}, 3);

function update(timestamp){
    requestAnimationFrame(update);
    camUpdate(deltaTime);
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

    let grassbg = new Entity(objects.length);
    grassbg.w = 800;
    grassbg.h = 600;
    grassbg.drawContent = new Sprite("/img/trawa.png", 800, 600);
    pushObject(grassbg);

    let player = new Player(objects.length);
    pushObject(player);

    let cursor = new Entity(objects.length);
    cursor.w = 10;
    cursor.h = 10;
    cursor.c = "rgba(225,225,225,0.4)";
    pushObject(cursor);
    mouse.setCursor(cursor);
    mouse.canvasReady(canvas);
    mouse.addEListener();

    pushObject(new Enemy(false, objects.length));

    let secondEnemy = new Enemy(true, objects.length);
    secondEnemy.x = 600;
    secondEnemy.combatType = "melee";
    pushObject(secondEnemy);

    document.addEventListener('SkillQ', e => {player.playerInput(e)});
    document.addEventListener('SkillW', e => {player.playerInput(e)});
    document.addEventListener('SkillE', e => {player.playerInput(e)});
    document.addEventListener('SkillR', e => {player.playerInput(e)});
}

start();