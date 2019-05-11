// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

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

func (s *server) AlwaysError(context.Context, *ExampleOneRequest) (*ExampleOneResponse, error) {
	code := codes.Code(rand.Int31n(15) + 1)
	return nil, status.Error(code, "an error ocurred")
}

func (s *server) StreamingExample(req *StreamRequest, stream ExampleService_StreamingExampleServer) error {
  if req.GetError() {
    time.Sleep(time.Second * 10)
    code := codes.Code(rand.Int31n(15) + 1)
	  return status.Error(code, "a server streaming error ocurred")
  }

  for start := time.Now(); time.Since(start) < time.Minute; {
    t := ServerTime{
      Time: time.Now().String(),
    }
    _ = stream.Send(&t)
    time.Sleep(time.Second * 10)
  }

  return nil
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
