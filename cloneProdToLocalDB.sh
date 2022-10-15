#!/usr/bin/env sh
# Export prod db
mongodump --archive="mongodump-ggc-prod-db" --uri=mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_production
mongodump --archive="mongodump-global_club-db" --uri=mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/global_club

#Import prod db into staging db
mongorestore --archive="mongodump-ggc-prod-db" --nsFrom='ggc_production.*' --nsTo='ggc_local.*' --uri=mongodb://citizix:S3cret@localhost:27017
mongorestore --archive="mongodump-global_club-db" --nsFrom='global_club.*' --nsTo='global_club_local.*' --uri=mongodb://citizix:S3cret@localhost:27017

rm ./mongodump-ggc-prod-db
rm ./mongodump-global_club-db
