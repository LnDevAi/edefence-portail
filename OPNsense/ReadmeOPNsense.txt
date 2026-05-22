Ce document décrit la configuration manuelle et la sécurisation de l'interface d'administration d'OPNsense effectuée pour le projet.

1. Accès et Préparation
L'interface d'administration d'OPNsense est accessible par défaut sur l'adresse IP 192.168.1.1 via le protocole HTTP. La première étape consiste à sécuriser cet accès.

2. Étapes de configuration (Web GUI)
A. Passage en HTTPS et changement de port
Pour limiter l'exposition de l'interface et chiffrer les flux :

Se connecter à l'interface Web (http://192.168.1.1).

Naviguer vers System > Configuration > Settings.

Configurer les paramètres Web GUI :

Protocol : Sélectionner HTTPS (certificat auto-signé par défaut).

TCP Port : Définir le port sur 8443.

Disable HTTP Redirect : Cocher pour forcer l'usage du HTTPS et fermer la porte au HTTP non sécurisé.

Cliquer sur Save et Apply.

Note : L'accès se fait désormais via https://192.168.1.1:8443.

B. Installation de "Login Protection"
Pour se protéger contre les attaques de type brute-force sur l'interface d'administration :

Naviguer vers System > Firmware > Plugins.

Rechercher et installer le plugin : os-security-login-protection.

Une fois installé, accéder à System > Settings > Login Protection.

Configurer les paramètres de protection :

Enable : Cocher la case.

Max Attempts : Définir un seuil raisonnable (ex: 3 ou 5 tentatives).

Ban Time : Définir la durée du bannissement (ex: 3600 secondes pour 1 heure).

Sauvegarder les modifications.

3. Sauvegarde de la configuration
Une fois les modifications appliquées, la configuration a été exportée pour archivage et versioning dans ce dépôt :

Naviguer vers System > Configuration > Backups.

Cliquer sur Download configuration.

Placer le fichier config.xml dans le dossier /opnsense du dépôt Git.

Prochaines étapes
Si vous souhaitez restaurer cette configuration sur une autre instance OPNsense :

Accéder à System > Configuration > Backups.

Utiliser la fonction Restore configuration en sélectionnant le fichier config.xml présent dans ce dépôt.