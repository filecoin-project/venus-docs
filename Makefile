dev:
	npm run predownload
	npm run docs:dev

TAG:=v1.9.0
docker-buildenv:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-buildenv:$(TAG) -f script/docker/venus-buildenv.dockerfile .
	docker tag filvenus/venus-buildenv:$(TAG) filvenus/venus-buildenv:latest

push-buildenv:
	docker push filvenus/venus-buildenv:$(TAG)
	docker push filvenus/venus-buildenv:latest

docker-runtime:
	docker build --build-arg https_proxy=$(BUILD_DOCKER_PROXY) -t filvenus/venus-runtime:$(TAG) -f script/docker/venus-runtime.dockerfile .
	docker tag filvenus/venus-runtime:$(TAG) filvenus/venus-runtime:latest

push-runtime:
	docker push filvenus/venus-runtime:$(TAG)
	docker push filvenus/venus-runtime:latest
