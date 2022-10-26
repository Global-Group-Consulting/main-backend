#!/usr/bin/env sh
# Export prod db
mongodump --archive="mongodump-ggc-prod-db" --uri=mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_production

#Import prod db into staging db
mongorestore --archive="mongodump-ggc-prod-db" --nsFrom='ggc_production.*' --nsTo='ggc_staging.*' --uri=mongodb+srv://ggc_staging:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_staging?retryWrites=true&w=majority
