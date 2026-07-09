#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="$repo_dir/skills/jonny-bench"
link_dir="$HOME/.claude/skills"
link="$link_dir/jonny-bench"

mkdir -p "$link_dir"

if [ -L "$link" ]; then
  current="$(readlink "$link")"
  if [ "$current" = "$target" ]; then
    echo "jonny-bench skill already installed: $link -> $target"
    exit 0
  fi
  rm "$link"
elif [ -e "$link" ]; then
  echo "Refusing to clobber existing non-symlink path: $link" >&2
  exit 1
fi

ln -s "$target" "$link"
echo "Installed jonny-bench skill: $link -> $target"
