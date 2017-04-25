CREATE TABLE `navbar` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `affichage` varchar(100) DEFAULT NULL,
  `ref` varchar(100) DEFAULT NULL,
  `icon` varchar(100) DEFAULT "dashboard",
  `autorisation` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2;

INSERT INTO `navbar` (`id`, `affichage`, `ref`, `icon`, `autorisation`) VALUES
(1, 'Page principal', '/principal', 'dashboard', 0),
(2, 'Commande', '/commande', 'dropbox', 0);


CREATE TABLE `email` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `sendemail` varchar(100) DEFAULT "default@example.com",
  `subject` varchar(100) DEFAULT "Default Subject",
  `id_commande` varchar(32) DEFAULT "N/A",
  `html` varchar(8000) DEFAULT "N/A",
  `returnSendEmail` varchar(1000) DEFAULT "N/A",
  `date` datetime,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=0;

INSERT INTO `email` (`id`, `sendemail`, `subject`, `id_commande`, `html`, `returnSendEmail`, `date`) VALUES
(1, 'taxisoopya@hotmail.fr', 'test', 'FR-669AMIIHJX', "ACHAT_DU_CLIENT.html", '{"accepted":["taxisoopya@hotmail.fr"],"rejected":[],"response":"250 2.0.0 Ok: queued as 08FA528007A","envelope":{"from":"suivi@easering.com","to":["taxisoopya@hotmail.fr"]},"messageId":"171eb866-c0f7-7992-e1a3-13242675d03c@easering.com"}', NOW());
