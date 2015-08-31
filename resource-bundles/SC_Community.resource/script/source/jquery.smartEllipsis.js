/**
 * jQuerySmartEllipsis
 * https://github.com/nothrem/jQuerySmartEllipsis
 * Adds ellipsis character to the text. Supports both single-line and multi-line text, does not break words unless specified.
 * Code based on StackOverflow forum: http://stackoverflow.com/questions/536814/insert-ellipsis-into-html-tag-if-content-too-wide
 * Code improved for better performance and extended by Nothrem Sinsky: https://github.com/nothrem
 * (c) 2014
 */
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

(function($) {

	if ('function' !== typeof Function.prototype.bind) {
		/**
		 * Sets scope for the method call
		 *
		 * @param  scope {Object} (optional, default: window) scope for the method
		 * @returns {Function} new function with defined scope
		 */
		Function.prototype.bind = function(scope) {
			var
				f = this,
				args = Array.prototype.splice.call(arguments, 1);

			return function() {
				return f.apply(scope || window, args.concat(arguments));
			};
		};
	}

	if (!String.prototype.lastIndexByFunction) {
		/**
		 * Alternative of String.lastIndexOf() that uses function to check if found position is correct. Returns last matching position in the string. May be slower than indexByFunction().
		 *
		 * @param  {Function} func Function to search for a position. Function is called in the scope of the string and is given a param with current searching position. It should return 0 if the position is OK or position/negative value of how wrong was the position (typically +1 or -1).
		 * @param  {Mixed} params This parameter will be passed in comparision function (as second parameter) as-is.
		 * @return {Number} Position in the String. Returns -1 if no position found.
		 */
		String.prototype.lastIndexByFunction = function(func, params) {
			var
				low = 0,
				high = this.length - 1,
				best = -1,
				mid,
				result;

			while (low <= high) {
				mid = Math.floor((low + high) / 2);
				result = func.call(this, mid, params);
				if (result < 0) {
					high = mid + result;
				} else if (result > 0) {
					low = mid + result;
				} else {
					best = mid; //found an occurance somewhere in the middle
					low = mid + 1; //there might be another closer to the end
				}
			}

			return best;
		};
	}

	//Allow to handle event 'show' when an element gets visible
	$.each(["show", "toggleClass", "addClass", "removeClass"], function() {
		var
			oldFn = $.fn[this], //get the old function, e.g. $.fn.show   or $.fn.hide
			/**
			 * Run all handlers registered for a show event. Must be called in the scope of element to trigger the event handler on.
			 */
			triggerShowEvent = function() {
				// trigger the show msg
				$(this).triggerHandler("show");
			};

		/**
		 * Function to override original jQuery method and watch for elements that become visible after its call.
		 */
		$.fn[this] = function() {
			var
				hidden = this.find(":hidden").add(this.filter(":hidden")), // get the items that are currently hidden
				result = oldFn.apply(this, arguments); // run the original function

			// for all of the hidden elements that are now visible
			hidden.filter(":visible").each(triggerShowEvent);

			return result;
		};
	});

	var
		tooTall = function() {
			return this.tempElement.height() > this.el.height();
		},
		tooWide = function() {
			return this.tempElement.width() > this.el.width();
		},
		ellipsis = function(str, len, breakWords) {
			if (true !== breakWords) {
				var spacePos = str.lastIndexOf(' ', len);
				if (-1 < spacePos) {
					len = spacePos;
				}
			}
			return str.substr(0, len).trim() + "…";
		},
		search = function(i, params) {
			params.tempElement.html(params.ellipsis(this, i, params.breakWords));
			if (params.comparator()) {
				return -1;
			}
			return 0;
		};

	// create the ellipsis function
	// when addTooltip = true, add a title attribute with the original text
	$.fn.ellipsis = function(addTooltip) {
		return this.each(function() {
			var
				el = $(this),
				multiline = ('nowrap' !== el.css('white-space')),
				breakWords = ('break-word' === el.css('word-wrap')),
				tempElement,
				content,
				comparator,
				len;

			if (el.is(":hidden")) { //if this isn't visible,
				el.one('show', function() { //then hook up the show event
					$(this).ellipsis(addTooltip);
				});
				return;
			}

			if (el.css("overflow") === "hidden") {
				content = (el.html() === el.data('trimText')) ? el.data('origText') : el.html();
				tempElement = $(this.cloneNode(true))
					.hide()
					.css('position', 'absolute')
					.css('overflow', 'visible')
					.width(multiline ? el.width() : 'auto')
					.height(multiline ? 'auto' : el.height())
					.html(content);
				el.after(tempElement);
				comparator = (multiline ? tooTall : tooWide).bind({
					el: el,
					tempElement: tempElement
				});

				if (!comparator()) { //text fits the element, no need to add ellipsis
					tempElement.remove();
					return;
				}

				if (addTooltip) { // if a tooltip was requested...
					el.attr('title', $.trim(el.text()).replace(/\s\s+/g, ' ')); // trim leading/trailing whitespace and consolidate internal whitespace to a single space
				}

				len = content.lastIndexByFunction(search, {
					tempElement: tempElement,
					comparator: comparator,
					ellipsis: ellipsis,
					breakWords: breakWords
				});
				if (-1 < len) {
					el
						.data('origText', content)
						.data('trimText', ellipsis(content, len, breakWords))
						.html(el.data('trimText'))
						.addClass('ellipsis');
				} //else even one letter cannot be displayed with ellipsis, so leave it as-is

				tempElement.remove();
			}
		});
	};

	// ellipsification for items with an ellipsis class
	$(document).ready(function() {
		$('.ellipsis').ellipsis(true);
	});

	//support resize event to update existing ellipsificated elements
	$(window).on('resize', function() {
		window.setTimeout($.ellipsis, 100); //postpone after all DOM changes are finished
	});
	if ("onorientationchange" in window) {
		$(window).on('orientationchange', function() {
			window.setTimeout($.ellipsis, 100); //postpone after all DOM changes are finished
		});
	}

	/**
	 * Manually updates all existing ellipsificated elements
	 */
	$.ellipsis = function() {
		$('.ellipsis').ellipsis();
	};

}(window.jQuery));
