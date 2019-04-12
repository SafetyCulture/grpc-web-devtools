FROM golang:1.12

COPY . /server
WORKDIR /server

RUN go build -o app .

CMD ["/server/app"]