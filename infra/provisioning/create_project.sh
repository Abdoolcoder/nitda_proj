#!/bin/bash
# Provisioning script for Nextcloud
# Given a project name, creates a folder and matching group.

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: ./create_project.sh <project_name>"
  exit 1
fi

echo "Creating group: $PROJECT_NAME"
# docker exec --user www-data nextcloud-app occ group:add "$PROJECT_NAME"

echo "Creating folder for project: $PROJECT_NAME"
# docker exec --user www-data nextcloud-app occ groupfolders:create "$PROJECT_NAME"

echo "Done."
