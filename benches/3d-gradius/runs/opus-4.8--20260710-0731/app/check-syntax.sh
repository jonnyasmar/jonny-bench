#!/bin/sh
# node --check parses .js as a *script*, which silently accepts some broken
# module code. Copying to .mjs forces real ES-module parsing.
set -e
tmp=$(mktemp -d)
fail=0
for f in src/*.js; do
  cp "$f" "$tmp/$(basename "$f" .js).mjs"
done
for m in "$tmp"/*.mjs; do
  if node --check "$m" 2>/tmp/err; then
    echo "ok   $(basename "$m" .mjs).js"
  else
    echo "FAIL $(basename "$m" .mjs).js"; sed -n '1,4p' /tmp/err; fail=1
  fi
done
rm -rf "$tmp"
exit $fail
