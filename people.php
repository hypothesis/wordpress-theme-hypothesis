<?php
/*
Plugin Name: People
Description: Declares a plugin that will create a custom post type displaying people.
Version: 1.0
Author: Jehan Tremback
License: GPLv2
*/
add_action( 'init', 'create_person' );


function create_person() {
  register_post_type( 'people',
    array(
      'labels' => array(
        'name' => 'People',
        'singular_name' => 'Person',
        'add_new' => 'Add New',
        'add_new_item' => 'Add New Person',
        'edit' => 'Edit',
        'edit_item' => 'Edit Person',
        'new_item' => 'New Person',
        'view' => 'View',
        'view_item' => 'View Person',
        'search_items' => 'Search People',
        'not_found' => 'No People found',
        'not_found_in_trash' => 'No People found in Trash',
        'parent' => 'Parent Person'
      ),
      'public' => true,
      'menu_position' => 15,
      'supports' => array( 'title', 'thumbnail' ),
      'taxonomies' => array( 'category' ),
      'has_archive' => false
    )
  );
}

add_action( 'admin_init', 'my_admin' );




function my_admin() {
  add_meta_box( 'person_meta_box',
    'Person Details',
    'display_person_meta_box',
    'people', 'normal', 'high'
  );
}

function display_person_meta_box( $person ) {
  // Retrieve current name of the Director and Movie Rating based on review ID
  $tagline = esc_html( get_post_meta( $person->ID, 'tagline', true ) );

  $twitter = esc_html( get_post_meta( $person->ID, 'twitter', true ) );

  $bio = esc_html( get_post_meta( $person->ID, 'bio', true ) );

  ?>
  <table>
    <tr>
      <td style="width: 100%">Tagline</td>
      <td><input type="text" size="80" name="person_tagline" value="<?php echo $tagline; ?>" /></td>
    </tr>

    <tr>
      <td style="width: 100%">Twitter</td>
      <td><input type="text" size="80" name="person_twitter" value="<?php echo $twitter; ?>" /></td>
    </tr>

    <tr>
      <td style="width: 100%">Bio</td>
      <td><textarea rows="20" cols="75" name="person_bio"><?php echo $bio; ?></textarea></td>
    </tr>

  </table>
  <?php } 

add_action( 'save_post', 'add_person_fields', 10, 2 );


function add_person_fields( $person_id, $person ) {
  // Check post type for movie reviews
  if ( $person->post_type == 'people' ) {
    // Store data in post meta table if present in post data

    if ( isset( $_POST['person_tagline'] ) && $_POST['person_tagline'] != '' ) {
      update_post_meta( $person_id, 'tagline', $_POST['person_tagline'] );
    }

    if ( isset( $_POST['person_twitter'] ) && $_POST['person_twitter'] != '' ) {
      update_post_meta( $person_id, 'twitter', $_POST['person_twitter'] );
    }

    if ( isset( $_POST['person_bio'] ) && $_POST['person_bio'] != '' ) {
      update_post_meta( $person_id, 'bio', $_POST['person_bio'] );
    }
  }
}


?>
