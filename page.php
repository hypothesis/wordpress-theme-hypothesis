<div class="col-sm-12 col-md-10 col-lg-8 hypo-space-at-bottom">
<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php get_template_part('templates/content', 'page'); ?>
<?php endwhile; ?>
</div>

