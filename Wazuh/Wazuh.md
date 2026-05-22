## 2. Monitoring avec Wazuh (Méthode IT-Connect)

L'installation a été réalisée en suivant les procédures de déploiement manuel de Wazuh.

### Étapes de configuration :
1. **Prérequis :** Importation de la clé GPG officielle de Wazuh.
2. **Installation du Dépôt :** Ajout du dépôt APT de Wazuh dans les sources du système.
3. **Installation du Paquet :** Installation de l'agent via la commande : 
   `sudo WAZUH_MANAGER='<IP_MANAGER>' apt install wazuh-agent`
4. **Configuration :** - Enregistrement de l'agent auprès du manager via la commande `agent-auth`.
   - Modification du fichier `/var/ossec/etc/ossec.conf` pour définir les paramètres de connexion au Manager.
5. **Démarrage :** Activation et démarrage du service via `systemctl`.