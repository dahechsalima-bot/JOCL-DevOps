# ================================
# Dockerfile pour le Backend Spring Boot
# ================================

# On utilise une image Java 21 légère comme base
FROM eclipse-temurin:21-jre-alpine

# On crée un dossier de travail dans le conteneur
WORKDIR /app

# On copie le fichier .jar compilé dans le conteneur
COPY target/jocl-0.0.1-SNAPSHOT.jar app.jar

# On expose le port 8080 (port du backend)
EXPOSE 8080

# Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
