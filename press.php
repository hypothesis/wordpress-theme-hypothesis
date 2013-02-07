<?php
/*
Plugin Name: Press
Description: Declares a plugin that will create a custom post type displaying press articles.
Version: 1.0
Author: Jehan Tremback
License: GPLv2
*/
add_action( 'init', 'create_article' );


function create_article() {
  register_post_type( 'press',
    array(
      'labels' => array(
        'name' => 'Press',
        'singular_name' => 'Article',
        'add_new' => 'Add New',
        'add_new_item' => 'Add New Article',
        'edit' => 'Edit',
        'edit_item' => 'Edit Article',
        'new_item' => 'New Article',
        'view' => 'View',
        'view_item' => 'View Article',
        'search_items' => 'Search Press',
        'not_found' => 'No Press found',
        'not_found_in_trash' => 'No Press found in Trash',
        'parent' => 'Parent Article'
      ),
      'public' => true,
      'menu_position' => 15,
      'supports' => array( 'title', 'thumbnail' ),
      'taxonomies' => array( 'category' ),
      'has_archive' => false
    )
  );
}

add_action( 'admin_init', 'press_admin' );




function press_admin() {
  add_meta_box( 'article_meta_box',
    'Article Details',
    'display_article_meta_box',
    'press', 'normal', 'high'
  );
}

function display_article_meta_box( $article ) {

  // Retrieve current name of the Director and Movie Rating based on review ID
  $link = esc_html( get_post_meta( $article->ID, 'link', true ) );

  $date = esc_html( get_post_meta( $article->ID, 'date', true ) );

  $outlet = esc_html( get_post_meta( $article->ID, 'outlet', true ) );

  $arch_file = esc_html( get_post_meta( $article->ID, 'arch_file', true ) );

  $arch_filetype = esc_html( get_post_meta( $article->ID, 'arch_filetype', true ) );

  $excerpt = esc_html( get_post_meta( $article->ID, 'excerpt', true ) );

  ?>
  <table>
    <tr>
      <td style="width: 100%">Article Link</td>
      <td><input type="text" size="80" name="article_link" value="<?php echo $link; ?>" /></td>
    </tr>

    <tr>
      <td style="width: 100%">Article Date</td>
      <td><input type="text" size="80" name="article_date" value="<?php echo $date; ?>" /></td>
    </tr>

    <tr>
      <td style="width: 100%">Outlet</td>
      <td><input type="text" size="80" name="article_outlet" value="<?php echo $outlet; ?>" /></td>
    </tr>

    <tr>
      <td style="width: 100%">Archival File</td>
      <td><input placeholder="/wp-content/uploads/2012/12/example.pdf" type="text" size="80" name="article_arch_file" value="<?php echo $arch_file; ?>" /></td>
    </tr>
    
    <tr>
      <td style="width: 100%">Archival Filetype</td>
      <td><input type="text" size="80" name="article_arch_filetype" value="<?php echo $arch_filetype; ?>" /></td>
    </tr>


    <tr>
      <td style="width: 100%">Excert</td>
      <td><textarea rows="20" cols="75" name="article_excerpt"><?php echo $excerpt; ?></textarea></td>
    </tr>

  </table>
  <?php } 

add_action( 'save_post', 'add_article_fields', 10, 2 );


function add_article_fields( $article_id, $article ) {
  // Check post type for movie reviews
  if ( $article->post_type == 'press' ) {
    // Store data in post meta table if present in post data

    if ( isset( $_POST['article_link'] ) && $_POST['article_link'] != '' ) {
      update_post_meta( $article_id, 'link', $_POST['article_link'] );
    }

    if ( isset( $_POST['article_date'] ) && $_POST['article_date'] != '' ) {
      update_post_meta( $article_id, 'date', $_POST['article_date'] );
    }

    if ( isset( $_POST['article_outlet'] ) && $_POST['article_outlet'] != '' ) {
      update_post_meta( $article_id, 'outlet', $_POST['article_outlet'] );
    }

    if ( isset( $_POST['article_arch_file'] ) && $_POST['article_arch_file'] != '' ) {
      update_post_meta( $article_id, 'arch_file', $_POST['article_arch_file'] );
    }

    if ( isset( $_POST['article_arch_filetype'] ) && $_POST['article_arch_filetype'] != '' ) {
      update_post_meta( $article_id, 'arch_filetype', $_POST['article_arch_filetype'] );
    }

    if ( isset( $_POST['article_excerpt'] ) && $_POST['article_excerpt'] != '' ) {
      update_post_meta( $article_id, 'excerpt', $_POST['article_excerpt'] );
    }
  }
}


?>
