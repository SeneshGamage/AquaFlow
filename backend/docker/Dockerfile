FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S aquaflow && adduser -S aquaflow -G aquaflow

COPY --from=build /app/target/*.jar app.jar
RUN chown aquaflow:aquaflow app.jar

USER aquaflow
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
