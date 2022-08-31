
docker-buildenv:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-buildenv -f script/venus-buildenv.dockerfile .

docker-runtime:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-runtime -f script/venus-runtime.dockerfile .
