# Notes

## building an image by hand

Following instructions from [here](https://codefresh.io/docs/docs/integrations/docker-registries/github-container-registry/)

### Using podman

1. `podman build . -t test-api`
2. `podman tag test-api ghcr.io/hannah-ellis-opencast-software/test-api:latest`
3. `podman push ghcr.io/hannah-ellis-opencast-software/test-api:latest`


## How to do a curl post request

```bash
curl -i -X POST -H 'Content-Type: application/json' -d '  {"id": "2b1f6013-a9b5-444a-b687-0c4769095236","forename":"Charlie","surname": "Bates","salary": 35000,"holidayAllowance": 24,"roles": [{ "level": "junior", "title": "developer" }]}' http://localhost:8080/employee
```

## How to do a curl get request with an admin header

```bash
curl -i -H 'x-admin-key: 77071417-55b0-4179-96bb-8043edf8507f' http://localhost:8080/employee/all
```

## How to fix issues with podman not starting up mongo due to chown issues

If you see the following output when using `podman compose up`

``` bash
chown: changing ownership of '/data/db': Operation not permitted
chown: changing ownership of '/data/configdb': Operation not permitted
```

You can fix by setting the following environment variable

```bash
export PODMAN_USERNS=keep-id 
```

See [here](https://github.com/containers/podman/issues/18348) for more details