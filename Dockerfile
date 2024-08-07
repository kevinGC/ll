FROM golang:1.22 AS builder

WORKDIR /
COPY . .
RUN CGO_ENABLED=0 go build github.com/kevinGC/ll

FROM scratch
WORKDIR /
COPY --from=builder /ll /ll
COPY static /static
COPY templates /templates
CMD ["/ll"]
