// ================================================
// Jenkinsfile — Pipeline CI/CD pour JOCL
// Utilise mvnw (Maven Wrapper) inclus dans le projet
// ================================================

pipeline {

    agent any

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
        // Utilise ./mvnw (Maven Wrapper inclus dans le projet)
        // -----------------------------------------------
        stage('Build Backend') {
            steps {
                echo '🔨 Compilation du backend Spring Boot...'
                dir('JOCL-BackEnd') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
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
                    sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ."
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
                    sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 5 : Lancer toute l'application
        // -----------------------------------------------
        stage('Deploy') {
            steps {
                echo '🚀 Lancement de l\'application avec Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline réussi ! Application disponible sur http://localhost:4200'
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifie les logs ci-dessus.'
        }
    }
}
