#!/usr/bin/env python

# The hypothesis-shared/ directory contains styles,
# fonts and templates that are shared between the Hypothesis site
# and the WordPress blog.
#
# This script creates an updated build of the shared styles,
# fonts and templates from a given checkout if the github.com/hypothesis/h
# Git repository.
#
# To update the styles in the WordPress theme to match the current
# version of the site:
#
#  1. Make any changes to the styles, scripts etc. in the hypothesis/h
#     repo
#  2. Run ./update-hypothesis-shared.py <path to hypothesis/h repo clone>
#  3. Run 'gulp' in the root directory of this repo
#  4. Test changes to WordPress theme and commit

from argparse import ArgumentParser
from os.path import basename, splitext
import shutil
import StringIO
import subprocess
import jinja2
import os


class FakeSession(object):
    def pop_flash(self, key):
        return []


class FakeRequest(object):
    def __init__(self):
        self.session = FakeSession()


class TemplateLoader(jinja2.FileSystemLoader):
    def get_source(self, environment, template):
        # templates in the H repo use 'package:path'
        # syntax, strip the package
        template_path = template.replace('h:','')
        return super(TemplateLoader, self).get_source(environment, template_path)


def compile_template(h_repo, template_name, output_path):
    file_loader = TemplateLoader(h_repo)
    env = jinja2.Environment(loader=file_loader)
    template = env.get_template(template_name)
    output_file = open(output_path, 'w')
    fake_request = FakeRequest()
    output_file.write(template.render(
        request=fake_request
    ))


out_dir = 'hypothesis-shared'

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('h_repo', help='Path to hypothesis/h repository clone')
    args = parser.parse_args()

    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    # compile styles
    styles_dir = args.h_repo + '/h/static/styles'
    subprocess.check_call(['sass', '-I', styles_dir,
                           './shared.scss', out_dir + '/shared.scss'])

    # compile templates
    templates = ['templates/includes/header.html.jinja2',
                 'templates/includes/footer.html.jinja2']
    for template in templates:
        path, _ = splitext(template)
        compile_template(args.h_repo + '/h', template, out_dir + '/' + basename(path))

    # copy scripts and icon fonts
    other_files = [
      'h/static/scripts/dropdown-menu.js',
      'h/static/styles/vendor/fonts/h.woff',
      'h/static/styles/vendor/icomoon.css',
    ]
    for file_path in other_files:
        shutil.copy(args.h_repo + '/' + file_path, out_dir)

    # compile scripts
    out_file = open(out_dir + '/shared.js', 'w')
    browserify_proc = subprocess.Popen(['browserify', 'shared.js'], stdout=subprocess.PIPE)
    stdout, stderr = browserify_proc.communicate()
    out_file.write('/* jshint ignore:start */\n')
    out_file.write(stdout)
