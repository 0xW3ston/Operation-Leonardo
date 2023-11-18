
CREATE TABLE `events_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventID` int DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `eventID` (`eventID`),
  CONSTRAINT `events_images_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`id`) ON DELETE CASCADE
);


INSERT INTO `events_images` VALUES (47,60,'\\eventsUploads\\myImage.1682165830551.537096.jpg'),(48,60,'\\eventsUploads\\myImage.1682165830556.583112.jpg'),(49,60,'\\eventsUploads\\myImage.1682165830561.683173.jpg'),(50,61,'\\eventsUploads\\myImage.1682167617267.685311.jpg'),(51,61,'\\eventsUploads\\myImage.1682167617275.874072.jpg'),(52,61,'\\eventsUploads\\myImage.1682167617281.529643.jpg'),(53,61,'\\eventsUploads\\myImage.1682167617293.822328.jpg'),(55,61,'\\eventsUploads\\myImage.1682267572241.104521.jpg');
