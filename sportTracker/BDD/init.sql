CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `verify` tinyint(1) NOT NULL DEFAULT '0',
  `rights` int(1) NOT NULL DEFAULT '0',
  `photo` mediumtext
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

------------------------------------------------------------------


CREATE TABLE `workout` (
  `id` int(11) NOT NULL,
  `id_account` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `resume` text NOT NULL,
  `description` text NOT NULL,
  `typeSport` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `feeling` text NOT NULL,
  `date` int(11) NOT NULL
  `photo` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `workout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `id_account` (`id_account`);

ALTER TABLE `workout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `workout`
  ADD CONSTRAINT `id_account_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id`);
