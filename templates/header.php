<?php use Roots\Sage\Nav; ?>

<header class="banner" role="banner">
  <!-- Temporary hiring banner -->
  <div style="padding-top: 10px; padding-bottom: 10px; min-height: 10px; margin-bottom: -20px; color: rgb(255, 255, 255); background-color: rgb(189, 28, 43);" class="navbar navbar-default navbar-static-top">
    <div class="container">
      <span>We're hiring <a href="https://hypothes.is/jobs/#developer" style="color: rgb(255, 255, 255); text-decoration: underline;">developers</a> and <a href="https://hypothes.is/jobs/#designer" style="color: rgb(255, 255, 255); text-decoration: underline;">designers</a>.</span>
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

        <ul class="nav navbar-nav pull-right login">
          <li><a href="https://hypothes.is/login">Login</a></li>
          <li><a href="https://hypothes.is/register">Signup</a></li>
        </ul>
      </nav>
    </div>
  </div>
</header>
