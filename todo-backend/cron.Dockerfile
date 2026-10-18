FROM alpine/curl

COPY ./wiki-update.sh .

CMD [ "./wiki-update.sh" ]