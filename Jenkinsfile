#!/usr/bin/env groovy

node {
    stage('checkout') {
        deleteDir()
        checkout scm
    }

    stage('check java') {
        sh "java -version"
    }

    stage('clean') {
        sh "chmod +x mvnw"
        sh "./mvnw clean"
    }

    stage('install tools') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v8.11.3 -DyarnVersion=v1.7.0"
    }

    stage('yarn install') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments='cache clean'"
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments='install --force'"
    }

    stage('backend tests') {
        try {
            sh "./mvnw test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
    }

    /*stage('frontend tests') {
        try {
            sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments=test"
        } catch(err) {
            throw err
        } finally {*/
           // junit '**/target/test-results/karma/TESTS-*.xml'
       // }
    //}

    stage('build and create docker image'){
        sh "./mvnw clean com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments=webpack:prod package -Pdev dockerfile:build  -Dmaven.test.skip=true"
    }

    stage('starting docker image'){
        sh "docker-compose -f src/main/docker/app-integration-test.yml up -d"
        timeout(time: 120, unit: 'SECONDS') {
            echo('Waiting for the container to start');
            waitUntil {
                def r = sh script: 'wget -q --spider http://localhost:8080/#/', returnStatus: true
                return (r == 0);
            }
        }
    }

    stage('integration test') {
        try {
            sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments=e2e"
        } catch(err) {
            throw err
        } finally {
            sh "docker-compose -f src/main/docker/app-integration-test.yml down"
            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'target/reports/e2e/screenshots',
                reportFiles: 'report.html',
                reportName: "E2E Report"
            ])
            junit '**/target/reports/e2e/junitresults-*.xml'
        }
    }
}
