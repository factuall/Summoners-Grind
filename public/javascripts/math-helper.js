function CollisionDetection(colA, colB){
    if (colA.x < colB.x + colB.w &&
        colA.x + colB.w > colB.x &&
        colA.y < colB.y + colB.h &&
        colA.y + colA.h > colB.y) {
            return true;
    }
    return false;    
}

/////////////////////////////////////////
//vector normalizing by Max Maximilian
/////////////////////////////////////////
var Vector = function(x,y) {
    this.x = x;
    this.y = y;
    }     
Vector.prototype.normalize = function() {
var length = Math.sqrt(this.x*this.x+this.y*this.y); //calculating length
this.x = this.x/length; //assigning new value to x (dividing x by length of the vector)
this.y= this.y/length; //assigning new value to y
}

function GetFacingVector(origin, destination){
    let distX = origin.x - destination.x;
    let distY = origin.y - destination.y;
    let facingVector = new Vector(distX, distY);
    facingVector.normalize();
    return(facingVector);
}

function GetXYDistanceBetweenObjects(origin, destination){
    let distX = origin.x - destination.x;
    let distY = origin.y - destination.y;
    return({distX, distY});
}

function GetDistanceBetweenObjects(origin, destination){
    let distance = GetXYDistanceBetweenObjects(origin, destination);
    return(Math.sqrt(Math.abs(distance.distX) * Math.abs(distance.distY)));
}