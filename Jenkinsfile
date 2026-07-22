// ================================================
// Jenkinsfile — Pipeline CI/CD pour JOCL
// Ce fichier automatise : build → test → docker
// ================================================

pipeline {

    // Lance le pipeline sur n'importe quel agent disponible
    agent any

    // Variables réutilisables dans tout le pipeline
    environment {
        BACKEND_IMAGE  = 'jocl-backend'
        FRONTEND_IMAGE = 'jocl-frontend'
        IMAGE_TAG      = 'latest'
    }

    stages {

        // -----------------------------------------------
        // ÉTAPE 1 : Récupérer le code depuis GitHub
        // -----------------------------------------------
        stage('Checkout') {
            steps {
                echo '📥 Récupération du code source...'
                checkout scm
            }
        }

        // -----------------------------------------------
        // ÉTAPE 2 : Compiler le backend Java (créer le .jar)
        // -----------------------------------------------
        stage('Build Backend') {
            steps {
                echo '🔨 Compilation du backend Spring Boot...'
                dir('JOCL-BackEnd') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 3 : Construire l'image Docker du backend
        // -----------------------------------------------
        stage('Docker Build Backend') {
            steps {
                echo '🐳 Construction de l\'image Docker Backend...'
                dir('JOCL-BackEnd') {
                    bat "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 4 : Construire l'image Docker du frontend
        // -----------------------------------------------
        stage('Docker Build Frontend') {
            steps {
                echo '🐳 Construction de l\'image Docker Frontend...'
                dir('JOCL-FrontEnd') {
                    bat "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 5 : Lancer toute l'application
        // -----------------------------------------------
        stage('Deploy') {
            steps {
                echo '🚀 Lancement de l\'application avec Docker Compose...'
                bat 'docker-compose down'
                bat 'docker-compose up -d'
            }
        }
    }

    // -----------------------------------------------
    // Résultat final du pipeline
    // -----------------------------------------------
    post {
        success {
            echo '✅ Pipeline réussi ! Application disponible sur http://localhost:4200'
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifie les logs ci-dessus.'
        }
    }
}
