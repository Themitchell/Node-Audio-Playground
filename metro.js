function Metronome(visual_aid, tempo) {
    var self = this;
    var counter;
    var interval;
    var click = new Audio('samples/click.ogg');
    self.state = 0;


    function startClick() {
        debugger;
        var spb     = 60/tempo; /* seconds per beat */
        var mspb    = 1000/spb; /* milliseconds per beat */
        
        /* Set counter to 0 */
        counter = 0;
        
        /* Set state to on (1) */
        self.state = 1;
        
        interval = setInterval(function () {
            performClick();
        }, mspb);
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