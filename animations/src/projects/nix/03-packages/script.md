Hey there!

We've talked about how Nix can manage packages in a previous video and even how to
consume those packages using Nix Flakes, but how do you go about creating a _new_
package? Today we're going to learn about the foundational tooling for building
packages in Nix and we will also learn about several of the abstractions that exist
to make the process easier.

In order to build something in Nix we need to use the built-in `derivation` function.
This function allows us to specify a name for our build result, the outputs that will
be created, and a program that will perform the build steps. In the simplest case, we
can use the `/bin/sh` program to execute a basic shell script. If the builder program
needs some arguments passed to it, they can be supplied with `args`.

With a derivation declared, we can build the package using the Nix CLI:
`nix build -f ./example.nix`. Running this command will evaluate our Nix expression
and Nix will execute our builder with the given arguments. The resulting build output
now exists in the Nix Store!

The derivation function is the core of creating builds in Nix, but it can be quite
cumbersome to work with. The process of creating packages using `derivation` directly
requires a lot of manual work which can be avoided by using a helper function instead.
Luckily, Nix has been around for a while and lots of people have already worked on
creating helpers for building packages easily. These helpers are built around `stdenv`,
a standard environment available from NixPkgs with the purpose of letting people create
new packages without needing to use `derivation` and orchestrate the entire build
themselves. These helper functions are frequently referred to as "builders" because they
abstract the management of `derivation`'s `builder` program and lifecycle.

The most common builder is `stdenv.mkDerivation`. This builder provides a standard
environment and set of common build phases which can be customized to create new packages.
To do so, we need to call the function and provide some arguments:

- `pname`: The name of the program we are packaging.
- `version`: The version of the program we are packaging.
- `src`: The source code of the program.

These arguments make up the minimum amount of configuration required for packaging a
simple program such as a C project that does not have any dependencies other than
`stdlib`. For more complex packages we need to start customizing dependencies and
build phases. Let's start by adding new dependencies; the `mkDerivation` builder allows
for customization of the different kinds of dependencies that a package may require.
Some dependencies are only necessary during build time, some are only necessary during
run time, and others are needed for both. In addition, dependencies may also only make
sense on either the machine building the package or the machine consuming the package due
to cross-compilation.

Let's start with the simplest case. We can use `buildInputs` to specify dependencies that
are available at both build time and run time.

Then, if we want to begin restricting dependencies to build time only we can use
`nativeBuildInputs`. The "native" part of the name `nativeBuildInputs` refers to the machine
building the package.

There are additional choices for specifying dependencies that will restrict them to
particular parts of the package's lifecycle. These options are less frequently used so we
won't be covering them here today, but more information can be found in the NixPkgs manual.

With dependencies available for the package build, the next thing we often need to do is
define the steps required to build our package. While some packages may not need configuration
due to `mkDerivation`'s defaults, most do. These build steps are contained within phases.

A phase is a set of bash instructions that run in order. `mkDerivation` defines the following
phases by default:

- unpackPhase: where the package source is unpacked from the tarball or zip file it was fetched in
- patchPhase: where custom `.patch` files are applied to the source code
- configurePhase: where the source code is prepared for building, running `./configure` by default
- buildPhase: where the program is build, running `make` by default
- checkPhase: where tests are run to ensure the program works built correctly
- installPhase: where the program and other necessary artifacts are moved into the Nix Store
- fixupPhase: where common modifications for supporting Nix's filesystem layout are made
- installCheckPhase: where a check is performed to ensure that the package was installed correctly
- distributionPhase: where the source code of the built package is optionally added to the package output

Let's try packaging the program `less`, a common utility for viewing large amounts of text. First, we can
call `mkDerivation` with the program name and version of our package. Then, we can get the program's source
code using the `fetchurl` helper. By supplying the url and expected hash of its contents Nix can safely
pull in the tarball reproducibly.

Next we need to handle dependencies. This package requires two dependencies in addition to what is
provided in the standard environment:

- ncurses
- pcre2

In order to build properly, some C programs need to use custom flags for `configure` when it is run
in the `configurePhase`. For `less`, we need to inform it where to find some dependency information:

- `--sysconfdir=/etc`
- `--with-regex=pcre2`

