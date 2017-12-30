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
