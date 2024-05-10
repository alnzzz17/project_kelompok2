-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2024 at 10:07 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kelompok2`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `idAppointment` int(11) NOT NULL,
  `idPasien` varchar(255) NOT NULL,
  `idDokter` varchar(255) NOT NULL,
  `idResepsionis` varchar(255) NOT NULL,
  `dateTime` datetime NOT NULL,
  `poli` enum('Gigi','Umum') DEFAULT NULL,
  `queueNumber` int(11) NOT NULL,
  `keluhan` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `assuranceType` varchar(255) DEFAULT NULL,
  `appStatus` enum('TERDAFTAR','SEDANG DIPERIKSA','SELESAI') NOT NULL DEFAULT 'TERDAFTAR',
  `bill` int(11) DEFAULT NULL,
  `discount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `dokters`
--

CREATE TABLE `dokters` (
  `idDokter` varchar(255) NOT NULL,
  `sipNumber` varchar(255) NOT NULL,
  `profilePict` text DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `gender` varchar(255) NOT NULL,
  `personalAddress` varchar(255) DEFAULT NULL,
  `birthDate` date NOT NULL,
  `specialize` varchar(255) NOT NULL,
  `poli` enum('Gigi','Umum') NOT NULL,
  `profileDesc` text DEFAULT NULL,
  `role` varchar(255) DEFAULT 'Dokter',
  `schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`schedule`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pasiens`
--

CREATE TABLE `pasiens` (
  `idPasien` varchar(255) NOT NULL,
  `idNumber` varchar(255) NOT NULL,
  `profilePict` text DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `emergencyContact` varchar(255) NOT NULL,
  `birthDate` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `personalAddress` varchar(255) DEFAULT NULL,
  `historyPenyakit` text DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `role` varchar(255) DEFAULT 'Pasien',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `resepsionis`
--

CREATE TABLE `resepsionis` (
  `idRsp` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profilePict` text DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT 'Resepsionis',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`idAppointment`),
  ADD KEY `idPasien` (`idPasien`),
  ADD KEY `idDokter` (`idDokter`),
  ADD KEY `idResepsionis` (`idResepsionis`);

--
-- Indexes for table `dokters`
--
ALTER TABLE `dokters`
  ADD PRIMARY KEY (`idDokter`);

--
-- Indexes for table `pasiens`
--
ALTER TABLE `pasiens`
  ADD PRIMARY KEY (`idPasien`);

--
-- Indexes for table `resepsionis`
--
ALTER TABLE `resepsionis`
  ADD PRIMARY KEY (`idRsp`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `idAppointment` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`idPasien`) REFERENCES `pasiens` (`idPasien`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`idDokter`) REFERENCES `dokters` (`idDokter`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`idResepsionis`) REFERENCES `resepsionis` (`idRsp`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
