function onScreenResize(breakpoint) {
	if ($('.group img').isLoaded()) {
		$('.groups-list').equalHeights({
			children: '.group'
		});
	} else {
		$('.group img').on('load', function() {
			$('.groups-list').equalHeights({
				children: '.group'
			});
		});
	}

	if ($('.event img').isLoaded()) {
		$('.all-events, .featured-events').equalHeights({
			children: '.event'
		});
	} else {
		$('.event img').on('load', function() {
			$('.all-events, .featured-events').equalHeights({
				children: '.event'
			});
		});
	}

	if ($('.news img').isLoaded() || $('.news img').length == 0) {
		$('.all-news, .featured-news-list').equalHeights({
			children: '.news'
		});
	} else {
		$('.news img').on('load', function() {
			$('.all-news, .featured-news-list').equalHeights({
				children: '.news'
			});
		});
	}

	$('.people-list').equalHeights({
		children: '.person'
	});
}

function isAndroid() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
}

function isBlackberry() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("blackberry") > -1; //&& ua.indexOf("mobile");
}

function isIos() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.match(/(ipad|iphone|ipod)/g);
}

function scrollToDiv(el) {
	$('html,body').animate({
		scrollTop: $(el).offset().top
	});
}

function prependFavicon(el) {
	// <span class="image"><img src="favicon" /></span>
	$(el).prepend('<span class="image favicon"><img src="//www.google.com/s2/favicons?domain=' + el.href + '" alt="" /></span>');
}

$.fn.modal.Constructor.prototype.enforceFocus = function() {
	modal_this = this
	$(document).on('focusin.modal', function(e) {
		if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
			modal_this.$element.focus()
		}
	})
};

$(document).ready(function() {

	// Initiate bxSlider on the news-main page
	$('#news-main').find('.news-primary').bxSlider({
		auto: true,
		autoHover: true,
		captions: true,
		controls: false,
		mode: 'fade'
	});

	// Add favicons to myLinks links
	$("a.my-link").each(function() {
		prependFavicon(this);
	});​

	$('.my-links-slides').bxSlider({
		adaptiveHeight: true,
		controls: false,
		infiniteLoop: false
	});

	$('.intro-slider').bxSlider({
		adaptiveHeight: true,
		controls: false,
		infiniteLoop: false
	});

	// $('.featured-news-list').bxSlider({
	//   minSlides:      1, 
	//   maxSlides:      3, 
	//   slideWidth:     363,
	//   controls:       false,
	//   infiniteLoop:   false
	// });

	// Give us those really nice fancy select boxes
	$("select.chosen").chosen({
		allow_single_deselect: true,
		width: "100%",
		disable_search_threshold: 10
	});

	// Seem to need to stop propogation when clicking events, otherwise you forward to the next item
	$('.chosen-container .chosen-results').on('touchend', function(event) {
		event.stopPropagation();
		event.preventDefault();
		return;
	});

	$('.tip').popover({
		trigger: 'hover focus click'
	});

	// Attempt to add ellipsis to the end of any content that needs it
	$('.ellipsis').ellipsis();

	// Initiate transport
	$('[data-transport]').transport({
		xs: '(max-width: 479px)',
		sm: '(max-width: 767px)',
		md: '(max-width: 991px)',
		lg: '(max-width: 1199px)'
	});

	onScreenResize(determineBreakpoint());

	// hide certain links on Android Devices only. (.ics, for instance.)
	if (isAndroid()) {
		$('.hidden-android').hide();
		$('html').addClass('android');
	}

	if (isBlackberry()) {
		$('.hidden-blackberry').hide();
		$('html').addClass('android');
	}

	if (isIos()) {
		$('.hidden-ios').hide();
		$('html').addClass('ios');
	}

	// Handle external links
	$('a[rel="external"]').attr('target', '_blank');

	// Allow filtering of the resoruce page
	$("#resource-list").resourceFilter();

	// Make sure tooltips work on mobile. Seems kind of hacky.
	// $(".tip").on('show', function (e) {
	//   if ('ontouchstart' in document.documentElement) e.preventDefault()
	// });

	// Get Started section
	$getStartedLink = $('#get-started-link');
	$getStarted = $('#get-started');
	getStartedShowText = $getStartedLink.html();
	getStartedHideText = $getStartedLink.data('alttext') + ' <span class="icon-collapse"></span>';

	$getStartedLink.click(function(e) {
		e.preventDefault();
		$getStarted.slideToggle("fast", function() {
			if ($getStarted.is(':visible')) {
				$getStartedLink.html(getStartedHideText);
			} else {
				$getStartedLink.html(getStartedShowText);
			}
		});
	});

});

$('.js-jump-to-top').bind('click', function(e) {
	e.preventDefault();
	window.scroll(0, 0);
});
