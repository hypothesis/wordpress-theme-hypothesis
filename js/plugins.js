// jquery.tweet.js - See http://tweet.seaofclouds.com/ or https://github.com/seaofclouds/tweet for more info
// Copyright (c) 2008-2011 Todd Matthews & Steve Purcell
(function (factory) {
  if (typeof define === 'function' && define.amd)
    define(['jquery'], factory); // AMD support for RequireJS etc.
  else
    factory(jQuery);
}(function ($) {
  $.fn.tweet = function(o){
    var s = $.extend({
      username: null,                           // [string or array] required unless using the 'query' option; one or more twitter screen names (use 'list' option for multiple names, where possible)
      list: null,                               // [string]   optional name of list belonging to username
      favorites: false,                         // [boolean]  display the user's favorites instead of his tweets
      query: null,                              // [string]   optional search query (see also: http://search.twitter.com/operators)
      avatar_size: null,                        // [integer]  height and width of avatar if displayed (48px max)
      count: 3,                                 // [integer]  how many tweets to display?
      fetch: null,                              // [integer]  how many tweets to fetch via the API (set this higher than 'count' if using the 'filter' option)
      page: 1,                                  // [integer]  which page of results to fetch (if count != fetch, you'll get unexpected results)
      retweets: true,                           // [boolean]  whether to fetch (official) retweets (not supported in all display modes)
      intro_text: null,                         // [string]   do you want text BEFORE your your tweets?
      outro_text: null,                         // [string]   do you want text AFTER your tweets?
      join_text:  null,                         // [string]   optional text in between date and tweet, try setting to "auto"
      auto_join_text_default: "I said,",        // [string]   auto text for non verb: "I said" bullocks
      auto_join_text_ed: "I",                   // [string]   auto text for past tense: "I" surfed
      auto_join_text_ing: "I am",               // [string]   auto tense for present tense: "I was" surfing
      auto_join_text_reply: "I replied to",     // [string]   auto tense for replies: "I replied to" @someone "with"
      auto_join_text_url: "I was looking at",   // [string]   auto tense for urls: "I was looking at" http:...
      loading_text: null,                       // [string]   optional loading text, displayed while tweets load
      refresh_interval: null ,                  // [integer]  optional number of seconds after which to reload tweets
      twitter_url: "twitter.com",               // [string]   custom twitter url, if any (apigee, etc.)
      twitter_api_url: "api.twitter.com",       // [string]   custom twitter api url, if any (apigee, etc.)
      twitter_search_url: "search.twitter.com", // [string]   custom twitter search url, if any (apigee, etc.)
      template: "{avatar}{time}{join}{text}",   // [string or function] template used to construct each tweet <li> - see code for available vars
      comparator: function(tweet1, tweet2) {    // [function] comparator used to sort tweets (see Array.sort)
        return tweet2["tweet_time"] - tweet1["tweet_time"];
      },
      filter: function(tweet) {                 // [function] whether or not to include a particular tweet (be sure to also set 'fetch')
        return true;
      }
      // You can attach callbacks to the following events using jQuery's standard .bind() mechanism:
      //   "loaded" -- triggered when tweets have been fetched and rendered
    }, o);

    // See http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    var url_regexp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

    // Expand values inside simple string templates with {placeholders}
    function t(template, info) {
      if (typeof template === "string") {
        var result = template;
        for(var key in info) {
          var val = info[key];
          result = result.replace(new RegExp('{'+key+'}','g'), val === null ? '' : val);
        }
        return result;
      } else return template(info);
    }
    // Export the t function for use when passing a function as the 'template' option
    $.extend({tweet: {t: t}});

    function replacer (regex, replacement) {
      return function() {
        var returning = [];
        this.each(function() {
          returning.push(this.replace(regex, replacement));
        });
        return $(returning);
      };
    }

    function escapeHTML(s) {
      return s.replace(/</g,"&lt;").replace(/>/g,"^&gt;");
    }

    $.fn.extend({
      linkUser: replacer(/(^|[\W])@(\w+)/gi, "$1<span class=\"at\">@</span><a href=\"http://"+s.twitter_url+"/$2\">$2</a>"),
      // Support various latin1 (\u00**) and arabic (\u06**) alphanumeric chars
      linkHash: replacer(/(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,
                         ' <a href="http://'+s.twitter_search_url+'/search?q=&tag=$1&lang=all'+((s.username && s.username.length == 1 && !s.list) ? '&from='+s.username.join("%2BOR%2B") : '')+'" class="tweet_hashtag">#$1</a>'),
      makeHeart: replacer(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>")
    });

    function linkURLs(text, entities) {
      return text.replace(url_regexp, function(match) {
        var url = (/^[a-z]+:/i).test(match) ? match : "http://"+match;
        var text = match;
        for(var i = 0; i < entities.length; ++i) {
          var entity = entities[i];
          if (entity.url == url && entity.expanded_url) {
            url = entity.expanded_url;
            text = entity.display_url;
            break;
          }
        }
        return "<a href=\""+escapeHTML(url)+"\">"+escapeHTML(text)+"</a>";
      });
    }

    function parse_date(date_str) {
      // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
      // cannot handle in IE. We therefore perform the following transformation:
      // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
      return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
    }

    function relative_time(date) {
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - date) / 1000, 10);
      var r = '';
      if (delta < 1) {
        r = 'just now';
      } else if (delta < 60) {
        r = delta + ' seconds ago';
      } else if(delta < 120) {
        r = 'about a minute ago';
      } else if(delta < (45*60)) {
        r = 'about ' + (parseInt(delta / 60, 10)).toString() + ' minutes ago';
      } else if(delta < (2*60*60)) {
        r = 'about an hour ago';
      } else if(delta < (24*60*60)) {
        r = 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
      } else if(delta < (48*60*60)) {
        r = 'about a day ago';
      } else {
        r = 'about ' + (parseInt(delta / 86400, 10)).toString() + ' days ago';
      }
      return r;
    }

    function build_auto_join_text(text) {
      if (text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
        return s.auto_join_text_reply;
      } else if (text.match(url_regexp)) {
        return s.auto_join_text_url;
      } else if (text.match(/^((\w+ed)|just) .*/im)) {
        return s.auto_join_text_ed;
      } else if (text.match(/^(\w*ing) .*/i)) {
        return s.auto_join_text_ing;
      } else {
        return s.auto_join_text_default;
      }
    }

    function build_api_url() {
      var proto = ('https:' == document.location.protocol ? 'https:' : 'http:');
      var count = (s.fetch === null) ? s.count : s.fetch;
      var common_params = '&include_entities=1&callback=?';
      if (s.list) {
        return proto+"//"+s.twitter_api_url+"/1/"+s.username[0]+"/lists/"+s.list+"/statuses.json?page="+s.page+"&per_page="+count+common_params;
      } else if (s.favorites) {
        return proto+"//"+s.twitter_api_url+"/favorites/"+s.username[0]+".json?page="+s.page+"&count="+count+common_params;
      } else if (s.query === null && s.username.length == 1) {
        return proto+'//'+s.twitter_api_url+'/1/statuses/user_timeline.json?screen_name='+s.username[0]+'&count='+count+(s.retweets ? '&include_rts=1' : '')+'&page='+s.page+common_params;
      } else {
        var query = (s.query || 'from:'+s.username.join(' OR from:'));
        return proto+'//'+s.twitter_search_url+'/search.json?&q='+encodeURIComponent(query)+'&rpp='+count+'&page='+s.page+common_params;
      }
    }

    function extract_avatar_url(item, secure) {
      if (secure) {
        return ('user' in item) ?
          item.user.profile_image_url_https :
          extract_avatar_url(item, false).
            replace(/^http:\/\/[a-z0-9]{1,3}\.twimg\.com\//, "https://s3.amazonaws.com/twitter_production/");
      } else {
        return item.profile_image_url || item.user.profile_image_url;
      }
    }

    // Convert twitter API objects into data available for
    // constructing each tweet <li> using a template
    function extract_template_data(item){
      var o = {};
      o.item = item;
      o.source = item.source;
      o.screen_name = item.from_user || item.user.screen_name;
      // The actual user name is not returned by all Twitter APIs, so please do not
      // file an issue if it is empty:
      o.name = item.from_user_name || item.user.name;
      o.avatar_size = s.avatar_size;
      o.avatar_url = extract_avatar_url(item, (document.location.protocol === 'https:'));
      o.retweet = typeof(item.retweeted_status) != 'undefined';
      o.tweet_time = parse_date(item.created_at);
      o.join_text = s.join_text == "auto" ? build_auto_join_text(item.text) : s.join_text;
      o.tweet_id = item.id_str;
      o.twitter_base = "http://"+s.twitter_url+"/";
      o.user_url = o.twitter_base+o.screen_name;
      o.tweet_url = o.user_url+"/status/"+o.tweet_id;
      o.reply_url = o.twitter_base+"intent/tweet?in_reply_to="+o.tweet_id;
      o.retweet_url = o.twitter_base+"intent/retweet?tweet_id="+o.tweet_id;
      o.favorite_url = o.twitter_base+"intent/favorite?tweet_id="+o.tweet_id;
      o.retweeted_screen_name = o.retweet && item.retweeted_status.user.screen_name;
      o.tweet_relative_time = relative_time(o.tweet_time);
      o.entities = item.entities ? (item.entities.urls || []).concat(item.entities.media || []) : [];
      o.tweet_raw_text = o.retweet ? ('RT @'+o.retweeted_screen_name+' '+item.retweeted_status.text) : item.text; // avoid '...' in long retweets
      o.tweet_text = $([linkURLs(o.tweet_raw_text, o.entities)]).linkUser().linkHash()[0];
      o.tweet_text_fancy = $([o.tweet_text]).makeHeart()[0];

      // Default spans, and pre-formatted blocks for common layouts
      o.user = t('<a class="tweet_user" href="{user_url}">{screen_name}</a>', o);
      o.join = s.join_text ? t(' <span class="tweet_join">{join_text}</span> ', o) : ' ';
      o.avatar = o.avatar_size ?
        t('<a class="tweet_avatar" href="{user_url}"><img src="{avatar_url}" height="{avatar_size}" width="{avatar_size}" alt="{screen_name}\'s avatar" title="{screen_name}\'s avatar" border="0"/></a>', o) : '';
      o.time = t('<span class="tweet_time"><a href="{tweet_url}" title="view tweet on twitter">{tweet_relative_time}</a></span>', o);
      o.text = t('<span class="tweet_text">{tweet_text_fancy}</span>', o);
      o.reply_action = t('<a class="tweet_action tweet_reply" href="{reply_url}">reply</a>', o);
      o.retweet_action = t('<a class="tweet_action tweet_retweet" href="{retweet_url}">retweet</a>', o);
      o.favorite_action = t('<a class="tweet_action tweet_favorite" href="{favorite_url}">favorite</a>', o);
      return o;
    }

    return this.each(function(i, widget){
      var list = $('<ul class="tweet_list">');
      var intro = '<p class="tweet_intro">'+s.intro_text+'</p>';
      var outro = '<p class="tweet_outro">'+s.outro_text+'</p>';
      var loading = $('<p class="loading">'+s.loading_text+'</p>');

      if(s.username && typeof(s.username) == "string"){
        s.username = [s.username];
      }

      $(widget).unbind("tweet:load").bind("tweet:load", function(){
        if (s.loading_text) $(widget).empty().append(loading);
        $.getJSON(build_api_url(), function(data){
          $(widget).empty().append(list);
          if (s.intro_text) list.before(intro);
          list.empty();

          var tweets = $.map(data.results || data, extract_template_data);
          tweets = $.grep(tweets, s.filter).sort(s.comparator).slice(0, s.count);
          list.append($.map(tweets, function(o) { return "<li>" + t(s.template, o) + "</li>"; }).join('')).
              children('li:first').addClass('tweet_first').end().
              children('li:odd').addClass('tweet_even').end().
              children('li:even').addClass('tweet_odd');

          if (s.outro_text) list.after(outro);
          $(widget).trigger("loaded").trigger((tweets.length === 0 ? "empty" : "full"));
          if (s.refresh_interval) {
            window.setTimeout(function() { $(widget).trigger("tweet:load"); }, 1000 * s.refresh_interval);
          }
        });
      }).trigger("tweet:load");
    });
  };
}));


// //JS VALIDATE??
// /**
//  * jQuery Validation Plugin 1.8.1
//  *
//  * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
//  * http://docs.jquery.com/Plugins/Validation
//  *
//  * Copyright (c) 2006 - 2011 JÃ¶rn Zaefferer
//  *
//  * Dual licensed under the MIT and GPL licenses:
//  *   http://www.opensource.org/licenses/mit-license.php
//  *   http://www.gnu.org/licenses/gpl.html
//  */

// (function($) {

// $.extend($.fn, {
// 	// http://docs.jquery.com/Plugins/Validation/validate
// 	validate: function( options ) {

// 		// if nothing is selected, return nothing; can't chain anyway
// 		if (!this.length) {
// 			options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
// 			return;
// 		}

// 		// check if a validator for this form was already created
// 		var validator = $.data(this[0], 'validator');
// 		if ( validator ) {
// 			return validator;
// 		}

// 		validator = new $.validator( options, this[0] );
// 		$.data(this[0], 'validator', validator);

// 		if ( validator.settings.onsubmit ) {

// 			// allow suppresing validation by adding a cancel class to the submit button
// 			this.find("input, button").filter(".cancel").click(function() {
// 				validator.cancelSubmit = true;
// 			});

// 			// when a submitHandler is used, capture the submitting button
// 			if (validator.settings.submitHandler) {
// 				this.find("input, button").filter(":submit").click(function() {
// 					validator.submitButton = this;
// 				});
// 			}

// 			// validate the form on submit
// 			this.submit( function( event ) {
// 				if ( validator.settings.debug )
// 					// prevent form submit to be able to see console output
// 					event.preventDefault();

// 				function handle() {
// 					if ( validator.settings.submitHandler ) {
// 						if (validator.submitButton) {
// 							// insert a hidden input as a replacement for the missing submit button
// 							var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
// 						}
// 						validator.settings.submitHandler.call( validator, validator.currentForm );
// 						if (validator.submitButton) {
// 							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
// 							hidden.remove();
// 						}
// 						return false;
// 					}
// 					return true;
// 				}

// 				// prevent submit for invalid forms or custom submit handlers
// 				if ( validator.cancelSubmit ) {
// 					validator.cancelSubmit = false;
// 					return handle();
// 				}
// 				if ( validator.form() ) {
// 					if ( validator.pendingRequest ) {
// 						validator.formSubmitted = true;
// 						return false;
// 					}
// 					return handle();
// 				} else {
// 					validator.focusInvalid();
// 					return false;
// 				}
// 			});
// 		}

// 		return validator;
// 	},
// 	// http://docs.jquery.com/Plugins/Validation/valid
// 	valid: function() {
//         if ( $(this[0]).is('form')) {
//             return this.validate().form();
//         } else {
//             var valid = true;
//             var validator = $(this[0].form).validate();
//             this.each(function() {
// 				valid &= validator.element(this);
//             });
//             return valid;
//         }
//     },
// 	// attributes: space seperated list of attributes to retrieve and remove
// 	removeAttrs: function(attributes) {
// 		var result = {},
// 			$element = this;
// 		$.each(attributes.split(/\s/), function(index, value) {
// 			result[value] = $element.attr(value);
// 			$element.removeAttr(value);
// 		});
// 		return result;
// 	},
// 	// http://docs.jquery.com/Plugins/Validation/rules
// 	rules: function(command, argument) {
// 		var element = this[0];

// 		if (command) {
// 			var settings = $.data(element.form, 'validator').settings;
// 			var staticRules = settings.rules;
// 			var existingRules = $.validator.staticRules(element);
// 			switch(command) {
// 			case "add":
// 				$.extend(existingRules, $.validator.normalizeRule(argument));
// 				staticRules[element.name] = existingRules;
// 				if (argument.messages)
// 					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
// 				break;
// 			case "remove":
// 				if (!argument) {
// 					delete staticRules[element.name];
// 					return existingRules;
// 				}
// 				var filtered = {};
// 				$.each(argument.split(/\s/), function(index, method) {
// 					filtered[method] = existingRules[method];
// 					delete existingRules[method];
// 				});
// 				return filtered;
// 			}
// 		}

// 		var data = $.validator.normalizeRules(
// 		$.extend(
// 			{},
// 			$.validator.metadataRules(element),
// 			$.validator.classRules(element),
// 			$.validator.attributeRules(element),
// 			$.validator.staticRules(element)
// 		), element);

// 		// make sure required is at front
// 		if (data.required) {
// 			var param = data.required;
// 			delete data.required;
// 			data = $.extend({required: param}, data);
// 		}

// 		return data;
// 	}
// });

// // Custom selectors
// $.extend($.expr[":"], {
// 	// http://docs.jquery.com/Plugins/Validation/blank
// 	blank: function(a) {return !$.trim("" + a.value);},
// 	// http://docs.jquery.com/Plugins/Validation/filled
// 	filled: function(a) {return !!$.trim("" + a.value);},
// 	// http://docs.jquery.com/Plugins/Validation/unchecked
// 	unchecked: function(a) {return !a.checked;}
// });

// // constructor for validator
// $.validator = function( options, form ) {
// 	this.settings = $.extend( true, {}, $.validator.defaults, options );
// 	this.currentForm = form;
// 	this.init();
// };

// $.validator.format = function(source, params) {
// 	if ( arguments.length == 1 )
// 		return function() {
// 			var args = $.makeArray(arguments);
// 			args.unshift(source);
// 			return $.validator.format.apply( this, args );
// 		};
// 	if ( arguments.length > 2 && params.constructor != Array  ) {
// 		params = $.makeArray(arguments).slice(1);
// 	}
// 	if ( params.constructor != Array ) {
// 		params = [ params ];
// 	}
// 	$.each(params, function(i, n) {
// 		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
// 	});
// 	return source;
// };

// $.extend($.validator, {

// 	defaults: {
// 		messages: {},
// 		groups: {},
// 		rules: {},
// 		errorClass: "error",
// 		validClass: "valid",
// 		errorElement: "label",
// 		focusInvalid: true,
// 		errorContainer: $( [] ),
// 		errorLabelContainer: $( [] ),
// 		onsubmit: true,
// 		ignore: [],
// 		ignoreTitle: false,
// 		onfocusin: function(element) {
// 			this.lastActive = element;

// 			// hide error label and remove error class on focus if enabled
// 			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
// 				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
// 				this.addWrapper(this.errorsFor(element)).hide();
// 			}
// 		},
// 		onfocusout: function(element) {
// 			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
// 				this.element(element);
// 			}
// 		},
// 		onkeyup: function(element) {
// 			if ( element.name in this.submitted || element == this.lastElement ) {
// 				this.element(element);
// 			}
// 		},
// 		onclick: function(element) {
// 			// click on selects, radiobuttons and checkboxes
// 			if ( element.name in this.submitted )
// 				this.element(element);
// 			// or option elements, check parent select in that case
// 			else if (element.parentNode.name in this.submitted)
// 				this.element(element.parentNode);
// 		},
// 		highlight: function(element, errorClass, validClass) {
// 			if (element.type === 'radio') {
// 				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
// 			} else {
// 				$(element).addClass(errorClass).removeClass(validClass);
// 			}
// 		},
// 		unhighlight: function(element, errorClass, validClass) {
// 			if (element.type === 'radio') {
// 				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
// 			} else {
// 				$(element).removeClass(errorClass).addClass(validClass);
// 			}
// 		}
// 	},

// 	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
// 	setDefaults: function(settings) {
// 		$.extend( $.validator.defaults, settings );
// 	},

// 	messages: {
// 		required: "This field is required.",
// 		remote: "Please fix this field.",
// 		email: "Please enter a valid email address.",
// 		url: "Please enter a valid URL.",
// 		date: "Please enter a valid date.",
// 		dateISO: "Please enter a valid date (ISO).",
// 		number: "Please enter a valid number.",
// 		digits: "Please enter only digits.",
// 		creditcard: "Please enter a valid credit card number.",
// 		equalTo: "Please enter the same value again.",
// 		accept: "Please enter a value with a valid extension.",
// 		maxlength: $.validator.format("Please enter no more than {0} characters."),
// 		minlength: $.validator.format("Please enter at least {0} characters."),
// 		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
// 		range: $.validator.format("Please enter a value between {0} and {1}."),
// 		max: $.validator.format("Please enter a value less than or equal to {0}."),
// 		min: $.validator.format("Please enter a value greater than or equal to {0}.")
// 	},

// 	autoCreateRanges: false,

// 	prototype: {

// 		init: function() {
// 			this.labelContainer = $(this.settings.errorLabelContainer);
// 			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
// 			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
// 			this.submitted = {};
// 			this.valueCache = {};
// 			this.pendingRequest = 0;
// 			this.pending = {};
// 			this.invalid = {};
// 			this.reset();

// 			var groups = (this.groups = {});
// 			$.each(this.settings.groups, function(key, value) {
// 				$.each(value.split(/\s/), function(index, name) {
// 					groups[name] = key;
// 				});
// 			});
// 			var rules = this.settings.rules;
// 			$.each(rules, function(key, value) {
// 				rules[key] = $.validator.normalizeRule(value);
// 			});

// 			function delegate(event) {
// 				var validator = $.data(this[0].form, "validator"),
// 					eventType = "on" + event.type.replace(/^validate/, "");
// 				validator.settings[eventType] && validator.settings[eventType].call(validator, this[0] );
// 			}
// 			$(this.currentForm)
// 				.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate)
// 				.validateDelegate(":radio, :checkbox, select, option", "click", delegate);

// 			if (this.settings.invalidHandler)
// 				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Validator/form
// 		form: function() {
// 			this.checkForm();
// 			$.extend(this.submitted, this.errorMap);
// 			this.invalid = $.extend({}, this.errorMap);
// 			if (!this.valid())
// 				$(this.currentForm).triggerHandler("invalid-form", [this]);
// 			this.showErrors();
// 			return this.valid();
// 		},

// 		checkForm: function() {
// 			this.prepareForm();
// 			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
// 				this.check( elements[i] );
// 			}
// 			return this.valid();
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Validator/element
// 		element: function( element ) {
// 			element = this.clean( element );
// 			this.lastElement = element;
// 			this.prepareElement( element );
// 			this.currentElements = $(element);
// 			var result = this.check( element );
// 			if ( result ) {
// 				delete this.invalid[element.name];
// 			} else {
// 				this.invalid[element.name] = true;
// 			}
// 			if ( !this.numberOfInvalids() ) {
// 				// Hide error containers on last error
// 				this.toHide = this.toHide.add( this.containers );
// 			}
// 			this.showErrors();
// 			return result;
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
// 		showErrors: function(errors) {
// 			if(errors) {
// 				// add items to error list and map
// 				$.extend( this.errorMap, errors );
// 				this.errorList = [];
// 				for ( var name in errors ) {
// 					this.errorList.push({
// 						message: errors[name],
// 						element: this.findByName(name)[0]
// 					});
// 				}
// 				// remove items from success list
// 				this.successList = $.grep( this.successList, function(element) {
// 					return !(element.name in errors);
// 				});
// 			}
// 			this.settings.showErrors
// 				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
// 				: this.defaultShowErrors();
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
// 		resetForm: function() {
// 			if ( $.fn.resetForm )
// 				$( this.currentForm ).resetForm();
// 			this.submitted = {};
// 			this.prepareForm();
// 			this.hideErrors();
// 			this.elements().removeClass( this.settings.errorClass );
// 		},

// 		numberOfInvalids: function() {
// 			return this.objectLength(this.invalid);
// 		},

// 		objectLength: function( obj ) {
// 			var count = 0;
// 			for ( var i in obj )
// 				count++;
// 			return count;
// 		},

// 		hideErrors: function() {
// 			this.addWrapper( this.toHide ).hide();
// 		},

// 		valid: function() {
// 			return this.size() == 0;
// 		},

// 		size: function() {
// 			return this.errorList.length;
// 		},

// 		focusInvalid: function() {
// 			if( this.settings.focusInvalid ) {
// 				try {
// 					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
// 					.filter(":visible")
// 					.focus()
// 					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
// 					.trigger("focusin");
// 				} catch(e) {
// 					// ignore IE throwing errors when focusing hidden elements
// 				}
// 			}
// 		},

// 		findLastActive: function() {
// 			var lastActive = this.lastActive;
// 			return lastActive && $.grep(this.errorList, function(n) {
// 				return n.element.name == lastActive.name;
// 			}).length == 1 && lastActive;
// 		},

// 		elements: function() {
// 			var validator = this,
// 				rulesCache = {};

// 			// select all valid inputs inside the form (no submit or reset buttons)
// 			return $(this.currentForm)
// 			.find("input, select, textarea")
// 			.not(":submit, :reset, :image, [disabled]")
// 			.not( this.settings.ignore )
// 			.filter(function() {
// 				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);

// 				// select only the first element for each name, and only those with rules specified
// 				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
// 					return false;

// 				rulesCache[this.name] = true;
// 				return true;
// 			});
// 		},

// 		clean: function( selector ) {
// 			return $( selector )[0];
// 		},

// 		errors: function() {
// 			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
// 		},

// 		reset: function() {
// 			this.successList = [];
// 			this.errorList = [];
// 			this.errorMap = {};
// 			this.toShow = $([]);
// 			this.toHide = $([]);
// 			this.currentElements = $([]);
// 		},

// 		prepareForm: function() {
// 			this.reset();
// 			this.toHide = this.errors().add( this.containers );
// 		},

// 		prepareElement: function( element ) {
// 			this.reset();
// 			this.toHide = this.errorsFor(element);
// 		},

// 		check: function( element ) {
// 			element = this.clean( element );

// 			// if radio/checkbox, validate first element in group instead
// 			if (this.checkable(element)) {
// 				element = this.findByName( element.name ).not(this.settings.ignore)[0];
// 			}

// 			var rules = $(element).rules();
// 			var dependencyMismatch = false;
// 			for (var method in rules ) {
// 				var rule = { method: method, parameters: rules[method] };
// 				try {
// 					var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );

// 					// if a method indicates that the field is optional and therefore valid,
// 					// don't mark it as valid when there are no other rules
// 					if ( result == "dependency-mismatch" ) {
// 						dependencyMismatch = true;
// 						continue;
// 					}
// 					dependencyMismatch = false;

// 					if ( result == "pending" ) {
// 						this.toHide = this.toHide.not( this.errorsFor(element) );
// 						return;
// 					}

// 					if( !result ) {
// 						this.formatAndAdd( element, rule );
// 						return false;
// 					}
// 				} catch(e) {
// 					this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
// 						 + ", check the '" + rule.method + "' method", e);
// 					throw e;
// 				}
// 			}
// 			if (dependencyMismatch)
// 				return;
// 			if ( this.objectLength(rules) )
// 				this.successList.push(element);
// 			return true;
// 		},

// 		// return the custom message for the given element and validation method
// 		// specified in the element's "messages" metadata
// 		customMetaMessage: function(element, method) {
// 			if (!$.metadata)
// 				return;

// 			var meta = this.settings.meta
// 				? $(element).metadata()[this.settings.meta]
// 				: $(element).metadata();

// 			return meta && meta.messages && meta.messages[method];
// 		},

// 		// return the custom message for the given element name and validation method
// 		customMessage: function( name, method ) {
// 			var m = this.settings.messages[name];
// 			return m && (m.constructor == String
// 				? m
// 				: m[method]);
// 		},

// 		// return the first defined argument, allowing empty strings
// 		findDefined: function() {
// 			for(var i = 0; i < arguments.length; i++) {
// 				if (arguments[i] !== undefined)
// 					return arguments[i];
// 			}
// 			return undefined;
// 		},

// 		defaultMessage: function( element, method) {
// 			return this.findDefined(
// 				this.customMessage( element.name, method ),
// 				this.customMetaMessage( element, method ),
// 				// title is never undefined, so handle empty string as undefined
// 				!this.settings.ignoreTitle && element.title || undefined,
// 				$.validator.messages[method],
// 				"<strong>Warning: No message defined for " + element.name + "</strong>"
// 			);
// 		},

// 		formatAndAdd: function( element, rule ) {
// 			var message = this.defaultMessage( element, rule.method ),
// 				theregex = /\$?\{(\d+)\}/g;
// 			if ( typeof message == "function" ) {
// 				message = message.call(this, rule.parameters, element);
// 			} else if (theregex.test(message)) {
// 				message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
// 			}
// 			this.errorList.push({
// 				message: message,
// 				element: element
// 			});

// 			this.errorMap[element.name] = message;
// 			this.submitted[element.name] = message;
// 		},

// 		addWrapper: function(toToggle) {
// 			if ( this.settings.wrapper )
// 				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
// 			return toToggle;
// 		},

// 		defaultShowErrors: function() {
// 			for ( var i = 0; this.errorList[i]; i++ ) {
// 				var error = this.errorList[i];
// 				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
// 				this.showLabel( error.element, error.message );
// 			}
// 			if( this.errorList.length ) {
// 				this.toShow = this.toShow.add( this.containers );
// 			}
// 			if (this.settings.success) {
// 				for ( var i = 0; this.successList[i]; i++ ) {
// 					this.showLabel( this.successList[i] );
// 				}
// 			}
// 			if (this.settings.unhighlight) {
// 				for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
// 					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
// 				}
// 			}
// 			this.toHide = this.toHide.not( this.toShow );
// 			this.hideErrors();
// 			this.addWrapper( this.toShow ).show();
// 		},

// 		validElements: function() {
// 			return this.currentElements.not(this.invalidElements());
// 		},

// 		invalidElements: function() {
// 			return $(this.errorList).map(function() {
// 				return this.element;
// 			});
// 		},

// 		showLabel: function(element, message) {
// 			var label = this.errorsFor( element );
// 			if ( label.length ) {
// 				// refresh error/success class
// 				label.removeClass().addClass( this.settings.errorClass );

// 				// check if we have a generated label, replace the message then
// 				label.attr("generated") && label.html(message);
// 			} else {
// 				// create label
// 				label = $("<" + this.settings.errorElement + "/>")
// 					.attr({"for":  this.idOrName(element), generated: true})
// 					.addClass(this.settings.errorClass)
// 					.html(message || "");
// 				if ( this.settings.wrapper ) {
// 					// make sure the element is visible, even in IE
// 					// actually showing the wrapped element is handled elsewhere
// 					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
// 				}
// 				if ( !this.labelContainer.append(label).length )
// 					this.settings.errorPlacement
// 						? this.settings.errorPlacement(label, $(element) )
// 						: label.insertAfter(element);
// 			}
// 			if ( !message && this.settings.success ) {
// 				label.text("");
// 				typeof this.settings.success == "string"
// 					? label.addClass( this.settings.success )
// 					: this.settings.success( label );
// 			}
// 			this.toShow = this.toShow.add(label);
// 		},

// 		errorsFor: function(element) {
// 			var name = this.idOrName(element);
//     		return this.errors().filter(function() {
// 				return $(this).attr('for') == name;
// 			});
// 		},

// 		idOrName: function(element) {
// 			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
// 		},

// 		checkable: function( element ) {
// 			return /radio|checkbox/i.test(element.type);
// 		},

// 		findByName: function( name ) {
// 			// select by name and filter by form for performance over form.find("[name=...]")
// 			var form = this.currentForm;
// 			return $(document.getElementsByName(name)).map(function(index, element) {
// 				return element.form == form && element.name == name && element  || null;
// 			});
// 		},

// 		getLength: function(value, element) {
// 			switch( element.nodeName.toLowerCase() ) {
// 			case 'select':
// 				return $("option:selected", element).length;
// 			case 'input':
// 				if( this.checkable( element) )
// 					return this.findByName(element.name).filter(':checked').length;
// 			}
// 			return value.length;
// 		},

// 		depend: function(param, element) {
// 			return this.dependTypes[typeof param]
// 				? this.dependTypes[typeof param](param, element)
// 				: true;
// 		},

// 		dependTypes: {
// 			"boolean": function(param, element) {
// 				return param;
// 			},
// 			"string": function(param, element) {
// 				return !!$(param, element.form).length;
// 			},
// 			"function": function(param, element) {
// 				return param(element);
// 			}
// 		},

// 		optional: function(element) {
// 			return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
// 		},

// 		startRequest: function(element) {
// 			if (!this.pending[element.name]) {
// 				this.pendingRequest++;
// 				this.pending[element.name] = true;
// 			}
// 		},

// 		stopRequest: function(element, valid) {
// 			this.pendingRequest--;
// 			// sometimes synchronization fails, make sure pendingRequest is never < 0
// 			if (this.pendingRequest < 0)
// 				this.pendingRequest = 0;
// 			delete this.pending[element.name];
// 			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
// 				$(this.currentForm).submit();
// 				this.formSubmitted = false;
// 			} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
// 				$(this.currentForm).triggerHandler("invalid-form", [this]);
// 				this.formSubmitted = false;
// 			}
// 		},

// 		previousValue: function(element) {
// 			return $.data(element, "previousValue") || $.data(element, "previousValue", {
// 				old: null,
// 				valid: true,
// 				message: this.defaultMessage( element, "remote" )
// 			});
// 		}

// 	},

// 	classRuleSettings: {
// 		required: {required: true},
// 		email: {email: true},
// 		url: {url: true},
// 		date: {date: true},
// 		dateISO: {dateISO: true},
// 		dateDE: {dateDE: true},
// 		number: {number: true},
// 		numberDE: {numberDE: true},
// 		digits: {digits: true},
// 		creditcard: {creditcard: true}
// 	},

// 	addClassRules: function(className, rules) {
// 		className.constructor == String ?
// 			this.classRuleSettings[className] = rules :
// 			$.extend(this.classRuleSettings, className);
// 	},

// 	classRules: function(element) {
// 		var rules = {};
// 		var classes = $(element).attr('class');
// 		classes && $.each(classes.split(' '), function() {
// 			if (this in $.validator.classRuleSettings) {
// 				$.extend(rules, $.validator.classRuleSettings[this]);
// 			}
// 		});
// 		return rules;
// 	},

// 	attributeRules: function(element) {
// 		var rules = {};
// 		var $element = $(element);

// 		for (var method in $.validator.methods) {
// 			var value = $element.attr(method);
// 			if (value) {
// 				rules[method] = value;
// 			}
// 		}

// 		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
// 		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
// 			delete rules.maxlength;
// 		}

// 		return rules;
// 	},

// 	metadataRules: function(element) {
// 		if (!$.metadata) return {};

// 		var meta = $.data(element.form, 'validator').settings.meta;
// 		return meta ?
// 			$(element).metadata()[meta] :
// 			$(element).metadata();
// 	},

// 	staticRules: function(element) {
// 		var rules = {};
// 		var validator = $.data(element.form, 'validator');
// 		if (validator.settings.rules) {
// 			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
// 		}
// 		return rules;
// 	},

// 	normalizeRules: function(rules, element) {
// 		// handle dependency check
// 		$.each(rules, function(prop, val) {
// 			// ignore rule when param is explicitly false, eg. required:false
// 			if (val === false) {
// 				delete rules[prop];
// 				return;
// 			}
// 			if (val.param || val.depends) {
// 				var keepRule = true;
// 				switch (typeof val.depends) {
// 					case "string":
// 						keepRule = !!$(val.depends, element.form).length;
// 						break;
// 					case "function":
// 						keepRule = val.depends.call(element, element);
// 						break;
// 				}
// 				if (keepRule) {
// 					rules[prop] = val.param !== undefined ? val.param : true;
// 				} else {
// 					delete rules[prop];
// 				}
// 			}
// 		});

// 		// evaluate parameters
// 		$.each(rules, function(rule, parameter) {
// 			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
// 		});

// 		// clean number parameters
// 		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
// 			if (rules[this]) {
// 				rules[this] = Number(rules[this]);
// 			}
// 		});
// 		$.each(['rangelength', 'range'], function() {
// 			if (rules[this]) {
// 				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
// 			}
// 		});

// 		if ($.validator.autoCreateRanges) {
// 			// auto-create ranges
// 			if (rules.min && rules.max) {
// 				rules.range = [rules.min, rules.max];
// 				delete rules.min;
// 				delete rules.max;
// 			}
// 			if (rules.minlength && rules.maxlength) {
// 				rules.rangelength = [rules.minlength, rules.maxlength];
// 				delete rules.minlength;
// 				delete rules.maxlength;
// 			}
// 		}

// 		// To support custom messages in metadata ignore rule methods titled "messages"
// 		if (rules.messages) {
// 			delete rules.messages;
// 		}

// 		return rules;
// 	},

// 	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
// 	normalizeRule: function(data) {
// 		if( typeof data == "string" ) {
// 			var transformed = {};
// 			$.each(data.split(/\s/), function() {
// 				transformed[this] = true;
// 			});
// 			data = transformed;
// 		}
// 		return data;
// 	},

// 	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
// 	addMethod: function(name, method, message) {
// 		$.validator.methods[name] = method;
// 		$.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
// 		if (method.length < 3) {
// 			$.validator.addClassRules(name, $.validator.normalizeRule(name));
// 		}
// 	},

// 	methods: {

// 		// http://docs.jquery.com/Plugins/Validation/Methods/required
// 		required: function(value, element, param) {
// 			// check if dependency is met
// 			if ( !this.depend(param, element) )
// 				return "dependency-mismatch";
// 			switch( element.nodeName.toLowerCase() ) {
// 			case 'select':
// 				// could be an array for select-multiple or a string, both are fine this way
// 				var val = $(element).val();
// 				return val && val.length > 0;
// 			case 'input':
// 				if ( this.checkable(element) )
// 					return this.getLength(value, element) > 0;
// 			default:
// 				return $.trim(value).length > 0;
// 			}
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/remote
// 		remote: function(value, element, param) {
// 			if ( this.optional(element) )
// 				return "dependency-mismatch";

// 			var previous = this.previousValue(element);
// 			if (!this.settings.messages[element.name] )
// 				this.settings.messages[element.name] = {};
// 			previous.originalMessage = this.settings.messages[element.name].remote;
// 			this.settings.messages[element.name].remote = previous.message;

// 			param = typeof param == "string" && {url:param} || param;

// 			if ( this.pending[element.name] ) {
// 				return "pending";
// 			}
// 			if ( previous.old === value ) {
// 				return previous.valid;
// 			}

// 			previous.old = value;
// 			var validator = this;
// 			this.startRequest(element);
// 			var data = {};
// 			data[element.name] = value;
// 			$.ajax($.extend(true, {
// 				url: param,
// 				mode: "abort",
// 				port: "validate" + element.name,
// 				dataType: "json",
// 				data: data,
// 				success: function(response) {
// 					validator.settings.messages[element.name].remote = previous.originalMessage;
// 					var valid = response === true;
// 					if ( valid ) {
// 						var submitted = validator.formSubmitted;
// 						validator.prepareElement(element);
// 						validator.formSubmitted = submitted;
// 						validator.successList.push(element);
// 						validator.showErrors();
// 					} else {
// 						var errors = {};
// 						var message = response || validator.defaultMessage( element, "remote" );
// 						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
// 						validator.showErrors(errors);
// 					}
// 					previous.valid = valid;
// 					validator.stopRequest(element, valid);
// 				}
// 			}, param));
// 			return "pending";
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
// 		minlength: function(value, element, param) {
// 			return this.optional(element) || this.getLength($.trim(value), element) >= param;
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
// 		maxlength: function(value, element, param) {
// 			return this.optional(element) || this.getLength($.trim(value), element) <= param;
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
// 		rangelength: function(value, element, param) {
// 			var length = this.getLength($.trim(value), element);
// 			return this.optional(element) || ( length >= param[0] && length <= param[1] );
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/min
// 		min: function( value, element, param ) {
// 			return this.optional(element) || value >= param;
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/max
// 		max: function( value, element, param ) {
// 			return this.optional(element) || value <= param;
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/range
// 		range: function( value, element, param ) {
// 			return this.optional(element) || ( value >= param[0] && value <= param[1] );
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/email
// 		email: function(value, element) {
// 			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
// 			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/url
// 		url: function(value, element) {
// 			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
// 			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/date
// 		date: function(value, element) {
// 			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
// 		dateISO: function(value, element) {
// 			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/number
// 		number: function(value, element) {
// 			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/digits
// 		digits: function(value, element) {
// 			return this.optional(element) || /^\d+$/.test(value);
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
// 		// based on http://en.wikipedia.org/wiki/Luhn
// 		creditcard: function(value, element) {
// 			if ( this.optional(element) )
// 				return "dependency-mismatch";
// 			// accept only digits and dashes
// 			if (/[^0-9-]+/.test(value))
// 				return false;
// 			var nCheck = 0,
// 				nDigit = 0,
// 				bEven = false;

// 			value = value.replace(/\D/g, "");

// 			for (var n = value.length - 1; n >= 0; n--) {
// 				var cDigit = value.charAt(n);
// 				var nDigit = parseInt(cDigit, 10);
// 				if (bEven) {
// 					if ((nDigit *= 2) > 9)
// 						nDigit -= 9;
// 				}
// 				nCheck += nDigit;
// 				bEven = !bEven;
// 			}

// 			return (nCheck % 10) == 0;
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/accept
// 		accept: function(value, element, param) {
// 			param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
// 			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
// 		},

// 		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
// 		equalTo: function(value, element, param) {
// 			// bind to the blur event of the target in order to revalidate whenever the target field is updated
// 			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
// 			var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
// 				$(element).valid();
// 			});
// 			return value == target.val();
// 		}

// 	}

// });

// // deprecated, use $.validator.format instead
// $.format = $.validator.format;

// })(jQuery);

// // ajax mode: abort
// // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
// ;(function($) {
// 	var pendingRequests = {};
// 	// Use a prefilter if available (1.5+)
// 	if ( $.ajaxPrefilter ) {
// 		$.ajaxPrefilter(function(settings, _, xhr) {
// 			var port = settings.port;
// 			if (settings.mode == "abort") {
// 				if ( pendingRequests[port] ) {
// 					pendingRequests[port].abort();
// 				}
// 				pendingRequests[port] = xhr;
// 			}
// 		});
// 	} else {
// 		// Proxy ajax
// 		var ajax = $.ajax;
// 		$.ajax = function(settings) {
// 			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
// 				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
// 			if (mode == "abort") {
// 				if ( pendingRequests[port] ) {
// 					pendingRequests[port].abort();
// 				}
// 				return (pendingRequests[port] = ajax.apply(this, arguments));
// 			}
// 			return ajax.apply(this, arguments);
// 		};
// 	}
// })(jQuery);

// // provides cross-browser focusin and focusout events
// // IE has native support, in other browsers, use event caputuring (neither bubbles)

// // provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// // handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
// ;(function($) {
// 	// only implement if not provided by jQuery core (since 1.4)
// 	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
// 	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
// 		$.each({
// 			focus: 'focusin',
// 			blur: 'focusout'
// 		}, function( original, fix ){
// 			$.event.special[fix] = {
// 				setup:function() {
// 					this.addEventListener( original, handler, true );
// 				},
// 				teardown:function() {
// 					this.removeEventListener( original, handler, true );
// 				},
// 				handler: function(e) {
// 					arguments[0] = $.event.fix(e);
// 					arguments[0].type = fix;
// 					return $.event.handle.apply(this, arguments);
// 				}
// 			};
// 			function handler(e) {
// 				e = $.event.fix(e);
// 				e.type = fix;
// 				return $.event.handle.call(this, e);
// 			}
// 		});
// 	};
// 	$.extend($.fn, {
// 		validateDelegate: function(delegate, type, handler) {
// 			return this.bind(type, function(event) {
// 				var target = $(event.target);
// 				if (target.is(delegate)) {
// 					return handler.apply(target, arguments);
// 				}
// 			});
// 		}
// 	});
// })(jQuery);


//USERNAME CHECK FROM ORIGINAL SITE
$(document).ready(function ()
{
    $("#register_form").validate(
    {
        errorPlacement: function (error, element) {
            if (element.attr('name') == 'email2') return;
            error.remove().hide();
            $("#availability_status").append(error);
            error.slideDown('fast');
        },
        wrapper: "div",
        onkeyup: function (element) {
            if ($(element).attr('name') != 'username') {
                $.validator.defaults.onkeyup.apply(this,arguments);
            }
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            this.addWrapper(this.errorsFor(element)).slideUp('fast', function () {
                $(this).remove();
            });
        },
        rules: {

            username: {

                required: true,
                validchars: true,
                minlength: 3,
                maxlength: 15,
                remote: {
                    url: "/bin/hypo_user_check.php",
                    type: "get"
                }
                // remote check for duplicate username
            },
            email: {
                required: true,
                email: true,
                remote: {
                    url: "/bin/hypo_mail_check.php",
                    type: "get"
                }
            },
            email2: {
                equalTo: "#email",
            }
        },
        messages: {
            username: {
                required: "Username is required.",
                minlength: jQuery.format("Username must be at least {0} characters."),
                maxlength : jQuery.format("Username must be no more than {0} characters."),
                remote: jQuery.format("That username is already taken."),
                validChars: "valid Chars please"
            },
            email: {
                required: "Email is required.",
                remote: jQuery.format("That email is already registered."),
            },
            email2: {
                equalTo: "Email fields must match."
            }
        },
        // specifying a submitHandler prevents the default submit, good for now
        submitHandler: function ()
        {
          var url = 'https://hypothes.is/';
              twitter_text = 'I just reserved my @hypothes_is username.  Get yours now. ',
              facebook_text = 'I just reserved my Hypothes.is username at ' + url + '. Check out this new open source project and protect your favorite username!',
              display_text = '&quot;I just reserved my @hypothes_is username ...&quot;',
              twitter_button = '<div id="custom-tweet-button"><a href="https://twitter.com/share?text=' + escape(twitter_text) + '" target="_blank"><span class="twitter-text">' + display_text + '</span><br/><span class="twitter-link">Tweet this</span></a></div>',
              facebook_button = '<div id="custom-facebook-button"><a name="fb_share" type="box_count" href="http://www.facebook.com/sharer.php?u=' + escape(url) + '&t=' + escape(facebook_text) + '"><span class="facebook-text">' + display_text + '</span><br/><span class="facebook-link">Post this to Facebook</span></a></div>';

        	$.post('/bin/db_insert.php', $("#register_form").serialize(), function(data) {
							$('#availability_status').html(data);
							$('#register_form').html("<div id='response'></div>");
        			$('#response').html("<br/>")
        			.append("<p class='reg-message'>Please check your email.</p>")
        			.append("<p>" + twitter_button + "</p>")
        			.append("<p>" + facebook_button + "</p>");
					});
        },
    });
    jQuery.validator.addMethod('validchars', function (value, element)
    {
        return this.optional(element) || "" || /^[a-zA-Z0-9_]+$/.test(value);
    }, "0-9, A-Z, a-z and underscore only, please.");
    $(function ()
    {
        $('input[type=text]').focus(function ()
        {
            if (this.value == this.defaultValue) {
                this.value = '';
            }
        }).blur(function ()
        {
            if (this.value == '') {
                this.value = this.defaultValue;
            }
        });
    });
});


//MAILER JS SCRIPT FROM ORIGINAL
$(function() {
  $('.error').hide();
  $('input.text-input').css({backgroundColor:"#FFFFFF"});
  $('.text-input').focus(function(){
    $(this).css({backgroundColor:"#F2F0E3"});
  });
  $('.text-input').blur(function(){
    $(this).css({backgroundColor:"#FFFFFF"});
  });

  $("#contact_form .button").click(function() {
		// validate and process form
		// first hide any error messages
    $('.error').hide();

	  var name = $("input#name").val();
		if (name == "") {
      $("label#name_error").show();
      $("input#name").focus();
      return false;
    }
		var contact_email = $("input#contact_email").val();
		if (contact_email == "") {
      $("label#contact_email_error").show();
      $("input#contact_email").focus();
      return false;
    }
		var message = $("textarea#message").val();
		if (message == "") {
      $("label#message_error").show();
      $("textarea#message").focus();
      return false;
    }

		var dataString = 'contact=join&name='+ name + '&contact_email=' + contact_email + '&message=' + message;
		//alert (dataString);return false;

		$.ajax({
      type: "POST",
      url: "/bin/process.php",
      data: dataString,
      success: function(response) {
        $('#contact_form').html("<div id='response'></div>");
        $('#response').html("<h2>Thank you!</h2>")
        .append("<p>We will be in touch soon.</p>")
        .hide()
        .fadeIn(1500);
      }
     });
    return false;
	});

  $("#note_form .button").click(function() {
		// validate and process form
		// first hide any error messages
    $('.error').hide();

	  var name = $("input#note_name").val();
		if (name == "") {
      $("label#note_name_error").show();
      $("input#note_name").focus();
      return false;
    }
		var contact_email = $("input#note_email").val();
		if (contact_email == "") {
      $("label#note_email_error").show();
      $("input#note_email").focus();
      return false;
    }
		var message = $("textarea#note_message").val();
		if (message == "") {
      $("label#note_message_error").show();
      $("textarea#note_message").focus();
      return false;
    }

		var dataString = 'contact=note&name='+ name + '&contact_email=' + contact_email + '&message=' + message;
		//alert (dataString);return false;

		$.ajax({
      type: "POST",
      url: "/bin/process.php",
      data: dataString,
      success: function(response) {
        $('#note_form').html("<div id='response'></div>");
        $('#response').html("<h2>Thank you!</h2>")
        .hide()
        .fadeIn(1500);
      }
     });
    return false;
	});
});
runOnLoad(function(){
  //$("input#name").select().focus();
});


// (function() {
//   var Time, Tweet, TweetCollection,
//     __slice = [].slice;

//   Tweet = (function() {

//     Tweet.urlRegex = function() {
//       return /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
//     };

//     Tweet.userRegex = function() {
//       return /[\@]+([A-Za-z0-9-_]+)/gi;
//     };

//     Tweet.hashRegex = function() {
//       return /\s[\#]+([A-Za-z0-9-_]+)/gi;
//     };

//     Tweet.templateKeys = function() {
//       return ['avatar', 'tweet', 'time'];
//     };

//     function Tweet(data, options) {
//       this.data = data;
//       this.options = options;
//     }

//     Tweet.prototype.content = function() {
//       var key, template, _i, _len, _ref;
//       template = this.options.template;
//       _ref = Tweet.templateKeys();
//       for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//         key = _ref[_i];
//         template = template.replace("{" + key + "}", this[key]());
//       }
//       return template;
//     };

//     Tweet.prototype.tweet = function() {
//       var tweet;
//       tweet = '';
//       if (this.options.introText !== null) {
//         tweet = "<span class='intro-text'>" + this.options.introText + "</span>";
//       }
//       tweet += this.originalText();
//       if (this.options.outroText !== null) {
//         tweet += "<span class='outro-text'>" + this.options.outroText + "</span>";
//       }
//       return "<span class='" + this.options.tweetClass + "'>" + tweet + "</span>";
//     };

//     Tweet.prototype.avatar = function() {
//       return "<img src='" + (this.avatarUrl()) + "' class='" + this.options.avatarClass + "' title='" + this.options.username + "' height='" + this.options.avatarSize + "' width='" + this.options.avatarSize + "'/>";
//     };

//     Tweet.prototype.time = function() {
//       var time;
//       time = new Time(this.data.created_at, this.options.timeFormat);
//       return "<span class='" + this.options.timeClass + "'>" + (time.formatted()) + "</span>";
//     };

//     Tweet.prototype.originalText = function() {
//       var originalText;
//       originalText = this.data.text;
//       originalText = originalText.replace(Tweet.urlRegex(), "<a class=\"mini-feed-link\" href=\"$1\">$1</a>");
//       originalText = originalText.replace(Tweet.userRegex(), "<a class=\"mini-feed-user-link\" href=\"http://www.twitter.com/$1\">@$1</a>");
//       return originalText.replace(Tweet.hashRegex(), " <a href=\"http://search.twitter.com/search?q=&tag=$1&lang=all\">#$1</a> ");
//     };

//     Tweet.prototype.listItemClass = function(index, size) {
//       if (index === 0) {
//         return this.options.firstClass;
//       }
//       if (index === (size - 1)) {
//         return this.options.lastClass;
//       }
//     };

//     Tweet.prototype.avatarUrl = function() {
//       return this.data.user.profile_image_url_https;
//     };

//     Tweet.prototype.isReply = function() {
//       return this.data.in_reply_to_status_id != null;
//     };

//     Tweet.apiUrl = function(options) {
//       var apiUrl;
//       apiUrl = "https://api.twitter.com/1/statuses/user_timeline.json?";
//       apiUrl += "screen_name=" + options.username;
//       apiUrl += "&count=" + options.limit;
//       if (!options.hideRetweets) {
//         apiUrl += "&include_rts=1";
//       }
//       apiUrl += "&callback=?";
//       return apiUrl;
//     };

//     return Tweet;

//   })();

//   TweetCollection = (function() {

//     function TweetCollection(apiData, options) {
//       var tweet, _i, _len;
//       this.options = options;
//       this.tweets = [];
//       for (_i = 0, _len = apiData.length; _i < _len; _i++) {
//         tweet = apiData[_i];
//         this.tweets.push(new Tweet(tweet, this.options));
//       }
//     }

//     TweetCollection.prototype.size = function() {
//       return this.tweets.length;
//     };

//     TweetCollection.prototype.formattedTweets = function() {
//       var $li, $ul, index, tweet, _i, _len, _ref;
//       $ul = $('<ul />', {
//         'class': this.options.listClass
//       });
//       _ref = this.tweets;
//       for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
//         tweet = _ref[index];
//         if (!(this.options.hideReplies && tweet.isReply())) {
//           $li = $('<li />', {
//             'class': tweet.listItemClass(index, this.size())
//           });
//           $li.append(tweet.content());
//           $li.appendTo($ul);
//         }
//       }
//       return $ul;
//     };

//     return TweetCollection;

//   })();

//   Time = (function() {

//     function Time(time, format) {
//       this.format = format;
//       this.time = time.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3');
//       this.date = new Date(this.time);
//     }

//     Time.prototype.formatted = function() {
//       if (this.format === "normal") {
//         return this.normalFormat();
//       }
//       return this.relativeFormat();
//     };

//     Time.prototype.normalFormat = function() {
//       return this.date.toDateString();
//     };

//     Time.prototype.relativeFormat = function() {
//       var delta, relative_to;
//       relative_to = new Date();
//       delta = parseInt((relative_to.getTime() - this.parsedDate()) / 1000);
//       if (delta < 60) {
//         return 'less than a minute ago';
//       } else if (delta < (60 * 60)) {
//         return 'about ' + this.pluralize("minute", parseInt(delta / 60)) + ' ago';
//       } else if (delta < (24 * 60 * 60)) {
//         return 'about ' + this.pluralize("hour", parseInt(delta / 3600)) + ' ago';
//       } else {
//         return 'about ' + this.pluralize("day", parseInt(delta / 86400)) + ' ago';
//       }
//     };

//     Time.prototype.pluralize = function(word, n) {
//       var plural;
//       plural = "" + n + " " + word;
//       if (n > 1) {
//         plural += "s";
//       }
//       return plural;
//     };

//     Time.prototype.parsedDate = function() {
//       return Date.parse(this.time);
//     };

//     return Time;

//   })();

//   $(function() {
//     $.miniFeed = function(element, options) {
//       var setState, showTweets, state,
//         _this = this;
//       this.defaults = {
//         username: 'mattaussaguel',
//         limit: 6,
//         template: '{avatar}{tweet}{time}',
//         introText: null,
//         outroText: null,
//         listClass: 'tweet-list',
//         firstClass: 'first',
//         lastClass: 'last',
//         avatarSize: '48',
//         avatarClass: 'tweet-avatar',
//         tweetClass: 'tweet-text',
//         hideRetweets: false,
//         hideReplies: false,
//         timeFormat: 'relative',
//         timeClass: 'tweet-time',
//         onLoad: function() {},
//         onLoaded: function() {}
//       };
//       state = '';
//       this.settings = {};
//       this.$element = $(element);
//       setState = function(_state) {
//         return state = _state;
//       };
//       showTweets = function() {
//         _this.callSettingFunction('onLoad');
//         setState('loading');
//         return $.getJSON(Tweet.apiUrl(_this.settings), function(data) {
//           var tweetCollection;
//           setState('formatting');
//           tweetCollection = new TweetCollection(data, _this.settings);
//           _this.$element.append(tweetCollection.formattedTweets());
//           _this.callSettingFunction('onLoaded');
//           return setState('loaded');
//         });
//       };
//       this.getState = function() {
//         return state;
//       };
//       this.getSetting = function(settingKey) {
//         return this.settings[settingKey];
//       };
//       this.callSettingFunction = function() {
//         var args, functionName;
//         functionName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
//         return this.settings[functionName](this.$element);
//       };
//       this.init = function() {
//         this.settings = $.extend({}, this.defaults, options);
//         setState('initialising');
//         return showTweets();
//       };
//       return this.init();
//     };
//     return $.fn.miniFeed = function(options) {
//       return this.each(function() {
//         var plugin;
//         if ($(this).data('miniFeed') === void 0) {
//           plugin = new $.miniFeed(this, options);
//           return $(this).data('miniFeed', plugin);
//         }
//       });
//     };
//   });

// }).call(this);
