<?php
/**
 * The Template for displaying all single posts
 *
 * Please see /external/starkers-utilities.php for info on get_template_parts()
 *
 * @package 	WordPress
 * @subpackage 	Starkers
 * @since 		Starkers 4.0
 */
?>
<?php get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); ?>

<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

<article>
	<h1><?php the_title(); ?></h2>
	<time datetime="<?php the_time( 'Y-m-d' ); ?>">Posted by <strong><?php the_author(); ?>,</strong> <?php the_time('F jS, Y'); ?></time>
	<?php the_content(); ?>

	<?php if ( get_the_author_meta( 'description' ) ) : ?>
	<h3>About <?php echo get_the_author() ; ?></h3>
	<?php the_author_meta( 'description' ); ?>
	<?php endif; ?>
</article>
<?php endwhile; ?>

<?php get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer' ) ); ?>
