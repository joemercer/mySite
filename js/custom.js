/*! mySite 2014-01-06 */
+function($) {
    "use strict";
    var Carousel = function(element, options) {
        this.$element = $(element), this.$indicators = this.$element.find(".carousel-indicators"), 
        this.options = options, this.paused = this.sliding = this.interval = this.$active = this.$items = null, 
        "hover" == this.options.pause && this.$element.on("mouseenter", $.proxy(this.pause, this)).on("mouseleave", $.proxy(this.cycle, this));
    };
    Carousel.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0
    }, Carousel.prototype.cycle = function(e) {
        return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval)), 
        this;
    }, Carousel.prototype.getActiveIndex = function() {
        return this.$active = this.$element.find(".item.active"), this.$items = this.$active.parent().children(), 
        this.$items.index(this.$active);
    }, Carousel.prototype.to = function(pos) {
        var that = this, activeIndex = this.getActiveIndex();
        return pos > this.$items.length - 1 || 0 > pos ? void 0 : this.sliding ? this.$element.one("slid", function() {
            that.to(pos);
        }) : activeIndex == pos ? this.pause().cycle() : this.slide(pos > activeIndex ? "next" : "prev", $(this.$items[pos]));
    }, Carousel.prototype.pause = function(e) {
        return e || (this.paused = !0), this.$element.find(".next, .prev").length && $.support.transition.end && (this.$element.trigger($.support.transition.end), 
        this.cycle(!0)), this.interval = clearInterval(this.interval), this;
    }, Carousel.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next");
    }, Carousel.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev");
    }, Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find(".item.active"), $next = next || $active[type](), isCycling = this.interval, direction = "next" == type ? "left" : "right", fallback = "next" == type ? "first" : "last", that = this;
        if (!$next.length) {
            if (!this.options.wrap) return;
            $next = this.$element.find(".item")[fallback]();
        }
        this.sliding = !0, isCycling && this.pause();
        var e = $.Event("slide.bs.carousel", {
            relatedTarget: $next[0],
            direction: direction
        });
        if (!$next.hasClass("active")) {
            if (this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), 
            this.$element.one("slid", function() {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
                $nextIndicator && $nextIndicator.addClass("active");
            })), $.support.transition && this.$element.hasClass("slide")) {
                if (this.$element.trigger(e), e.isDefaultPrevented()) return;
                $next.addClass(type), $next[0].offsetWidth, $active.addClass(direction), $next.addClass(direction), 
                $active.one($.support.transition.end, function() {
                    $next.removeClass([ type, direction ].join(" ")).addClass("active"), $active.removeClass([ "active", direction ].join(" ")), 
                    that.sliding = !1, setTimeout(function() {
                        that.$element.trigger("slid");
                    }, 0);
                }).emulateTransitionEnd(600);
            } else {
                if (this.$element.trigger(e), e.isDefaultPrevented()) return;
                $active.removeClass("active"), $next.addClass("active"), this.sliding = !1, this.$element.trigger("slid");
            }
            return isCycling && this.cycle(), this;
        }
    };
    var old = $.fn.carousel;
    $.fn.carousel = function(option) {
        return this.each(function() {
            var $this = $(this), data = $this.data("bs.carousel"), options = $.extend({}, Carousel.DEFAULTS, $this.data(), "object" == typeof option && option), action = "string" == typeof option ? option : options.slide;
            data || $this.data("bs.carousel", data = new Carousel(this, options)), "number" == typeof option ? data.to(option) : action ? data[action]() : options.interval && data.pause().cycle();
        });
    }, $.fn.carousel.Constructor = Carousel, $.fn.carousel.noConflict = function() {
        return $.fn.carousel = old, this;
    }, $(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(e) {
        var href, $this = $(this), $target = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "")), options = $.extend({}, $target.data(), $this.data()), slideIndex = $this.attr("data-slide-to");
        slideIndex && (options.interval = !1), $target.carousel(options), (slideIndex = $this.attr("data-slide-to")) && $target.data("bs.carousel").to(slideIndex), 
        e.preventDefault();
    }), $(window).on("load", function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this);
            $carousel.carousel($carousel.data());
        });
    });
}(window.jQuery), +function($) {
    "use strict";
    function clearMenus() {
        $(backdrop).remove(), $(toggle).each(function(e) {
            var $parent = getParent($(this));
            $parent.hasClass("open") && ($parent.trigger(e = $.Event("hide.bs.dropdown")), e.isDefaultPrevented() || $parent.removeClass("open").trigger("hidden.bs.dropdown"));
        });
    }
    function getParent($this) {
        var selector = $this.attr("data-target");
        selector || (selector = $this.attr("href"), selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ""));
        var $parent = selector && $(selector);
        return $parent && $parent.length ? $parent : $this.parent();
    }
    var backdrop = ".dropdown-backdrop", toggle = "[data-toggle=dropdown]", Dropdown = function(element) {
        $(element).on("click.bs.dropdown", this.toggle);
    };
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this);
        if (!$this.is(".disabled, :disabled")) {
            var $parent = getParent($this), isActive = $parent.hasClass("open");
            if (clearMenus(), !isActive) {
                if ("ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length && $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click", clearMenus), 
                $parent.trigger(e = $.Event("show.bs.dropdown")), e.isDefaultPrevented()) return;
                $parent.toggleClass("open").trigger("shown.bs.dropdown"), $this.focus();
            }
            return !1;
        }
    }, Dropdown.prototype.keydown = function(e) {
        if (/(38|40|27)/.test(e.keyCode)) {
            var $this = $(this);
            if (e.preventDefault(), e.stopPropagation(), !$this.is(".disabled, :disabled")) {
                var $parent = getParent($this), isActive = $parent.hasClass("open");
                if (!isActive || isActive && 27 == e.keyCode) return 27 == e.which && $parent.find(toggle).focus(), 
                $this.click();
                var $items = $("[role=menu] li:not(.divider):visible a", $parent);
                if ($items.length) {
                    var index = $items.index($items.filter(":focus"));
                    38 == e.keyCode && index > 0 && index--, 40 == e.keyCode && index < $items.length - 1 && index++, 
                    ~index || (index = 0), $items.eq(index).focus();
                }
            }
        }
    };
    var old = $.fn.dropdown;
    $.fn.dropdown = function(option) {
        return this.each(function() {
            var $this = $(this), data = $this.data("dropdown");
            data || $this.data("dropdown", data = new Dropdown(this)), "string" == typeof option && data[option].call($this);
        });
    }, $.fn.dropdown.Constructor = Dropdown, $.fn.dropdown.noConflict = function() {
        return $.fn.dropdown = old, this;
    }, $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation();
    }).on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", toggle + ", [role=menu]", Dropdown.prototype.keydown);
}(window.jQuery), +function($) {
    "use strict";
    function ScrollSpy(element, options) {
        var href, process = $.proxy(this.process, this);
        this.$element = $(element).is("body") ? $(window) : $(element), this.$body = $("body"), 
        this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", process), 
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options), this.selector = (this.options.target || (href = $(element).attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", 
        this.offsets = $([]), this.targets = $([]), this.activeTarget = null, this.refresh(), 
        this.process();
    }
    ScrollSpy.DEFAULTS = {
        offset: 10
    }, ScrollSpy.prototype.refresh = function() {
        var offsetMethod = this.$element[0] == window ? "offset" : "position";
        this.offsets = $([]), this.targets = $([]);
        {
            var self = this;
            this.$body.find(this.selector).map(function() {
                var $el = $(this), href = $el.data("target") || $el.attr("href"), $href = /^#\w/.test(href) && $(href);
                return $href && $href.length && [ [ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ] ] || null;
            }).sort(function(a, b) {
                return a[0] - b[0];
            }).each(function() {
                self.offsets.push(this[0]), self.targets.push(this[1]);
            });
        }
    }, ScrollSpy.prototype.process = function() {
        var i, scrollTop = this.$scrollElement.scrollTop() + this.options.offset, scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight, maxScroll = scrollHeight - this.$scrollElement.height(), offsets = this.offsets, targets = this.targets, activeTarget = this.activeTarget;
        if (scrollTop >= maxScroll) return activeTarget != (i = targets.last()[0]) && this.activate(i);
        for (i = offsets.length; i--; ) activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i]);
    }, ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target, $(this.selector).parents(".active").removeClass("active");
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]', active = $(selector).parents("li").addClass("active");
        active.parent(".dropdown-menu").length && (active = active.closest("li.dropdown").addClass("active")), 
        active.trigger("activate");
    };
    var old = $.fn.scrollspy;
    $.fn.scrollspy = function(option) {
        return this.each(function() {
            var $this = $(this), data = $this.data("bs.scrollspy"), options = "object" == typeof option && option;
            data || $this.data("bs.scrollspy", data = new ScrollSpy(this, options)), "string" == typeof option && data[option]();
        });
    }, $.fn.scrollspy.Constructor = ScrollSpy, $.fn.scrollspy.noConflict = function() {
        return $.fn.scrollspy = old, this;
    }, $(window).on("load", function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this);
            $spy.scrollspy($spy.data());
        });
    });
}(window.jQuery), +function($) {
    "use strict";
    function transitionEnd() {
        var el = document.createElement("bootstrap"), transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var name in transEndEventNames) if (void 0 !== el.style[name]) return {
            end: transEndEventNames[name]
        };
    }
    $.fn.emulateTransitionEnd = function(duration) {
        var called = !1, $el = this;
        $(this).one($.support.transition.end, function() {
            called = !0;
        });
        var callback = function() {
            called || $($el).trigger($.support.transition.end);
        };
        return setTimeout(callback, duration), this;
    }, $(function() {
        $.support.transition = transitionEnd();
    });
}(window.jQuery), $.fn.animateRotate = function(angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete), step = args.step;
    return this.each(function(i, e) {
        args.step = function(now) {
            return $.style(e, "transform", "rotate(" + now + "deg)"), step ? step.apply(this, arguments) : void 0;
        }, $({
            deg: 0
        }).animate({
            deg: angle
        }, args);
    });
};

