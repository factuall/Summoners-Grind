////////////////////////////////////////////////////
//this is ultra temporary 
//later I'll replace this shit with code that
//removes useless objects from objects list
//and then handles gaps in array and updating
//every object left (to correct their index)

import { Entity } from "/js/entities/bases/Entity.js";

export class Trash extends Entity{
    constructor(){
        super();
        this.entityType = "TrashEntity";
        this.name = "Trash";
        this.w = 0;
        this.h = 0;
    }
}