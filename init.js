function init() {
    var printer         = document.getElementById("printer");
    var visual_aid      = $('#metronome .visual_aid');
    var metro_toggle    = $('#metronome .state');
    var sound_bank      = document.getElementById("sound_bank");
    var mixer           = document.getElementById("mixer");
    var trigger_bank    = document.getElementById("trigger_bank");
    var metronome       = new Metronome(visual_aid);
    
    var menu_items      = document.getElementById('options').children;
    
    $(menu_items).click(function() {
        var instrument = new Instrument(sound_bank, mixer, trigger_bank, this.innerHTML, printer);
    });
    
    visual_aid.hide();
    debugger;
    metro_toggle.click(function() {
        if (metro_toggle.hasClass('off')) {
             metronome.startClick();
             metro_toggle.addClass('on');
             metro_toggle.removeClass('off');
             
        } else if (metro_toggle.hasClass('on')) {
            metronome.stopClick();
            metro_toggle.addClass('off');
            metro_toggle.removeClass('on');
        }
    })

}

$(document).ready( function() {
    init();
});