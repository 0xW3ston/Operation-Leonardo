CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'user',
  `Mail_Verified` tinyint(1) DEFAULT '0',
  `Verify_Token` varchar(90) DEFAULT NULL,
  `session_key` varchar(90) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);
INSERT INTO `users` VALUES (1,'soukaina','nabila','admin@a.com','03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4','secretaire',1,NULL,'bc0b1af6da9a00e640162ef22bf10f1c7b514dc0a5a768d4c39b274f40936afc'),(2,'chayma','agardouh','aahllaamm@hotmail.com','03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4','formateur',0,NULL,'f9042bee4ea5c32fbdb549953055acaa7cb5c89f38293ce2c9e876e8ce881570');