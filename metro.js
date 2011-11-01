function Metronome(visual_aid) {
    var self = this;
    var tempo = 120;
    var counter;
    var interval;
    var click = new Audio('samples/click.ogg');
    self.state = 0;


    function startClick() {
        var spb     = 60/tempo; /* seconds per beat */
        var mspb    = 1000/spb; /* milliseconds per beat */
        var click_sustain = 10; /* length in milliseconds of the click TODO: Convert to beats for more musical values! */
        
        /* Set counter to 0 */
        counter = 0;
        
        /* Set state to on (1) */
        self.state = 1;
        
        interval = setInterval(function () {
            performClick();
        }, 200);
    }
    this.startClick = startClick;


    function stopClick() {
        /* Set state to off (0) */
        self.state = 0;
        clearInterval(interval);
    }
    this.stopClick = stopClick;


    function performClick() {
        click.play();
        visual_aid.fadeIn(100);
        visual_aid.fadeOut(100);
        counter++;
    }
    
}