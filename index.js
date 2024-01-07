var numberofdrums = document.querySelectorAll(".drum").length
for (var i=0; i<numberofdrums; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function() {
        let drum = this.innerHTML
        makeSound(drum)
        buttonAnimation(drum)
    })
}


//detects keyboard press
document.addEventListener("keydown", function(event){
    makeSound(event.key);
    buttonAnimation(event.key);
})



function makeSound(key){
    switch (key){
        case "w":
            let tom1 = new Audio("sounds/tom-1.mp3").play()
        break
        case "a":
            let tom2 = new Audio("sounds/tom-2.mp3").play()
        break
        case "s":
            let tom3 = new Audio("sounds/tom-3.mp3").play()
        break
        case "d":
            let tom4 = new Audio("sounds/tom-4.mp3").play()
        break
        case "j":
            let snare = new Audio("sounds/snare.mp3").play()
        break
        case "k":
            let crash = new Audio("sounds/crash.mp3").play()
        break
        case "l":
            let kickbass = new Audio("sounds/kick-bass.mp3").play()
        break
        default: console.log(key)
    }
}

function buttonAnimation(CurrentKey){
    let activeButton = document.querySelector("."+CurrentKey)

    activeButton.classList.add("pressed")

    setTimeout(()=>{activeButton.classList.remove("pressed")}, 100)
}