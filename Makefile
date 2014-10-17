npmbin := $(shell npm bin)
scssbin := $(npmbin)/node-sass
stylein := $(wildcard stylesheets/*.scss)
styleout := $(patsubst %.scss, %.css, $(stylein))

# Build all the scss files.
.PHONY: build clean zip
build: $(styleout)

$(styleout): $(stylein)

%.css: %.scss $(scssbin)
	$(scssbin) $< $@

$(scssbin):
	npm install

clean:
	find stylesheets/ -iname \*.css -delete

zip: build
	rm -f hypothetheme-$(shell json version < package.json).zip
	zip -r hypothetheme-$(shell json version < package.json).zip . -x \
		\*.scss \*.rb \*.json .\* \
		node_modules\*
