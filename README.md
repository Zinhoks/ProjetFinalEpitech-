# PROJET EP'EAT




## Présentation


Le projet Ep'Eat est un site proposant un service de prise de commande plats cuisinés auprès de différents restaurateurs partenaires (fictifs) simulant un service de Click and Collect.
Pour profiter pleinement du site et de l'ensemble de ses fonctionalitées, un compte utilisateur est nécessaire sans ce dernier l'utilisateur ne disposant pas de compte sera limité à une activité visuelle, il aura accès à la page d'accueil où l'ensemble des restaurants seront affichés ainsi que la page dédiée aux informations de chaques établissements tels que les plats proposés, la localisation ou encore la note moyenne. 
Un utilisateur disposant d'un compte utilisateur aura la possiblité de mettre en favoris tous les restaurants de son choix, de laisser une note ou encore de passer plusieurs commandes en séléctionnant des plats qui seront ajoutés dans un panier puis triés selon les restaurants où il pourra par la suite procéder au paiement via le service Stripe. Il aura également accès à sa page profil personnalisée où seront affichés ses informations personnelles qu'il pourra modifier, l'historique de ses commandes ainsi qu'une liste de ses restaurants favoris avec la possibilité de les supprimer.
Un utilisateur disposant d'un compte administrateur aura en plus des actions citées précédement la possibilité de gérer la liste des utilisateurs avec la capacité de modifier leurs données, supprimer un compte ainsi que de donner ou enlever le statut d'administrateur, il en sera de même pour les restaurants.


## Technologies


* [ReactJS](https://reactjs.org/) - Framework Frontend - Librairie Javascript permettant de créer des interfaces utilisateurs interactives.
  
* [ExpressJS](https://expressjs.com/) - Framework Backend - Framework servant d'extension à Node.js permettant la création d'un serveur backend pour les applications web.
  
* [Postman](https://www.postman.com/) - Plateforme API - Plateforme permettant de créer ainsi que de vérifier le bon déploiement d'une API (routes, ect).
  
* [MongoDB](https://www.mongodb.com/) - Plateforme de base de donnée (commune) - Plateforme permettant de créer et héberger une base de donnée commune à ses membres
  
* [Material UI](https://mui.com/) - Outil d'interface graphique - Librairie open-source compatible avec ReactJS proposant des outils de gestion d'interface graphique.
  
* [ChartJS](https://www.chartjs.org/) - Bibliothèque Javascript d'interface graphique - Outil permettant la création d'image et de diagramme au format canvas HTML5.
  
* [SwaggerIO](https://swagger.io/) - Interface utilisateur - Infrasctructure d'affichage générant une console API interactive permettant une documentation claire et précise et une meilleure compréhension d'une API.

* [JestJS](https://jestjs.io/) - Framework de test JS - Framework permettant d'effectuer des tests unitaires.


## Installation


-Installation de ReactJS:

    `npx create-react-app nom du projet`

-Installation de ExpressJS:

    `npm init` + `npm i express` 


## Démarrage    

-Démarrage du serveur Javascript ReactJS (front) au niveau de la racine du dossier React.js en rentrant la commande suivant:

    `npm run start`

-Démarrage des serveurs ExpressJS (back) au niveau de la racine des dossiers respectifs en rentrant la commande pour chaques dossiers tout en respectant leur port respectif:   

    `npm run start`

-Installation et initialisation de tous les packages npm (à faire dans chacun des dossiers)

    `npm install`