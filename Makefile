dev:
	npm run predownload
	npm run docs:dev

docker-buildenv:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-buildenv -f script/docker/venus-buildenv.dockerfile .

docker-runtime:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-runtime -f script/docker/venus-runtime.dockerfile .
