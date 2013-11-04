// scrolling fast problems
// scrolling up problems

$(function(){

	var navHeightInitial = $('nav').outerHeight();
	var navHeightFinal = 70;

	var navPaddingInitial = 65;
	var navPaddingFinal = 0;

	var splashHeight = $('#splash').outerHeight();
	var splashHeaderHeight = $('#splash h1').outerHeight();
	var splashTopOffset = $('#splash').offset().top + splashHeight;

	$(window).scroll(function(){

		var scrolled = $(this).scrollTop();
		console.log('scroll at', scrolled);
		if (scrolled < 0) return;

		// Fade out the splash
		var start = 0;
		var end = start + splashHeight;
		if (scrolled >= start && scrolled <= end) {

			// reduce opacity of splash
			var opacity = 1 - Math.min(scrolled / splashHeight, 1);
			$("#splash").css({opacity:opacity});

			// reduce opacity of splash header
			var opacity = 1 - Math.min(scrolled / splashHeight, 1);
			$("#splash h1").css({opacity:opacity});

			// reduce height
			var height = Math.max(splashHeight - scrolled, 0);
			$("#splash").css({height:height});
		}

		// Shorten the nav
		var start = end;
		var end = start + navHeightInitial - navHeightFinal;
		if (scrolled >= start && scrolled <= end) {
			var relScroll = scrolled - start;

			// reduce height of the nav
			var height = Math.max(navHeightInitial - relScroll, navHeightFinal);
			$('nav').css({height:height});

			// reduce the padding of the nav
			var padding = Math.max(navPaddingInitial - relScroll, navPaddingFinal);
			$('nav').css({'padding-top':padding});

		}

	});

});
