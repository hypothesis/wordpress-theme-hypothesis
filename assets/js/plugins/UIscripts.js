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
