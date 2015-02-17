Hypothesis Wordpress Theme
==========================

Our own shiny custom theme, based on [roots.io](http://roots.io/). Be sure to check there for more detailed documentation about the template theme.

Installation
------------

This is just a wordpress theme, so first you'll need to actully get Wordpress
up and running. You'll need MySQL, PHP 5.4.x and latest Nodejs. Download the
latest Wordpress bundle from:

http://wordpress.org/download/

There are tons of good OS-specific instructions for getting started with local development and wordpress.

Once wordpress is setup and running locally, cd into the theme directory.

    $ cd path-to/wp-content/themes

Clone the repo:

    $ git@github.com:hypothesis/wordpress-theme-hypothesis.git

Install the required dependencies:

    $ npm install

Build the assets:

    $ grunt dev

Then to run Wordpress ensure MySQL is running and cd back into the root
directory. Use the following instructions to allow Wordpress to be run using
the built in PHP server.

http://ripeworks.com/run-wordpress-locally-using-phps-buily-in-web-server/

Then starting the server should be as simple as:

    $ php -S localhost:9393 -t /path/to/wordpress router.php

Visit http://localhost:9393 in your browser and follow the installation
instructions. Once Wordpress is installed, you just need to change your theme
in the admin panel to use the hypothetheme.

To upload to WordPress, first build a zip file:

    $ make zip

Then upload the zip file to WordPress as usual.
