-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Sep 2026 pada 15.11
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') NOT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `duration` int(11) NOT NULL,
  `kuota` int(11) NOT NULL,
  `harga` decimal(12,2) NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `rating`, `thumbnail`, `level`, `status`, `duration`, `kuota`, `harga`, `category_id`, `user_id`) VALUES
(1, 'Dasar Pemrograman Python', 'Kursus Dasar Pemrograman Python', 8.0, NULL, 'beginner', 'published', 24, 30, 150000.00, 1, 1),
(2, 'JavaScript untuk Pemula', 'Kursus JavaScript untuk Pemula', 8.0, NULL, 'beginner', 'published', 20, 25, 175000.00, 1, 2),
(3, 'Membangun Website dengan HTML CSS', 'Kursus Membangun Website dengan HTML CSS', 8.0, NULL, 'beginner', 'published', 18, 20, 125000.00, 2, 3),
(4, 'React JS Modern', 'Kursus React JS Modern', 8.0, NULL, 'beginner', 'published', 30, 25, 350000.00, 2, 4),
(5, 'Data Analysis dengan Python', 'Kursus Data Analysis dengan Python', 8.0, NULL, 'beginner', 'published', 32, 20, 450000.00, 3, 5),
(6, 'Machine Learning Dasar', 'Kursus Machine Learning Dasar', 8.0, NULL, 'beginner', 'published', 40, 15, 750000.00, 4, 6),
(7, 'SQL dan Database MySQL', 'Kursus SQL dan Database MySQL', 8.0, NULL, 'beginner', 'published', 25, 30, 200000.00, 5, 7),
(8, 'Cyber Security Fundamental', 'Kursus Cyber Security Fundamental', 8.0, NULL, 'beginner', 'published', 35, 20, 850000.00, 6, 8),
(9, 'Android Development dengan Kotlin', 'Kursus Android Development dengan Kotlin', 8.0, NULL, 'beginner', 'published', 40, 15, 650000.00, 7, 9),
(10, 'UI UX Design untuk Pemula', 'Kursus UI UX Design untuk Pemula', 8.0, NULL, 'beginner', 'published', 20, 25, 180000.00, 8, 10),
(11, 'Cloud Computing Fundamental', 'Kursus Cloud Computing Fundamental', 8.0, NULL, 'beginner', 'published', 30, 20, 550000.00, 9, 11),
(12, 'DevOps dengan Docker', 'Kursus DevOps dengan Docker', 8.0, NULL, 'beginner', 'published', 35, 15, 900000.00, 10, 12),
(13, 'Software Engineering Dasar', 'Kursus Software Engineering Dasar', 8.0, NULL, 'beginner', 'published', 22, 30, 300000.00, 11, 13),
(14, 'Computer Network Fundamental', 'Kursus Computer Network Fundamental', 8.0, NULL, 'beginner', 'published', 28, 20, 275000.00, 12, 14),
(15, 'Game Development dengan Unity', 'Kursus Game Development dengan Unity', 8.0, NULL, 'beginner', 'published', 45, 0, 1250000.00, 13, 15),
(16, 'C++ Object Oriented Programming', 'Kursus C++ Object Oriented Programming', 8.0, NULL, 'beginner', 'published', 30, 25, 250000.00, 1, 1),
(17, 'Java Programming Fundamental', 'Kursus Java Programming Fundamental', 8.0, NULL, 'beginner', 'published', 35, 20, 400000.00, 1, 2),
(18, 'Pemrograman Go untuk Pemula', 'Kursus Pemrograman Go untuk Pemula', 8.0, NULL, 'beginner', 'published', 28, 20, 500000.00, 1, 3),
(19, 'Full Stack Web Development', 'Kursus Full Stack Web Development', 8.0, NULL, 'beginner', 'published', 45, 15, 950000.00, 2, 4),
(20, 'Backend Development dengan Node.js', 'Kursus Backend Development dengan Node.js', 8.0, NULL, 'beginner', 'published', 35, 20, 600000.00, 2, 5),
(21, 'Frontend Development dengan Vue.js', 'Kursus Frontend Development dengan Vue.js', 8.0, NULL, 'beginner', 'published', 30, 25, 325000.00, 2, 6),
(22, 'Golang Advanced Backend', 'Kursus Golang Advanced Backend', 8.0, NULL, 'beginner', 'published', 35, 20, 750000.00, 1, 16),
(23, 'Microservices Architecture', 'Kursus Microservices Architecture', 8.0, NULL, 'beginner', 'published', 40, 15, 1100000.00, 10, 16);

