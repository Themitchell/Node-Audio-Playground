function Channel(mixer, sound_source, type) {
    var self = this;
    
    /* create channel elements */
    var mix_channel    = $("<div class='channel_strip' id='" + type + "'><h3>" + type + "</h3></div>");
    var fader          = $("<div class='fader'></div>");
    self.meter         = $("<canvas class='meter'></canvas>");
    var mute           = $("<span class='mute_button mute'>M</span>");
    var solo           = $("<span class='solo_button solo'>S</span>");
    var controls       = $("<div class='controls'></div>").append(fader, self.meter);
    var buttons        = $("<div class='buttons'></div>").append(mute, solo);

    mix_channel.append(controls, buttons)
    $(mixer).append(mix_channel);

    var volume = valueToVolume(100);
    fader.slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 127,
        value: 100,
        slide: function( event, ui ) {
            volume = valueToVolume(ui.value);
            sound_source.audio[0].volume = volume;
        }
    });


    function muteOrUnmute(button, sound_source, volume) {
        /*  TODO: Work out how to make mutes force a solo when exiting solos exist

            var solo_buttons = $('.solo_button.unsolo');
            if (solo_buttons >= 0) {
                this.next().click();
            }

            This currently causes a loop whereby a solo no longer works as it uses
            muteOrUnmute() to create a solo.
        */
        if ($(button).hasClass('mute')) {
            /* Set sound source level to zero */
            sound_source.audio[0].volume = 0;

            /* Turn on mute light */
            $(button).addClass('unmute').removeClass('mute');
        } else if ($(button).hasClass('unmute')) {
            /* Set sound source level to fader value */
            sound_source.audio[0].volume = volume;

            /* Turn off mute light */
            $(button).addClass('mute').removeClass('unmute');
        }
    }
    mute.click(function() {
        muteOrUnmute(this, sound_source, volume);
    });

    function soloOrUnsolo(button) {
        if ($(button).hasClass('solo')) {
            /* Check for any other solo buttons and disable them */
            var enabled_solo_buttons = $('.solo_button.unsolo')
            enabled_solo_buttons.each( function() {
                this.click();
            });

            /* Turn on solo light */
            $(button).addClass('unsolo').removeClass('solo');

            /* Find mutes for all channels except this on and turn them on */
            var disabled_mutes_except_own = $('.mute_button.mute').not($(button).prev());
            disabled_mutes_except_own.each( function() {
                this.click();
            });

        } else if ($(button).hasClass('unsolo')) {
            /* Turn off solo light */
            $(button).addClass('solo').removeClass('unsolo');

            /* Find mutes for all channels except this on and turn them off */
            var enabled_mutes_except_own = $('.mute_button.unmute').not($(button).prev());
            enabled_mutes_except_own.each( function() {
                this.click();
            });
        }
    }
    solo.click(function() {
        soloOrUnsolo(this);
    });
}