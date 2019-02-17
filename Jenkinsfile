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
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v10.15.0 -DyarnVersion=v1.13.0"
    }

    stage('yarn install') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments=install"
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
        sh "./mvnw clean com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments=build package -Pdev verify jib:dockerBuild  -Dmaven.test.skip=true"
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
            junit '**/target/test-results/e2e/TESTS-results.xml'
        }
    }
}
