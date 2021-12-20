#!/bin/bash

#MongoDB can't handle '.'
old_file=book_data.csv
new_file=new_book_data.csv
read -r header < $old_file
new_header=${header/./}

#Remove calculated fields for 'book avg. rating' and 'book ratings'
# new_header=${header/,book avg. rating,book ratings/}

sed "1c$new_header" $old_file > $new_file 

#Import data into MongoDB
# ./mongoimport --type csv -d apple_db -c books --headerline --drop $new_file

./mongoimport --uri mongodb+srv://basharhweij:<PASSWORD>@apple-db.29ih4.mongodb.net/apple-db --type csv --collection books --headerline --drop $new_file

read -p "Press any key to resume ..."
