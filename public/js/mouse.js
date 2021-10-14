import { Entity } from "/js/entities/bases/Entity.js";
import { objects } from "/js/wrapper.js";
import * as mathhelper from "/js/mathhelper.js";
import { camera } from "/js/graphics.js";

export var canvas;
export var canvasPosition;
export var cursor;

export const mouse = {
    x: 0,
    y: 0,
    click: false
}

// sync cursor object with one defined in main module
export function setCursor(crs){
    cursor = crs;
}

export function canvasReady(cvs){
    canvas = cvs;
    canvas.addEventListener('mousedown', function(event){
        if(event.button === 0){
    
        }else{
            canvasPosition = canvas.getBoundingClientRect();
            mouse.x = event.x - canvasPosition.left + camera.x;
            mouse.y = event.y - canvasPosition.top + camera.y;
            let pointer = new Entity(0);
            pointer.w = 10; pointer.h = 10;
            pointer.setCentralPosition(mouse.x, mouse.y);
            let clickedObjects = [];
            objects.forEach(e => {
                if(mathhelper.CollisionDetection(pointer, e)){
                    clickedObjects.push(e);
                }
            });
            let cursorClick = new CustomEvent('cursorClick', {detail: clickedObjects});
            document.dispatchEvent(cursorClick);
            cursor.setCentralPosition(mouse.x, mouse.y);
        }
    });
}

window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
}, false);