-- --------------------------------------------------------

--
-- Struktur dari tabel `course_categories`
--

CREATE TABLE `course_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `course_categories`
--

INSERT INTO `course_categories` (`id`, `name`, `description`) VALUES
(1, 'Programming', NULL),
(2, 'Web Development', NULL),
(3, 'Data Science', NULL),
(4, 'Artificial Intelligence', NULL),
(5, 'Database', NULL),
(6, 'Cyber Security', NULL),
(7, 'Mobile Development', NULL),
(8, 'UI/UX Design', NULL),
(9, 'Cloud Computing', NULL),
(10, 'DevOps', NULL),
(11, 'Software Engineering', NULL),
(12, 'Computer Networks', NULL),
(13, 'Game Development', NULL),
(14, 'Digital Marketing', NULL),
(15, 'Information Systems', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed','dropped') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `enrolled_at`, `status`) VALUES
(1, 1, 1, '2026-09-15 12:32:55', 'active'),
(2, 1, 7, '2026-09-15 12:32:55', 'completed'),
(3, 2, 2, '2026-09-15 12:32:55', 'active'),
(4, 3, 3, '2026-09-15 12:32:55', 'completed'),
(5, 4, 4, '2026-09-15 12:32:55', 'active'),
(6, 5, 5, '2026-09-15 12:32:55', 'active'),
(7, 6, 6, '2026-09-15 12:32:55', 'completed'),
(8, 7, 7, '2026-09-15 12:32:55', 'active'),
(9, 8, 8, '2026-09-15 12:32:55', 'dropped'),
(10, 9, 9, '2026-09-15 12:32:55', 'active'),
(11, 10, 10, '2026-09-15 12:32:55', 'completed'),
(12, 11, 11, '2026-09-15 12:32:55', 'active'),
(13, 12, 12, '2026-09-15 12:32:55', 'active'),
(14, 13, 13, '2026-09-15 12:32:55', 'completed'),
(15, 14, 14, '2026-09-15 12:32:55', 'active'),
(16, 15, 15, '2026-09-15 12:32:55', 'dropped'),
(17, 16, 19, '2026-09-15 12:32:55', 'active'),
(18, 17, 2, '2026-09-15 12:32:55', 'active');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`) VALUES
(1, 'Andi Pratama', 'andi.pratama@gmail.com', 'password123'),
(2, 'Budi Santoso', 'budi.santoso@gmail.com', 'password123'),
(3, 'Citra Lestari', 'citra.lestari@gmail.com', 'password123'),
(4, 'Dimas Saputra', 'dimas.saputra@gmail.com', 'password123'),
(5, 'Eka Putri', 'eka.putri@gmail.com', 'password123'),
(6, 'Fajar Ramadhan', 'fajar.ramadhan@gmail.com', 'password123'),
(7, 'Gita Maharani', 'gita.maharani@gmail.com', 'password123'),
(8, 'Hendra Wijaya', 'hendra.wijaya@gmail.com', 'password123'),
(9, 'Intan Permata', 'intan.permata@gmail.com', 'password123'),
(10, 'Joko Susanto', 'joko.susanto@gmail.com', 'password123'),
(11, 'Karin Amelia', 'karin.amelia@gmail.com', 'password123'),
(12, 'Lukman Hakim', 'lukman.hakim@gmail.com', 'password123'),
(13, 'Maya Sari', 'maya.sari@gmail.com', 'password123'),
(14, 'Nanda Firmansyah', 'nanda.firmansyah@gmail.com', 'password123'),
(15, 'Olivia Ananda', 'olivia.ananda@gmail.com', 'password123'),
(16, 'Raka Pangestu', 'raka.pangestu@gmail.com', 'password123'),
(17, 'Siti Rahma', 'siti.rahma@gmail.com', 'password123');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_course_harga` (`harga`);

--
-- Indeks untuk tabel `course_categories`
--
ALTER TABLE `course_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_enrollments_user` (`user_id`),
  ADD KEY `fk_enrollments_course` (`course_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT untuk tabel `course_categories`
--
ALTER TABLE `course_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `course_categories` (`id`);

--
-- Ketidakleluasaan untuk tabel `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
