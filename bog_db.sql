-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 30, 2022 at 07:52 AM
-- Server version: 8.0.31-0ubuntu0.20.04.1
-- PHP Version: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bog_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_details`
--

CREATE TABLE `bank_details` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bank_code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_details`
--

INSERT INTO `bank_details` (`id`, `userId`, `account_number`, `account_name`, `bank_name`, `bank_code`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('3f4f70f6-c100-4c91-87d9-63119ee3f517', '754d5284-7a79-43c1-89b8-8034dd6534ce', '1381417409', 'KAREEM LATEEF YOMI', 'Access Bank', '044', '2022-11-03 00:35:23', '2022-11-03 22:59:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `corporate_clients`
--

CREATE TABLE `corporate_clients` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'corporate_client',
  `isVerified` tinyint(1) DEFAULT '0',
  `company_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_street` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cac_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tin` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bvn` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `certificate_of_operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `professional_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tax_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `corporate_clients`
--

INSERT INTO `corporate_clients` (`id`, `userId`, `userType`, `isVerified`, `company_address`, `company_state`, `company_city`, `company_street`, `company_name`, `cac_number`, `tin`, `bvn`, `years_of_experience`, `certificate_of_operation`, `professional_certificate`, `tax_certificate`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('a50a751a-1080-4db7-92ee-8c7881325876', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'corporate_client', 0, NULL, NULL, NULL, NULL, 'Company One', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-11-18 05:44:40', '2022-11-18 05:44:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `orderSlug` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `deliveryFee` float DEFAULT NULL,
  `totalAmount` float DEFAULT NULL,
  `status` enum('pending','approved','cancelled','completed') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `orderSlug`, `userId`, `discount`, `deliveryFee`, `totalAmount`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('29f1a39f-d803-4f84-8002-f60cc9cbcfbb', 'ORD-959243905', '754d5284-7a79-43c1-89b8-8034dd6534ce', 5, 500, 200000, 'approved', '2022-11-29 23:59:36', '2022-11-30 00:24:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `trackingId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('paid','awaiting_shipment','shipped','delivered','cancelled','refunded','declined','completed') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `productOwner` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `shippingAddress` text COLLATE utf8mb4_general_ci,
  `product` text COLLATE utf8mb4_general_ci,
  `paymentInfo` text COLLATE utf8mb4_general_ci,
  `quantity` float DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `deliveryFee` float DEFAULT NULL,
  `totalAmount` float DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `returnDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `trackingId`, `status`, `ownerId`, `productOwner`, `shippingAddress`, `product`, `paymentInfo`, `quantity`, `discount`, `amount`, `deliveryFee`, `totalAmount`, `paymentDate`, `dueDate`, `returnDate`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('7b41af5c-ad2a-42a7-a705-07eafb28780b', '29f1a39f-d803-4f84-8002-f60cc9cbcfbb', 'TRD-959243905', 'paid', '754d5284-7a79-43c1-89b8-8034dd6534ce', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '{\"city\":\"Ikeja\",\"state\":\"Lagos\",\"country\":\"Nigeria\",\"postal_code\":\"2018871\"}', '{\"id\":\"0b0ba6b4-3d99-4709-9d29-723bb56c958d\",\"name\":\"20 Tons of Sharp Filling Sand\",\"price\":\"478000\",\"unit\":\"tons\",\"image\":\"uploads/yRHXMxOimage 4.png\",\"description\":\"Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna\"}', '{\"reference\":\"TR-1727334\",\"amount\":28389400}', 5, NULL, 2390000, NULL, NULL, NULL, NULL, NULL, '2022-11-29 23:59:36', '2022-11-29 23:59:36', NULL),
('af712657-caec-4af1-9dbf-c51833937ee0', '29f1a39f-d803-4f84-8002-f60cc9cbcfbb', 'TRD-959243905', 'paid', '754d5284-7a79-43c1-89b8-8034dd6534ce', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '{\"city\":\"Ikeja\",\"state\":\"Lagos\",\"country\":\"Nigeria\",\"postal_code\":\"2018871\"}', '{\"id\":\"661004d7-d9a7-4c18-9620-93834f90888f\",\"name\":\"20 Tons of building sand\",\"price\":\"198000\",\"unit\":\"tons\",\"image\":\"uploads/8TKQ2V6image 4.png\",\"description\":\"Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna\"}', '{\"reference\":\"TR-1727334\",\"amount\":28389400}', 10, NULL, 1980000, NULL, NULL, NULL, NULL, NULL, '2022-11-29 23:59:36', '2022-11-29 23:59:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `payment_category` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_reference` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `userId`, `payment_category`, `payment_reference`, `amount`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('0fe4037b-4399-4aa1-97b5-c6a88866e915', '754d5284-7a79-43c1-89b8-8034dd6534ce', 'Order', 'TR-1727334', 28389400, '2022-11-29 23:53:17', '2022-11-29 23:53:17', NULL),
('12dd66b7-7327-4f9a-b00c-cb774a8ba166', '754d5284-7a79-43c1-89b8-8034dd6534ce', 'Order', 'TR-1727334', 28389400, '2022-11-29 23:50:01', '2022-11-29 23:50:01', NULL),
('e73df33f-5a24-49d6-a76f-2e764875babc', '754d5284-7a79-43c1-89b8-8034dd6534ce', 'Order', 'TR-1727334', 28389400, '2022-11-29 23:59:36', '2022-11-29 23:59:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `private_clients`
--

CREATE TABLE `private_clients` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'private_client',
  `isVerified` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `categoryId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `creatorId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `quantity` decimal(10,0) DEFAULT NULL,
  `unit` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `showInShop` tinyint(1) DEFAULT '0',
  `status` enum('draft','pending','in_review','approved','disapproved') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `categoryId`, `creatorId`, `price`, `quantity`, `unit`, `image`, `showInShop`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('0871c123-aaa5-4ea7-a4a7-3fe74e5d4630', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/CFBQL2Alogo.png', 0, 'in_review', '2022-11-15 23:18:05', '2022-11-15 23:20:46', NULL),
('0b0ba6b4-3d99-4709-9d29-723bb56c958d', '20 Tons of Sharp Filling Sand', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', 'ea86f613-050f-413f-a92c-70619d9790c9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '478000', '20', 'tons', 'uploads/yRHXMxOimage 4.png', 1, 'disapproved', '2022-11-11 22:33:39', '2022-11-17 00:13:22', NULL),
('0de458a7-dd64-45f4-a39e-c30ebc8ae88a', '30 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '150000', '10', 'bags', NULL, 0, 'pending', '2022-11-16 23:14:51', '2022-11-16 23:14:51', '2022-11-16 23:17:26'),
('0f748822-f066-41a0-9d5c-5b08d05d6adf', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/52xr1Tflogo.png', 0, 'draft', '2022-11-15 23:22:48', '2022-11-15 23:22:48', NULL),
('1452dbf0-0728-47ba-ba00-e475289a9144', '20 Tons of Sharp Filling Sand', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '90000', '40', 'tons', 'uploads/0iJzqB1logo2.png', 1, 'disapproved', '2022-11-11 21:00:27', '2022-11-17 00:57:50', NULL),
('1cefc20b-db6c-4a01-b4b8-37919f2cc5e0', '10 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '100000', '10', 'bags', 'uploads/82GFHBklogo.png', 0, 'draft', '2022-11-15 20:55:42', '2022-11-15 20:55:42', NULL),
('1de30839-01b9-4252-88c7-7bf8ab0b63f7', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/VpTxtdUlogo.png', 0, 'draft', '2022-11-15 23:22:51', '2022-11-15 23:22:51', NULL),
('230c3cd0-1995-4578-83d8-a347ffac71e0', '50 Bags of Dangote Cement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '30000', '50', 'Bags', 'uploads/NbA0KCgjakub-dziubak-XtUd5SiX464-unsplash.jpg', 1, 'approved', '2022-11-16 22:20:30', '2022-11-17 01:02:15', NULL),
('2843ab15-8237-4118-afeb-29be74a32b44', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/aDlhju7logo.png', 0, 'in_review', '2022-11-15 23:18:03', '2022-11-15 23:22:39', NULL),
('2d8b8640-1598-48fb-b868-788465759b52', '10 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', 'ea86f613-050f-413f-a92c-70619d9790c9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '478000', '10', 'tons', 'uploads/kf8uhF7clay-banks-_wkd7XBRfU4-unsplash.jpg', 0, 'draft', '2022-11-11 21:36:01', '2022-11-11 21:36:01', '2022-11-11 21:37:03'),
('309edc86-55b5-43ca-a5eb-cfd7486bec56', 'Steel Reinforcement (Local)', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '478000', '100', 'bars', 'uploads/vT0dHDWclay-banks-_wkd7XBRfU4-unsplash.jpg', 1, 'approved', '2022-11-11 21:32:03', '2022-11-11 22:24:36', NULL),
('3281635c-8871-4829-85c2-6185af20ba2c', '18 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '150000', '18', 'bags', 'uploads/IOKn8QClogo.png', 0, 'draft', '2022-11-15 20:56:00', '2022-11-15 20:56:00', '2022-11-15 22:35:04'),
('409b4293-9613-48a0-8cae-a1c332545a3d', '5 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '150000', '5', 'tons', 'uploads/ABMj2Amlogo.png', 1, 'approved', '2022-11-15 20:58:28', '2022-11-17 01:02:48', NULL),
('4510ad52-9932-4b42-ad7a-c2d71d4352b2', '40 Steel Bars', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '3000', '40', 'Bars', 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384023/zkgoi0txghiakmywd4wq.png', 1, 'approved', '2022-11-25 13:47:09', '2022-11-25 13:56:55', '2022-11-25 14:04:56'),
('4c69608e-efd0-4023-b83b-8a4f19023743', '30 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '150000', '30', 'bags', NULL, 0, 'pending', '2022-11-16 23:14:38', '2022-11-16 23:14:38', '2022-11-16 23:17:22'),
('5254459d-c6ad-4991-a74b-ae14057fe3e9', '20 Bags of Dangote Cement ', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '100000', '20', 'bags', 'https://res.cloudinary.com/yhomi1996/image/upload/v1668976535/gvpe72uaofghdvn3ugep.jpg', 0, 'draft', '2022-11-20 20:35:57', '2022-11-20 20:35:57', NULL),
('5aca8267-5aa4-474d-9632-78b21d666fee', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/hDjh4WRlogo.png', 0, 'in_review', '2022-11-15 23:18:07', '2022-11-15 23:18:27', NULL),
('5bc2a67f-ab93-465b-9e50-b93c3642e40d', 'Sand Product', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\r\n\r\n', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'b1ea50b9-3fe6-4e56-8e67-c7349481b74a', '138940', '10', 'Containers', 'uploads/ARG01hilogo2.png', 0, 'in_review', '2022-11-17 21:40:43', '2022-11-17 21:40:43', NULL),
('5eee6b93-275a-4198-872f-d147fd164308', '20 Bags of Dangote Cement ', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '100000', '20', 'bags', 'uploads/j6lIo9zfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', 0, 'in_review', '2022-11-15 23:25:11', '2022-11-15 23:25:36', '2022-11-24 21:00:21'),
('661004d7-d9a7-4c18-9620-93834f90888f', '20 Tons of building sand', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', 'ea86f613-050f-413f-a92c-70619d9790c9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '198000', '20', 'tons', 'uploads/8TKQ2V6image 4.png', 1, 'disapproved', '2022-11-11 22:35:26', '2022-11-17 00:13:38', NULL),
('68adb102-9513-48a0-a531-204655b3d475', '15 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '150000', '15', 'tons', 'uploads/FRQtaUjlogo.png', 0, 'draft', '2022-11-15 20:58:44', '2022-11-15 20:58:44', '2022-11-15 22:42:48'),
('6a1c0b32-4a98-4ca3-a6c2-c5f682c2159a', '20 Tons of Granite stones', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'ea86f613-050f-413f-a92c-70619d9790c9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '3000', '20', 'Tons', 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384385/hwycax0g6v9fjrcnpgu7.jpg', 0, 'draft', '2022-11-25 13:53:08', '2022-11-25 13:53:08', NULL),
('731d1e48-afb3-489e-9b82-1f09c61fc8ad', '20 Bags of Dangote Cement ', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '100000', '20', 'bags', 'https://res.cloudinary.com/yhomi1996/image/upload/v1668977136/ffikfhv2bqc5qj7i3b2f.jpg', 0, 'draft', '2022-11-20 20:46:05', '2022-11-20 20:46:05', NULL),
('781effcc-e541-4aad-bd82-0cea8f295172', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/6A0nBB6logo.png', 0, 'in_review', '2022-11-15 22:56:04', '2022-11-15 23:16:29', NULL),
('8911ee1e-f4a8-4180-88b0-f0208ccfc17c', '12 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '32000', '10', 'Bars', 'uploads/NDPuT08Screenshot_20220405-095220_Slack.jpg', 0, 'pending', '2022-11-15 20:56:19', '2022-11-16 23:23:31', NULL),
('9021d8c4-f48e-4ef4-942b-f944602261ca', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/l1DNdqAlogo.png', 0, 'draft', '2022-11-15 23:22:53', '2022-11-15 23:22:53', NULL),
('a64f043b-8a3f-43ee-b4ec-4754329d0531', 'Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit', '91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '19998', '8', 'Bars', 'uploads/ZyRmRMMtmail_icon.png', 0, 'disapproved', '2022-11-16 22:34:02', '2022-11-17 01:03:26', NULL),
('ab87de1d-bf6c-404e-bb13-6afd116b9299', '10 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', 'ea86f613-050f-413f-a92c-70619d9790c9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '478000', '10', 'tons', 'uploads/yaIAlzNclay-banks-_wkd7XBRfU4-unsplash.jpg', 1, 'disapproved', '2022-11-11 21:35:59', '2022-11-17 00:09:58', NULL),
('ae701dec-802b-464b-96ff-da3adc64edc3', '34 Tons of fine Sand', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '2000', '34', 'Tons', 'https://res.cloudinary.com/yhomi1996/image/upload/v1669383870/eyiv75hswruvx9kveitk.svg', 0, 'in_review', '2022-11-25 13:44:39', '2022-11-25 13:55:06', NULL),
('bf2d465b-e442-46aa-aeb5-75a7494512d8', 'Samantha Smith', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '1000', '10', 'Bags', 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323359/nlxgawmvzim0nhnpibqg.svg', 0, 'pending', '2022-11-24 20:56:04', '2022-11-24 20:56:04', NULL),
('c840879b-d597-4d97-9300-d34f59dc54a8', '10 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '39999', '10', 'bags', NULL, 0, 'pending', '2022-11-16 23:13:10', '2022-11-16 23:13:10', '2022-11-16 23:17:13'),
('cac9e955-74b9-4a4a-871e-b9644498df77', 'Elephant cement Load', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '20000', '100', 'bags', 'uploads/wF6e4zfclay-banks-_wkd7XBRfU4-unsplash.jpg', 0, 'pending', '2022-11-11 21:05:47', '2022-11-16 23:07:31', NULL),
('caf7cf61-ef5b-435f-915f-fc518dc2794f', '5 Bars of Steel Reinforcement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '30000', '5', 'Bags', NULL, 0, 'pending', '2022-11-16 23:14:11', '2022-11-16 23:14:11', '2022-11-16 23:17:17'),
('d1b5225d-42b9-454e-8bc2-0a06edc42cef', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/HY6OV4Tlogo.png', 0, 'draft', '2022-11-15 23:22:49', '2022-11-15 23:22:49', NULL),
('d1f3eea5-f719-41cf-8df6-4007c50f7ff1', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/Hc0fkvFlogo.png', 0, 'draft', '2022-11-15 23:22:52', '2022-11-15 23:22:52', NULL),
('d2a4e988-e968-4445-a6f4-7616085cf8c7', '50 Bags of Dangote Cement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '4500000', '50', 'bags', 'uploads/sVmWa2Slogo2.png', 0, 'pending', '2022-11-15 20:53:24', '2022-11-16 23:21:25', NULL),
('d4d5f24b-07b1-4b4b-abfa-8a50d346d40a', '5 Containers of Sand', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '50000', '5', 'Containers', 'uploads/yOM2Cwo1fad38085083e0b56b3c79ec5e43d6b3.jpg', 0, 'pending', '2022-11-16 22:28:48', '2022-11-16 22:28:48', NULL),
('d544d7bb-97f3-4ced-9a7e-58bbe2337d5c', '20 Bags of Dangote Cement ', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '100000', '20', 'bags', 'https://res.cloudinary.com/yhomi1996/image/upload/v1668976570/o396dvi7vsk3xqh0vpsl.jpg', 0, 'draft', '2022-11-20 20:36:21', '2022-11-20 20:36:21', NULL),
('d93b3983-53bd-4f47-baf2-63b9c2876a2b', '100 Bags of Dangote Cement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '1000000', '50', 'bags', 'uploads/zoH9yx0logo.png', 0, 'in_review', '2022-11-15 20:54:52', '2022-11-15 22:51:45', NULL),
('ddc9caee-931e-4ddb-8ea7-1580110cbaa1', '50 Bags of Dangote Cement', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '400000', '50', 'bags', 'uploads/hq3tf3alogo.png', 0, 'draft', '2022-11-15 20:54:37', '2022-11-15 20:54:37', '2022-11-15 22:39:51'),
('df8985f3-f6c9-4423-8459-3693cd8bc8ea', '15 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '150000', '15', 'tons', 'uploads/11Xxhc5logo.png', 0, 'in_review', '2022-11-15 22:43:01', '2022-11-15 22:56:52', NULL),
('e5cbb4c8-3f80-45af-86fe-5397f762dc64', 'Samantha Smith', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '1000', '20', 'trucks', 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323449/uhc3mjyqzebvry8xiexv.svg', 0, 'pending', '2022-11-24 20:57:40', '2022-11-24 20:57:40', NULL),
('e76dce34-690d-4e0b-8c89-7f5699a29357', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/0j9jT5Tlogo.png', 0, 'in_review', '2022-11-15 23:18:04', '2022-11-15 23:21:57', NULL),
('e8e82f68-40de-4e02-8a6b-130fb9523fdd', '25 Tons Construction Stones', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '7b059cb3-75cb-4b81-be11-9ef4c5581607', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '25', 'tons', 'uploads/4i1XbKllogo.png', 1, 'approved', '2022-11-15 23:22:54', '2022-11-17 01:04:17', NULL),
('f019ca95-5f72-4c2b-b776-0f5c38810159', '50 Bags of Dangote Cement', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '5000', '50', 'Bags', 'https://res.cloudinary.com/yhomi1996/image/upload/v1669322683/rxvckpdljqpr90j6grcx.jpg', 0, 'pending', '2022-11-24 20:44:50', '2022-11-24 20:44:50', NULL),
('fff942c1-1a6a-4963-96ff-d8d2b39cae0f', '50 Bags of Dangote Cement ', 'Consequat mollit commodo laboris amet est occaecat velit velit proident enim nulla eu. Deserunt consectetur cillum irure magna cillum elit mollit nulla. Ullamco commodo irure est aliquip qui anim qui occaecat magna', '68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '200000', '50', 'bags', 'uploads/C823g1Yfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', 0, 'draft', '2022-11-15 23:24:56', '2022-11-15 23:24:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('68c5e476-d25d-4d96-8ebe-2b9fafbbec01', 'Cement', 'dummy text', '2022-11-09 00:17:07', '2022-11-09 00:17:07', NULL),
('7b059cb3-75cb-4b81-be11-9ef4c5581607', 'Sand', 'dummy text', '2022-11-11 20:42:48', '2022-11-11 20:42:48', NULL),
('815f30a6-1fd2-4e56-9e73-c0d01e43abbf', 'Sands', 'Simple building sand', '2022-11-09 00:16:27', '2022-11-09 00:19:41', '2022-11-09 00:20:15'),
('91a5d97f-c2f1-4f61-889d-d4e5b56dd91c', 'Steel', 'dummy text', '2022-11-09 00:17:13', '2022-11-09 00:17:13', NULL),
('ea86f613-050f-413f-a92c-70619d9790c9', 'Gravel', 'dummy text', '2022-11-09 00:16:49', '2022-11-09 00:16:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `creatorId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `name`, `productId`, `creatorId`, `image`, `createdAt`, `updatedAt`, `deletedAt`, `url`) VALUES
('001bff64-b80f-4984-8fa1-96d54aa72049', 'T-mail-email.jpg', '1de30839-01b9-4252-88c7-7bf8ab0b63f7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/EJoDT0tT-mail-email.jpg', '2022-11-15 23:22:51', '2022-11-15 23:22:51', NULL, NULL),
('0134c3ae-9858-4bf7-ae35-e6c47eca7921', 'logo.png', '2843ab15-8237-4118-afeb-29be74a32b44', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/aDlhju7logo.png', '2022-11-15 23:18:03', '2022-11-15 23:18:03', NULL, NULL),
('02b572e6-6c1f-4b42-91ca-77cb4f10785b', 'logo.png', 'd93b3983-53bd-4f47-baf2-63b9c2876a2b', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/zoH9yx0logo.png', '2022-11-15 20:54:52', '2022-11-15 20:54:52', NULL, NULL),
('036d85d2-e92e-4c5d-9191-8e67982d23db', 'T-mail-email.png', 'ddc9caee-931e-4ddb-8ea7-1580110cbaa1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/CrzTxryT-mail-email.png', '2022-11-15 20:54:37', '2022-11-15 20:54:37', NULL, NULL),
('06b1f1d0-78c5-49fc-ad23-d772f9a6c5a0', 'logo.png', '5aca8267-5aa4-474d-9632-78b21d666fee', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/hDjh4WRlogo.png', '2022-11-15 23:18:07', '2022-11-15 23:18:07', NULL, NULL),
('070ec1a0-916f-4eb3-8b3f-e31b6e705ad2', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '5eee6b93-275a-4198-872f-d147fd164308', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/j6lIo9zfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-15 23:25:11', '2022-11-15 23:25:11', NULL, NULL),
('07897275-4b30-4185-9608-b1aed4d88f6d', 'unnamed.jpg', '2d8b8640-1598-48fb-b868-788465759b52', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/fIS1DQKunnamed.jpg', '2022-11-11 21:36:01', '2022-11-11 21:36:01', NULL, NULL),
('08f2d2e5-8c28-45c7-8871-19a4fe9a8c31', 'T-mail-email.png', 'd1f3eea5-f719-41cf-8df6-4007c50f7ff1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/w5eA5kQT-mail-email.png', '2022-11-15 23:22:52', '2022-11-15 23:22:52', NULL, NULL),
('0b54ffc9-fd04-4375-a254-39a80664a182', 'logo2.png', 'ddc9caee-931e-4ddb-8ea7-1580110cbaa1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/vl8b1Wklogo2.png', '2022-11-15 20:54:37', '2022-11-15 20:54:37', NULL, NULL),
('0c8aeeed-8aa5-4c74-b86c-1804ded65eaa', 'T-mail-email.png', '3281635c-8871-4829-85c2-6185af20ba2c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/jJVRz72T-mail-email.png', '2022-11-15 20:56:00', '2022-11-15 20:56:00', NULL, NULL),
('10c22210-d418-4e75-859b-e939b040e7a5', 'T-mail-email.jpg', '4510ad52-9932-4b42-ad7a-c2d71d4352b2', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/miSYS0IT-mail-email.jpg', '2022-11-25 13:47:09', '2022-11-25 13:47:09', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384028/hk4o4g0wx6qcykbo2v4l.jpg'),
('12dcc543-cfbd-4408-8233-cf2a81e24569', 'logo.png', 'd544d7bb-97f3-4ced-9a7e-58bbe2337d5c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/HnAZ83glogo.png', '2022-11-20 20:36:21', '2022-11-20 20:36:21', NULL, NULL),
('13f6d7ee-899d-4b60-8328-0efe3257aceb', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', 'ab87de1d-bf6c-404e-bb13-6afd116b9299', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/yaIAlzNclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-11 21:35:59', '2022-11-11 21:35:59', NULL, NULL),
('154655ca-778b-4813-b077-d4a2777104d0', 'logo2.png', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/qUTGSiRlogo2.png', '2022-11-15 20:53:24', '2022-11-15 20:53:24', '2022-11-16 23:21:25', NULL),
('15e2834a-581d-45fc-9acf-e9a1c36b569d', 'T-mail-email.jpg', 'df8985f3-f6c9-4423-8459-3693cd8bc8ea', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/ygN99ktT-mail-email.jpg', '2022-11-15 22:43:01', '2022-11-15 22:43:01', NULL, NULL),
('18369312-c8b5-48ae-b40e-acd7726aba8e', 'logo2.png', '3281635c-8871-4829-85c2-6185af20ba2c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Q0rkrXBlogo2.png', '2022-11-15 20:56:00', '2022-11-15 20:56:00', NULL, NULL),
('190cf229-08f3-4ae4-a893-ab0640ff9220', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '309edc86-55b5-43ca-a5eb-cfd7486bec56', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/vT0dHDWclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-11 21:32:03', '2022-11-11 21:32:03', NULL, NULL),
('19d7bb17-c8c7-4d62-9656-1b9389468923', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '5254459d-c6ad-4991-a74b-ae14057fe3e9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/KKufcOSfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-20 20:35:57', '2022-11-20 20:35:57', NULL, NULL),
('1bc84ca3-1b77-4f98-92db-0b59c2d944c1', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', 'd544d7bb-97f3-4ced-9a7e-58bbe2337d5c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/8X0SeNrclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-20 20:36:21', '2022-11-20 20:36:21', NULL, NULL),
('1bced5e0-9a7f-4874-90a7-fa96a52d5bac', 'T-mail-email.jpg', '3281635c-8871-4829-85c2-6185af20ba2c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/CJCOfWVT-mail-email.jpg', '2022-11-15 20:56:00', '2022-11-15 20:56:00', NULL, NULL),
('1c25e792-6f3e-4ca2-8675-ca515d036616', 'logo2.png', '0871c123-aaa5-4ea7-a4a7-3fe74e5d4630', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/D3QigGAlogo2.png', '2022-11-15 23:18:05', '2022-11-15 23:18:05', NULL, NULL),
('1c7010fd-c876-4d6e-91df-4ba4adc6c18c', 'logo2.png', '781effcc-e541-4aad-bd82-0cea8f295172', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/ZwPTkn5logo2.png', '2022-11-15 22:56:04', '2022-11-15 22:56:04', NULL, NULL),
('1d42a1dd-8bc1-4d98-9e88-73d88c8c3338', 'T-mail-email.jpg', '0f748822-f066-41a0-9d5c-5b08d05d6adf', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Q1EopCFT-mail-email.jpg', '2022-11-15 23:22:48', '2022-11-15 23:22:48', NULL, NULL),
('1f20fd36-a8a5-43f4-9ba6-f382cd993af9', 'i5kz9nctylg1gnzdqppj.png', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/VbLVMCei5kz9nctylg1gnzdqppj.png', '2022-11-16 23:23:31', '2022-11-16 23:23:31', NULL, NULL),
('20859d0f-b6ec-4b5e-ad7b-19e148a5b277', 'logo2.png', 'df8985f3-f6c9-4423-8459-3693cd8bc8ea', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/irF40Aylogo2.png', '2022-11-15 22:43:01', '2022-11-15 22:43:01', NULL, NULL),
('223ff287-eae0-4042-ac63-be806574e8b5', 'logo2.png', 'd93b3983-53bd-4f47-baf2-63b9c2876a2b', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/edYad0elogo2.png', '2022-11-15 20:54:52', '2022-11-15 20:54:52', NULL, NULL),
('22462596-9392-41cc-b2db-3a1150f43d17', 'logo2.png', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/oprPJ8dlogo2.png', '2022-11-15 20:56:19', '2022-11-15 20:56:19', '2022-11-16 23:23:31', NULL),
('2702be33-6ce7-4e5a-a838-7633bc8b0c7b', 'logo.png', '5254459d-c6ad-4991-a74b-ae14057fe3e9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/AbgNc6klogo.png', '2022-11-20 20:35:57', '2022-11-20 20:35:57', NULL, NULL),
('291875ba-ff77-48fb-b369-955282cb87c7', 'logo2.png', '2843ab15-8237-4118-afeb-29be74a32b44', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/trgPLvclogo2.png', '2022-11-15 23:18:03', '2022-11-15 23:18:03', NULL, NULL),
('2d722920-f15c-4bed-a9af-d240e6b71623', 'T-mail-email.jpg', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/z501OtkT-mail-email.jpg', '2022-11-15 20:56:19', '2022-11-15 20:56:19', '2022-11-16 23:23:31', NULL),
('30d77e28-7fa2-4006-9726-642044d7b3e1', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', 'd544d7bb-97f3-4ced-9a7e-58bbe2337d5c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/CKjkzqSfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-20 20:36:21', '2022-11-20 20:36:21', NULL, NULL),
('32691df2-0212-46f6-9220-7b189c60868d', 'Screenshot_20220405-095220_Slack.jpg', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/NDPuT08Screenshot_20220405-095220_Slack.jpg', '2022-11-16 23:23:31', '2022-11-16 23:23:31', NULL, NULL),
('33171efa-7684-4b5e-99f4-2fa218f9151b', 'noImage.jpg', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Aue3V1xnoImage.jpg', '2022-11-16 23:21:25', '2022-11-16 23:21:25', NULL, NULL),
('356b6111-3c99-43cb-ae24-51b538a4257a', 'T-mail-email.png', '5aca8267-5aa4-474d-9632-78b21d666fee', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/rY9xAJFT-mail-email.png', '2022-11-15 23:18:07', '2022-11-15 23:18:07', NULL, NULL),
('3684424c-6903-4b41-a218-eee29de5960c', 'logo2.png', 'fff942c1-1a6a-4963-96ff-d8d2b39cae0f', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/KZGeuc0logo2.png', '2022-11-15 23:24:56', '2022-11-15 23:24:56', NULL, NULL),
('376dc432-ccab-4f89-b047-4d95dcc6d9d9', 'logo.png', 'df8985f3-f6c9-4423-8459-3693cd8bc8ea', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/11Xxhc5logo.png', '2022-11-15 22:43:01', '2022-11-15 22:43:01', NULL, NULL),
('3d9f3a42-ead6-4e3f-aa66-d6a1a9c41f42', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '5eee6b93-275a-4198-872f-d147fd164308', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/y6XjRJqclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-15 23:25:11', '2022-11-15 23:25:11', NULL, NULL),
('3e8c2d60-7b84-45d2-9874-6a88eb31edb9', 'logo2.png', 'e8e82f68-40de-4e02-8a6b-130fb9523fdd', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/XM0bFEglogo2.png', '2022-11-15 23:22:54', '2022-11-15 23:22:54', NULL, NULL),
('41a561c1-0528-47f4-b540-24873ffdac67', 'T-mail-email.jpg', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/rDsvxBdT-mail-email.jpg', '2022-11-15 20:53:24', '2022-11-15 20:53:24', '2022-11-16 23:21:25', NULL),
('455469bb-ea31-49d3-9b76-76545aad607d', 'logo.png', '731d1e48-afb3-489e-9b82-1f09c61fc8ad', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/rzITOVMlogo.png', '2022-11-20 20:46:05', '2022-11-20 20:46:05', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1668977163/opdwqnerucbvrupo9l6b.png'),
('46729238-9fbf-4560-a40e-c0b55d0c4780', 'logo.png', '3281635c-8871-4829-85c2-6185af20ba2c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/IOKn8QClogo.png', '2022-11-15 20:56:00', '2022-11-15 20:56:00', NULL, NULL),
('48569b08-9f11-467d-b081-e13c35c32c21', 'logo.png', 'e76dce34-690d-4e0b-8c89-7f5699a29357', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/0j9jT5Tlogo.png', '2022-11-15 23:18:04', '2022-11-15 23:18:04', NULL, NULL),
('48acae50-c4a1-4e46-91f8-35d3b2e64cc4', 'T-mail-email.jpg', '9021d8c4-f48e-4ef4-942b-f944602261ca', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/l71JunPT-mail-email.jpg', '2022-11-15 23:22:53', '2022-11-15 23:22:53', NULL, NULL),
('48ec512e-e691-4906-80e9-72ad51ca5aaf', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', 'f019ca95-5f72-4c2b-b776-0f5c38810159', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/QdJdGdjfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-24 20:44:50', '2022-11-24 20:44:50', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669322687/roiwpybx3osrrohcqs6t.jpg'),
('48f80f32-8fdb-4a4c-a3e4-63a8101c85bf', 'T-mail-email.png', '4510ad52-9932-4b42-ad7a-c2d71d4352b2', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/O15fLOHT-mail-email.png', '2022-11-25 13:47:09', '2022-11-25 13:47:09', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384027/xj4hi7gmaj7mjw12zqvv.png'),
('4be490f0-5aad-4a31-a580-b23d80092408', 'T-mail-email.png', '1cefc20b-db6c-4a01-b4b8-37919f2cc5e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/AQNhiUwT-mail-email.png', '2022-11-15 20:55:42', '2022-11-15 20:55:42', NULL, NULL),
('4cb8b3d1-04a1-47a5-924d-a6165c0ee02f', 'image 4.png', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/yAv4mjbimage 4.png', '2022-11-16 23:23:31', '2022-11-16 23:23:31', NULL, NULL),
('4cc94f70-e1bb-463b-832d-ded3a36eec1b', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '731d1e48-afb3-489e-9b82-1f09c61fc8ad', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/VpR6qLAfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-20 20:46:05', '2022-11-20 20:46:05', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1668977136/ffikfhv2bqc5qj7i3b2f.jpg'),
('4cf25863-c62b-4d97-a5ba-2b5047a6c579', 'tmail_icon.png', 'a64f043b-8a3f-43ee-b4ec-4754329d0531', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/ZyRmRMMtmail_icon.png', '2022-11-16 22:34:02', '2022-11-16 22:34:02', NULL, NULL),
('4f0f727d-0a60-42ad-ae07-9cb0115d18f4', 'jakub-dziubak-XtUd5SiX464-unsplash.jpg', '230c3cd0-1995-4578-83d8-a347ffac71e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/NbA0KCgjakub-dziubak-XtUd5SiX464-unsplash.jpg', '2022-11-16 22:20:30', '2022-11-16 22:20:30', NULL, NULL),
('504f7613-16ad-4136-b272-4832cafd6c8e', 'logo.png', 'e8e82f68-40de-4e02-8a6b-130fb9523fdd', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/4i1XbKllogo.png', '2022-11-15 23:22:54', '2022-11-15 23:22:54', NULL, NULL),
('51bac15e-28e4-4c37-914b-c7e113bece83', 'T-mail-email.jpg', '409b4293-9613-48a0-8cae-a1c332545a3d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/tBjtWuBT-mail-email.jpg', '2022-11-15 20:58:28', '2022-11-15 20:58:28', NULL, NULL),
('5310fa15-2b5d-4926-9fa8-6b81f05367b1', 'logo2.png', '1cefc20b-db6c-4a01-b4b8-37919f2cc5e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/LhNfmxglogo2.png', '2022-11-15 20:55:42', '2022-11-15 20:55:42', NULL, NULL),
('534a09e8-f1ec-441d-9516-265e45511201', 'logo.png', '0871c123-aaa5-4ea7-a4a7-3fe74e5d4630', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/CFBQL2Alogo.png', '2022-11-15 23:18:05', '2022-11-15 23:18:05', NULL, NULL),
('545a2fb0-fb29-42c0-8305-6c190941e63f', 'T-mail-email.png', 'df8985f3-f6c9-4423-8459-3693cd8bc8ea', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/WOnI2dHT-mail-email.png', '2022-11-15 22:43:01', '2022-11-15 22:43:01', NULL, NULL),
('562c0c5c-ef1c-4295-8a72-7a429e19ea18', 'logo2.png', '5bc2a67f-ab93-465b-9e50-b93c3642e40d', 'b1ea50b9-3fe6-4e56-8e67-c7349481b74a', 'uploads/ARG01hilogo2.png', '2022-11-17 21:40:43', '2022-11-17 21:40:43', NULL, NULL),
('5657ae15-d07d-4b7a-acf7-c06b2144884f', 'unnamed.jpg', 'ab87de1d-bf6c-404e-bb13-6afd116b9299', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/9sHF1dmunnamed.jpg', '2022-11-11 21:35:59', '2022-11-11 21:35:59', NULL, NULL),
('5c84407d-e5ce-436e-b106-822e26e33fa8', 'T-mail-email.jpg', 'cac9e955-74b9-4a4a-871e-b9644498df77', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/1zhCsxYT-mail-email.jpg', '2022-11-11 21:23:46', '2022-11-11 21:23:46', NULL, NULL),
('5d395222-8775-4a1c-a30a-53fba36fae10', 'T-mail-email.png', 'e76dce34-690d-4e0b-8c89-7f5699a29357', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/xMiQ29KT-mail-email.png', '2022-11-15 23:18:04', '2022-11-15 23:18:04', NULL, NULL),
('5f001d42-8f9a-4989-97e0-ed2e3ac60913', 'T-mail-email.jpg', 'd1b5225d-42b9-454e-8bc2-0a06edc42cef', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/NVpIQgNT-mail-email.jpg', '2022-11-15 23:22:49', '2022-11-15 23:22:49', NULL, NULL),
('5f7168ca-e723-4cdf-8bd4-9c3d7c3b3879', 'logo2.png', '5254459d-c6ad-4991-a74b-ae14057fe3e9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/R5APayOlogo2.png', '2022-11-20 20:35:57', '2022-11-20 20:35:57', NULL, NULL),
('6053b901-5c3b-4dcd-9706-815c7b69475a', 'icons8-mysql-logo.svg', 'e5cbb4c8-3f80-45af-86fe-5397f762dc64', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/mkUbXozicons8-mysql-logo.svg', '2022-11-24 20:57:40', '2022-11-24 20:57:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323457/dhnv6akm87kgw4iwnrjy.svg'),
('60800ac4-a20a-4024-a97d-e4c8c806417e', 'logo.png', 'ddc9caee-931e-4ddb-8ea7-1580110cbaa1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/hq3tf3alogo.png', '2022-11-15 20:54:37', '2022-11-15 20:54:37', NULL, NULL),
('60809128-456c-41b5-875e-5d267d16f451', 'T-mail-email.jpg', '0871c123-aaa5-4ea7-a4a7-3fe74e5d4630', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/EQLu50kT-mail-email.jpg', '2022-11-15 23:18:05', '2022-11-15 23:18:05', NULL, NULL),
('63bc1ed2-e918-4025-9fc2-2739e8b7643b', 'WhatsApp Image 2022-05-05 at 3.05.12 PM.jpeg', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/kEyTKWjWhatsApp Image 2022-05-05 at 3.05.12 PM.jpeg', '2022-11-16 23:21:25', '2022-11-16 23:21:25', NULL, NULL),
('66223855-1ad5-4722-957f-22e71dbd609e', '1fad38085083e0b56b3c79ec5e43d6b3.jpg', 'ab87de1d-bf6c-404e-bb13-6afd116b9299', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/foNJSfe1fad38085083e0b56b3c79ec5e43d6b3.jpg', '2022-11-11 21:35:59', '2022-11-11 21:35:59', NULL, NULL),
('672c957e-e3a9-407c-aaa5-f996f0b713f4', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', 'fff942c1-1a6a-4963-96ff-d8d2b39cae0f', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/C823g1Yfahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-15 23:24:56', '2022-11-15 23:24:56', NULL, NULL),
('6aeef77c-db52-437b-897b-655e00fdc500', 'logo.png', 'cac9e955-74b9-4a4a-871e-b9644498df77', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/iwoouIKlogo.png', '2022-11-11 21:23:46', '2022-11-11 21:23:46', NULL, NULL),
('6b7bab14-decb-48b0-b19c-7ad59fd9ad42', 'T-mail-email.png', '9021d8c4-f48e-4ef4-942b-f944602261ca', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Dfp0AilT-mail-email.png', '2022-11-15 23:22:53', '2022-11-15 23:22:53', NULL, NULL),
('6d3c7490-c910-42d0-80e4-b497cb5e602c', 'T-mail-email.jpg', '68adb102-9513-48a0-a531-204655b3d475', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/WlNNzKsT-mail-email.jpg', '2022-11-15 20:58:44', '2022-11-15 20:58:44', NULL, NULL),
('6d4e7903-5df2-4e8d-8204-526ed206a981', 'logo.png', 'd1b5225d-42b9-454e-8bc2-0a06edc42cef', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/HY6OV4Tlogo.png', '2022-11-15 23:22:49', '2022-11-15 23:22:49', NULL, NULL),
('6dd397fa-afd6-48e6-847b-38002429ed41', 'T-mail-email.png', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/n7bxHaNT-mail-email.png', '2022-11-15 20:56:19', '2022-11-15 20:56:19', '2022-11-16 23:23:31', NULL),
('6e088120-a40a-49f1-b808-002b63ebfa3e', 'T-mail-email.png', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/aP5hhxKT-mail-email.png', '2022-11-15 20:53:24', '2022-11-15 20:53:24', '2022-11-16 23:21:25', NULL),
('7062efba-da03-49c2-8113-23fa74102b13', 'logo2.png', '6a1c0b32-4a98-4ca3-a6c2-c5f682c2159a', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/tG24TUtlogo2.png', '2022-11-25 13:53:08', '2022-11-25 13:53:08', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384387/i0yod7zm9xm7xlazr9yo.png'),
('7370d7f7-8218-4b9a-88c7-0b3ddacdb223', 'logo.png', '6a1c0b32-4a98-4ca3-a6c2-c5f682c2159a', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/TxWOMuIlogo.png', '2022-11-25 13:53:08', '2022-11-25 13:53:08', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384386/iiywyvke3skka1luhf54.png'),
('74f601d7-9101-4f2d-877d-8aa7a25a14fa', 'logo.png', '1cefc20b-db6c-4a01-b4b8-37919f2cc5e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/82GFHBklogo.png', '2022-11-15 20:55:42', '2022-11-15 20:55:42', NULL, NULL),
('7501127c-615f-429c-9912-e1426df3f90a', 'mysql.svg', 'ae701dec-802b-464b-96ff-da3adc64edc3', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/HVD1meNmysql.svg', '2022-11-25 13:44:40', '2022-11-25 13:44:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669383873/cp8iehlwhyjsyfqx4gkw.svg'),
('7964882c-8474-4acf-ad2d-fdf81dc120ba', 'logo2.png', 'e76dce34-690d-4e0b-8c89-7f5699a29357', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/7fA30M9logo2.png', '2022-11-15 23:18:04', '2022-11-15 23:18:04', NULL, NULL),
('79d531fb-e1c0-4e9a-8e62-babdc08e861c', 'logo2.png', '1de30839-01b9-4252-88c7-7bf8ab0b63f7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/l5XTTFMlogo2.png', '2022-11-15 23:22:51', '2022-11-15 23:22:51', NULL, NULL),
('7c82d8bd-700f-4d2c-b655-8c6089d3cdd9', 'logo.png', '1de30839-01b9-4252-88c7-7bf8ab0b63f7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/VpTxtdUlogo.png', '2022-11-15 23:22:51', '2022-11-15 23:22:51', NULL, NULL),
('807a4741-7ea5-499e-9e6d-2f680666ff90', 'T-mail-email.png', '409b4293-9613-48a0-8cae-a1c332545a3d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/X6sJIhpT-mail-email.png', '2022-11-15 20:58:28', '2022-11-15 20:58:28', NULL, NULL),
('831be160-0a32-4529-8cb6-3386e00100a8', 'logo.png', '0f748822-f066-41a0-9d5c-5b08d05d6adf', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/52xr1Tflogo.png', '2022-11-15 23:22:48', '2022-11-15 23:22:48', NULL, NULL),
('83e3b6e8-737b-48b9-b512-5bcafe0e97ed', 'logo2.png', '68adb102-9513-48a0-a531-204655b3d475', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/mFMDWKnlogo2.png', '2022-11-15 20:58:44', '2022-11-15 20:58:44', NULL, NULL),
('85ba32d4-a95a-4a95-add1-5b35c96bcacb', 'T-mail-email.png', 'd1b5225d-42b9-454e-8bc2-0a06edc42cef', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/bRsvZoZT-mail-email.png', '2022-11-15 23:22:49', '2022-11-15 23:22:49', NULL, NULL),
('87cbf496-a390-40c0-8ae7-561e2ad06e66', 'noImage.jpg', 'ab87de1d-bf6c-404e-bb13-6afd116b9299', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/dz4rXIjnoImage.jpg', '2022-11-11 21:35:59', '2022-11-11 21:35:59', NULL, NULL),
('8fb589f1-ed00-496c-9e03-4d1753640c8b', 'i5kz9nctylg1gnzdqppj.png', '661004d7-d9a7-4c18-9620-93834f90888f', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/yRCuxWMi5kz9nctylg1gnzdqppj.png', '2022-11-11 22:35:26', '2022-11-11 22:35:26', NULL, NULL),
('90b6d75b-1b9f-4340-a33c-3b7a2fbad0fe', 'postgresql.svg', 'bf2d465b-e442-46aa-aeb5-75a7494512d8', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/TrBAi8wpostgresql.svg', '2022-11-24 20:56:04', '2022-11-24 20:56:04', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323359/nlxgawmvzim0nhnpibqg.svg'),
('92669fa9-c7df-4366-a01b-2a494246d270', 'T-mail-email.jpg', '781effcc-e541-4aad-bd82-0cea8f295172', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/kHE9NiVT-mail-email.jpg', '2022-11-15 22:56:04', '2022-11-15 22:56:04', NULL, NULL),
('93bac30f-af72-464b-b40d-8d183f23881e', 'logo.png', 'ae701dec-802b-464b-96ff-da3adc64edc3', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/RfwLIRylogo.png', '2022-11-25 13:44:40', '2022-11-25 13:44:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669383879/dfswjzs7sybt5jxzkh46.png'),
('94739b9e-ff84-4e3f-a1ae-ca667ff4dcbf', 'T-mail-email.jpg', 'd1f3eea5-f719-41cf-8df6-4007c50f7ff1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/SArlYvTT-mail-email.jpg', '2022-11-15 23:22:52', '2022-11-15 23:22:52', NULL, NULL),
('95d301b4-1b8a-480a-a32b-8255ed4426b3', 'logo.png', '8911ee1e-f4a8-4180-88b0-f0208ccfc17c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/znyIGEHlogo.png', '2022-11-15 20:56:19', '2022-11-15 20:56:19', '2022-11-16 23:23:31', NULL),
('96a3a3d9-c0f9-4cfd-84ce-4cf4206f2509', 'nathan-dumlao-nBJHO6wmRWw-unsplash.jpg', 'f019ca95-5f72-4c2b-b776-0f5c38810159', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/VytnBZ5nathan-dumlao-nBJHO6wmRWw-unsplash.jpg', '2022-11-24 20:44:50', '2022-11-24 20:44:50', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669322683/rxvckpdljqpr90j6grcx.jpg'),
('976f476c-99c2-4c65-8618-540406e8251c', 'logo2.png', '409b4293-9613-48a0-8cae-a1c332545a3d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/1s38i19logo2.png', '2022-11-15 20:58:28', '2022-11-15 20:58:28', NULL, NULL),
('986d9e6c-afdf-4f4b-8424-b6ec27b57cdf', 'logo.png', '409b4293-9613-48a0-8cae-a1c332545a3d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/ABMj2Amlogo.png', '2022-11-15 20:58:28', '2022-11-15 20:58:28', NULL, NULL),
('99fbdd2f-4dfa-40a6-bc96-5f4c31f91efb', 'T-mail-email.png', '1de30839-01b9-4252-88c7-7bf8ab0b63f7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/7XEIBjST-mail-email.png', '2022-11-15 23:22:51', '2022-11-15 23:22:51', NULL, NULL),
('9bf3b01e-ada1-433f-90fc-cb39bdb9997a', 'logo2.png', '5aca8267-5aa4-474d-9632-78b21d666fee', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/1UokW15logo2.png', '2022-11-15 23:18:07', '2022-11-15 23:18:07', NULL, NULL),
('9cc17adf-231d-491d-93ca-dca6a78c1dc8', 'WhatsApp Image 2022-05-05 at 3.05.12 PM.jpeg', 'a64f043b-8a3f-43ee-b4ec-4754329d0531', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/hnjXUU3WhatsApp Image 2022-05-05 at 3.05.12 PM.jpeg', '2022-11-16 22:34:02', '2022-11-16 22:34:02', NULL, NULL),
('9cf69d3f-8bbd-4a9e-a08e-5f5c2e792e51', 'noImage.jpg', '2d8b8640-1598-48fb-b868-788465759b52', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/zXWBPwLnoImage.jpg', '2022-11-11 21:36:01', '2022-11-11 21:36:01', NULL, NULL),
('9dbd9e7d-8d4c-4be1-98ba-7ec66d00d80d', 'logo2.png', '0f748822-f066-41a0-9d5c-5b08d05d6adf', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/cTH0XIKlogo2.png', '2022-11-15 23:22:48', '2022-11-15 23:22:48', NULL, NULL),
('9f0b3f24-a24e-448b-87fe-38c8bada46a2', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '731d1e48-afb3-489e-9b82-1f09c61fc8ad', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/IVu025Mclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-20 20:46:05', '2022-11-20 20:46:05', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1668977161/csevmkmatu90v7o12hvo.jpg'),
('a06c1c59-0160-4431-aa11-99787ea07f04', 'logo2.png', 'd1f3eea5-f719-41cf-8df6-4007c50f7ff1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/2QUP1kdlogo2.png', '2022-11-15 23:22:52', '2022-11-15 23:22:52', NULL, NULL),
('a236b9a3-319b-404a-bd83-d3e46853ca96', 'logo.png', '4510ad52-9932-4b42-ad7a-c2d71d4352b2', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/COsAzU2logo.png', '2022-11-25 13:47:09', '2022-11-25 13:47:09', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384023/zkgoi0txghiakmywd4wq.png'),
('a3ec3fc3-41b4-48ee-aa31-497e3e57e15f', 'image 4.png', '0b0ba6b4-3d99-4709-9d29-723bb56c958d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/yRHXMxOimage 4.png', '2022-11-11 22:33:39', '2022-11-11 22:33:39', NULL, NULL),
('a581a031-bdbf-4354-825c-e31652e99dd2', '1fad38085083e0b56b3c79ec5e43d6b3.jpg', '309edc86-55b5-43ca-a5eb-cfd7486bec56', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/LKgg6yV1fad38085083e0b56b3c79ec5e43d6b3.jpg', '2022-11-11 21:32:03', '2022-11-11 21:32:03', NULL, NULL),
('a7d0e04d-9d0d-495d-abd1-03c5d587716d', 'T-mail-email.png', '781effcc-e541-4aad-bd82-0cea8f295172', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/qkIrvCGT-mail-email.png', '2022-11-15 22:56:04', '2022-11-15 22:56:04', NULL, NULL),
('a94eea50-50b8-401f-994a-335b4f46bfb3', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', 'cac9e955-74b9-4a4a-871e-b9644498df77', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/wF6e4zfclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-11 21:23:46', '2022-11-11 21:23:46', NULL, NULL),
('ac937e87-646e-4b27-8851-e43d8b70dc6c', 'T-mail-email.png', 'd93b3983-53bd-4f47-baf2-63b9c2876a2b', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/gxh1ZWHT-mail-email.png', '2022-11-15 20:54:52', '2022-11-15 20:54:52', NULL, NULL),
('ae28c963-9f28-4723-a03a-49ab683a87a7', 'logo2.png', '1452dbf0-0728-47ba-ba00-e475289a9144', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/0iJzqB1logo2.png', '2022-11-11 21:00:27', '2022-11-11 21:00:27', NULL, NULL),
('ae76d672-e503-4078-b246-7a44442c16d5', 'logo.png', 'd1f3eea5-f719-41cf-8df6-4007c50f7ff1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Hc0fkvFlogo.png', '2022-11-15 23:22:52', '2022-11-15 23:22:52', NULL, NULL),
('ae8a5481-56ef-4754-af80-972ddeb5a81e', 'logo2.png', 'd1b5225d-42b9-454e-8bc2-0a06edc42cef', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/ltpqB2nlogo2.png', '2022-11-15 23:22:49', '2022-11-15 23:22:49', NULL, NULL),
('af905831-fcf4-4377-a84e-c631ac8190f9', 'tmail_icon.png', '2d8b8640-1598-48fb-b868-788465759b52', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/BofkJu1tmail_icon.png', '2022-11-11 21:36:01', '2022-11-11 21:36:01', NULL, NULL),
('b0a069fb-0d3f-413a-801f-408acef9f2aa', 'logo.png', '781effcc-e541-4aad-bd82-0cea8f295172', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/6A0nBB6logo.png', '2022-11-15 22:56:04', '2022-11-15 22:56:04', NULL, NULL),
('b2bdfefe-91ed-4784-bd0b-fbf2bdab0d73', 'i5kz9nctylg1gnzdqppj.png', '0b0ba6b4-3d99-4709-9d29-723bb56c958d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/qHxoEq4i5kz9nctylg1gnzdqppj.png', '2022-11-11 22:33:39', '2022-11-11 22:33:39', NULL, NULL),
('b36da70d-f222-432b-9114-2a5dd2644eef', 'T-mail-email.jpg', '5aca8267-5aa4-474d-9632-78b21d666fee', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/vrsdydET-mail-email.jpg', '2022-11-15 23:18:07', '2022-11-15 23:18:07', NULL, NULL),
('b600e4f9-8e6c-494d-b54c-904b62b7ba1b', 'Screenshot 2022-03-29 at 16.19.59.png', '661004d7-d9a7-4c18-9620-93834f90888f', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/mR6dEEOScreenshot 2022-03-29 at 16.19.59.png', '2022-11-11 22:35:26', '2022-11-11 22:35:26', NULL, NULL),
('b62e4cac-c064-4285-98d5-d9003796027a', 'T-mail-email.png', '68adb102-9513-48a0-a531-204655b3d475', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/cic4B4WT-mail-email.png', '2022-11-15 20:58:44', '2022-11-15 20:58:44', NULL, NULL),
('bbce3f7f-680c-4597-8601-4f486222da69', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', 'f019ca95-5f72-4c2b-b776-0f5c38810159', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Bu6Kw3Kclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-24 20:44:50', '2022-11-24 20:44:50', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669322689/l7qybrjja1fu2typhk1b.jpg'),
('bc7ecbde-f8da-4050-a097-3dbdbf33fd0e', 'logo2.png', '9021d8c4-f48e-4ef4-942b-f944602261ca', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/sqWpE48logo2.png', '2022-11-15 23:22:53', '2022-11-15 23:22:53', NULL, NULL),
('bc9f6cae-f6c7-447f-a44b-4cc5979c51bd', 'Screenshot 2022-03-29 at 16.19.59.png', '0b0ba6b4-3d99-4709-9d29-723bb56c958d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/QkAwmgiScreenshot 2022-03-29 at 16.19.59.png', '2022-11-11 22:33:39', '2022-11-11 22:33:39', NULL, NULL),
('bdd30c64-a9f4-4ebd-8d04-a25cd076d502', 'T-mail-email.jpg', '2843ab15-8237-4118-afeb-29be74a32b44', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/4Ddsb7sT-mail-email.jpg', '2022-11-15 23:18:03', '2022-11-15 23:18:03', NULL, NULL),
('c0f88c46-6b48-45eb-898e-3c4d1bd43796', 'T-mail-email.jpg', '5bc2a67f-ab93-465b-9e50-b93c3642e40d', 'b1ea50b9-3fe6-4e56-8e67-c7349481b74a', 'uploads/qDLS9KsT-mail-email.jpg', '2022-11-17 21:40:43', '2022-11-17 21:40:43', NULL, NULL),
('c28249f1-0bfa-4234-876a-746e73c48f0d', 'T-mail-email.jpg', 'e76dce34-690d-4e0b-8c89-7f5699a29357', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/optWYIMT-mail-email.jpg', '2022-11-15 23:18:04', '2022-11-15 23:18:04', NULL, NULL),
('c490c4ac-b365-4706-ba22-8d9d8eca31b2', 'tmail_icon.png', '309edc86-55b5-43ca-a5eb-cfd7486bec56', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/iiIwA2atmail_icon.png', '2022-11-11 21:32:03', '2022-11-11 21:32:03', NULL, NULL),
('c5b9c712-8a14-4418-b026-5657aef234e4', '1fad38085083e0b56b3c79ec5e43d6b3.jpg', 'd4d5f24b-07b1-4b4b-abfa-8a50d346d40a', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/yOM2Cwo1fad38085083e0b56b3c79ec5e43d6b3.jpg', '2022-11-16 22:28:48', '2022-11-16 22:28:48', NULL, NULL),
('c688b0f2-cfd9-410f-a7fe-174203dbf0f1', 'logo2.png', '4510ad52-9932-4b42-ad7a-c2d71d4352b2', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/RqUXH0elogo2.png', '2022-11-25 13:47:09', '2022-11-25 13:47:09', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384026/h90l7fseka9iql5znzui.png'),
('c7341ce0-484b-4f1c-8910-55dd107ad30e', 'postgresql.svg', 'e5cbb4c8-3f80-45af-86fe-5397f762dc64', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/WgIu90qpostgresql.svg', '2022-11-24 20:57:40', '2022-11-24 20:57:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323449/uhc3mjyqzebvry8xiexv.svg'),
('cab399ac-0ea2-4fef-ad23-503b24081b13', 'logo.png', '68adb102-9513-48a0-a531-204655b3d475', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/FRQtaUjlogo.png', '2022-11-15 20:58:44', '2022-11-15 20:58:44', NULL, NULL),
('cbe53589-360d-4c94-83e0-44806d3203b1', 'unnamed.jpg', 'd4d5f24b-07b1-4b4b-abfa-8a50d346d40a', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/hMKDAPTunnamed.jpg', '2022-11-16 22:28:48', '2022-11-16 22:28:48', NULL, NULL),
('cf4435d2-8b6a-4571-8f34-f78b5b8ac796', 'T-mail-email.png', '1452dbf0-0728-47ba-ba00-e475289a9144', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/JVWua7sT-mail-email.png', '2022-11-11 21:00:27', '2022-11-11 21:00:27', NULL, NULL),
('d31d25c9-a332-4d39-a55b-ea3b47babb2b', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '2d8b8640-1598-48fb-b868-788465759b52', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/kf8uhF7clay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-11 21:36:01', '2022-11-11 21:36:01', NULL, NULL),
('d336bca7-d30d-4a98-8f6a-106e5e18ff9f', 'logo.png', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/am7DCV1logo.png', '2022-11-15 20:53:24', '2022-11-15 20:53:24', '2022-11-16 23:21:25', NULL),
('d6c869ad-a755-4cce-aa40-e0a4b19d2a39', 'icons8-postgresql.svg', 'e5cbb4c8-3f80-45af-86fe-5397f762dc64', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/eiUZd09icons8-postgresql.svg', '2022-11-24 20:57:40', '2022-11-24 20:57:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323453/cbbwskzflcbz6okwkr7u.svg'),
('d8d4f023-3bd0-49e1-85d2-4b206c98027c', 'T-mail-email.png', '0f748822-f066-41a0-9d5c-5b08d05d6adf', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Pdg75gET-mail-email.png', '2022-11-15 23:22:48', '2022-11-15 23:22:48', NULL, NULL),
('db6f1233-1dae-4fad-8fb6-12191a0c2b03', 'image 4.png', '661004d7-d9a7-4c18-9620-93834f90888f', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/8TKQ2V6image 4.png', '2022-11-11 22:35:26', '2022-11-11 22:35:26', NULL, NULL),
('de35716e-7d63-4adf-97be-4c27b8fa09bb', 'fahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '230c3cd0-1995-4578-83d8-a347ffac71e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/ziiC52Afahmi-fakhrudin-nzyzAUsbV0M-unsplash.jpg', '2022-11-16 22:20:30', '2022-11-16 22:20:30', NULL, NULL),
('dfc11598-9896-4d7c-a667-b3cf43349a22', 'noImage.jpg', '309edc86-55b5-43ca-a5eb-cfd7486bec56', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/va3BuwFnoImage.jpg', '2022-11-11 21:32:03', '2022-11-11 21:32:03', NULL, NULL),
('e0d8dfab-19e6-4bce-bc80-503cb2cafa6a', '1fad38085083e0b56b3c79ec5e43d6b3.jpg', '2d8b8640-1598-48fb-b868-788465759b52', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/DnwQiS41fad38085083e0b56b3c79ec5e43d6b3.jpg', '2022-11-11 21:36:01', '2022-11-11 21:36:01', NULL, NULL),
('e1a5bfd1-6c59-4981-a8ee-dcf29f53b4b1', 'T-mail-email.png', 'e8e82f68-40de-4e02-8a6b-130fb9523fdd', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/C8CxpOeT-mail-email.png', '2022-11-15 23:22:54', '2022-11-15 23:22:54', NULL, NULL),
('e203b78e-2425-4d00-8aad-8da2833209e8', 'T-mail-email.jpg', 'e8e82f68-40de-4e02-8a6b-130fb9523fdd', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/iLhJiMJT-mail-email.jpg', '2022-11-15 23:22:54', '2022-11-15 23:22:54', NULL, NULL),
('e3336124-5e8c-476c-9fa8-5a4f70ddd5cc', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', 'fff942c1-1a6a-4963-96ff-d8d2b39cae0f', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/j6Dg4yCclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-15 23:24:56', '2022-11-15 23:24:56', NULL, NULL),
('e60f7943-0daf-471d-acce-bb31fdb78d31', 'icons8-mysql-logo.svg', 'ae701dec-802b-464b-96ff-da3adc64edc3', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/geOCTWficons8-mysql-logo.svg', '2022-11-25 13:44:40', '2022-11-25 13:44:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669383870/eyiv75hswruvx9kveitk.svg'),
('e6ff63a7-13eb-4e3c-ab81-efa1e4e6fe2f', 'T-mail-email.jpg', 'ddc9caee-931e-4ddb-8ea7-1580110cbaa1', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/euU8D9nT-mail-email.jpg', '2022-11-15 20:54:37', '2022-11-15 20:54:37', NULL, NULL),
('eaba9b2f-158d-4458-952d-9153f8752403', 'logo2.png', 'd2a4e988-e968-4445-a6f4-7616085cf8c7', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/sVmWa2Slogo2.png', '2022-11-16 23:21:25', '2022-11-16 23:21:25', NULL, NULL),
('eb99c198-b9eb-465f-a04a-dee66a74ece5', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '6a1c0b32-4a98-4ca3-a6c2-c5f682c2159a', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/5oGGKhpclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-25 13:53:08', '2022-11-25 13:53:08', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669384385/hwycax0g6v9fjrcnpgu7.jpg'),
('ec049a10-6e19-4e52-8eef-8a1bdd2f7afe', 'T-mail-email.jpg', '1cefc20b-db6c-4a01-b4b8-37919f2cc5e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Sgc7XmNT-mail-email.jpg', '2022-11-15 20:55:42', '2022-11-15 20:55:42', NULL, NULL),
('ecf5574a-cee2-459f-8bb2-a78ab31d8ffd', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '5254459d-c6ad-4991-a74b-ae14057fe3e9', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/2BQ8clSclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-20 20:35:57', '2022-11-20 20:35:57', NULL, NULL),
('ed1ceedb-bc88-4507-be85-46a8f8220ec8', 'T-mail-email.png', '0871c123-aaa5-4ea7-a4a7-3fe74e5d4630', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/8qAQS1bT-mail-email.png', '2022-11-15 23:18:05', '2022-11-15 23:18:05', NULL, NULL),
('eff75ae7-ce3b-436b-9fdd-301021134a89', 'T-mail-email.png', '2843ab15-8237-4118-afeb-29be74a32b44', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/Ulh6StDT-mail-email.png', '2022-11-15 23:18:03', '2022-11-15 23:18:03', NULL, NULL),
('f00da75d-3e31-47c5-b524-f42affc92225', 'logo2.png', '5eee6b93-275a-4198-872f-d147fd164308', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/04nnWyelogo2.png', '2022-11-15 23:25:11', '2022-11-15 23:25:11', NULL, NULL),
('f01ff7b9-c7b4-4f88-b465-c1d1c63e3855', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', '230c3cd0-1995-4578-83d8-a347ffac71e0', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/w0lWhfCclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-16 22:20:30', '2022-11-16 22:20:30', NULL, NULL),
('f0c6092b-8686-4ee8-bbd8-9e435d74600f', 'logo.png', '9021d8c4-f48e-4ef4-942b-f944602261ca', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/l1DNdqAlogo.png', '2022-11-15 23:22:53', '2022-11-15 23:22:53', NULL, NULL),
('f5bb169c-2a88-45fa-b95b-a8a98969525e', 'logo2.png', '731d1e48-afb3-489e-9b82-1f09c61fc8ad', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/3DqIwdhlogo2.png', '2022-11-20 20:46:05', '2022-11-20 20:46:05', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1668977165/yv2wiuylx4fdey7sqtzv.png'),
('f83392ba-8769-4278-ad5b-179d81e402b4', 'clay-banks-_wkd7XBRfU4-unsplash.jpg', 'ae701dec-802b-464b-96ff-da3adc64edc3', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/clKzkqTclay-banks-_wkd7XBRfU4-unsplash.jpg', '2022-11-25 13:44:40', '2022-11-25 13:44:40', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669383877/r0pryeeh708toglmmuj2.jpg'),
('f83ebe74-cf9e-4894-9aec-64bb22c26e9d', 'mysql.svg', 'bf2d465b-e442-46aa-aeb5-75a7494512d8', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/JpVUjfPmysql.svg', '2022-11-24 20:56:04', '2022-11-24 20:56:04', NULL, 'https://res.cloudinary.com/yhomi1996/image/upload/v1669323362/rstbxdkjhksp7dwi3spv.svg'),
('fa480fed-596d-405a-a3de-d84e733442b6', 'unnamed.jpg', '309edc86-55b5-43ca-a5eb-cfd7486bec56', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/jWIRz0cunnamed.jpg', '2022-11-11 21:32:03', '2022-11-11 21:32:03', NULL, NULL),
('fa492111-80b8-4dfa-85d5-7fc848fb8b61', 'T-mail-email.jpg', 'd93b3983-53bd-4f47-baf2-63b9c2876a2b', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/7ZVjtDGT-mail-email.jpg', '2022-11-15 20:54:52', '2022-11-15 20:54:52', NULL, NULL),
('fd275e8d-8fec-4f6a-a072-8de28422ed8a', 'logo2.png', 'd544d7bb-97f3-4ced-9a7e-58bbe2337d5c', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/6rGGqzologo2.png', '2022-11-20 20:36:21', '2022-11-20 20:36:21', NULL, NULL),
('fdfa6aad-7cab-4467-b5c1-90df73fb521d', 'tmail_icon.png', 'ab87de1d-bf6c-404e-bb13-6afd116b9299', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'uploads/8Hjmm0Qtmail_icon.png', '2022-11-11 21:35:59', '2022-11-11 21:35:59', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_partners`
--

CREATE TABLE `product_partners` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'product_partner',
  `isVerified` tinyint(1) DEFAULT '0',
  `company_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_street` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cac_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tin` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `certificate_of_operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `professional_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_partners`
--

INSERT INTO `product_partners` (`id`, `userId`, `userType`, `isVerified`, `company_address`, `company_state`, `company_city`, `company_street`, `company_name`, `cac_number`, `tin`, `years_of_experience`, `certificate_of_operation`, `professional_certificate`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('a717469f-cf2b-405d-b345-787bd7e41e3d', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'vendor', 0, NULL, NULL, NULL, NULL, 'Vendor Four', NULL, NULL, NULL, NULL, NULL, '2022-11-18 05:45:11', '2022-11-18 05:45:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `referredId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `referrals`
--

INSERT INTO `referrals` (`id`, `userId`, `referredId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('3acfd88f-0567-40cf-b447-ff745c9cf11e', '49fe0007-0317-47c3-b4ce-79de5231dc20', '13863d58-f6f6-4dd2-97f2-60840b11ad50', '2022-10-27 22:42:23', '2022-10-27 22:42:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20221011192616-create-users-table.js'),
('20221011202050-create-bank-details-table.js'),
('20221013131640-create-user-profile-table.js'),
('20221013131702-create-user-connector-table.js'),
('20221024194751-add-values-to-user-type.js'),
('20221024210405-add-level-to-users-table.js'),
('20221024215028-add-photo-to-users-table.js'),
('20221027220216-add-new-columns-to-users-table.js'),
('20221027220836-create-referrals-table.js'),
('20221103001304-add-new-colums-to-bank_table.js'),
('20221107212255-create-private-client-table.js'),
('20221107212324-create-corporate-client-table.js'),
('20221107212356-create-product-partner-table.js'),
('20221107212420-create-service-partner-table.js'),
('20221108234613-create-product-category-table.js'),
('20221108234649-create-products-table.js'),
('20221111091059-create-table-for-products-images.js'),
('20221120163953-add-image-url-to-products-image-table.js'),
('20221129224337-create-orders-table.js'),
('20221129224352-create-order-items-table.js'),
('20221129230247-create-payments-table.js');

-- --------------------------------------------------------

--
-- Table structure for table `service_partners`
--

CREATE TABLE `service_partners` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'service_partner',
  `isVerified` tinyint(1) DEFAULT '0',
  `company_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_street` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cac_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tin` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bvn` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `certificate_of_operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `professional_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tax_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_partners`
--

INSERT INTO `service_partners` (`id`, `userId`, `userType`, `isVerified`, `company_address`, `company_state`, `company_city`, `company_street`, `company_name`, `cac_number`, `tin`, `bvn`, `years_of_experience`, `certificate_of_operation`, `professional_certificate`, `tax_certificate`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('3b9c9bcd-cfbf-460b-9b8e-f08fb60ac921', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'professional', 0, NULL, NULL, NULL, NULL, 'Company Two', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-11-18 05:47:06', '2022-11-18 05:47:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  `token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userType` enum('professional','vendor','private_client','corporate_client','admin','none') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `level` int DEFAULT '1',
  `photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referralId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aboutUs` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `isActive`, `token`, `userType`, `address`, `state`, `city`, `street`, `createdAt`, `updatedAt`, `deletedAt`, `level`, `photo`, `fname`, `lname`, `referralId`, `aboutUs`) VALUES
('09a47740-bdd3-41e8-aa7c-437378fdbc64', 'Test  Eleven', 't11@tmail.com', '$2a$10$cHMav7IYE9PLfHq1..GJdeFLGKMVPBL0r22zHrjxoQD/ojXnEJc1y', '09013141516', 0, 'vbjcoPocjxfTwYW1ghD4wBzv', 'vendor', NULL, NULL, NULL, NULL, '2022-10-28 11:32:04', '2022-10-28 11:32:05', NULL, 1, NULL, 'Test ', 'Eleven', 'J7zFo513bBCA', NULL),
('13863d58-f6f6-4dd2-97f2-60840b11ad50', 'Client Two', 'client2@test.com', '$2a$10$D1W69TF6CZmar2EzXmtqPuhjLjNUAyIMFTXzcZeg4Sg3rkb8QYZs6', '0810020937', 0, 'kx0OFhXC8YHLjmh6Xlrfqt8I', 'private_client', NULL, NULL, NULL, NULL, '2022-10-27 22:42:23', '2022-10-27 22:42:23', NULL, 1, NULL, NULL, NULL, 'ASr9hYltKwGl', 'Twitter'),
('3cfb364e-e829-44ac-b993-dd01d0633225', 'Vendor One', 'yhomi16@gmail.com', '$2a$10$6DO3dyV7nyVyGU7hAhGgbObo2mkzt4zkCNXUnfeoVWjuZGft1Oo2m', '0918363521', 0, '0Ts8OjPInmvpbj00Vlk19WTk', 'vendor', NULL, NULL, NULL, NULL, '2022-10-14 22:35:43', '2022-10-14 22:35:43', NULL, 1, NULL, NULL, NULL, NULL, NULL),
('49fe0007-0317-47c3-b4ce-79de5231dc20', 'Client One', 'test@test.com', '$2a$10$z/KoevPmEYNILI2kABFXIOrsd9ECUMvSTIgLrZ1Efa/V.ILojsvJi', '09013141516', 1, NULL, 'private_client', 'Lagos Nigeria', 'Lagos', 'Ikeja', 'Dopemu', '2022-10-14 17:08:05', '2022-11-02 22:48:23', NULL, 1, 'uploads/jTNgo7Blogo.png', 'Test', 'One', 'AqoTIzKurxJi', NULL),
('54d4d143-d295-4664-917b-a373e8d9bbb3', 'Test Eight', 'test8@test.com', '$2a$10$EG7Wy1HApjkWdsUMzpGk3.y7CUsD9ACvwHiDx/M9LJIqLmA54H8HO', '0918363521', 0, 'Weq9eREFSeK3FPKnUdKTNcKH', 'vendor', NULL, NULL, NULL, NULL, '2022-10-14 21:51:48', '2022-10-14 21:51:48', NULL, 1, NULL, NULL, NULL, NULL, NULL),
('754d5284-7a79-43c1-89b8-8034dd6534ce', 'Test Two', 'test2@test.com', '$2a$10$xbIWSy9tc8m6z7ULZR6VOewnkx157hnckNOb6gCGH3mCnu7bZ.k52', '09013141516', 1, NULL, 'corporate_client', NULL, NULL, NULL, NULL, '2022-10-14 19:25:18', '2022-11-03 20:22:50', NULL, 1, 'uploads/sOTnhAclogo2.png', 'Test', 'Two', NULL, NULL),
('a0822660-4ecd-426f-b665-d1f04071c195', 'Test Four', 'test4@test.com', '$2a$10$BUVN6obPZcH9hRbOqGi/P.fMfBBaOC8uuNfPECw.3RdscHMzgkjNW', NULL, 1, NULL, 'professional', NULL, NULL, NULL, NULL, '2022-10-14 19:30:38', '2022-10-14 20:47:41', NULL, 1, NULL, NULL, NULL, NULL, NULL),
('b1ea50b9-3fe6-4e56-8e67-c7349481b74a', 'Super Admin', 'admin@test.com', '$2a$10$3le0gQq6YePSadKOt83iIebh1VuBigm3vV4StW.ULr9jxO5GLelTe', '0810020937', 0, 'RNt8IdYGkhKtVPvDMtnIbBSj', 'admin', NULL, NULL, NULL, NULL, '2022-10-25 18:14:04', '2022-10-25 18:14:04', NULL, 2, NULL, NULL, NULL, NULL, NULL),
('de7f37dd-3bcc-4c75-a977-0495ef40a6e9', 'Test Five', 'test5@test.com', '$2a$10$7TnzRIVhcKGG8Vb20NPCm.bvsr92px8hGkHr8CH8tUl6VhAFTK8h6', '0810020937', 0, 'EdzoZy4q34xpks4IJMNdmlO8', 'private_client', NULL, NULL, NULL, NULL, '2022-10-14 19:32:15', '2022-10-14 19:32:15', NULL, 1, NULL, NULL, NULL, NULL, NULL),
('eefa8382-0f43-45a6-bbc4-ed5760b65085', 'Test Six', 'test6@test.com', '$2a$10$wiEICzrd9niPs9ttNFVACuoikbw2zBcCaKSRF.1soo5eTPY1tPRvm', '0810020897', 0, '4Z2A6Nh79RKumLO9OEUR3Cx7', 'vendor', NULL, NULL, NULL, NULL, '2022-10-14 21:48:30', '2022-10-14 21:48:30', NULL, 1, NULL, NULL, NULL, NULL, NULL),
('f2bebbbc-f531-4442-aa8f-23c07c4771d5', 'Test Three', 'test3@test.com', '$2a$10$XPNSG9QWPNncSLHK8a48XOAGym56I/UvpYUjMCBlYhKCMSQ.a11hi', '08000001000', 1, NULL, 'vendor', NULL, NULL, NULL, NULL, '2022-10-14 19:28:48', '2022-11-25 14:18:15', NULL, 1, 'uploads/vzXdXYnT-mail-email.jpg', 'Test', 'Three', NULL, NULL),
('f98d4da0-23e4-4e33-9715-b15f2d8dc589', 'Test Seven', 'test7@test.com', '$2a$10$.dRy6AqEBeETeiQocj3kN.5DCBgSKc9aNqr0atuxNYmesgDRwwN1e', '0918363521', 0, 'dQyENhZbuByJ8X4EdzL9RfCV', 'vendor', NULL, NULL, NULL, NULL, '2022-10-14 21:50:43', '2022-10-14 21:50:43', NULL, 1, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_connectors`
--

CREATE TABLE `user_connectors` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `connector_type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `client_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `client_secret` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `exchange_key` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `access_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isEnabled` tinyint(1) DEFAULT '1',
  `credentials` json DEFAULT NULL,
  `expires_in` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `company_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_city` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_street` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cac_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tin` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `certificate_of_operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `professional_certificate` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `userId`, `company_address`, `company_state`, `company_city`, `company_street`, `company_name`, `cac_number`, `tin`, `years_of_experience`, `certificate_of_operation`, `professional_certificate`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('0310754c-30e0-4efb-9e9d-811d7bc94b52', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', NULL, NULL, NULL, NULL, 'Company Two', NULL, NULL, NULL, NULL, NULL, '2022-11-18 05:47:06', '2022-11-18 05:47:06', NULL),
('267fa716-a0f7-4738-909b-1116a1ba8aaa', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', NULL, NULL, NULL, NULL, 'Vendor Four', NULL, NULL, NULL, NULL, NULL, '2022-11-18 05:45:11', '2022-11-18 05:45:11', NULL),
('27fbc776-365b-4709-89cd-f6e2ea86e520', '09a47740-bdd3-41e8-aa7c-437378fdbc64', NULL, NULL, NULL, NULL, 'Test mail', NULL, NULL, NULL, NULL, NULL, '2022-10-28 11:32:05', '2022-10-28 11:32:05', NULL),
('3d8de301-6333-43f7-881b-0f968e4d6da8', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', NULL, NULL, NULL, NULL, 'Company One', NULL, NULL, NULL, NULL, NULL, '2022-11-18 05:44:40', '2022-11-18 05:44:40', NULL),
('668406be-1d41-46d2-8fbf-a6b994239242', '54d4d143-d295-4664-917b-a373e8d9bbb3', NULL, NULL, NULL, NULL, 'Vendor Four', NULL, NULL, NULL, NULL, NULL, '2022-10-14 21:51:48', '2022-10-14 21:51:48', NULL),
('6aa36f80-d19e-4b47-a057-1a65976bf4e8', 'f2bebbbc-f531-4442-aa8f-23c07c4771d5', '23, Iwo-road Ibadan', NULL, NULL, NULL, 'Vendor One', '123457596', 'Afvd28749', 20, NULL, NULL, '2022-10-14 19:28:48', '2022-10-14 21:19:21', NULL),
('74ae7948-2ba3-4a61-adab-538859ee406a', '754d5284-7a79-43c1-89b8-8034dd6534ce', '23, Maitama Abuja', NULL, NULL, NULL, 'Client Two', '10986124341', 'CAN907365432', 10, NULL, NULL, '2022-10-14 19:25:18', '2022-10-14 21:22:35', NULL),
('ab92f6f7-747c-402a-961e-3c7279b99c01', 'eefa8382-0f43-45a6-bbc4-ed5760b65085', NULL, NULL, NULL, NULL, 'Vendor Two', NULL, NULL, NULL, NULL, NULL, '2022-10-14 21:48:30', '2022-10-14 21:48:30', NULL),
('ac27bd20-17b9-4efa-854e-650105eb7ce8', 'a0822660-4ecd-426f-b665-d1f04071c195', '2, Ikoyi Road, Lagos', NULL, NULL, NULL, 'Professional One', NULL, NULL, 10, 'uploads/lusFvAudomai2.png', 'uploads/Fvf2EyRsupport.png', '2022-10-14 19:30:38', '2022-10-14 21:03:10', NULL),
('b8e593b8-f49e-42c8-b650-e2b5235fe28b', '3cfb364e-e829-44ac-b993-dd01d0633225', NULL, NULL, NULL, NULL, 'Vendor One', NULL, NULL, NULL, NULL, NULL, '2022-10-14 22:35:43', '2022-10-14 22:35:43', NULL),
('e085ec32-36e7-4105-acff-48f824dddc1e', 'f98d4da0-23e4-4e33-9715-b15f2d8dc589', NULL, NULL, NULL, NULL, 'Vendor Three', NULL, NULL, NULL, NULL, NULL, '2022-10-14 21:50:43', '2022-10-14 21:50:43', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_details`
--
ALTER TABLE `bank_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `corporate_clients`
--
ALTER TABLE `corporate_clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `private_clients`
--
ALTER TABLE `private_clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `product_partners`
--
ALTER TABLE `product_partners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `service_partners`
--
ALTER TABLE `service_partners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_connectors`
--
ALTER TABLE `user_connectors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
