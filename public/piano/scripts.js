window.addEventListener('keydown', function(e){
	var keycode = e.keyCode;
	var audioToSelect = "audio[data-key=\'"+ keycode + "\'";
	var sound = document.querySelector(audioToSelect);

    if(!sound) return;
    console.log(sound);

	sound.currentTime= 0; //rewind to the start // რომ დააჭერ რომ არესტარტებდეს ხმას
	sound.play();
});