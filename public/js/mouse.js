import { Entity } from "/js/entities/bases/Entity.js";
import { objects } from "/js/wrapper.js";
import * as mathhelper from "/js/mathhelper.js";
import { camera, getScreenWidth, getScreenHeight, zoom } from "/js/graphics.js";

export let canvas;
export let canvasPosition;
export let cursor;

export const mouse = {
    x: 0,
    y: 0,
    click: false
}

export const mouseAbsolute = {
    x: 0,
    y: 0,
}

// sync cursor object with one defined in main module
export function setCursor(crs){
    cursor = crs;
}

export function canvasReady(cvs){
    canvas = cvs;
}

let mwheelup = new Event("MWheelUp");
let mwheeldown = new Event("MWheelDown");
export function addEListener(){
    document.addEventListener("wheel", function (e) {
        document.dispatchEvent((e.deltaY > 0) ? mwheelup : mwheeldown);
        return false;
    }, true);

    canvas.addEventListener('mousedown', function(event){
        if(event.button === 0){
    
        }else{
            canvasPosition = canvas.getBoundingClientRect();
            mouse.x = ((event.x - canvasPosition.left) * zoom) + camera.x;
            mouse.y = ((event.y - canvasPosition.top) * zoom) + camera.y;
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

function updateMousePosition(event){
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mouseAbsolute.x = event.pageX;
    mouseAbsolute.y = event.pageY;

    mouse.x = event.pageX + camera.x;
    mouse.y = event.pageY + camera.y;

}
document.onmousemove = updateMousePosition;