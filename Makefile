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
	protoc -I./example --grpc-web-devtools_out=:example example/*.proto