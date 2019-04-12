CXX = g++
CPPFLAGS += -I/usr/local/include -pthread
CXXFLAGS += -std=c++11
LDFLAGS += -L/usr/local/lib -lprotoc -lprotobuf -lpthread -ldl

protoc-gen-grpc-web-devtools: devtools_generator.o
	$(CXX) $^ $(LDFLAGS) -o $@

install: protoc-gen-grpc-web-devtools
	install protoc-gen-grpc-web-devtools /usr/local/bin/protoc-gen-grpc-web-devtools

.PHONY: example
example: install
	protoc -I./example --js_out=import_style=commonjs:example/client \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:example/client \
		--grpc-web-devtools_out=:example/client example/*.proto
	protoc -I./example --go_out=plugins=grpc:example/server example/*.proto

example-envoy:
	docker build -t grpcweb-devtools-example/envoy -f ./example/envoy.Dockerfile ./example

example-server:
	docker build -t grpcweb-devtools-example/server ./example/server

example-up: example-envoy example-server
	docker-compose -f ./example/docker-compose.yml up -d;

example-down:
	docker-compose -f ./example/docker-compose.yml down