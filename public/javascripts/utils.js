function amplitudeAsPercentage(sample) {
  return sample * 100;
}

function valueToVolume(value) {
  return (1/128) * value;
}

function startOverlay() {
	$("body").append('<div class="overlay"></div>').css({"overflow-y":"hidden"});
	$(".overlay").animate({"opacity":"0.6"}, 200, 'linear');
}

function killOverlay() {
  $(".overlay").animate({"opacity":"0"}, 200, 'linear', function(){
		$(".overlay").remove();
	})
}