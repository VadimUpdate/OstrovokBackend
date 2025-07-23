FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY build/libs/ProjectStudy-0.0.1-SNAPSHOT.jar /app/ProjectStudy.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/ProjectStudy.jar"]
