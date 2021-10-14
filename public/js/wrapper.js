//module is allowing simpler communication between main module and rest of them
export var objects = [];

export function setObjects(objs){
    objects = objs;
}

export function pushObject(obj){
    let objEvent = new CustomEvent('pushObject', {detail: obj});
    document.dispatchEvent(objEvent);
}