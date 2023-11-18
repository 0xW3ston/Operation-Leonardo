
CREATE TABLE `etudiant_cour` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cours` int DEFAULT NULL,
  `id_etudiant` int DEFAULT NULL,
  `DateEnrollement` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_cours` (`id_cours`,`id_etudiant`),
  KEY `id_etudiant` (`id_etudiant`),
  CONSTRAINT `etudiant_cour_ibfk_1` FOREIGN KEY (`id_cours`) REFERENCES `cours` (`id`) ON DELETE CASCADE,
  CONSTRAINT `etudiant_cour_ibfk_2` FOREIGN KEY (`id_etudiant`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
INSERT INTO `etudiant_cour` VALUES (1,1,2,'2023-04-24'),(2,2,1,'2023-04-24');
