// Chris fleharty cfleharty@lwsd.org 3:33 PM

$.fn.animateRotate = function(angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function(i, e) {
        args.step = function(now) {
            $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(this, arguments);
        };

        $({deg: 0}).animate({deg: angle}, args);
    });
};

// constants for block size classes
// based on window size
var LARGE_MAX = 1200;
var MEDIUM_MAX = 992;
var SMALL_MAX = 768;

// cache the commonly accessed elements
var $blocks;
var $blockPreviews;
var $blockExpands;

$(function(){
	"use strict";

	// cache the blocks
	$blocks = $('.block');
	$blockPreviews = $blocks.find('.block-preview');
	$blockExpands = $blocks.find('.expand');



	var $window = $(window);

	// change block preview size class based on window width
	$window.resize(function(e){
		var width = $window.width();
		if (width >= LARGE_MAX) {
			$blockPreviews.removeClass('medium').removeClass('small').addClass('large');
		}
		else if (width >= MEDIUM_MAX && width < LARGE_MAX) {
			$blockPreviews.removeClass('large').removeClass('small').addClass('medium');
		}
		else if (width >= SMALL_MAX && width < MEDIUM_MAX) {
			$blockPreviews.removeClass('large').removeClass('medium').addClass('small');
		}
		else if (width < SMALL_MAX) {
			$blockPreviews.removeClass('large').removeClass('medium').removeClass('small');
		}
	});
	// and on init
	$window.resize();


	// !!! this needs a switch based on whether we're expanded or not

	// On clicking .expand, expand the block
	// On clicking .shrink, shrink the block

	// constants for expanding blocks
	var BLOCK_MARGIN = 15; // could be calculated on load
	var BLOCK_CONTENT_PADDING = 20; // could be calculated on load // could change based on each block / be found automatically
	var BLOCK_FOOTER_HEIGHT = 54; // could be calculated on load

	var EXPAND_FADE_DURATION = 3000; // has to be enough that we fadeIn before changing the height
	var BLOCK_EXPANDED_MARGIN = 0;
	var EXPAND_WIDTH_DURATION = 2000;
	var EXPAND_HEIGHT_DURATION = 2000;
	var EXPAND_ROTATE_DEGREES = 3600; //degrees
	var EXPAND_ROTATE_DURATION = 2000;
	var EXPAND_SCROLL_DURATION = 2000;

	// on clicking the block expands
	$blockExpands.click(function(e){
		var $expandTarget = $(e.target);
		var $block = $expandTarget.parents('.block');
		var $blockPreview = $block.find('.block-preview');
		var $blockFull = $block.find('.block-full');

		// fadeOut the block-preview
		$block.find('.block-preview').fadeOut(EXPAND_FADE_DURATION/2, function(){
			$blockPreview.toggleClass('hide');
			// fadeIn the block-full
			$blockFull.fadeIn(EXPAND_FADE_DURATION/2).toggleClass('hide');
		});

		// animate the block expanding
		// first animate the width
		var newWidth = $block.parents('.content').width();
		$block.animate({'margin-left':BLOCK_EXPANDED_MARGIN, 'margin-right':BLOCK_EXPANDED_MARGIN, width:newWidth},EXPAND_WIDTH_DURATION,function(){
			// then animate the height
			$block.animate({height:BLOCK_FOOTER_HEIGHT+(BLOCK_CONTENT_PADDING*2)+$blockFull.height()},EXPAND_HEIGHT_DURATION,function(){
				$block.addClass('expanded');
			});
		});

		// switch the plus to a minus
		$expandTarget.animateRotate(EXPAND_ROTATE_DEGREES/2, EXPAND_ROTATE_DURATION/2, undefined, function(){
			$expandTarget.removeClass('glyphicon-plus').addClass('glyphicon-minus')
				.animateRotate(EXPAND_ROTATE_DEGREES/2, EXPAND_ROTATE_DURATION/2);
		});

		// scroll the window to keep the expanded block in line
		var indexOfBlock = $blocks.index($block);
		if (indexOfBlock !== 0) {
			var previousBlockPositionLeft = $blocks.eq(indexOfBlock-1).position().left;
			var thisBlockPositionLeft = $block.position().left;
			if (previousBlockPositionLeft < thisBlockPositionLeft) {
				var newScrollTop = $window.scrollTop() + $block.outerHeight(true);
				$('html, body').animate({
					scrollTop: newScrollTop
				}, EXPAND_SCROLL_DURATION);
			}
		}

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
			opacity = 1 - Math.min(scrolled / splashHeight, 1);
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
		start = end;
		end = start + navHeightInitial - navHeightFinal;
		if (scrolled < start) {
			$('nav').css({height:navHeightInitial});
			$('nav').css({'padding-top':navPaddingInitial});
		}
		else if (scrolled >= start && scrolled <= end) {
			var relScroll = scrolled - start;

			// reduce height of the nav
			var newHeight = Math.max(navHeightInitial - relScroll, navHeightFinal);
			$('nav').css({height:newHeight});

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
