CREATE TABLE `cours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tutor_id` int DEFAULT NULL,
  `titre` varchar(50) NOT NULL,
  `cours_path` varchar(200) DEFAULT NULL,
  `description` text,
  `montant` decimal(5,2) DEFAULT '0.00',
  `payant` tinyint(1) DEFAULT '0',
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cours_path` (`cours_path`),
  KEY `tutor_id` (`tutor_id`),
  CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`)
)
INSERT INTO `cours` VALUES (1,1,'Php','\\\\cours\\\\coursPdf.1682296088786.156833.pdf','PHP is a general-purpose scripting language widely used as a server-side language for creating dynamic web pages. Though its reputation is mixed, PHP is still extremely popular and is used in over 75% of all websites where the server-side programming language is known.',0.00,0,'hhrQz2t06tMBqBlWtEToEJVq1Ql0nnHd'),(2,1,'Python','\\\\cours\\\\coursPdf.1682296234188.911805.pdf','Python is a general-purpose, versatile, and powerful programming language. It’s a great first language because Python code is concise and easy to read. Whatever you want to do, python can do it. From web development to machine learning to data science, Python is the language for you.',9.99,1,'qvE7htfFdJmlyIMsHTAvdPLfFk29TAPT');
