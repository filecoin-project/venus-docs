FROM debian:bookworm

# install dependence
RUN apt-get -qq update \
    && apt-get -qq install -y --no-install-recommends ca-certificates curl vim telnet tzdata subversion jq procps 

# set time zone to Shanghai
ENV TZ=Asia/Shanghai
RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata

# set charset
ENV LANG C.UTF-8

# copy ddl
COPY --from=filvenus/venus-buildenv   /usr/lib/x86_64-linux-gnu/libhwloc.so.15  \
    /usr/lib/x86_64-linux-gnu/libOpenCL.so.1  \
    /lib/x86_64-linux-gnu/libgcc_s.so.1  \
    /lib/x86_64-linux-gnu/libutil.so.1  \
    /lib/x86_64-linux-gnu/librt.so.1  \
    /lib/x86_64-linux-gnu/libpthread.so.0  \
    /lib/x86_64-linux-gnu/libm.so.6  \
    /lib/x86_64-linux-gnu/libdl.so.2  \
    /lib/x86_64-linux-gnu/libc.so.6  \
    /usr/lib/x86_64-linux-gnu/libnuma.so.1  \
    /usr/lib/x86_64-linux-gnu/libltdl.so.7  \
    /lib/

RUN echo "alias messager=venus-messager market=venus-market miner=venus-miner gateway=venus-gateway wallet=venus-wallet auth=venus-auth" >> /etc/bash.bashrc

# RUN svn checkout https://github.com/filecoin-project/venus-docs/trunk/script/docker
# COPY ./docker/common/* /script
# COPY ./docker/compose  /script

COPY ./script/docker/common/* /script/
COPY ./script/docker/compose  /script/compose

# DIR for app
WORKDIR /app
ENV PATH "$PATH:/app/"
