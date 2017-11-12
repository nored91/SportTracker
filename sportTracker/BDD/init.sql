CREATE TABLE `smt`.`account` ( 
    `id` INT(11) NOT NULL AUTO_INCREMENT , 
    `name` VARCHAR(255) NOT NULL , 
    `surname` VARCHAR(255) NOT NULL , 
    `mdp` VARCHAR(255) NOT NULL , 
    `email` VARCHAR(255) NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = MyISAM;