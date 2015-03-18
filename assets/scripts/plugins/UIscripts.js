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