While we could build the package as-is, it is also common to want to add specific patches to the
source code of the program we are building. For `less`, there is a security patch we want to apply.
To do so, we can download the patch with the `fetchpatch` helper and supply those to `mkDerivation`
by supplying a list of `patches`.

Now, you might be wondering where these helpers and packages come from. They are not a part of Nix,
but rather a part of NixPkgs. You can import NixPkgs using flakes like we saw in the last video or,
if you are not using flakes, you can import the channel manually. For this example, we are going to
do the latter: import NixPkgs manually.

Once imported, we can then access the packages and helpers exported from the NixPkgs repository.

With all of this done, we can now build our package by running `nix build -f ./less.nix`.

---

Before we move on to some of the other builders that NixPkgs provides, let's take a moment to talk
about package hygiene. There are some common quality of life improvements that package maintainers
should make when working on Nix packages.

First and foremost, setting `meta` properties. These values are used to inform users what this package
is, where to find more information on it, what license it uses, what binary should be executed, who
maintains it, what platforms the package is available on, and more. These properties are important to
ensure that people who are using your package can do so without issue. Let's take a look at some of
the most common `meta` properties:

- `description`: A short description of the package.
- `homepage`: The URL to the package's homepage.
- `license`: The license of the package.
- `maintainers`: A list of maintainers for the package.
- `platforms`: The platforms the package is available on.
- `mainProgram`: The binary that should be executed when the package is run.
- `broken`: A boolean that indicates if the package is broken.
- `insecure`: A boolean that indicates if the package is insecure.

In addition to `meta` properties, additional properties can be set on the package using the `passthru`
attribute. Attributes added this way are not used for the package build, but are made available on the
Nix package object itself. One useful passthrough item is `passthru.tests`. Tests can be created here to
verify that the Nix package is operating as expected. We won't be covering the topic of NixOS Tests in
this video, but it is important to know that they are available.

It is also common to declare packages as a function that takes an attribute set of dependencies. This
is used with the `callPackage` helper which allows consumers of your package to easily override these
dependencies as necessary.

---

Moving on from `stdenv.mkDerivation`, let's take a look at one of the other builders in NixPkgs:
`buildRustPackage`. As the name suggests, we can use this builder to build programs written in the Rust
programming language. To do so, we use `rustPlatform.buildRustPackage` in place of `mkDerivation`.
It's important to note that `buildRustPackage` is built on top of `mkDerivation` so most of the things
we learned in the last sections still apply.

Let's try packaging `ripgrep` as an example. To start, we specify the name, version, and source just
like before. This time we are using the `fetchFromGitHub` helper to fetch source code.

Then, instead of specifying custom build steps we will let the Rust builder take care of building the
package entirely. We _can_ customize these steps if necessary, but you will find that most customized
builders don't need additional modification.

Finally, instead of specifying dependencies on Rust libraries ourselves, we will instead let the Rust
builder read the source code's `Cargo.lock` file and pull dependencies automatically. But, in order to
do so, we need to specify `cargoHash`. This hash can be found by first using the value `lib.fakeHash`,
running the build, and then copying the resulting hash in the build's error output.

With everything configured, we can build our Rust package by running `nix build -f ./ripgrep.nix`.

---

Okay, one last example. This time let's take a look at `buildGoModule`, a helper for building programs
written in Go. This builder works similarly to `buildRustPackage`. For this example, let's try packaging
the program `pet`.

Like before, we specify the name, version, and source of the program. Then, in order to handle Go
dependencies we need to specify a `vendorHash`. We can use the same trick as before of setting this
value to `lib.fakeHash` first, running a build, and then copying the calculated hash from the build's
error output.

Once done, the package can be built using `nix build -f ./pet.nix`.

---

And that's packaging in Nix! Or, at least, the basics of it. There are many other builders provided
by NixPkgs which are each good at doing different things. Builders such as `runCommand` are good at doing
one-shot build/installs for trivial packages. Others like `writeShellApplication` make it easy to turn
a shell script into a portable application with dependencies in-tact. Many additional language ecosystems
have builders defined in addition to the ones we saw today, such as `buildNpmPackage`, `buildPythonPackage`,
and more. For more information about these builders and how to configure them, take a look at the NixPkgs
manual.
