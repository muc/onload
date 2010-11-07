-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 03. November 2010 um 00:26
-- Server Version: 5.1.41
-- PHP-Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `onload_db`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=64 ;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `admin`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'a4d80eac9ab26a4a2da04125bc2c096a', 'admin@onload.loc', 1, '2010-10-29 00:20:01', '2010-11-03 00:22:16'),
(2, 'Melissa', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Nam.interdum@egestasblanditNam.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'Vivien', 'a4d80eac9ab26a4a2da04125bc2c096a', 'nisi.Mauris.nulla@eratvitae.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'Basil', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Vestibulum.ut.eros@augueSed.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Husan', 'a4d80eac9ab26a4a2da04125bc2c096a', 'natoque.penatibus.et@musProin.com', 0, '0000-00-00 00:00:00', '2010-11-02 20:01:13'),
(6, 'Sybill', 'a4d80eac9ab26a4a2da04125bc2c096a', 'urna@idnunc.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 'Madison', 'a4d80eac9ab26a4a2da04125bc2c096a', 'ante.iaculis@liberoInteger.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'Colby', 'a4d80eac9ab26a4a2da04125bc2c096a', 'cursus.Nunc.mauris@Donec.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 'Zahir', 'a4d80eac9ab26a4a2da04125bc2c096a', 'metus.Aliquam@etmagnis.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'Meghan', 'a4d80eac9ab26a4a2da04125bc2c096a', 'non.luctus.sit@aliquetvel.com', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 'Victor', 'a4d80eac9ab26a4a2da04125bc2c096a', 'est.Nunc@loremsemper.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 'Lynn', 'a4d80eac9ab26a4a2da04125bc2c096a', 'scelerisque.mollis.Phasellus@eratvitaerisus.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 'Keelie', 'a4d80eac9ab26a4a2da04125bc2c096a', 'convallis.in.cursus@Crassed.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'Pamela', 'a4d80eac9ab26a4a2da04125bc2c096a', 'sociis@ipsumnon.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'Dillon', 'a4d80eac9ab26a4a2da04125bc2c096a', 'urna.Ut@Aenean.com', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 'Fulton', 'a4d80eac9ab26a4a2da04125bc2c096a', 'libero.lacus@ametmassaQuisque.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 'Benjamin', 'a4d80eac9ab26a4a2da04125bc2c096a', 'nunc@enimMauris.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'Laith', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Pellentesque.habitant@feugiat.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 'Silas', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Etiam.bibendum.fermentum@adipiscing.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 'Leah', 'a4d80eac9ab26a4a2da04125bc2c096a', 'non@arcuVestibulumut.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 'Steel', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Praesent.eu.dui@eratSednunc.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'Denton', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Suspendisse@tellusloremeu.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'Libby', 'a4d80eac9ab26a4a2da04125bc2c096a', 'malesuada.fames@asollicitudin.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'Shelley', 'a4d80eac9ab26a4a2da04125bc2c096a', 'ornare@consectetuerrhoncus.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 'Tiger', 'a4d80eac9ab26a4a2da04125bc2c096a', 'eget.lacus.Mauris@mattisornarelectus.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 'Alfreda', 'a4d80eac9ab26a4a2da04125bc2c096a', 'semper.et@cubilia.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'Kylynn', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Sed.id.risus@varius.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 'Serena', 'a4d80eac9ab26a4a2da04125bc2c096a', 'auctor.Mauris@atfringillapurus.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'Calvin', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Suspendisse@consequat.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'Amena', 'a4d80eac9ab26a4a2da04125bc2c096a', 'cursus.et@gravida.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'Nevada', 'a4d80eac9ab26a4a2da04125bc2c096a', 'lobortis@ipsum.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'Garrett', 'a4d80eac9ab26a4a2da04125bc2c096a', 'elementum.at.egestas@Duis.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'Dominic', 'a4d80eac9ab26a4a2da04125bc2c096a', 'aliquam.adipiscing@ametorci.com', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, 'Lila', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Donec@consequatauctor.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'Nyssa', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Aliquam.ultrices.iaculis@Aliquamfringilla.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, 'Preston', 'a4d80eac9ab26a4a2da04125bc2c096a', 'cursus@cursus.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(37, 'Linus', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Praesent.eu@metusvitaevelit.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(38, 'Cora', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Donec.luctus@netusetmalesuada.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(39, 'Lilah', 'a4d80eac9ab26a4a2da04125bc2c096a', 'nec.malesuada.ut@lorem.com', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(40, 'Nash', 'a4d80eac9ab26a4a2da04125bc2c096a', 'Integer.in.magna@sagittissemper.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(41, 'Drake', 'a4d80eac9ab26a4a2da04125bc2c096a', 'ut.aliquam.iaculis@morbitristiquesenectus.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(42, 'Risa', 'a4d80eac9ab26a4a2da04125bc2c096a', 'egestas@feugiat.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(43, 'Mona', 'a4d80eac9ab26a4a2da04125bc2c096a', 'eget.volutpat.ornare@consectetuer.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(44, 'Pascale', 'a4d80eac9ab26a4a2da04125bc2c096a', 'mus.Proin.vel@acfacilisis.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(45, 'Ori', 'a4d80eac9ab26a4a2da04125bc2c096a', 'arcu@Fusce.com', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(46, 'Aiko', 'a4d80eac9ab26a4a2da04125bc2c096a', 'dolor@orciadipiscingnon.org', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(47, 'Drew', 'a4d80eac9ab26a4a2da04125bc2c096a', 'orci.consectetuer@Nullatinciduntneque.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(48, 'Evangeline', 'a4d80eac9ab26a4a2da04125bc2c096a', 'elementum.lorem@Aliquam.edu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(49, 'Tamekah', 'a4d80eac9ab26a4a2da04125bc2c096a', 'ac.eleifend.vitae@sitamet.ca', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
