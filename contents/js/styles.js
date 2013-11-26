$(function(){

	$('.block .expand').click(function(e){
		// assume this is a small joe
		var $block = $(this).parents('.block');

		var newWidth = $block.parents('.content').width();
		$block.stop().animate({width:newWidth},2000,function(){
			$(this).addClass('expanded');
		});

		$block.find('.block-preview').toggleClass('hide');
		$block.find('.block-full').toggleClass('hide');


		//$(this).toggleClass('large');

		// 1. animate removing margin
		// 2. animate width expanding
		// 3. animate height expanding
		// 4. spin plus(while happening)
		// 5. switch plus to minus
		// 6. spin minus

	});



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
		if (scrolled < start) {
			$("#splash").css({opacity:1});
			$("#splash h1").css({opacity:1});
			$("#splash").css({height:600});
		}
		else if (scrolled >= start && scrolled <= end) {

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
		else if (scrolled > end) {
			$("#splash").css({opacity:0});
			$("#splash h1").css({opacity:0});
			$("#splash").css({height:0});
		}

		// Shorten the nav
		var start = end;
		var end = start + navHeightInitial - navHeightFinal;
		if (scrolled < start) {
			$('nav').css({height:navHeightInitial});
			$('nav').css({'padding-top':navPaddingInitial});
		}
		else if (scrolled >= start && scrolled <= end) {
			var relScroll = scrolled - start;

			// reduce height of the nav
			var height = Math.max(navHeightInitial - relScroll, navHeightFinal);
			$('nav').css({height:height});

			// reduce the padding of the nav
			var padding = Math.max(navPaddingInitial - relScroll, navPaddingFinal);
			$('nav').css({'padding-top':padding});
		}
		else if (scrolled > end) {
			$('nav').css({height:navHeightFinal});
			$('nav').css({'padding-top':navPaddingFinal});
		}

	});

	// fade in more content when plus button is clicked
	$('.more').click(function(e){
		// $('.container.one').fadeOut();
		// $('.project2').slideDown('slow');
		$('.container.two').fadeIn('slow');
	});

});
