
.PHONY: build
build:
	yarn && yarn build

run:
	yarn && yarn start

example-build-frontend:
	protoc -I./example --js_out=import_style=commonjs:example/client \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:example/client \

example-build-backend:
	protoc -I./example --go_out=plugins=grpc:example/server example/*.proto

example-frontend-up: example-build-frontend
	npm run start --prefix example/client

example-envoy:
	docker build -t grpcweb-devtools-example/envoy -f ./example/envoy.Dockerfile ./example

example-server: example-build-backend
	docker build -t grpcweb-devtools-example/server ./example/server

example-backend-up: example-build example-envoy example-server
	docker-compose -f ./example/docker-compose.yml up -d;

example-backend-down:
	docker-compose -f ./example/docker-compose.yml down