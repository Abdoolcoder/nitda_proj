# Secure Research Collaboration Workspace

A controlled research collaboration workspace, built on Nextcloud, that lets university researchers keep working the way they already do, while giving the university visibility and control over sensitive files, and an automatic way to revoke access when someone leaves.

## Stated, upfront limitations
- No-download mode and watermarking (if ever added later) are deterrents, not prevention — a photo of a screen still defeats them.
- Rule-based detection will produce false positives/negatives — it's a starting point, not a finished anomaly-detection system.
- The exit protocol is manually triggered by a supervisor in this version, not wired to any HR/registrar system.
- Controls are only useful if they're lighter than the workaround — this is exactly what the user test is meant to check.

## Setup Instructions

1. Copy `.env.example` to `.env` and fill in any required variables.
2. Run `docker-compose up -d` in the `infra/` directory to start Nextcloud and ONLYOFFICE.
3. Check the individual folders for specific `requirements.txt` and run instructions for the scripts and dashboard.
