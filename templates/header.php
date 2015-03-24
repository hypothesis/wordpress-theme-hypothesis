<?php use Roots\Sage\Nav; ?>

<header class="banner" role="banner">
  <!-- Temporary hiring banner -->
  <div style="padding-top: 10px; padding-bottom: 10px; min-height: 10px; margin-bottom: -20px; color: rgb(255, 255, 255); background-color: rgb(189, 28, 43);" class="navbar navbar-default navbar-static-top">
    <div class="container">
      <span>We're hiring for <a href="https://hypothes.is/jobs/#developer" style="color: rgb(255, 255, 255); text-decoration: underline;">front-end developer</a> and <a href="https://hypothes.is/jobs/#designer" style="color: rgb(255, 255, 255); text-decoration: underline;">designer</a> positions.</span>
    </div>
  </div>
  <!-- / Temporary hiring banner -->

  <div class="navbar navbar-default navbar-static-top">
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
          wp_nav_menu(['theme_location' => 'primary_navigation', 'walker' => new Nav\SageNavWalker(), 'menu_class' => 'nav navbar-nav']);
        endif;
        ?>

        <!-- Social Media -->
        <div class="social-media pull-right">
            <a href="https://github.com/hypothesis"><i class="fa fa-github"></i></a>
            <a href="https://twitter.com/hypothes_is"><i class="fa fa-twitter"></i></a>
            <a href="http://hypothes.is/feed/"><i class="fa fa-rss"></i></a>
        </div>
      </nav>
    </div>
  </div>
</header>
