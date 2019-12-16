
.PHONY: build
build:
	yarn && yarn build

run:
	yarn && yarn start

package: build
	cd build; zip -r ../grpc-web-devtools.zip .

example-build-frontend:
	protoc -I./example --js_out=import_style=commonjs:example/client \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:example/client example/*.proto

example-build-backend:
	protoc -I./example --go_out=plugins=grpc:example/server example/*.proto

example-build: example-build-backend example-build-frontend

example-frontend-up: example-build-frontend
	npm run start --prefix example/client

example-envoy:
	docker build -t grpcweb-devtools-example/envoy -f ./example/envoy.Dockerfile ./example

example-server:
	docker build -t grpcweb-devtools-example/server ./example/server

example-client: 
	docker build -t grpcweb-devtools-example/client ./example/client

example-up: example-server example-envoy example-server example-client
	docker-compose -f ./example/docker-compose.yml up -d;

example-down:
	docker-compose -f ./example/docker-compose.yml down
