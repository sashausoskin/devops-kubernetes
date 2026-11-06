FROM google/cloud-sdk:alpine

RUN apk add --no-cache postgresql-client

COPY ./db-backup.sh .

CMD [ "./db-backup.sh" ]