{
  description = "Algorithms Practice";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachSystem
    (with flake-utils.lib.system; [x86_64-linux x86_64-darwin]) (system: let
      pkgs = import nixpkgs {inherit system;};
      # Taken from here:
      # https://github.com/numtide/devshell/blob/83cb93d6d063ad290beee669f4badf9914cc16ec/nix/mkNakedShell.nix#L4
      #
      # Changes:
      # - I also unset IN_NIX_SHELL as it's redundant since I use direnv
      mkNakedShell = {
        name,
        # A path to a buildEnv that will be loaded by the shell.
        # We assume that the buildEnv contains an ./env.bash script.
        profile,
        pkgs,
      }: let
        bashPath = "${pkgs.bashInteractive}/bin/bash";
        stdenv = pkgs.writeTextFile {
          name = "naked-stdenv";
          destination = "/setup";
          text = ''
            # Fix for `nix develop`
            : ''${outputs:=out}

            runHook() {
              eval "$shellHook"
              unset runHook
            }
          '';
        };
      in
        derivation {
          inherit name;
          inherit (pkgs) system;

          # `nix develop` actually checks and uses builder. And it must be bash.
          builder = bashPath;

          # Bring in the dependencies on `nix-build`
          args = ["-ec" "${pkgs.coreutils-full}/bin/ln -s ${profile} $out; exit 0"];

          # $stdenv/setup is loaded by nix-shell during startup.
          # https://github.com/nixos/nix/blob/377345e26f1ac4bbc87bb21debcc52a1d03230aa/src/nix-build/nix-build.cc#L429-L432
          inherit stdenv;

          XDG_DATA_DIRS = "${profile}/share";
          PATH = "${profile}/bin";

          # The shellHook is loaded directly by `nix develop`. But nix-shell
          # requires that other trampoline.
          shellHook = ''
            # Remove all the unnecessary noise that is set by the build env
            unset NIX_BUILD_TOP NIX_BUILD_CORES NIX_STORE
            unset TEMP TEMPDIR TMP TMPDIR
            # $name variable is preserved to keep it compatible with pure shell https://github.com/sindresorhus/pure/blob/47c0c881f0e7cfdb5eaccd335f52ad17b897c060/pure.zsh#L235
            unset builder out shellHook stdenv system
            # Flakes stuff
            unset dontAddDisableDepTrack outputs
            # Redundant since I use direnv
            unset IN_NIX_SHELL

            # For `nix develop`. We get /noshell on Linux and /sbin/nologin on macOS.
            if [[ "$SHELL" == "/noshell" || "$SHELL" == "/sbin/nologin" ]]; then
              export SHELL=${bashPath}
            fi
          '';
        };

      profile = pkgs.symlinkJoin {
        name = "tools";
        paths = with pkgs; [
          # languages
          bashInteractive
          nodejs
          typescript

          # formatters
          treefmt
          shfmt
          deadnix
          statix
          alejandra

          # version control
          git
          lefthook

          # for the Nix IDE vscode extension
          nil

          # misc.
          just
          coreutils
        ];
      };
    in {
      devShells.default = mkNakedShell {
        name = "devShell";
        inherit profile pkgs;
      };
    });
}
