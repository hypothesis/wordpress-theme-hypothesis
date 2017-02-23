<?php
function hy_search_page_url() {
  if(get_option('show_on_front') === 'page') {
    return get_permalink(get_option('page_for_posts'));
  } else {
    return home_url('/');
  }
}
?>
<form role="search" method="get" class="search-form form-inline" action="<?= esc_url(hy_search_page_url()); ?>">
  <label class="sr-only"><?php _e('Search for:', 'sage'); ?></label>
  <div class="input-group">
    <input type="search" value="<?= get_search_query(); ?>" name="s" class="search-field form-control" placeholder="<?php _e('Search', 'sage'); ?> <?php bloginfo('name'); ?>" required>
    <span class="input-group-btn">
      <button type="submit" class="search-submit btn btn-default"><?php _e('Search', 'sage'); ?></button>
    </span>
  </div>
</form>
