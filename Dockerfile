FROM gradle:jdk21 AS builder

WORKDIR /app

COPY ..
RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/Admin-console-0.0.1-SNAPSHOT.jar /app/Admin-console.jar

EXPOSE 8000

CMD ["java", "-jar", "/app/Admin-console.jar"]
