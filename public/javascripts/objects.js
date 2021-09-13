class Life{
    constructor(){
        this.index = objects.length;
        this.name = "Object";
        this.x = 0; 
        this.y = 0;
        this.w = 50;
        this.h = 50;
        this.c = "#000000";
        this.ox = this.x - (this.w/2);
        thix.oy = this.y - (this.h/2);
    }

    move(x,y){
        this.x += x;
        this.y += y;
        this.ox = this.x - (this.w/2);
        this.oy = this.y - (this.h/2);
    }

    setPosition(x,y){
        this.x = x;
        this.y = y;
        this.ox = this.x - (this.w/2);
        this.oy = this.y - (this.h/2);
    }

    setCentralPosition(x,y){
        this.ox = x;
        this.oy = y;
        this.x = this.ox + (this.w/2);
        thix.y = this.oy + (this.h/2);
    }
}

class Trash extends Life{
    constructor(){
        super();
        this.name = "Trash";
        this.w = 0;
        this.h = 0;
    }
}

class Player extends Life{
    constructor(){
        super();
        this.name = "Player";
        this.c = "#88ff88";
        this.inPosition = true;
        this.underAttack = true;
        //stats
        this.health = 1000;
        this.maxHealth = 1200;
        this.mana = 200;
        this.maxMana = 200;
        //skills
        //i wish nobody will see that
        //whis is temporary i promise

        this.skills = [];
        this.skills.push(new Skill("KeyQ", "Q", 60));
        this.skills.push(new Skill("KeyW", "W", 200));
        this.skills.push(new Skill("KeyE", "E", 300));
        this.skills.push(new Skill("KeyR", "R", 400));
    }

    damagePlayer(damage){
        if(this.health >= damage)
        this.health -= damage;

    }

    updatePlayer(){
        this.inPosition = (CollisionDetection(this, objects[1]));
        if(!this.inPosition){
            let destination = GetFacingVector(this, objects[1]);
            this.x -= destination.x * 4;
            this.y -= destination.y * 4;
        }
        this.skills.forEach(playerSkill => {
            playerSkill.clock += deltaTime;
        });

    }

    updateGUI(){
        //health and mana bars
        HPBar.innerHTML = this.health + " / " + this.maxHealth;
        HPBar.style.width = (100 * (this.health / this.maxHealth)) - 1 + "%";
        MPBar.innerHTML = this.mana + " / " + this.maxMana;
        MPBar.style.width = (100 * (this.mana / this.maxMana)) - 1 + "%";
        
        //skills
        //this is not that temporary... i guess...
        this.skills.forEach(function(playerSkill, i){
            SkillsGUI[i].style.backgroundColor = (playerSkill.clock >= playerSkill.cooldown) ? "gray" : "rgb(55,55,55)";
            let timeLeft = (playerSkill.cooldown - playerSkill.clock) / 60;
            
            //timeLeft = (Math.round(timeLeft * 10) / 10).toFixed(1);
            SkillsGUI[i].innerHTML = playerSkill.label + ((playerSkill.clock >= playerSkill.cooldown) ? "" : HTMLBEAK + timeLeft.toFixed(1) + "s");
        });
    }

    

    inputKey(e){ //this is temporary too please dont kill me
        this.skills.forEach(playerSkill => {
            if(e.code == playerSkill.keycode && playerSkill.clock > playerSkill.cooldown){
                playerSkill.clock = 0;
            }
        });
        
        switch(e.code){
            case "KeyQ":

                break;
            case "KeyW":
                if(this.CooldownClockW > this.CooldownW){
                    this.CooldownClockW = 0;
                }
                break;
            case "KeyE":
                if(this.CooldownClockE > this.CooldownE){
                    this.CooldownClockE = 0;
                }
                break;
            case "KeyR":
                if(this.CooldownClockR > this.CooldownR){
                    this.CooldownClockR = 0;
                }
                break;
            default:
                break;
        }
    }
};

class Enemy extends Life{
    constructor(){
        super();
        this.x = 400;
        this.y = 400;
        this.c = "#ff3333";
        this.attackDamage = 200;
        this.attackSpeed = 8;
        this.lastAttack = 0;
        this.name = "Enemy";
        this.enemyname = "Range"
        this.target = "None"
    }
    updateEnemy(){
        if(this.target == "None"){
            let closest;
            let closestDist = Number.MAX_SAFE_INTEGER;
            objects.forEach(element => {
                if(element.name == "Player" || element.name == "Ally"){
                    let distance = GetDistanceBetweenObjects(this, element);
                    if(distance < closestDist){
                        closestDist = distance;
                        closest = element.index;
                    }
                }
            });

            this.target = closest;
        }

        let collided = false;
        objects.forEach(element => {
            if(CollisionDetection(this,element) && element!=this && objects[1] != element){
                if(element.name == "Player") collided = true;
                if(element.name == "Enemy" && !collided){
                    let destination = GetFacingVector(this, element);
                    this.x += destination.x * deltaTime;
                    this.y += destination.y * deltaTime;
                    collided = true;
                }
            }

        });
        if(!CollisionDetection(this,objects[this.target])){
            if(GetDistanceBetweenObjects(this,objects[this.target]) < 100){
                if(this.lastAttack>(1000/this.attackSpeed)){
                    objects.push(new Projectile(this, objects[this.target], 4, this.attackDamage));
                    this.lastAttack = 0;
                }

            }else{
                let destination = GetFacingVector(this, objects[this.target]);
                this.x -= destination.x * 1;
                this.y -= destination.y * 1;
            }

        
        }else{
            if(this.lastAttack>(1000/this.attackSpeed)){
                player.damagePlayer(this.attackDamage);
                this.lastAttack = 0;
            }
        }
        
        this.lastAttack++;

    }
};

class Projectile extends Life{
    constructor(source, target, speed, damage){
        super();
        this.source = source;
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.w = 10;
        this.h = 10;
        this.x = source.x + (source.w / 2) - (this.w / 2);
        this.y = source.y + (source.h / 2) - (this.h / 2);

        this.c = "#ffff33";
        this.name = "Projectile";
    }
    
    updateProjectile(){
        let targetWithOffset = new Life();
        targetWithOffset.x = this.target.x + (this.target.w / 2) - (this.w / 2);
        targetWithOffset.y = this.target.y + (this.target.h / 2) - (this.h / 2);
        let destination = GetFacingVector(this, targetWithOffset);
        this.x -= destination.x * deltaTime * this.speed;
        this.y -= destination.y * deltaTime * this.speed;
    
        if(CollisionDetection(this,this.target)){
            if(this.target.name == "Player") this.target.damagePlayer(this.damage);
            objects[this.index] = new Trash();
        }
    }
};