npmbin := $(shell npm bin)
scssbin := $(npmbin)/node-sass
stylein := $(wildcard stylesheets/*.scss)
styleout := $(patsubst %.scss, %.css, $(stylein))

# Build all the scss files.
.PHONY: build
build: $(styleout)

$(styleout): $(stylein)

%.css: %.scss $(scssbin)
	$(scssbin) $< $@

$(scssbin):
	npm install
