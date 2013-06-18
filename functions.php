<?php
	/**
	 * Starkers functions and definitions
	 *
	 * For more information on hooks, actions, and filters, see http://codex.wordpress.org/Plugin_API.
	 *
 	 * @package 	WordPress
 	 * @subpackage 	Starkers
 	 * @since 		Starkers 4.0
	 */

	/* ========================================================================================================================
	
	Required external files
	
	======================================================================================================================== */

	require_once( 'external/starkers-utilities.php' );

	/* ========================================================================================================================
	
	Theme specific settings

	Uncomment register_nav_menus to enable a single menu with the title of "Primary Navigation" in your theme
	
	======================================================================================================================== */

	add_theme_support( 'menus' );

	add_theme_support('post-thumbnails');
	
	// register_nav_menus(array('primary' => 'Primary Navigation'));

	/* ========================================================================================================================
	
	Actions and Filters
	
	======================================================================================================================== */

	add_action( 'wp_enqueue_scripts', 'script_enqueuer' );

	add_filter( 'body_class', 'add_slug_to_body_class' );

	/* ========================================================================================================================
	
	Custom Post Types - include custom post types and taxonimies here e.g.

	e.g. require_once( 'custom-post-types/your-custom-post-type.php' );
	
	======================================================================================================================== */



	/* ========================================================================================================================
	
	Comments
	
	======================================================================================================================== */

	/**
	 * Custom callback for outputting comments 
	 *
	 * @return void
	 * @author Keir Whitaker
	 */
	function starkers_comment( $comment, $args, $depth ) {
		$GLOBALS['comment'] = $comment; 
		?>
		<?php if ( $comment->comment_approved == '1' ): ?>	
		<li>
			<article id="comment-<?php comment_ID() ?>">
				<?php echo get_avatar( $comment ); ?>
				<h4><?php comment_author_link() ?></h4>
				<time><a href="#comment-<?php comment_ID() ?>" pubdate><?php comment_date() ?> at <?php comment_time() ?></a></time>
				<?php comment_text() ?>
			</article>
		<?php endif;
	}

	/* ========================================================================================================================
	
	Remove Thumbnail Dimensions
	
	======================================================================================================================== */

	/**
	 * Remove hardcoded width and height on thumbnails
	 *
	 * @return void
	 */

	add_filter( 'post_thumbnail_html', 'remove_thumbnail_dimensions', 10, 3 );

	function remove_thumbnail_dimensions( $html, $post_id, $post_image_id ) {
	    $html = preg_replace( '/(width|height)=\"\d*\"\s/', "", $html );
	    return $html;
	}

	/* ========================================================================================================================
	
	Excerpt
	
	======================================================================================================================== */

	function new_excerpt_more( $more ) {
		return '...';
	}
	add_filter('excerpt_more', 'new_excerpt_more');

	function get_excerpt($count){
	  $excerpt = get_the_content();
	  $excerpt = strip_tags($excerpt);
	  $excerpt = substr($excerpt, 0, $count);
	  $excerpt = $excerpt.'...';
	  return $excerpt;
	}

	function that_excerpt($count){
	  $excerpt = the_content();
	  $excerpt = strip_tags($excerpt);
	  $excerpt = substr($excerpt, 0, $count);
	  $excerpt = $excerpt.'...';
	  return $excerpt;
	}






	/* ========================================================================================================================
	
	Script Loading
	
	======================================================================================================================== */

	/**
	 * What the name says
	 *
	 * @return void
	 */

	if (!function_exists('script_enqueuer')) {  
	    function script_enqueuer() {  
	        if (!is_admin()) {  
	        wp_deregister_script( 'jquery' );

	        wp_enqueue_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js','','',true);

	        wp_enqueue_script('jqvalidate', 'https://ajax.aspnetcdn.com/ajax/jquery.validate/1.8.1/jquery.validate.js','','',true);

	        wp_enqueue_script('jqvalidate_additional', 'https://ajax.aspnetcdn.com/ajax/jquery.validate/1.8.1/additional-methods.js','','',true);

	        wp_enqueue_script('typekit', 'https://use.typekit.com/bpz6nxe.js','','',false);

	        wp_enqueue_script('runonload', get_template_directory_uri().'/js/runonload.js','','',false);

	        wp_enqueue_script('plugins', get_template_directory_uri().'/js/plugins.js','','',true);

	        wp_enqueue_script('scripts', get_template_directory_uri().'/js/scripts.js','','',true);

      		wp_register_style( 'screen', get_template_directory_uri().'/style.css', '', '', 'screen' );

                wp_enqueue_style( 'screen','','','',true);

	        }  
	    }  
	}  

	include 'people.php';
	include 'press.php';

	include 'layout_shortcodes.php';
	include 'loop_shortcodes.php';