var LARGE_MAX = 1200, MEDIUM_MAX = 992, SMALL_MAX = 768, $blocks, $blockPreviews, $changeBlockSize, $scrollBlockAway, getNextBlock, getPrevBlock, getBlockOnNextRow, getBlockOnPrevRow, getBlockOuterHeight, getBlockOuterWidth, getBlockMargin;

$(function() {
    "use strict";
    $blocks = $(".block"), $blockPreviews = $blocks.find(".block-preview"), $changeBlockSize = $blocks.find(".change-size"), 
    $scrollBlockAway = $blocks.filter(".scroll-away");
    var indexOfBlock, counter;
    getNextBlock = function($block) {
        if (indexOfBlock = $blocks.index($block), -1 === indexOfBlock) return $block;
        var indexOfNextBlock = indexOfBlock + 1;
        return indexOfNextBlock === $blocks.length ? $block : $blocks.eq(indexOfNextBlock);
    }, getPrevBlock = function($block) {
        if (indexOfBlock = $blocks.index($block), -1 === indexOfBlock) return $block;
        var indexOfPrevBlock = indexOfBlock - 1;
        return -1 === indexOfPrevBlock ? $block : $blocks.eq(indexOfPrevBlock);
    }, getBlockOnNextRow = function($block) {
        if (indexOfBlock = $blocks.index($block), -1 === indexOfBlock) return $block;
        var $nextBlock = getNextBlock($block);
        if ($nextBlock === $block) return $block;
        var thisBlockOffsetTop = $block.offset().top;
        for (counter = 1; $nextBlock.offset().top === thisBlockOffsetTop; ) if (counter += 1, 
        $nextBlock = $blocks.eq(indexOfBlock + counter), $nextBlock === $block) return $block;
        return $nextBlock;
    }, getBlockOnPrevRow = function($block) {
        if (indexOfBlock = $blocks.index($block), -1 === indexOfBlock) return $block;
        var $prevBlock = getPrevBlock($block);
        if ($prevBlock === $block) return $block;
        var thisBlockOffsetTop = $block.offset().top;
        for (counter = 1; $prevBlock.offset().top === thisBlockOffsetTop; ) if (counter -= 1, 
        $prevBlock = $blocks.eq(indexOfBlock + counter), $prevBlock === $block) return $block;
        return $prevBlock;
    }, getBlockOuterHeight = function(includeMargin) {
        return $blocks.last().outerHeight(!!includeMargin);
    }, getBlockOuterWidth = function(includeMargin) {
        return $blocks.last().outerWidth(!!includeMargin);
    };
    var _blockMargin;
    getBlockMargin = function() {
        return _blockMargin ? _blockMargin : _blockMargin = parseInt($blocks.last().css("marginBottom"), 10);
    };
    var $window = $(window);
    $window.resize(function() {
        var width = $window.width();
        width >= LARGE_MAX ? $blockPreviews.removeClass("medium").removeClass("small").addClass("large") : width >= MEDIUM_MAX && LARGE_MAX > width ? $blockPreviews.removeClass("large").removeClass("small").addClass("medium") : width >= SMALL_MAX && MEDIUM_MAX > width ? $blockPreviews.removeClass("large").removeClass("medium").addClass("small") : SMALL_MAX > width && $blockPreviews.removeClass("large").removeClass("medium").removeClass("small");
    }), $window.resize();
    var BLOCK_EXPANDED_MARGIN = 0, EXPAND_ROTATE_DEGREES = 3600, SHRINK_ROTATE_DEGREES = 3600, EXPAND_SCROLL_TOP_OFFSET = .33, SHRINK_SCROLL_TOP_OFFSET = .33, EXPAND_FADE_DURATION = 3e3, EXPAND_SIZE_DURATION = 4e3, EXPAND_WIDTH_DURATION = EXPAND_SIZE_DURATION / 2, EXPAND_HEIGHT_DURATION = EXPAND_SIZE_DURATION / 2, EXPAND_ROTATE_DURATION = 2e3, EXPAND_SCROLL_DURATION = 2e3, SHRINK_FADE_DURATION = 3e3, SHRINK_SIZE_DURATION = 4e3, SHRINK_WIDTH_DURATION = SHRINK_SIZE_DURATION / 2, SHRINK_HEIGHT_DURATION = SHRINK_SIZE_DURATION / 2, SHRINK_ROTATE_DURATION = 2e3, SHRINK_SCROLL_DURATION = 2e3;
    $changeBlockSize.click(function(e) {
        var newScrollTop, $target = $(e.target), $block = $target.parents(".block"), $blockPreview = $block.find(".block-preview"), $blockFull = $block.find(".block-full"), $blockFooter = $block.find(".block-footer");
        if ($target.hasClass("expand")) {
            $blockPreview.fadeOut(EXPAND_FADE_DURATION / 2, function() {
                $blockPreview.toggleClass("hide"), $blockFull.fadeIn(EXPAND_FADE_DURATION / 2).toggleClass("hide");
            }), $block.animate({
                "margin-left": BLOCK_EXPANDED_MARGIN,
                "margin-right": BLOCK_EXPANDED_MARGIN,
                width: $block.parents(".content").width()
            }, EXPAND_WIDTH_DURATION, function() {
                $block.animate({
                    height: $blockFull.outerHeight(!0) + $blockFooter.outerHeight(!0)
                }, EXPAND_HEIGHT_DURATION, function() {
                    $block.addClass("expanded");
                });
            }), $target.animateRotate(EXPAND_ROTATE_DEGREES / 2, EXPAND_ROTATE_DURATION / 2, void 0, function() {
                $target.removeClass("expand").removeClass("glyphicon-plus").addClass("shrink").addClass("glyphicon-minus").animateRotate(EXPAND_ROTATE_DEGREES / 2, EXPAND_ROTATE_DURATION / 2);
            });
            var previousBlockPositionLeft = getPrevBlock($block).position().left, thisBlockPositionLeft = $block.position().left;
            newScrollTop = thisBlockPositionLeft > previousBlockPositionLeft ? getBlockOnNextRow($block).offset().top - $window.height() * EXPAND_SCROLL_TOP_OFFSET : $block.offset().top - $window.height() * EXPAND_SCROLL_TOP_OFFSET, 
            $("html, body").animate({
                scrollTop: newScrollTop
            }, EXPAND_SCROLL_DURATION);
        }
        if ($target.hasClass("shrink")) {
            $blockFull.fadeOut(SHRINK_FADE_DURATION / 2, function() {
                $blockFull.toggleClass("hide"), $blockPreview.fadeIn(SHRINK_FADE_DURATION / 2).toggleClass("hide");
            }), $block.animate({
                height: getBlockOuterHeight()
            }, SHRINK_HEIGHT_DURATION, function() {
                $block.animate({
                    "margin-left": getBlockMargin(),
                    "margin-right": getBlockMargin(),
                    width: getBlockOuterWidth()
                }, SHRINK_WIDTH_DURATION);
            }).removeClass("expanded"), $target.animateRotate(SHRINK_ROTATE_DEGREES / 2, SHRINK_ROTATE_DURATION / 2, void 0, function() {
                $target.removeClass("shrink").removeClass("glyphicon-minus").addClass("expand").addClass("glyphicon-plus").animateRotate(EXPAND_ROTATE_DEGREES / 2, EXPAND_ROTATE_DURATION / 2);
            });
            var previousBlockPositionRight = getPrevBlock($block).position().left + getPrevBlock($block).width(), thisBlockPositionRight = $block.position().left + $block.width();
            newScrollTop = thisBlockPositionRight > previousBlockPositionRight ? getBlockOnPrevRow($block).offset().top - $window.height() * SHRINK_SCROLL_TOP_OFFSET : getBlockOnNextRow($block).offset().top - $window.height() * SHRINK_SCROLL_TOP_OFFSET, 
            $("html, body").animate({
                scrollTop: newScrollTop
            }, SHRINK_SCROLL_DURATION);
        }
    });
    var navHeightInitial = $("nav").outerHeight(), navHeightFinal = 70, navPaddingInitial = 65, navPaddingFinal = 0, splashHeight = $("#splash").outerHeight(), inPreSplash = ($("#splash h1").outerHeight(), 
    $("#splash").offset().top + splashHeight, !1), inPostSplash = !1, inPreNav = !1, inPostNav = !1;
    $window.scroll(function() {
        var scrolled = $(this).scrollTop();
        if (console.log("scroll at", scrolled), !(0 > scrolled)) {
            var start = 0, end = start + splashHeight;
            if (!inPreSplash && start > scrolled) console.log("preSplash"), $("#splash").css({
                opacity: 1
            }), $("#splash h1").css({
                opacity: 1
            }), $("#splash").css({
                height: 600
            }), inPreSplash = !0; else if (scrolled >= start && end >= scrolled) {
                var opacity = 1 - Math.min(scrolled / splashHeight, 1);
                $("#splash").css({
                    opacity: opacity
                }), opacity = 1 - Math.min(scrolled / splashHeight, 1), $("#splash h1").css({
                    opacity: opacity
                });
                var height = Math.max(splashHeight - scrolled, 0);
                $("#splash").css({
                    height: height
                }), inPreSplash = !1, inPostSplash = !1;
            } else !inPostSplash && scrolled > end && (console.log("postSplash"), $("#splash").css({
                opacity: 0
            }), $("#splash h1").css({
                opacity: 0
            }), $("#splash").css({
                height: 0
            }), inPostSplash = !0);
            if (start = end, end = start + navHeightInitial - navHeightFinal, !inPreNav && start > scrolled) $("nav").css({
                height: navHeightInitial
            }), $("nav").css({
                "padding-top": navPaddingInitial
            }), inPreNav = !0; else if (scrolled >= start && end >= scrolled) {
                var relScroll = scrolled - start, newHeight = Math.max(navHeightInitial - relScroll, navHeightFinal);
                $("nav").css({
                    height: newHeight
                });
                var padding = Math.max(navPaddingInitial - relScroll, navPaddingFinal);
                $("nav").css({
                    "padding-top": padding
                }), inPreNav = !1, inPostNav = !1;
            } else !inPostNav && scrolled > end && ($("nav").css({
                height: navHeightFinal
            }), $("nav").css({
                "padding-top": navPaddingFinal
            }), inPostNav = !0);
            $scrollBlockAway.each(function(index, el) {
                var $el = $(el), $target = $el.find(".scroll-away-target"), relScroll = scrolled - $el.data("start");
                if (0 > relScroll) $target.css({
                    height: $el.height()
                }), $target.css({
                    opacity: 1
                }); else if (relScroll > $el.height()) $target.css({
                    height: 0
                }), $target.css({
                    opacity: 0
                }); else {
                    var height = $el.height() - relScroll;
                    $target.css({
                        height: height
                    });
                    var opacity = 1 - relScroll / $el.height();
                    $target.css({
                        opacity: opacity
                    });
                }
            }), $scrollBlockAway.each(function(index, el) {
                var $el = $(el), start = $el.position().top + $el.height() / 2 - $window.height() / 2;
                $el.data("start", start);
            });
        }
    });
});