# Venus daemon

This is a step-by-step guide for installing and running a Filecoin node connected to the testnet on your local machine.

## Minimal requirements

To run a venus node, your computer must have:

- macOS or Linux installed. Windows is not yet supported.
- 8-core CPU and 32 GiB RAM. Models with support for _Intel SHA Extensions_ (AMD since Zen microarchitecture, or Intel since Ice Lake) will significantly speed things up.
- Enough space to store the current Lotus chain (preferably on an SSD storage medium). The chain grows at approximately 12 GiB per week. The chain can be also [synced from trusted state snapshots and compacted](../guide/Chain.md).

#### Installing Go

The build process for `venus` requires [Go](https://golang.org/doc/install) >= v1.16.

> Installing Go for the first time? We recommend [this tutorial](https://www.ardanlabs.com/blog/2016/05/installing-go-and-your-workspace.html) which includes environment setup.

Due to the use of `cgo` in `venus`, a C compiler is required to build it whether a prebuilt library is being used or it is compiled from source. To use `gcc` (e.g. `export CC=gcc`), v7.4.0 or higher is required.

The build process will download a static library containing the [Filecoin proofs implementation](https://github.com/filecoin-project/rust-fil-proofs) (which is written in Rust).

> **NOTICE:** To build proofs from source, (1) a Rust development environment must be installed and (2) the environment variable `FFI_BUILD_FROM_SOURCE=1` must be set. More information can be found in [filecoin-ffi](https://github.com/filecoin-project/filecoin-ffi).

#### Installing Rustup

Lotus needs [rustup](https://rustup.rs). The easiest way to install it is:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

:::tip
Make sure your `$PATH` variable is correctly configured after the rustup installation so that `cargo` and `rustc` are found in their rustup-configured locations.
:::


#### Install system dependencies

##### Linux

Arch:

```bash
sudo pacman -Syu opencl-icd-loader gcc git bzr jq pkg-config opencl-icd-loader opencl-headers hwloc
```

Ubuntu/Debian:

```bash
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config curl clang build-essential hwloc libhwloc-dev wget -y && sudo apt upgrade -y
```

Fedora:

```bash
sudo dnf -y install gcc make git bzr jq pkgconfig mesa-libOpenCL mesa-libOpenCL-devel opencl-headers ocl-icd ocl-icd-devel clang llvm wget hwloc libhwloc-dev
```

OpenSUSE:

```bash
sudo zypper in gcc git jq make libOpenCL1 opencl-headers ocl-icd-devel clang llvm hwloc && sudo ln -s /usr/lib64/libOpenCL.so.1 /usr/lib64/libOpenCL.so
```

Amazon Linux 2:

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```

##### MacOS

These instructions are specific to macOS. If you are installing Lotus on a Linux distribution, head over to the [Linux section](#linux).

### XCode Command Line Tools

Lotus requires that X-Code CLI tools be installed before building the Lotus binaries.

1. Check if you already have the XCode Command Line Tools installed via the CLI, run:

   ```sh
   xcode-select -p
   ```

   If this command returns a path, you can move on to the [next step](#install-homebrew). Otherwise, to install via the CLI, run:

   ```sh
   xcode-select --install
   ```

1. To update, run:

   ```sh
   sudo rm -rf /Library/Developer/CommandLineTools
   xcode-select --install
   ```

### Install Homebrew

We recommend that MacOS users use [Homebrew](https://brew.sh) to install each of the necessary packages.

1. Use the command `brew install` to install the following packages:

   ```sh
   brew install go bzr jq pkg-config rustup hwloc
   ```

#### Installing dependencies

2. Clone the `venus` git repository and enter it:

   ```sh
    mkdir -p /path/to/filecoin-project
    git clone https://github.com/filecoin-project/venus.git /path/to/filecoin-project/venus
   ```

3. Load all the Git submodules:

    ```sh
    git submodule update --init --recursive
    ```

4. Initialize the build dependencies:

    ```sh
    make deps
    ```

 > **NOTICE:** The first `deps` start up can be **slow**, as very large parameter files are either downloaded or generated locally in `/var/tmp/filecoin-proof-parameters`. Have patience; future runs will be faster.

### Building Filecoin and running tests

1. Build the binary:
    ```sh
    make
    ```

2. Run the unit tests:
    ```sh
    go run ./build test
    ```

3. Optionally, building and tests can be combined:
    ```sh
    go run ./build best
    ```

Other handy build commands include:

```sh
# Check the code for style and correctness issues
go run ./build lint

# Run different categories of tests by toggling their flags
go run ./build test -unit=false -integration=true -functional=true

# Test with a coverage report
go run ./build test -cover

# Test with Go's race-condition instrumentation and warnings (see https://blog.golang.org/race-detector)
go run ./build test -race

# Deps, Lint, Build, Test (any args will be passed to `test`)
go run ./build all
```

> **NOTICE:** Any flag passed to `go run ./build test` (e.g. `-cover`) will be passed on to `go test`.

## Start running Filecoin

1. If `venus` has been run on the system before, remove existing Filecoin repo (**this will delete all previous filecoin data**):
    ```sh
    rm -rf ~/.venus
    ```

2. Start the venus daemon:
    ```sh
    venus daemon
    ```
    
This should return "My peer ID is `<peerID>`", where `<peerID>` is a long [CID](https://github.com/filecoin-project/specs/blob/master/definitions.md#cid) string starting with "Qm".

1. Print a list of bootstrap node addresses:
    ```sh
    venus config bootstrap.addresses
    ```

    
2. Choose any address from the list you just printed, and connect to it (Automatic peer discovery and connection coming soon.):
    ```sh
    venus swarm connect <any-filecoin-node-mulitaddr>
    ```
    
 > **NOTICE:** This can be **slow** the first time. The filecoin node needs a large parameter file for proofs, stored in `/tmp/filecoin-proof-parameters`. It is usually generated by the `deps` build step. If these files are missing they will be regenerated, which can take up to an hour. We are working on a better solution.

3. Check the node's connectivity:
    ```sh
    venus swarm peers                  # list addresses of peers to which you're connected
    ```

The node should now be connected to some peers and will begin downloading and validating the blockchain.


 > **NOTICE:** The daemon is now running indefinitely in its own Terminal (`Ctrl + C` to quit). To run other `venus` commands, open a second Terminal tab or window (`Cmd + T` on Mac)._

_Need help? See [Troubleshooting & FAQ](../guide/Troubleshooting-&-FAQ) or [#fil-dev on Matrix chat](https://riot.im/app/#/room/#fil-dev:matrix.org).

## Wait for chain sync
🎉 Congratulations, you're now connected to Filecoin! The daemon is now busy syncing and validating the existing blockchain, which can take awhile -- hours or even days depending on network age and activity.

During this initial sync time ther will be intense activity on one CPU core. Find out what the current block height is first by visiting the [network stats page](https://stats.testnet.filecoin.io) then observe the nodes syncing progress:
```sh
venus sync status
````

## Viewing network information

There are a few visualisation tools to help users understand what is happening within the Filecoin network, such as the official [network stats](http://stats.testnet.filecoin.io/) page as well as the community-managed block explorers [filscan.io](https://filscan.io), [filscout.io](https://filscout.io), and [filfox.io](https://filfox.io/).
