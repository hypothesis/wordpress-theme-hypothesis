# This file no longer works but it would be good to put a script
# like this together for the new theme... so not deleting it for
# now.

npmbin := $(shell npm bin)
scssbin := $(npmbin)/node-sass
stylein := $(wildcard stylesheets/*.scss)
styleout := $(patsubst %.scss, %.css, $(stylein))
version := $(shell node -pe "require('./package.json').version")

# Build all the scss files.
.PHONY: build clean zip
build: $(styleout) style.css

$(styleout): $(stylein)

%.css: %.scss $(scssbin)
	$(scssbin) $< $@

$(scssbin):
	npm install

style.css: _style.css package.json
	sed -e s/VERSION/$(version)/ \
		_style.css > style.css

clean:
	rm -f style.css
	find stylesheets/ -iname \*.css -delete

zip: build
	rm -f hypothesis-$(version).zip
	zip -r hypothesis-$(version).zip . -x \
		\*.scss \*.rb \*.json .\* _style.css \
		node_modules\*
