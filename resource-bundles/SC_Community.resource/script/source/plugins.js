// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function() {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

// Screen Resizing Function for not firing immediately on screen resize
var waitForScreenResize = (function() {
	var timers = {};
	return function(callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// Scripts to be run when window is resized. 
// waitForScreenResize() tries to wait until the end of the resize due to 
// performance issues.
$(window).resize(function() {
	waitForScreenResize(function() {

		var breakpoint = determineBreakpoint();

		onScreenResize(breakpoint);

	}, 200, "main-resize");
});

// Returns "breakpoint" based on the screen width passed in.
function determineBreakpoint() {
	var breakpoint = "",
		wi = $(window).width();

	if (wi < 768) {
		breakpoint = 'xs';
	} else if (wi >= 768 && wi < 992) {
		breakpoint = 'sm';
	} else if (wi >= 992 && wi < 1200) {
		breakpoint = 'md';
	} else {
		breakpoint = 'lg';
	}
	return breakpoint;
}

jQuery.fn.isLoaded = function() {
	return this
		.filter("img")
		.filter(function() {
			return this.complete;
		}).length > 0;
};


/*! http://tinynav.viljamis.com v1.2 by @viljamis */
(function($, window, i) {
	$.fn.tinyNav = function(options) {

		// Default settings
		var settings = $.extend({
			'active': 'selected', // String: Set the "active" class
			'header': '', // String: Specify text for "header" and show header instead of the active item
			'indent': '- ', // String: Specify text for indenting sub-items
			'label': '' // String: sets the <label> text for the <select> (if not set, no label will be added)
		}, options);

		return this.each(function() {

			// Used for namespacing
			i++;

			var $nav = $(this),
				// Namespacing
				namespace = 'tinynav',
				namespace_i = namespace + i,
				l_namespace_i = '.l_' + namespace_i,
				$select = $('<select/>').attr("id", namespace_i).addClass(namespace + ' ' + namespace_i).addClass('form-control').addClass('visible-xs');

			if ($nav.is('ul,ol')) {

				if (settings.header !== '') {
					$select.append(
						$('<option/>').text(settings.header)
					);
				}

				// Build options
				var options = '';

				$nav
					.addClass('l_' + namespace_i)
					.find('a')
					.each(function() {
						options += '<option value="' + $(this).attr('href') + '">';
						var j;
						for (j = 0; j < $(this).parents('ul, ol').length - 1; j++) {
							options += settings.indent;
						}
						options += $(this).text() + '</option>';
					});

				// Append options into a select
				$select.append(options);

				// Select the active item
				if (!settings.header) {
					$select
						.find(':eq(' + $(l_namespace_i + ' li')
							.index($(l_namespace_i + ' li.' + settings.active)) + ')')
						.attr('selected', true);
				}

				// Change window location
				$select.change(function() {
					window.location.href = $(this).val();
				});

				// Inject select
				$(l_namespace_i).after($select);

				// Inject label
				if (settings.label) {
					$select.before(
						$("<label/>")
						.attr("for", namespace_i)
						.addClass(namespace + '_label ' + namespace_i + '_label')
						.append(settings.label)
					);
				}

			}

		});

	};
})(jQuery, this, 0);


/*! 
 * JQuery Plugin: "EqualHeights"
 * by:  Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
 *
 * Copyright (c) 2007 Filament Group
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * modified by 7Summits to add optional grouping and clearing of previous min-heights
 */
(function($) {
	$.fn.equalHeights = function(options) {
		// Default settings
		var settings = $.extend({
			'container': this, // String: optional container element, will be converted to jQuery object
			'children': '> *' // String: optional selector for children of the container, will be converted to jQuery object
		}, options);
		var breakpoint = determineBreakpoint();

		if (
			breakpoint == 'sm' ||
			breakpoint == 'md' ||
			breakpoint == 'lg'
		) {
			$(settings.container).each(function() {
				$(this).find(settings.children).css({
					'min-height': 1
				});
				var currentTallest = 0;
				$(this).find(settings.children).each(function(i) {
					if ($(this).height() > currentTallest) {
						currentTallest = $(this).height();
					}
				});
				$(this).find(settings.children).css({
					'min-height': currentTallest + 1
				});
			});
		} else {
			$(settings.container).find(settings.children).css({
				'min-height': 1
			});
		}
		return this;
	};
})(jQuery);


/* 
 * Filtering function for narrowing down the Resources group
 */
(function($) {
	$.fn.resourceFilter = function(options) {
		var settings = $.extend({
			self: this,
			tabs: '.tab-pane',
			list: '.list-unstyled',
			filteredClass: "filtered",
			listClass: "resource-list",
			showClass: "show",
			hideClass: "hide",
			openClass: "open",
			searchInput: "#resource-list-search"
		}, options);

		function resetFilters() {
			$(settings.searchInput).val("");
			$(settings.self).find('.nav-tabs').show();
			$(settings.self).removeClass(settings.filteredClass).find('.tab-pane').removeClass(settings.openClass);

			$(settings.self).find(settings.list).find("li").removeClass(settings.hideClass);
			$(settings.self).find(settings.list).find("li > ul").removeClass(settings.hideClass);

			$("." + settings.listClass + "-alert").addClass(settings.hideClass);
		}

		$(settings.searchInput).siblings("a").click(function(e) {
			e.preventDefault;
			resetFilters();
		});

		$(this).on("keyup", settings.searchInput, function(e) {

			if (e.keyCode == 27) {
				$(this).val("");
			}

			var searchString = $(this).val(),
				matchRegex = new RegExp(searchString, "gi"),
				linksFound = false;

			if (searchString.length > 0) { // Perform a search, and filter the list as needed.
				$(settings.self).addClass(settings.filteredClass).find('.nav-tabs').hide();

				$(settings.self).find(settings.tabs) // Find each individual tab pane
					.addClass(settings.openClass) // Add an open class
					.each(function() { // iterate over them to find results
						var tabLinksFound = false;
						$(this).find(settings.list).find('li').removeClass(settings.showClass);

						$(this).find(settings.list).find("a, span, strong").each(function() {
							if ($(this).text().match(matchRegex)) {
								$(this).parents("li").removeClass(settings.hideClass);
								$(this).parent("li").has("ul").addClass(settings.showClass);
								tabLinksFound = true;
								linksFound = true;
							} else {
								if (!$(this).parent("li").text().match(matchRegex)) {
									$(this).parent("li").addClass(settings.hideClass);
								}
							}
						});

						if (!tabLinksFound) {
							$(this).removeClass(settings.openClass);
						}
					});

				if (linksFound == false) {
					$("." + settings.listClass + "-alert").removeClass(settings.hideClass);
				} else {
					$("." + settings.listClass + "-alert").addClass(settings.hideClass);
				}
			} else { // If there was no search performed, reset everything back to where it should be.
				resetFilters();
			}

		});
		return this;
	};
})(jQuery);
