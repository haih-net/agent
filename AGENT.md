# Agent guide

Read [README.md](README.md), especially **AI Agent Setup Instructions**, **Docker Setup**, and **Local Development**, before configuring or starting the project.

Ask the user which AI provider to use before startup: an OpenRouter API key, a local OpenAI-compatible endpoint and its access details, or the bundled llama.cpp service. Follow the selected provider's setup in the README.

Read [credentials/README.md](credentials/README.md) for the files under `credentials/` and [wiki/README.md](wiki/README.md) for architecture and feature-specific guides.

For Docker development, use `docker/docker-compose.yml` with `docker/docker-compose.dev.yml`. For production, use `docker/docker-compose.yml` with `docker/docker-compose.prod.yml`; read [docker/traefik/README.md](docker/traefik/README.md) for production routing and TLS. The main README currently gives a step-by-step Docker development setup; the production Compose and Traefik files are the references for production settings.

If a setup step is unclear or differs from the running configuration, verify it in the relevant config and update that documentation.
