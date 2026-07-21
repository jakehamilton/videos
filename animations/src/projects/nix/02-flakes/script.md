Hey there! Nix Flakes are really cool.

If you've used Nix for some time, you've probably heard about them. They're a very useful feature
with a bit of a confusing history. Well, don't worry, today we're going to dig into Flakes and
understand what they are and how they work.

Nix Flakes aim to solve two problems experienced when working with Nix:

- Dependency locking to ensure that builds are reproducible.
- A standardized way to define and share Nix projects.

Historically, Nix has managed package sets and dependencies of other Nix projects using Channels.
Channels work by providing a path mapping to a local copy of a repository like NixPkgs. However,
these local copies of projects can (and will) be different between machines. Because of this,
running a build on one machine won't always result in the same output as another machine.
Instead, Nix Flakes provide a replacement for channels. With Flakes, we can specify inputs like
NixPkgs and these dependencies are then locked to specific versions stored in a `flake.lock` file.
Now, running a build on one machine will result in the same output as on another machine.

Another common pain point has been sharing and consuming Nix expressions from different projects.
Imagine you want to pull in a package that someone else has written. Previously,
the only solution for this was a convoluted `import` / `fetchgit` combination that was difficult to
write, read, and maintain. Rather than importing raw paths within fetched artifacts, Nix Flakes
give us an official schema to consume Nix expressions.

How do you get started using Nix Flakes? Nix Flakes aren't enabled by default in Nix yet, but that
doesn't mean you can't use them today. Lots of projects already make heavy use of Nix Flakes and
you can join them by setting `experimental-features = nix-command flakes` in your `nix.conf` file.
For plain Nix installs you'll find that in `/etc/nix/nix.conf` and for NixOS users you can set
`nix.settings.experimental-features = "nix-command flakes"` in your system config.

With Flakes enabled, you can create a new Flake using the command `nix flake init`. This will give
you a new `flake.nix` file in your current directory. Adding any dependencies and running nix commands
on your flake will lock your inputs and store their version info in a `flake.lock` file. Now it's time
to define your Flake in `flake.nix`.

A `flake.nix` has two important parts:

- Inputs
- Outputs

The inputs of a Flake specify what dependencies are required for this Flake. For example, `nixpkgs`
can be specified to pull in the package set. You aren't limited to just NixPkgs and GitHub, though,
you can use flakes from anywhere including a local path, any git forge, or a tarball from the web.

Flake outputs define the available attributes that can be consumed by users. Flake outputs are defined
as a function that takes in the Flake's inputs and produces an attribute set of exported items. The
official Flake schema defines some well-known outputs, though additional outputs can be created. The
ones we'll talk about are:

- packages
- devShells
- checks
- nixosConfigurations
- nixosModules

Note that these aren't the only outputs Nix defines, they're just the ones we're covering today.

Packages are programs like Firefox or libraries like OpenSSL, devShells are development environments
created using `mkShell`, and checks are builds that assert the validity of a package. nixosConfigurations
and nixosModules declare NixOS builds and reusable configuration for NixOS systems.

Packages, devShells, and checks must be defined for a specific system type such as `x86_64-linux` in
order to be consumed. Any number of packages, devShells, and checks can be created with one caveat:
the attribute set cannot be nested. `nixosConfigurations` and `nixosModules` may be defined directly
on the outputs of a flake.

To use outputs from another Flake, first add that Flake as an input. Then, the newly added `input`
will be available in your `outputs` function.

If you're ever wondering what outputs a Nix Flake has or want to explore it without looking directly at
the code, you can use the command `nix flake show`. This will display all of the outputs defined on
a Flake and a description of what they are if they are a well-known output defined by Nix. Some Flakes
will export things that aren't defined by Nix and that's okay. You can still use them, but `nix flake show`
won't be able to give them a description.

Once your Flake outputs are defined, you can work with them using the `nix` commands. When working with
Flakes, you need to tell Nix which Flake you want to target. This is done with a Flake URI, using the
following format: a protocol (such as `github`), a `hash`, followed by the name of the output.

To build a package from a Flake in the current directory, you can run `nix build .#my-package`. Since
the `build` command builds packages, we don't have to specify the full path to the output; only the
name is required.

Entering development environments can be done with the command `nix develop`. For example, if you wanted
to enter a shell defined in a Flake on a GitHub repository, you would run
`nix develop github:user/repo#my-shell`.

Checks defined on a Flake can be evaluated by running `nix check`. Similar to the previous commands, you
can specify the Flake and a specific check to run. However, if you only specify a Flake then all checks
will be evaluated.

This standard interface for importing and exporting things from Nix projects makes things a lot easier
than the alternative and avoids reproducibility issues thanks to how Nix Flakes lock inputs. If you haven't
already, I recommend giving them a try!
