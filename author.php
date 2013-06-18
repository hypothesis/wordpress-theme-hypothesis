<?php
/**
 * The template for displaying Author Archive pages
 *
 * Please see /external/starkers-utilities.php for info on get_template_parts()
 *
 * @package 	WordPress
 * @subpackage 	Starkers
 * @since 		Starkers 4.0
 */
?>
<?php get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); ?>

<?php if ( have_posts() ): the_post(); ?>


<article>
<h2><?php echo get_the_author() ; ?>'s Archives<span class="redtext">:</span></h2>
<?php rewind_posts(); while ( have_posts() ) : the_post(); ?>
  <a class="nolink" href="<?php esc_url( the_permalink() ); ?>" title="Permalink to <?php the_title(); ?>" rel="bookmark">
  <h2 style="color: #BD5862;"><?php the_title(); ?></h2>
  <time datetime="<?php the_time( 'Y-m-d' ); ?>">Posted by <strong><?php the_author(); ?>,</strong> <?php the_time('F jS, Y'); ?></time>
  <?php the_excerpt('...'); ?>
  </a>
<?php endwhile; ?>
</article>

<?php else: ?>
<h2>No posts to display for <?php echo get_the_author() ; ?></h2>	
<?php endif; ?>

<?php get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer' ) ); ?>
