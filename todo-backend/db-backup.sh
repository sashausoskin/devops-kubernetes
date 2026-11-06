#!/usr/bin/env bash
set -e

if [ -n $DB_URL ] && [ -n $BUCKET_URL ]
then
    FILE="/tmp/backup-$(date +%Y-%m-%d-%H%M%S).sql"
    echo "Dumping the database..."

    pg_dump -v $DB_URL > /tmp/backup.sql

    echo "Uploading to Google Cloud"
  
    gcloud storage cp /tmp/backup.sql $BUCKET_URL
else
    echo "The DB_URL and/or the BUCKET_URl env variables are not set"
fi