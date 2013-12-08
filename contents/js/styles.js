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
var $changeBlockSize;
var $scrollBlockAway;

var getNextBlock;
var getPrevBlock;
var getBlockOnNextRow;
var getBlockOnPrevRow;
var getBlockOuterHeight;
var getBlockOuterWidth;
var getBlockMargin;

// Chris fleharty cfleharty@lwsd.org 3:33 PM

$(function(){
	"use strict";

	// cache the blocks
	$blocks = $('.block');
	$blockPreviews = $blocks.find('.block-preview');
	$changeBlockSize = $blocks.find('.change-size');
	$scrollBlockAway = $blocks.filter('.scroll-away');

	// helper methods for accessing the blocks
	var indexOfBlock;
	var counter;
	getNextBlock = function($block){
		indexOfBlock = $blocks.index($block);
		if (indexOfBlock === -1) return $block;
		var indexOfNextBlock = indexOfBlock + 1;
		if (indexOfNextBlock === $blocks.length) return $block;
		return $blocks.eq(indexOfNextBlock);
	};
	getPrevBlock = function($block){
		indexOfBlock = $blocks.index($block);
		if (indexOfBlock === -1) return $block;
		var indexOfPrevBlock = indexOfBlock - 1;
		if (indexOfPrevBlock === -1) return $block;
		return $blocks.eq(indexOfPrevBlock);
	};
	getBlockOnNextRow = function($block){
		indexOfBlock = $blocks.index($block);
		if (indexOfBlock === -1) return $block;

		var $nextBlock = getNextBlock($block);
		if ($nextBlock === $block) return $block;
		var thisBlockOffsetTop = $block.offset().top;
		counter = 1;
		while($nextBlock.offset().top === thisBlockOffsetTop){
			counter = counter + 1;
			$nextBlock = $blocks.eq(indexOfBlock+counter);
			if ($nextBlock === $block) return $block;
		}
		return $nextBlock;
	};
	getBlockOnPrevRow = function($block){
		indexOfBlock = $blocks.index($block);
		if (indexOfBlock === -1) return $block;

		var $prevBlock = getPrevBlock($block);
		if ($prevBlock === $block) return $block;
		var thisBlockOffsetTop = $block.offset().top;
		counter = 1;
		while($prevBlock.offset().top === thisBlockOffsetTop){
			counter = counter - 1;
			$prevBlock = $blocks.eq(indexOfBlock+counter);
			if ($prevBlock === $block) return $block;
		}
		return $prevBlock;
	};
	getBlockOuterHeight = function(includeMargin){
		return $blocks.last().outerHeight(!!includeMargin);
	};
	getBlockOuterWidth = function(includeMargin){
		return $blocks.last().outerWidth(!!includeMargin);
	};
	var _blockMargin;
	getBlockMargin = function(){
		if (_blockMargin) return _blockMargin;
		_blockMargin = parseInt($blocks.last().css('marginBottom'), 10);
		return _blockMargin;
	};




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





	var BLOCK_EXPANDED_MARGIN = 0;

	var EXPAND_ROTATE_DEGREES = 3600; //degrees
	var SHRINK_ROTATE_DEGREES = 3600; //degrees
	var EXPAND_SCROLL_TOP_OFFSET = 0.33; //percent of window
	var SHRINK_SCROLL_TOP_OFFSET = 0.33; //percent of window

	// !!! THIS NEEDS TO BE HOOKED INTO EVERYTHING
	var CHANGE_SIZE_DURATION = 3000;
	// additionally we can add in like FadeInDuration seperate from fadeOutDuration
	// and have FADE_DURATION just refer to how long the whole thing should take

	var EXPAND_FADE_DURATION = 3000; // has to be enough that we fadeIn before changing the height
	var EXPAND_SIZE_DURATION = 4000;
	var EXPAND_WIDTH_DURATION = EXPAND_SIZE_DURATION/2;
	var EXPAND_HEIGHT_DURATION = EXPAND_SIZE_DURATION/2;
	var EXPAND_ROTATE_DURATION = 2000;
	var EXPAND_SCROLL_DURATION = 2000;

	var SHRINK_FADE_DURATION = 3000; // has to be enough that we fadeIn before changing the height
	var SHRINK_SIZE_DURATION = 4000;
	var SHRINK_WIDTH_DURATION = SHRINK_SIZE_DURATION/2;
	var SHRINK_HEIGHT_DURATION = SHRINK_SIZE_DURATION/2;
	var SHRINK_ROTATE_DURATION = 2000;
	var SHRINK_SCROLL_DURATION = 2000;

	$changeBlockSize.click(function(e){
		var $target = $(e.target);
		var $block = $target.parents('.block');
		var $blockPreview = $block.find('.block-preview');
		var $blockFull = $block.find('.block-full');
		var $blockFooter = $block.find('.block-footer');

		var newScrollTop;

		// expand the block
		if ($target.hasClass('expand')) {
			// fadeOut the block-preview
			$blockPreview.fadeOut(EXPAND_FADE_DURATION/2, function(){
				$blockPreview.toggleClass('hide');
				// fadeIn the block-full
				$blockFull.fadeIn(EXPAND_FADE_DURATION/2).toggleClass('hide');
			});

			// animate the block expanding
			// first animate the width
			$block.animate({
				'margin-left': BLOCK_EXPANDED_MARGIN,
				'margin-right': BLOCK_EXPANDED_MARGIN,
				width: $block.parents('.content').width()
			},EXPAND_WIDTH_DURATION,function(){
				// then animate the height
				$block.animate({
					height:$blockFull.outerHeight(true) + $blockFooter.outerHeight(true)
				},EXPAND_HEIGHT_DURATION,function(){
					$block.addClass('expanded');
				});
			});

			// switch the plus to a minus and spin it
			$target.animateRotate(EXPAND_ROTATE_DEGREES/2, EXPAND_ROTATE_DURATION/2, undefined, function(){
				$target.removeClass('expand').removeClass('glyphicon-plus').addClass('shrink').addClass('glyphicon-minus')
					.animateRotate(EXPAND_ROTATE_DEGREES/2, EXPAND_ROTATE_DURATION/2);
			});

			// scroll the window to keep the expanded block 33% down from the top of the window
			var previousBlockPositionLeft = getPrevBlock($block).position().left;
			var thisBlockPositionLeft = $block.position().left;
			if (previousBlockPositionLeft < thisBlockPositionLeft) { // => block expansion will overflow into next row
				newScrollTop = getBlockOnNextRow($block).offset().top - ($window.height()*EXPAND_SCROLL_TOP_OFFSET); 
			}
			else { // => block expansion will not overflow into next row
				newScrollTop = $block.offset().top - ($window.height()*EXPAND_SCROLL_TOP_OFFSET);
			}
			$('html, body').animate({
				scrollTop: newScrollTop
			}, EXPAND_SCROLL_DURATION);

		}
		// shrink the block
		if ($target.hasClass('shrink')) {
			// fadeOut the block-full
			$blockFull.fadeOut(SHRINK_FADE_DURATION/2, function(){
				$blockFull.toggleClass('hide');
				// fadeIn the block-preview
				$blockPreview.fadeIn(SHRINK_FADE_DURATION/2).toggleClass('hide');
			});

			// animate the block shrinking
			// first animate the height
			$block.animate({
				height:getBlockOuterHeight()
			},SHRINK_HEIGHT_DURATION,function(){
				// then animate the width
				$block.animate({
					'margin-left':getBlockMargin(),
					'margin-right':getBlockMargin(),
					width:getBlockOuterWidth()
				},SHRINK_WIDTH_DURATION);
			}).removeClass('expanded');

			// switch the plus to a minus
			$target.animateRotate(SHRINK_ROTATE_DEGREES/2, SHRINK_ROTATE_DURATION/2, undefined, function(){
				$target.removeClass('shrink').removeClass('glyphicon-minus').addClass('expand').addClass('glyphicon-plus')
					.animateRotate(EXPAND_ROTATE_DEGREES/2, EXPAND_ROTATE_DURATION/2);
			});

			// scroll the window to keep the shrunk block 33% down from the top of the window
			var previousBlockPositionRight = getPrevBlock($block).position().left + getPrevBlock($block).width();
			var thisBlockPositionRight = $block.position().left + $block.width();
			if (previousBlockPositionRight < thisBlockPositionRight) { // => block reduction will reduce number of rows
				newScrollTop = getBlockOnPrevRow($block).offset().top - ($window.height()*SHRINK_SCROLL_TOP_OFFSET);
			}
			else { // => block reduction will not reduce number of rows
				newScrollTop = getBlockOnNextRow($block).offset().top - ($window.height()*SHRINK_SCROLL_TOP_OFFSET);
			}
			$('html, body').animate({
				scrollTop: newScrollTop
			}, SHRINK_SCROLL_DURATION);

		}
	});






	// scroll away the splash and scroll up the nav
	var navHeightInitial = $('nav').outerHeight();
	var navHeightFinal = 70;

	var navPaddingInitial = 65;
	var navPaddingFinal = 0;

	var splashHeight = $('#splash').outerHeight();
	var splashHeaderHeight = $('#splash h1').outerHeight();
	var splashTopOffset = $('#splash').offset().top + splashHeight;

	var inPreSplash = false;
	var inPostSplash = false;

	var inPreNav = false;
	var inPostNav = false;

	$window.scroll(function(){

		// !!! $(this) === $window ???
		var scrolled = $(this).scrollTop();
		console.log('scroll at', scrolled);
		if (scrolled < 0) return;

		// Fade out the splash
		var start = 0;
		var end = start + splashHeight;
		if (!inPreSplash && scrolled < start) {
			console.log('preSplash');
			$("#splash").css({opacity:1});
			$("#splash h1").css({opacity:1});
			$("#splash").css({height:600});
			inPreSplash = true;
		}
		else if (scrolled >= start && scrolled <= end) {

			// reduce opacity of splash
			var opacity = 1 - Math.min(scrolled / splashHeight, 1);
			$("#splash").css({opacity:opacity});

			// reduce opacity of splash header
			opacity = 1 - Math.min(scrolled / splashHeight, 1);
			$("#splash h1").css({opacity:opacity});

			// !!! should be relScroll not scrolled
			// scrolled will not work if element is below top
			// reduce height
			var height = Math.max(splashHeight - scrolled, 0);
			$("#splash").css({height:height});

			// reset pre and post triggers
			inPreSplash = false;
			inPostSplash = false;
		}
		else if (!inPostSplash && scrolled > end) {
			console.log('postSplash');
			$("#splash").css({opacity:0});
			$("#splash h1").css({opacity:0});
			$("#splash").css({height:0});
			inPostSplash = true;
		}

		// Shorten the nav
		start = end;
		end = start + navHeightInitial - navHeightFinal;
		if (!inPreNav && scrolled < start) {
			$('nav').css({height:navHeightInitial});
			$('nav').css({'padding-top':navPaddingInitial});
			inPreNav = true;
		}
		else if (scrolled >= start && scrolled <= end) {
			var relScroll = scrolled - start;

			// reduce height of the nav
			var newHeight = Math.max(navHeightInitial - relScroll, navHeightFinal);
			$('nav').css({height:newHeight});

			// reduce the padding of the nav
			var padding = Math.max(navPaddingInitial - relScroll, navPaddingFinal);
			$('nav').css({'padding-top':padding});

			// reset pre and post triggers
			inPreNav = false;
			inPostNav = false;
		}
		else if (!inPostNav && scrolled > end) {
			$('nav').css({height:navHeightFinal});
			$('nav').css({'padding-top':navPaddingFinal});
			inPostNav = true;
		}


		// scroll away the scroll-away blocks
		// assumptions: effect duration is based on the size of the block
		// !!! think i need to calculate start dynamically : ()
		// !!! on resize perhaps I need to recalculate the current positions for everything
		$scrollBlockAway.each(function(index, el){
			var $el = $(el);
			var $target = $el.find('.scroll-away-target');
			var relScroll = scrolled - $el.data('start');

			if (relScroll < 0){
				// before effect
				$target.css({height:$el.height()});
				$target.css({opacity:1});
			}
			else if (relScroll > $el.height()){
				// after effect
				$target.css({height:0});
				$target.css({opacity:0});
			}
			else {
				// effect

				// reduce height proportional to relScroll
				var height = $el.height() - relScroll;
				$target.css({height:height});

				// reduce opacity proportional to relScroll
				var opacity = 1 - (relScroll / $el.height());
				$target.css({opacity:opacity});
			}

		});

		// set up the scrollAway blocks by caching some data
		$scrollBlockAway.each(function(index, el){
			var $el = $(el);
			var start = $el.position().top + ($el.height() / 2) - ($window.height() / 2);
			$el.data('start', start);
		});



		// for each block that has a .scrollAway class
		// if window.scrollTop + window.height === block.position().top + block.height => block is fully in the visible window
		// relScroll = (block.position().top + block.height) - (window.scrollTop + window.height)
		// reduce height and opacity based on ratio to window size

		// if less than force to be full stats
		// if more than force to be null stats

		// #scrollAwayBlue {
			// background-color: red;
		// }

		// .scrollAwayTarget {
			// weight: 100%
			// height: 100%
		// }

	});


	

});
