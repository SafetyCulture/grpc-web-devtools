CXX = g++
CPPFLAGS += -I/usr/local/include -pthread
CXXFLAGS += -std=c++11
LDFLAGS += -L/usr/local/lib -lprotoc -lprotobuf -lpthread -ldl

protoc-gen-grpc-web-devtools: devtools_generator.o
	$(CXX) $^ $(LDFLAGS) -o $@
