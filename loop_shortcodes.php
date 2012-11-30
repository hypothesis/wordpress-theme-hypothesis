<?php

  function andrew_loop_shortcode( $atts ) {
      extract( shortcode_atts( array(
          'parent' => 8,
          'type' => 'person',
          'perpage' => 4
      ), $atts ) );
      $output = '<div class="clear"></div><div class="childs grid_12">';
      $args = array(
          // 'post_parent' => $parent,
          'post_type' => $type,
          'posts_per_page' => $perpage,
          'sort_column'   => 'menu_order'
      );
      $yo_quiery = new WP_Query( $args );
      while ( $yo_quiery->have_posts() ) : $yo_quiery->the_post();
          $output .= '<div id="service-hp">'.
                     get_the_post_thumbnail().
                     '<h2 style="margin-bottom:5px">'.
                     get_the_title().
                     '</h2>'.
                     get_the_excerpt().get_post_meta( get_the_ID(), 'twitter', true ).
                     '<a class="read-more" href="'.
                     get_permalink().
                     '">en savoir plus <img src="'.
                     get_bloginfo( 'template_url' ).
                     '/images/read-more.png"></a></div><!--  ends here -->';
      endwhile;
      wp_reset_query();
      $output .= '</div>';
      return $output;
  }
  add_shortcode('andrewloop', 'andrew_loop_shortcode');

  function pressLoop( $atts ) {
      extract( shortcode_atts( array(
          'type' => 'press',
      ), $atts ) );
      $output = '<div class="clear"></div><div class="childs grid_12">';
      $args = array(
          // 'post_parent' => $parent,
          'post_type' => $type,
          'sort_column'   => 'menu_order'
      );
      $yo_quiery = new WP_Query( $args );
      while ( $yo_quiery->have_posts() ) : $yo_quiery->the_post();
          $output .= 
          '<div class="pressunit">
            <div class="row">
              <div class="picunit one_fourth">
                <a href="'.get_post_meta( get_the_ID(), 'article_link', true ).'">
                  '.get_the_post_thumbnail().'
                </a>
                <div class="caption">
                  <span>'.get_post_meta( get_the_ID(), 'article_date', true ).'</span>
                </div>
              </div>
              <div class="text three_fourths last">
                <h3>'.get_post_meta( get_the_ID(), 'outlet', true ).'</h3>
                <a class="strong" href="'.get_post_meta( get_the_ID(), 'article_link', true ).'">'.get_the_title().'</a>
                <div class="em">"'.get_the_excerpt().'" <a href="'.get_post_meta( get_the_ID(), 'arch_file', true ).'">[Archival '.get_post_meta( get_the_ID(), 'arch_file_type', true ).']</a></div>
              </div>
            </div>
          </div>';
      endwhile;
      wp_reset_query();
      $output .= '</div>';
      return $output;
  }
  add_shortcode('press-loop', 'pressLoop');


function prev_related($atts, $content = null) {
  extract(shortcode_atts(array(
    "num" => '6',
    "category" => 'test'
  ), $atts));

  //Extract ID from category name
  $theCatId = get_term_by( 'slug', $category, 'category' );
  $theCatId = $theCatId->term_id;

  //Establish global post var
  global $post;

  //Open markup
  $output = '<ol>';

  //set args for WP_Query
  $argsQ = array(
    'post_type' => 'typetest',
    'cat' => $theCatId
    );

  //make new WP_Query
  $yo_quiery = new WP_Query($argsQ);
  $total = $yo_quiery->found_posts;

  //Start counter
  $i = 0;

  //While counter is less than 
  while($i < $total) :
  
    //Set up args for get_posts
    $argsG2 = array(
      'numberposts' => $num,
      'offset' => $i,
      'category' => $theCatId,
      'post_type' => 'typetest'
    );

    //Get the posts
    $myposts = get_posts($argsG2);

    //First row
    foreach($myposts as $post) : setup_postdata($post);
      $output .='<li style="background: blue;"><a href="'.get_permalink().'">'.the_title("","",false).'</a></li>';
    endforeach;

    //Second row
    foreach($myposts as $post) :
      $output .='<li style="background: red;"><a href="'.get_permalink().'">'.the_title("","",false).'</a></li>';
    endforeach;

    //Increment counter
    $i += $num;

  endwhile;

  //Close and return markup
  $output .= $total.'</ol>';
  return $output;
}
add_shortcode('related', 'prev_related');

