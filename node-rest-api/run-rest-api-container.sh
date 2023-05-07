#!/bin/bash
set -e -o pipefail

# Define environment variables (Locally)
export MONGODB_URI="mongodb://mamarbao:m4n56l@localhost:27017/mydb"
export ADMIN_EMAIL="mamarbao@gmail.com"
export ADMIN_PASSWORD="mypassword"
export ADMIN_NAME="Manu"
export JWT_SECRET="2c2b9883b396e96ddb744fcd663a9921d441c5537ad6ba4e7fd993629e37062b"
export AUTH0_DOMAIN="your-auth0-domain.auth0.com" #not yet used
export AUTH0_CLIENT_ID="your-auth0-client-id" #not yet used
export AUTH0_CLIENT_SECRET="your-auth0-client-secret" #not yet used
export AUTH0_CALLBACK_URL="http://localhost:3000/auth/AUTH0_CALLBACK_URL" #not yet used
export GRAFANA_HOST="localhost"
export PORT=3000

# Define container name
CONTAINER_NAME="rest-api-container"

# Define image name
IMAGE_NAME="rest-api-image"

# Function to build the image
build_image() {
  local target=$1
  docker build --target="$target" -t "$IMAGE_NAME" .
}

# Function to start the container
start_container() {
  local build_choice=$1
  local env_vars=""
  if [[ $build_choice == 2 ]]; then
    env_vars="-e MONGODB_URI=$MONGODB_URI \
              -e ADMIN_EMAIL=\"$ADMIN_EMAIL\" \
              -e ADMIN_PASSWORD=\"$ADMIN_PASSWORD\" \
              -e ADMIN_NAME=\"$ADMIN_NAME\" \
              -e JWT_SECRET=\"$JWT_SECRET\" \
              -e AUTH0_DOMAIN=$AUTH0_DOMAIN \
              -e AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID \
              -e AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET \
              -e AUTH0_CALLBACK_URL=$AUTH0_CALLBACK_URL \
              -e GRAFANA_HOST=$GRAFANA_HOST"
  fi
  local container_id=$(docker run -d --name "$CONTAINER_NAME" \
                      -p $PORT:$PORT $env_vars $IMAGE_NAME)
  echo "The container ($CONTAINER_NAME):($container_id) has been started."
}

# Function to stop container
stop_container() {
  if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    docker stop "$CONTAINER_NAME"
    echo "The container ($CONTAINER_NAME) has been stopped."
  else
    echo "The container ($CONTAINER_NAME) already stopped."
  fi
}



# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    # Container is running, ask user if they want to stop or delete it
    read -p "The container is running. Do you want to stop or delete it? (stop/delete/abort) " choice

    case "$choice" in
        stop)
            docker stop $CONTAINER_NAME
            echo "The container has been stopped."
            ;;
        delete)
            docker stop $CONTAINER_NAME
            docker rm $CONTAINER_NAME
            echo "The container has been deleted."
            ;;
        *)
            echo "Aborting."
            exit 1
            ;;
    esac
fi


# Prompt user to choose action
echo "In what state you want to build the container?"
echo "1. Development"
echo "2. Production"
echo "3. Ignore"
read -r build_choice

# Handle user's choice
case $build_choice in
    1)
        build_image "dev"
        ;;
    2)
        build_image "production"
        ;;
    3)
        echo "Nothing"
        ;;

    *)
        echo "Invalid choice"
        exit 1
        ;;
esac


# Prompt user to choose action
echo "What do you want to do?"
echo "1. Start container"
echo "2. Stop container"
echo "3. Delete container and image"
echo "4. Exit"
read -r choice

# Handle user's choice
case $choice in
    1)
        start_container "$build_choice"        
        ;;
    2)
        # Stop container
        stop_container
        ;;
    3)
        # Delete container and image
        stop_container
        if docker ps -a --format "{{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
            docker rm $CONTAINER_NAME
            docker rmi $IMAGE_NAME
            echo "The container ($CONTAINER_NAME) has been deleted."
        else
            echo "The container ($CONTAINER_NAME) does not exist."
        fi        
        ;;
    4)
        exit 0
        ;;
    *)
        echo "Invalid choice"
        ;;
esac
