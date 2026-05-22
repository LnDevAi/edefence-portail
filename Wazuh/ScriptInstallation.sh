#!/bin/bash
# Script d'installation automatique de l'agent Wazuh

# 1. Ajout de la clé GPG
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --no-default-keyring --keyring /usr/share/keyrings/wazuh-archive-keyring.gpg --import

# 2. Ajout du dépôt
echo "deb [signed-by=/usr/share/keyrings/wazuh-archive-keyring.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee /etc/apt/sources.list.d/wazuh.list

# 3. Mise à jour et installation
sudo apt update
sudo WAZUH_MANAGER='192.168.11.118' apt install wazuh-agent -y

# 4. Enregistrement et démarrage
sudo /var/ossec/bin/agent-auth -m 192.168.11.118
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent

echo "Installation terminée avec succès !"