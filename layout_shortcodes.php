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
            <h3 class="noborder">'.$title.'</h3>
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



  /* ========================================================================================================================
  
  Forms
  
  ======================================================================================================================== */

  function register($atts) {

    extract(shortcode_atts(array(
      'text' => 'Reserve your username.'
    ), $atts));

    return '
      <a class="tipper" id="us_re">'.$text.'</a>
      <form class="two_thirds us_re tip" id="register_form" style="display: none;">
        <div id="availability_status"></div>
        <label for="username" style="display: none;">Choose a Username.</label>
        <input class="clearFocus" id="username" name="username" placeholder="Choose a Username" type="text">
        <label for="email" style="display: none;">Enter your email.</label>
        <input id="email" name="email" placeholder="Enter your email- (No Spam)" type="text">
        <label for="email2" style="display: none;">Confirm your email.</label>
        <input id="email2" name="email2" placeholder="Confirm your email." type="text">
        <input class="button" name="button" type="submit" value="Save my username">
      </form>
    ';
  }
  add_shortcode('register', 'register');


  function contact($atts) {
    return '
      <p style="font-size: .7em">This form accepts plain text, and will strip html out of your submission.</p>
      <form action="" id="note_form" method="post" name="note_form" style="display: block; ">
        <div class="contact-form">
          <div class="message">
            <label for="note_message" style="display: none; ">Message</label>
            <label class="error" for="note_message" id="note_message_error" style="display: none;">This field is required.</label>
            <textarea class="text-input" id="note_message" name="note_message" placeholder="Leave us a message" value=""></textarea>
          </div>
          <div class="identification">
            <label for="note_name" style="display: none; ">Your name</label>
            <label class="error" for="note_name" id="note_name_error" style="display: none;">This field is required.</label>
            <input class="text-input" id="note_name" name="note_name" placeholder="Enter your name" type="text" value="" style="background-color: rgb(255, 255, 255);">
            <label for="note_email" style="display: none; ">Your email</label>
            <label class="error" for="note_email" id="note_email_error" style="display: none;">This field is required.</label>
            <input class="text-input" id="note_email" name="note_email" placeholder="Enter your email- (No Spam)" type="text" value="" style="background-color: rgb(255, 255, 255);">
          </div>
          <div class="note_type">
            <select name="cars">
              <option value="general">General message</option>
              <option value="code">I’d like to code.</option>
              <option value="design">I’d like to design.</option>
              <option value="other">I’d like to help in other ways.</option>
              <option value="partner">I’d like to partner.</option>
              <option value="talk">I’d like to talk to you.</option>
              <option value="question">I have a question.</option>
            </select>
          </div>
          <input class="button" id="submit_btn" name="note_submit" type="submit" value="Send">
        </div>
      </form>
    ';
  }
  add_shortcode('contact', 'contact');


  /* ========================================================================================================================
  
  Fake Hypothesis embed
  
  ======================================================================================================================== */

  function hypEmbedSource($atts) {
    extract(shortcode_atts(array(
      'domain' => '',
      'title' => '',
      'link' => '',
      'excerpt' => '',
      'child_user' => '',
      'child_time' => '',
      'child_annotation' => ''
    ), $atts));

    return do_shortcode('
      <div class="hyp-embed">
        <div class="hyp-topbar">
          <span>'.$domain.'</span>
          <span>/</span>
          <a href="'.$link.'">'.$title.'</a>
        </div>
        <div class="hyp-quote">
          <div class="hyp-body">'.$excerpt.'</div>
        </div>
        <div class="hyp-annotation">
          <div class="hyp-time">'.$child_time.'</div>
          <div class="hyp-user">'.$child_user.'</div>
          <div class="hyp-body">'.$child_annotation.'</div>
          <div class="hyp-bottombar">
            <div class="hyp-store">Annotation from:&nbsp;&nbsp;<span>test.hypothes.is</span></div>
          </div>
        </div>
      </div>
    ');
  }
  add_shortcode('hyp-embed-source', 'hypEmbedSource');


  /* ========================================================================================================================
  
  Fake Hypothesis embed
  
  ======================================================================================================================== */

  function hypEmbedReply($atts) {
    extract(shortcode_atts(array(
      'domain' => '',
      'title' => '',
      'link' => '',
      'excerpt' => '',
      'child_user' => '',
      'child_time' => '',
      'child_annotation' => '',
      'parent_user' => '',
      'parent_time' => '',
      'parent_annotation' => ''
    ), $atts));

    return do_shortcode('
      <div class="hyp-embed">
        <div class="hyp-topbar">
          <span>'.$domain.'</span>
          <span>/</span>
          <a href="'.$link.'">'.$title.'</a>
        </div>
        <div class="hyp-parent">
          <div class="hyp-time">'.$parent_time.'</div>
          <div class="hyp-user">'.$parent_user.'</div>
          <div class="hyp-body">'.$parent_annotation.'</div>
        </div>
        <div class="hyp-child">
          <div class="hyp-threadexp"></div>
          <div class="hyp-time">'.$child_time.'</div>
          <div class="hyp-user">'.$child_user.'</div>
          <div class="hyp-body">'.$child_annotation.'</div>
          <div class="hyp-bottombar">
            <div class="hyp-store">Annotation from:&nbsp;&nbsp;<span>test.hypothes.is</span></div>
          </div>
        </div>
      </div>
    ');
  }
  add_shortcode('hyp-embed-reply', 'hypEmbedReply');

