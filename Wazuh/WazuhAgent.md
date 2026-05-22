# Commandes d'installation effectuées 

1. Import clé GPG :
   curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --no-default-keyring --keyring /usr/share/keyrings/wazuh-archive-keyring.gpg --import

2. Ajout dépôt :
   echo "deb [signed-by=/usr/share/keyrings/wazuh-archive-keyring.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee -a /etc/apt/sources.list.d/wazuh.list

3. Installation :
   sudo apt update
   sudo WAZUH_MANAGER='192.168.11.118' apt install wazuh-agent

4. Lancement :
   sudo systemctl daemon-reload
   sudo systemctl enable wazuh-agent
   sudo systemctl start wazuh-agent