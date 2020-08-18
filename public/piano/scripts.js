window.addEventListener('keydown', function(e){
	var keycode = e.keyCode;
	var audioToSelect = "audio[data-key=\'"+ keycode + "\'";
	var sound = document.querySelector(audioToSelect);

    if(!sound) return;
    console.log(sound);

	sound.currentTime= 0; // rewind the sound when pressed again
    sound.play();
    
    // animation
    var buttonToSelect = "button[data-key=\'"+ keycode + "\'";
	var button = document.querySelector(buttonToSelect);
	button.classList.add("button-pressed");
});


var buttons = document.querySelectorAll("button");
buttons.forEach(function(key){
	key.addEventListener('transitionend', function(e){
        // listen to the end of transitions, wait for them and then return to normal
        if(e.propertyName !== 'transform') return;
	    this.classList.remove('button-pressed');
    });
});