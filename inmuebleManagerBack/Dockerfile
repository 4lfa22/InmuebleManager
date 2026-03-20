# Multistage build para Spring Boot
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar JAR generado
COPY --from=builder /app/target/*.jar app.jar

# Variables de entorno por defecto
ENV PORT=8080 \
    JAVA_OPTS="-Xmx512m -Xms256m" \
    SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

# Usar shell form para permitir expansión de variables
ENTRYPOINT java $JAVA_OPTS -Dserver.port=$PORT -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -jar app.jar
