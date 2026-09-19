#!/bin/bash
# create_demo_users.sh - provisions Nextcloud users

# Helper to run occ
OCC="docker compose exec --user www-data app php occ"

echo "Creating demo users in Nextcloud..."

# Setup passwords via env vars for occ
export OC_PASS=password123

$OCC user:add --password-from-env dr_amara --display-name="Dr. Amara" || true
$OCC user:add --password-from-env researcher_bello --display-name="Researcher Bello" || true
$OCC user:add --password-from-env student_musa --display-name="Student Musa" || true

echo "Demo users created successfully."
