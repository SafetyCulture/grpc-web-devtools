// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

package main

import (
	"fmt"
	"log"
	"net"
	"time"

	context "golang.org/x/net/context"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

type server struct{}

func (s *server) ExampleOne(_ context.Context, req *ExampleOneRequest) (*ExampleOneResponse, error) {
	return &ExampleOneResponse{
		Id:  fmt.Sprintf("%d", time.Now().Unix()),
		Msg: req.Msg,
	}, nil
}
func (s *server) ExampleTwo(context.Context, *ExampleTwoRequest) (*ExampleTwoResponse, error) {
	return &ExampleTwoResponse{
		Id:  int32(time.Now().Unix()),
		Msg: "Example Two",
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	RegisterExampleServiceServer(s, &server{})
	fmt.Println("starting server...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
