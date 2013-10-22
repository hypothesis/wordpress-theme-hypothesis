<?php
/*
Template Name: Events
*/
?>
<?php get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); ?>

<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
<article>
  <?php the_content(); ?>
  
  <?php if(get_field('hyp_event')): ?> 
     <ul>
     <?php while(has_sub_field('hyp_event')): ?>
       <li>
         <h3 class="noborder"><?php the_sub_field('hyp_event_title'); ?></h3>
         <span class="eventdate"><?php the_sub_field('hyp_event_date'); ?></span>
         <a href="<?php the_sub_field('hyp_event_link_url'); ?>" title="<?php the_sub_field('hyp_event_link_title'); ?>" class="strong">
		   <?php the_sub_field('hyp_event_link_title'); ?>
         </a>
         <div class="em">
           <?php the_sub_field('hyp_event_summary'); ?>
         </div>
       </li>
     <?php endwhile; ?>
     </ul>
  <?php endif; ?>
  
  
</article>
<div class="bigspacer"></div>
<?php endwhile; ?>

<?php get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer' ) ); ?>