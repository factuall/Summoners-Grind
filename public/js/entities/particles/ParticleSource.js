import { Entity } from "/js/entities/bases/Entity.js";

export class ParticleSource extends Entity{
    constructor(particles, settings){
        super();
        this.particleList = particles;
        this.sourceSettings = settings;
        this.name = "Particle Source";
        this.drawContent = "#00ff0000";
        parseSettings();
    }

    parseSettings(){
        
    }

    updateObject(){   
    }
}