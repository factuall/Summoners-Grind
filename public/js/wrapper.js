//
// this module is allowing entities to see 
// global objects list and even affect it
//
export var objects = [];

export function syncObjects(objs){
    objects = objs;
}

export function pushObject(obj){
    let objEvent = new CustomEvent('pushObject', {detail: obj});
    document.dispatchEvent(objEvent);
}