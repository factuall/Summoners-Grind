import { resumeUpdate, lastTimestamp } from "/js/gamemodule.js";

export let menuHalt = false;
let gameMenu = document.getElementById("GameMenu");
gameMenu.style.display = "none";
$('#PlayerGui').css("cursor", "default");

export function openMenu(){
    $('#GameScreen').css("cursor", "default");
    menuHalt = true;
    $('#GameMenu').animate({height: "toggle"}, 200, ()=>{});
}

export function closeMenu(){
    $('#GameScreen').css("cursor", "none");
    $('#PlayerGui').css("cursor", "default");
    menuHalt = false;
    $('#GameMenu').animate({height: "toggle"}, 200, ()=>{});
    requestAnimationFrame(resumeUpdate);
    if(controlsGuiOpen) {
        $('#ControlsGui').animate({left: "-=290", height: "toggle"}, 100, function() {});
        controlsGuiOpen = false;
    }
    if(fadeIn) {
        $('#fadeIn').fadeOut(400);
        fadeIn = false;

    }
}
$(document).keyup(function(e) {
    if (e.key === "Escape") {
        if(!menuHalt) openMenu(); else closeMenu();
    }
});

$('#ControlsGui').animate({height: "toggle"}, 1, function() {});

$('#resumeButton').on("click", ()=>{closeMenu();});
let controlsGuiOpen = false;

$('#openControlsButton').on("click", ()=>{
    controlsGuiOpen = !controlsGuiOpen;
    if(!controlsGuiOpen){
        $('#ControlsGui').animate({
            left: "-=290",
            height: "toggle"
        }, 100, function() {
            // Animation complete.
        });
    }else{
        $('#ControlsGui').animate({
            left: "+=290",
            height: "toggle"
        }, 100, function() {
            // Animation complete.
        });
    }
});

openMenu();
let fadeIn = true;
