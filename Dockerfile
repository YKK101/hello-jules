# Use the official n8n image as a base
FROM n8nio/n8n

# Set environment variables
# These can be customized as needed
ENV N8N_HOST="0.0.0.0"
ENV N8N_PORT=5678
ENV NODE_ENV=production
ENV N8N_BASIC_AUTH_ACTIVE=false
ENV GENERIC_TIMEZONE="UTC"

# Expose the port n8n will run on
EXPOSE 5678

# Set the user for the container
# USER node

# Command to run n8n
CMD ["n8n"]
