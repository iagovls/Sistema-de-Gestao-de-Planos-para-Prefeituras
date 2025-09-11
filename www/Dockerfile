# Etapa de build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Baixa dependências em cache
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline

# Copia código-fonte e empacota
COPY src ./src
RUN mvn -B -DskipTests package

# Etapa de runtime
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copia o JAR gerado na etapa de build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]