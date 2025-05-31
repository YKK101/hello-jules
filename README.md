# n8n Self-Hosted with Docker

This project provides a basic setup to self-host n8n using Docker and Docker Compose.

## Prerequisites

*   Docker: Make sure you have Docker installed on your system. You can find installation instructions at [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/).
*   Docker Compose: Docker Compose is usually included with Docker Desktop. If not, or if you're on Linux, you might need to install it separately. See [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

## Setup and Running n8n

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Build and start the n8n container:**
    This command will build the Docker image based on the `Dockerfile` and then start the n8n service in detached mode.
    ```bash
    sudo docker-compose up --build -d
    ```
    *Note: `sudo` might be required depending on your Docker installation.*

3.  **Access n8n:**
    Once the container is running, you can access n8n by opening your web browser and navigating to:
    [http://localhost:5678](http://localhost:5678)

4.  **Stopping n8n:**
    To stop the n8n container, run:
    ```bash
    sudo docker-compose down
    ```

## Configuration

*   **Data Persistence:** n8n data (workflows, credentials, etc.) is stored in the `./n8n_data` directory on your host machine, which is mounted as a volume into the container. This ensures your data persists even if the container is stopped or removed.
*   **Environment Variables:** You can customize n8n's configuration by setting environment variables in the `docker-compose.yml` file within the `services.n8n.environment` section. Some common variables include:
    *   `GENERIC_TIMEZONE`: Sets the timezone for n8n (e.g., `Europe/Berlin`).
    *   `N8N_BASIC_AUTH_ACTIVE`: Set to `true` to enable basic authentication.
    *   `N8N_BASIC_AUTH_USER`: Username for basic authentication.
    *   `N8N_BASIC_AUTH_PASSWORD`: Password for basic authentication.
    *   `N8N_ENCRYPTION_KEY`: A long, random string used for encrypting credentials. It's highly recommended to set this for production environments.

    Refer to the [official n8n documentation](https://docs.n8n.io/hosting/configuration/) for a complete list of environment variables.

## Dockerfile

The `Dockerfile` in this repository uses the official `n8nio/n8n` image as a base and sets some default environment variables. You can customize this file if you need to add more dependencies or modify the base image further.

## Troubleshooting

*   **Port Conflicts:** If port `5678` is already in use on your system, you can change the host port mapping in the `docker-compose.yml` file. For example, to map to port `5679` on your host, change `ports: - "5678:5678"` to `ports: - "5679:5678"`.
*   **Docker Permissions:** If you encounter permission errors when running `docker-compose` commands, you might need to add your user to the `docker` group or run the commands with `sudo`.
