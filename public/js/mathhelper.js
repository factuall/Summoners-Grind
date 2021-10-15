export function CollisionDetection(colA, colB){
    if (colA.x < colB.x + colB.w &&
        colA.x + colA.w > colB.x &&
        colA.y < colB.y + colB.h &&
        colA.y + colA.h > colB.y) {
            return true;
    }
    return false;    
}

/////////////////////////////////////////
//vector normalizing by Max Maximilian
/////////////////////////////////////////
export let Vector = function(x,y) {
    this.x = x;
    this.y = y;
    }     
Vector.prototype.normalize = function() {
let length = Math.sqrt(this.x*this.x+this.y*this.y); //calculating length
this.x = this.x/length; //assigning new value to x (dividing x by length of the vector)
this.y= this.y/length; //assigning new value to y
}

export function GetFacingVector(origin, destination){
    let distX = origin.x - destination.x;
    let distY = origin.y - destination.y;
    let facingVector = new Vector(distX, distY);
    facingVector.normalize();
    return(facingVector);
}

export function GetFacingVectorC(origin, destination){
    let distX = origin.x - destination.ox;
    let distY = origin.y - destination.oy;
    let facingVector = new Vector(distX, distY);
    facingVector.normalize();
    return(facingVector);
}

export function GetFacingVectorCC(origin, destination){
    let distX = origin.ox - destination.ox;
    let distY = origin.oy - destination.oy;
    let facingVector = new Vector(distX, distY);
    facingVector.normalize();
    return(facingVector);
}

export function GetXYDistanceBetweenObjects(origin, destination){
    let distX = origin.x - destination.x;
    let distY = origin.y - destination.y;
    return({distX, distY});
}

export function GetXYDistanceBetweenObjectsCC(origin, destination){
    let distX = origin.ox - destination.ox;
    let distY = origin.oy - destination.oy;
    return({distX, distY});
}

export function GetDistanceBetweenObjects(origin, destination){
    let distance = GetXYDistanceBetweenObjects(origin, destination);
    return(Math.sqrt(
        (Math.abs(distance.distX) * Math.abs(distance.distX)) + 
        (Math.abs(distance.distY) * Math.abs(distance.distY))
        ));
}

export function GetDistanceBetweenObjectsCC(origin, destination){
    let distance = GetXYDistanceBetweenObjectsCC(origin, destination);
    return(Math.sqrt(
        (Math.abs(distance.distX) * Math.abs(distance.distX)) + 
        (Math.abs(distance.distY) * Math.abs(distance.distY))
        ));
}