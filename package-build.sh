#! /bin/bash

podman build . -t test-api
podman tag test-api ghcr.io/hannah-ellis-opencast-software/test-api:latest
podman push ghcr.io/hannah-ellis-opencast-software/test-api:latest