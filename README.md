# confetti.js

A simple confetti floating animation overlay for your website! 🙂 (no libraries required)

Support use of images and confetti.

Based on [mathusummut/confetti.js](https://github.com/mathusummut/confetti.js)

## Use

You can call any of the following available functions:

    confetti.start();                  //starts the confetti animation (keeps going until stopped manually)
    confetti.start({ timeout, amount, img, rootEl});      //starts confetti animation with confetti timeout in milliseconds (if timeout is 0, it will keep going until stopped manually)
    confetti.start(timeout, amount);   //like confetti.start(timeout), but also specifies the number of confetti particles to throw (50 would be a good example)
    confetti.start(timeout, min, max); //like confetti.start(timeout), but also the specifies the number of confetti particles randomly between the specified minimum and maximum amount
    confetti.stop();        //stops adding confetti
    confetti.toggle();      //starts or stops the confetti animation depending on whether it's already running
    confetti.pause();       //freezes the confetti animation
    confetti.resume();      //unfreezes the confetti animation
    confetti.togglePause(); //toggles whether the confetti animation is paused
    confetti.remove();      //stops the confetti animation and remove all confetti immediately
    confetti.isPaused();    //returns true or false depending on whether the confetti animation is paused
    confetti.isRunning();   //returns true or false depending on whether the animation is running

You can also configure these parameters:

    confetti.maxCount = 80;     //set max confetti count

confetti.maxPerClick = 6; //set max confetti count per user click
confetti.speed = 5; //set the particle animation speed
confetti.frameInterval = 15; //the confetti animation frame interval in milliseconds
confetti.alpha = 1; //Start alpha/opacity value of particles
confetti.fadeBorder = 0.6; //Height where fading of particles starts
confetti.fade = 0.008; //Alpha fade per frame

Enjoy!
