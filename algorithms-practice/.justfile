set shell := ["bash", "-o", "errexit", "-o", "nounset", "-o", "pipefail", "-c"]

# Choose a task. Only includes tasks that don't take arguments.
default:
    @just --choose --unsorted

# Display a list of all tasks.
help:
    @just --list --justfile {{ justfile() }} --unsorted

# Reload direnv
reload:
    #!/usr/bin/env bash
    set -o errexit
    set -o nounset
    set -o pipefail

    direnv reload
    nix-direnv-reload

# Format, lint, and fix all source code
format:
    treefmt