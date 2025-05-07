# build container stage
FROM golang:1.23-bookworm AS build-env

# RUN  sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list

# download dependence
RUN apt-get update -y && apt-get install -y \
          bzr \
          build-essential \
          clang \
          curl \
          gcc \
          git \
          hwloc \
          jq \
          libhwloc-dev \
          make \
          mesa-opencl-icd \
          ncftp \
          ocl-icd-opencl-dev \
          pkg-config \
          wget && rm -rf /var/lib/apt/lists/*

COPY script/docker/common/install_mod.sh /script/
RUN bash /script/install_mod.sh
