FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY build/libs/Admin-console-0.0.1-SNAPSHOT.jar /app/Admin-console.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/Admin-console.jar"]
