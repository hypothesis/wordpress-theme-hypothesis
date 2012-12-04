// LOADING EFFECTS- FADEIN
$(function(){
  $("article").hide();
});

$(document).ready(function(){
  $("article").fadeIn("slow");
});

//SLIDESHOW
$(function() {
    var slide = $('#slideshow .slide'),
        counter = $('#slideshow .counter'),
        index = Math.floor(Math.random()*(slide.length)), 
        interval,

        // This fades out the slide and counter with an old index, fades in the one with a new index, and changes the old index to new.
        slideChange = function (newIndex) {
          counter.eq(index).removeClass("active");
          slide.eq(index).fadeOut(function () {
            counter.eq(newIndex).addClass("active");
            slide.eq(newIndex).fadeIn();
          });
          index = newIndex;
        }

        //This calls the slideChange and sets the new index to the one ahead.
        slideNext = function () {
          slideChange((index + 1) % slide.length);
        };

        //This calls the slideChange and sets the new index to the one behind.
        slidePrev = function () {
          slideChange((index - 1) % slide.length);
        };

    //This stuff happens at the beginning and hides all slides except for the one at the index.
    slide.hide();
    slide.eq(index).show();
    counter.eq(index).addClass("active"); 

    //This binds the next and previous to the arrows.
    $('#slideshow .arrowleft').click(slidePrev);
    $('#slideshow .arrowright').click(slideNext);

    //This calls the slide change to the index of the proper counter.
    counter.click(function () {
      slideChange(counter.index(this))
    });

    //This calls the slideChange on a set interval and also disables it on hover.
    interval = setInterval(slideNext, 10000);
    $('#slideshow').hover(function () {
        clearInterval(interval);
    }, function () {
        interval = setInterval(slideNext, 10000);
    });
});

//MINIFEED SETUP CODE
$(function() {
  $('#tweets').miniFeed({
    username: 'hypothes_is',
    limit: 4,
    avatarSize: 32,
    template: '<div class="tweet-avacase">{avatar}</div><div class="tweet-content">{tweet}{time}</div>'
  });
});


//COLLAPSING ITEMS
$(document).ready(function() {
  $(".collapsee").hide();
  $(".collapser").click(function() {
    $(this).parents("article").find(".collapser").not(this).find(".collapsee").slideUp();
    $(this).parents("article").find(".collapser").not(this).removeClass("expanded");
    $(this).find(".collapsee").slideToggle();
    $(this).toggleClass("expanded");
  });
});

//TOOLTIPS
$(document).ready(function() {
  $(".tip").hide();
  $(".tipper").click(function() {
    var person = "." + $(this).attr("id");
    $(this).parents("article").find(".tip").not(person).slideUp("slow")
    $(this).parents("article").find(person).slideToggle("slow");
  });
});

//PICUNIT HOVERTEXT
$(document).ready(function() {
  $(".hovertext").hide();
  $(".tipper").hover(function() {
    $(this).find(".caption").toggle();
    $(this).find(".hovertext").toggle();
  });
});

