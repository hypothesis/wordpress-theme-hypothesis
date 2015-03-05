<?php
/*
Template Name: Full Width Page
*/
?>

<div class="container hypo-space-at-bottom">
<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php get_template_part('templates/content', 'page'); ?>
<?php endwhile; ?>
</div>
