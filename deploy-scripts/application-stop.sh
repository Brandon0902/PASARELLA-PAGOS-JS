#!/bin/bash
# application-stop.sh
# Legalian script to stop application before automatic deploy using AWS CodeDeploy

systemctl stop pm2-pm2.service
