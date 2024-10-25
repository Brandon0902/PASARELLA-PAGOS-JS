#!/bin/bash
# application-start.sh
# Legalian script to start application after automatic deploy using AWS CodeDeploy

# Dependencies
su - pm2 -c "cd  /opt/pm2/pasarela && npm install"

#Start services
systemctl start pm2-pm2.service