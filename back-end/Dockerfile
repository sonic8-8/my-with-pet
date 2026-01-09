FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy built jar
COPY build/libs/*.jar app.jar

# Pinpoint setup (Placeholder - ensure agent is available or download it)
# ADD https://github.com/pinpoint-apm/pinpoint/releases/download/v2.5.3/pinpoint-agent-2.5.3.tar.gz pinpoint-agent.tar.gz
# RUN tar -xzf pinpoint-agent.tar.gz && mv pinpoint-agent-2.5.3 pinpoint-agent

# Environment variables
ENV PINPOINT_AGENT_ID=backend-agent
ENV PINPOINT_APP_NAME=MyWithPetBackend

# Entrypoint
# If using Pinpoint:
# ENTRYPOINT ["java", "-javaagent:/app/pinpoint-agent/pinpoint-bootstrap.jar", "-Dpinpoint.agentId=${PINPOINT_AGENT_ID}", "-Dpinpoint.applicationName=${PINPOINT_APP_NAME}", "-jar", "app.jar"]

# Standard Entrypoint without Pinpoint for now (uncomment above for Pinpoint)
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
