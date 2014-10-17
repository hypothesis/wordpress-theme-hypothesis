npmbin := $(shell npm bin)
scssbin := $(npmbin)/node-sass
stylein := $(wildcard stylesheets/*.scss)
styleout := $(patsubst %.scss, %.css, $(stylein))

# Build all the scss files.
.PHONY: build clean zip
build: $(styleout) style.css

$(styleout): $(stylein)

%.css: %.scss $(scssbin)
	$(scssbin) $< $@

$(scssbin):
	npm install

style.css: _style.css
	sed -e s/VERSION/$(shell json version < package.json)/ \
		_style.css > style.css

clean:
	rm -f style.css
	find stylesheets/ -iname \*.css -delete

zip: build
	rm -f hypothetheme-$(shell json version < package.json).zip
	zip -r hypothetheme-$(shell json version < package.json).zip . -x \
		\*.scss \*.rb \*.json .\* _style.css \
		node_modules\*
