<?php


  function pressLoop( $atts ) {
      extract( shortcode_atts( array(
          'type' => 'press',
      ), $atts ) );
      $output = '';
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
                <a href="'.get_post_meta( get_the_ID(), 'link', true ).'">
                  '.get_the_post_thumbnail().'
                </a>
                <div class="caption">
                  <span>'.get_post_meta( get_the_ID(), 'date', true ).'</span>
                </div>
              </div>
              <div class="text three_fourths last">
                <h3>'.get_post_meta( get_the_ID(), 'outlet', true ).'</h3>
                <a class="strong" href="'.get_post_meta( get_the_ID(), 'link', true ).'">'.get_the_title().'</a>
                <div class="em">"'.get_post_meta( get_the_ID(), 'excerpt', true ).'" <a href="'.get_post_meta( get_the_ID(), 'arch_file', true ).'">[Archival '.get_post_meta( get_the_ID(), 'arch_filetype', true ).']</a></div>
              </div>
            </div>
          </div>';
      endwhile;
      wp_reset_query();
      return $output;
  }
  add_shortcode('press-loop', 'pressLoop');


  function peopleLoop($atts, $content = null) {
    extract(shortcode_atts(array(
      "category" => '',
      "type" => 'people',
      'per_row' => '5',
      'width' => ''
    ), $atts));

    //Extract ID from category name
    $theCatId = get_term_by( 'slug', $category, 'category' );
    $theCatId = $theCatId->term_id;



    //Establish global post var
    global $post;

    //Open markup
    $output = '';

    //set args for WP_Query
    $argsQ = array(
      'post_type' => $type,
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
        'numberposts' => $per_row,
        'offset' => $i,
        'category' => $theCatId,
        'post_type' => $type,
      );

      //Get the posts
      $myposts = get_posts($argsG2);


      $output .= '<div class="row">';

      foreach($myposts as $post) : setup_postdata($post);
        $output .='<div class="picunit tipper '.$width.'" id="'.get_the_ID().'">
            '.get_the_post_thumbnail().'
            <div class="caption" style="display: block;">
              <a href="'.get_post_meta( get_the_ID(), 'website', true ).'">'.get_the_title().'</strong></a>
            </div>
            <div class="caption" style="display: block;">'.get_post_meta( get_the_ID(), 'tagline', true ).'</div>
            <div class="hovertext" style="display: none;">Click for bio<span class="redtext">.</span></div>
          </div>';
      endforeach;

      //Second row

      $output .= '</div><div class="row">';

      foreach($myposts as $post) : setup_postdata($post);
        
        $output .='
          <div class="one_whole tip '.get_the_ID().'">
            <h3>
              <a href="'.get_post_meta( get_the_ID(), 'website', true ).'">'.get_the_title().'</a>
            </h3>
            <h4>'.get_post_meta( get_the_ID(), 'tagline', true ).'</h4>
            <h4>
              <a href="https://twitter.com/#!/'.substr(get_post_meta( get_the_ID(), 'twitter', true ), 1).'">'.get_post_meta( get_the_ID(), 'twitter', true ).'</a>
            </h4>
            <p>'.get_post_meta( get_the_ID(), 'bio', true ).'</p>
          </div>';
      endforeach;

      $output .= '</div>';

      //Increment counter
      $i += $per_row;

    endwhile;

    //Close and return markup
    return $output;
  }
  add_shortcode('people-loop', 'peopleLoop');


  function recentPosts( $atts ) {
      extract( shortcode_atts( array(
          'type' => 'post',
      ), $atts ) );

      function get_excerpt($count){
        $permalink = get_permalink($post->ID);
        $excerpt = get_the_content();
        $excerpt = strip_tags($excerpt);
        $excerpt = substr($excerpt, 0, $count);
        $excerpt = $excerpt.'...';
        return $excerpt;
      }

      $args = array(
          // 'post_parent' => $parent,
          'post_type' => $type,
          'posts_per_page' => 4,
          'orderby' => 'rand',
          'sort_column'   => 'menu_order'
      );

      $output = '<ul class="newposts">';

      $yo_quiery = new WP_Query( $args );
      while ( $yo_quiery->have_posts() ) : $yo_quiery->the_post();
          $output .= 
              '
              
              <li class="post">
                <a href="'.get_post_meta( get_the_ID(), 'article_link', true ).'"><h4>'.get_the_title().'</h4></a>
                <div>'.get_excerpt(100).'</div>
              </li>

              ';
      endwhile;
      wp_reset_query();
      $output .= '</ul><a class="morelink" href="https://blog.hypothes.is">More…</a>';
      return $output;
  }
  add_shortcode('recent-posts', 'recentPosts');
