import './keybinding.js';
import { camUpdate, Sprite, render, canvas } from './graphics.js';
import { Entity } from "/js/entities/bases/Entity.js";
import { Player } from "/js/entities/Player.js";
import { Enemy } from "/js/entities/Enemy.js";
import { Trash } from "/js/entities/Trash.js";
import * as mouse from "/js/mouse.js";
import {menuHalt} from "/js/managers/menumanager.js";

//update and render setup
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
export let lastTimestamp = 0;

export let objects = [];
document.addEventListener("pushObject", objEvent => {
    pushObject(objEvent.detail);
});

export function pushObject(obj){
    
    if(Array.isArray(obj)){
        obj.forEach(e => {
            e.index = objects.length;
            objects.push(e);
        });
    }else{
        obj.index = objects.length;
        objects.push(obj);
    }
}

let renderInterval = window.setInterval(function(){
    render(objects);
}, 3);


export function resumeUpdate(timestamp){
    lastTimestamp = timestamp;
    requestAnimationFrame(update);
}

function update(timestamp){
    if(menuHalt) return;
    requestAnimationFrame(update);
    camUpdate(deltaTime);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    objects.forEach(element => {
        if(element.entityType == "TrashEntity") return;
        element.updateObject(deltaTime);
        if(element.entityType == "CombatEntity"){
            if(element.health <= 0) {
                objects[element.index] = new Trash(); 
                objects[element.index+1] = new Trash();

            }
        }
    });
}

function start() {
    requestAnimationFrame(update);

    let grassbg = new Entity();
    grassbg.w = 800;
    grassbg.h = 600;
    grassbg.drawContent = new Sprite("/img/trawa.png", 800, 600);
    pushObject(grassbg);

    let player = new Player();
    pushObject(player.bundle());

    let cursor = new Entity();
    cursor.w = 10;
    cursor.h = 10;
    cursor.c = "rgba(225,225,225,0.4)";
    pushObject(cursor);
    mouse.setCursor(cursor);
    mouse.canvasReady(canvas);
    mouse.addEListener();

    pushObject(new Enemy(false).bundle());

    let secondEnemy = new Enemy(true);
    secondEnemy.x = 600;
    secondEnemy.combatType = "melee";
    pushObject(secondEnemy.bundle());

    document.addEventListener('SkillQ', e => {player.playerInput(e)});
    document.addEventListener('SkillW', e => {player.playerInput(e)});
    document.addEventListener('SkillE', e => {player.playerInput(e)});
    document.addEventListener('SkillR', e => {player.playerInput(e)});
}

start();