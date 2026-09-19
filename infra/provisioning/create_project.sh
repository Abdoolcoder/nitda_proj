#!/bin/bash
# create_project.sh - provisions Nextcloud demo project

OCC="docker compose exec --user www-data app php occ"

echo "Creating Research Project..."

# Create a group for the project
$OCC group:add "Project Alpha" || true

# Add users to the group
$OCC group:adduser "Project Alpha" dr_amara || true
$OCC group:adduser "Project Alpha" researcher_bello || true
$OCC group:adduser "Project Alpha" student_musa || true

echo "Project Alpha created and users assigned."
