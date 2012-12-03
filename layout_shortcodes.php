<?php



  /* ========================================================================================================================

  Bio Pic and Info

  ======================================================================================================================== */

  function bioPic($atts) {
    extract(shortcode_atts(array(
      'hash' => '',
      'first' => '',
      'last' => '',
      'tagline' => '',
      'site' => '',
      'twitter' => '',
      'pic' => ''
    ), $atts));

    //Saves some of the atts in the global array under the hash name
    $GLOBALS[$hash] = array(
        'first' => $first,
        'last' => $last,
        'tagline' => $tagline,
        'twitter' => $twitter,
        'site' => $site
      );

    return do_shortcode('<div class="picunit tipper" id="'.$hash.'">
          <img alt="'.$first.' '.$last.'" src="'.$pic.'">
          <div class="caption" style="display: block;">
            <a href="'.$site.'">'.$first.' <strong>'.$last.'</strong></a>
          </div>
          <div class="caption" style="display: block;">'.$tagline.'</div>
          <div class="hovertext" style="display: none;">Click for bio<span class="redtext">.</span></div>
        </div>');
  }
  add_shortcode('bio-pic', 'bioPic');


  function bioInfo($atts, $content=null) {
    extract(shortcode_atts(array(
      'hash' => ''
    ), $atts));

    //Retrieves the atts from the global array
    $saved = $GLOBALS[$hash];


    return do_shortcode('<div class="tip '.$hash.'" style="display: none;">
          <h3>
            <a href="'.$saved['site'].'">'.$saved['first'].' <strong>'.$saved['last'].'</strong></a>
          </h3>
          <h4>'.$saved['tagline'].'</h4>
          <h4><a href="https://twitter.com/#!/'.$saved['twitter'].'">@'.$saved['twitter'].'</a></h4>
          <p>'.$content.'</p>
        </div>');
  }
  add_shortcode('bio-info', 'bioInfo');



  /* ========================================================================================================================
  
  Ordered List with Images
  
  ======================================================================================================================== */

  function imgList($atts, $content=null) {
    extract(shortcode_atts(array(
      'number' => '',
      'title' => '',
      'imglink' => ''
    ), $atts));

    return do_shortcode('<div class="row">
        <img class="one_third picunitimg" src="'.$imglink.'">
        <div class="two_thirds last">
          <div class="specunit">
            <div class="number">
              <h1 class="noborder">'.$number.'</h1>
            </div>
            <span class="text">
              <h3>'.$title.'</h3>
              <div>'.$content.'</div>
            </span>
          </div>
        </div>
      </div>');
  }
  add_shortcode('img-list', 'imgList');



  /* ========================================================================================================================
  
  Ordered List without Images
  
  ======================================================================================================================== */

  function numList($atts, $content=null) {
    extract(shortcode_atts(array(
      'number' => '',
      'title' => ''
    ), $atts));

    return do_shortcode(
      '<div class="one_whole">
        <div class="principle">
          <div class="number">
            <h2 class="noborder">'.$number.'</h2>
          </div>
          <div class="text">
            <h3>'.$title.'</h3>
            <div>'.$content.'</div>
          </div>
        </div>
      </div>');
  }
  add_shortcode('num-list', 'numList');



  /* ========================================================================================================================
  
  Unordered Expanding List
  
  ======================================================================================================================== */

  function expandList($atts, $content=null) {
    extract(shortcode_atts(array(
      'title' => ''
    ), $atts));

    return do_shortcode('  <div class="row">
        <div class="one_whole">
          <div class="faqunit collapser">
            <div class="triangle triangle">
              <div class="img"></div>
            </div>
            <div class="text">
              <h4>'.$title.'</h4>
              <div class="collapsee" style="display: none;">'.$content.'</div>
            </div>
          </div>
        </div>
      </div>');
  }
  add_shortcode('exp-list', 'expandList');
