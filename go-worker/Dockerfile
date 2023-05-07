FROM golang:1.18.7 AS build

# create a non-root user (limited access in our Dockerfile for added security)
RUN useradd -u 1001 -m iamuser
ENV APP_NAME go-app
ENV APP_HOME /go/src/go-app
# create a working directory inside the image
WORKDIR "$APP_HOME"

#X509: Certificate Signed by Unknown Authority
RUN apt-get update && apt-get install -y ca-certificates

# copy directory files and Go modules and dependencies to image
COPY ./$APP_NAME/go.mod ./$APP_NAME/go.sum ./
COPY ./$APP_NAME/. .
# download Go modules and dependencies
RUN go mod download


# compile application
#RUN go build -o /go-code
RUN CGO_ENABLED=0 go build -v -o /$APP_NAME
#ENTRYPOINT ["/go-app"]
##DEPLOY
FROM scratch
WORKDIR /
COPY --from=build /go-app /go-app
COPY --from=build /go-app /go-app
# copy the SSL/TLS certificates from the build stage
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
USER 1001
ENTRYPOINT ["/go-app"]