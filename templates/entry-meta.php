<time class="updated" datetime="<?= get_the_time('c'); ?>"><?= get_the_date(); ?></time>
<p class="byline author vcard"><?= __('By', 'sage'); ?> <a href="https://hypothes.is/blog/?author=<?= get_the_author_meta('ID'); ?>" rel="author" class="fn"><?= get_the_author(); ?></a></p>
