# build stage
FROM golang as builder

ENV GO111MODULE=on

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server/server server/server.go

# final stage
FROM scratch
COPY --from=builder /app/server/server /app/
COPY --from=builder /app/database.sql /database.sql
EXPOSE 18080
ENTRYPOINT ["/app/server"]