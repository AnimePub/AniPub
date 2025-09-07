#!/bin/bash
echo "Running AniPub Dev. Mode"
echo "Please Let Me Know If you find any Bug ....."
echo "Starting Server....."

if [ -v ~/usr/bin/npm ] 
then 
    npm run dev
else 
    if [ -f ~/etc/debian_version ]
    then 
        sudo apt update && upgrade -y
        sudo apt install npm
    else 
        sudo pacman -Syu -y
        sudo pacman -S npm

    fi
fi    
        
