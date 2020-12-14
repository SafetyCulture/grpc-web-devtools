FROM golang:alpine

COPY . /server
WORKDIR /server

RUN go build -o app .

CMD ["/server/app"]
