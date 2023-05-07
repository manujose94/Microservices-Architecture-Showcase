#!/bin/bash

# Check if the script is being run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

if command -v go &> /dev/null; then
    echo "Go is already installed."
    echo "You can use 'go version' command to check the version."
else
    # Set the Go version
    GO_VERSION=1.17

    # Download the Go binary
    cd /tmp
    wget https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz

    # Extract the Go binary
    tar -xzf go${GO_VERSION}.linux-amd64.tar.gz
    rm -rf /usr/local/go
    mv go /usr/local

    # Set up the Go environment
    echo "export PATH=\$PATH:/usr/local/go/bin" >> /etc/profile
    source /etc/profile

    # Verify that Go is installed and set up correctly
    go version
fi