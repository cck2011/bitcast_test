FROM golang:1.14.14-stretch

ENV GO111MODULE=on

WORKDIR $GOPATH/src/github.com/pion/ion-sfu

COPY ./ion-sfu/go.mod ./ion-sfu/go.sum ./
RUN cd $GOPATH/src/github.com/pion/ion-sfu && go mod download

COPY ./ion-sfu/pkg/ $GOPATH/src/github.com/pion/ion-sfu/pkg
COPY ./ion-sfu/cmd/ $GOPATH/src/github.com/pion/ion-sfu/cmd
COPY ./ion-sfu/config.toml $GOPATH/src/github.com/pion/ion-sfu/config.toml

WORKDIR $GOPATH/src/github.com/pion/ion-sfu/cmd/signal/json-rpc
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /sfu .

FROM alpine:3.12.3

RUN apk --no-cache add ca-certificates
COPY --from=0 /sfu /usr/local/bin/sfu

COPY ./ion-sfu/config.toml /configs/sfu.toml

ENTRYPOINT ["/usr/local/bin/sfu"]
CMD ["-c", "/configs/sfu.toml"]