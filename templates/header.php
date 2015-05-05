<!-- Temporary hiring banner -->
<header class="banner hiring" role="banner">
  <div class="container">
    <span>We're hiring <a href="https://hypothes.is/jobs/#developer">developers</a> and <a href="https://hypothes.is/jobs/#designer">designers</a>.</span>
  </div>
</header>
<!-- / Temporary hiring banner -->

<header class="navbar navbar-default navbar-static-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only"><?= __('Toggle navigation', 'sage'); ?></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?= esc_url(home_url('/')); ?>">Hypothes<span class="red">.</span>is</a>
    </div>
    <nav class="collapse navbar-collapse" role="navigation">
      <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav navbar-nav']);
      endif;
      ?>
      <ul class="nav navbar-nav pull-right login">
        <li><a href="https://hypothes.is/login">Login</a></li>
          <li><a href="https://hypothes.is/register">Sign up</a></li>
      </ul>
    </nav>
  </div>
</header>
