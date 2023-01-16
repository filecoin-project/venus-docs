dev:
	npm run predownload
	npm run docs:dev

TAG:=v1.9.0
docker-buildenv:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-buildenv:$(TAG) -f script/docker/venus-buildenv.dockerfile .

push-buildenv:
	docker push filvenus/venus-buildenv:$(TAG)

docker-runtime:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-runtime:$(TAG) -f script/docker/venus-runtime.dockerfile .

push-runtime:
	docker push filvenus/venus-runtime:$(TAG)
