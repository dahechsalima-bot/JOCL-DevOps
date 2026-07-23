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
        // ÉTAPE 3 : Analyse qualité avec SonarQube
        // -----------------------------------------------
        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Analyse de la qualité du code avec SonarQube...'
                dir('JOCL-BackEnd') {
                    withSonarQubeEnv('SonarQube') {
                        sh './mvnw sonar:sonar -Dsonar.projectKey=JOCL -Dsonar.projectName=JOCL -Dsonar.host.url=http://sonarqube:9000'
                    }
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 4 : Vérifier le Quality Gate
        // -----------------------------------------------
        stage('Quality Gate') {
            steps {
                echo '🚦 Vérification du Quality Gate...'
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 5 : Analyse qualité Frontend Angular
        // -----------------------------------------------
        stage('SonarQube Frontend') {
            steps {
                echo '🔍 Analyse de la qualité du code Angular...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        docker run --rm \
                          --network jocl-pipeline_jocl-network \
                          -e SONAR_HOST_URL=http://sonarqube:9000 \
                          -e SONAR_TOKEN=$SONAR_AUTH_TOKEN \
                          -v $WORKSPACE/JOCL-FrontEnd:/usr/src \
                          sonarsource/sonar-scanner-cli \
                          -Dsonar.projectKey=JOCL-Frontend \
                          -Dsonar.projectName="JOCL Frontend Angular" \
                          -Dsonar.sources=. \
                          -Dsonar.inclusions="src/**/*.ts,src/**/*.html" \
                          -Dsonar.exclusions="**/node_modules/**,**/*.spec.ts,**/dist/**,**/*.js" \
                          -Dsonar.host.url=http://sonarqube:9000
                    '''
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 5 : Publier le .jar sur Nexus
        // -----------------------------------------------
        stage('Publish to Nexus') {
            steps {
                echo '📦 Publication du .jar sur Nexus Repository...'
                dir('JOCL-BackEnd') {
                    sh './mvnw deploy -DskipTests -s /var/jenkins_home/.m2/settings.xml'
                }
            }
        }

        // -----------------------------------------------
        // ÉTAPE 6 : Construire l'image Docker du backend
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
