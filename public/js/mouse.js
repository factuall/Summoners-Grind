import { Entity } from "/js/entities/bases/Entity.js";

export const mouse = {
    x: 0,
    y: 0,
    click: false
}

export var canvas;
export var canvasPosition;

export var cursor;

export function setCursor(crs){
    cursor = crs;
}

export function setCanvas(cvs){
    canvas = cvs;
    
    canvas.addEventListener('mousedown', function(event){
        if(event.button === 0){
    
        }else{
            canvasPosition = canvas.getBoundingClientRect();
            mouse.x = event.x - canvasPosition.left;
            mouse.y = event.y - canvasPosition.top;
            let pointer = new Entity(0);
            pointer.w = 10; pointer.h = 10;
            pointer.setCentralPosition(mouse.x, mouse.y);
            cursor.setCentralPosition(mouse.x, mouse.y);
        }
    });
}