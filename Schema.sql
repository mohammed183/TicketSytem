CREATE DATABASE ticketsystem;
USE ticketsystem;
-- Creating table to hold tickets
CREATE TABLE IF NOT EXISTS `tickets` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,
	`msg` text NOT NULL,
	`cust_id` int(11) NOT NULL,
	`created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`resolved` datetime DEFAULT NULL,
	`status` enum('open','assigned','resolved') NOT NULL DEFAULT 'open',
	`assignee` int(11) DEFAULT 0,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Creating table to hold ticket comments
CREATE TABLE IF NOT EXISTS `tickets_comments` (
	`comment_id` int(11) NOT NULL AUTO_INCREMENT,
	`ticket_id` int(11) NOT NULL,
	`comment` text NOT NULL,
	`owner` text NOT NULL,
	`com_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`role` text NOT NULL,
	PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Creating table to hold client accounts
CREATE TABLE IF NOT EXISTS `customers` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` text NOT NULL,
	`email` varchar(255) not null,
	`password` varchar(255) not null,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


-- Creating table to keep track of team members, Default is admin to be able to add more team members.
CREATE TABLE IF NOT EXISTS `team`(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` text NOT NULL,
	`email` varchar(255) not null,
	`password` varchar(255) not null,
	`role` enum('Developer','Admin') NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (1, 'admin','admin@admin', '5f4dcc3b5aa765d61d8327deb882cf99', 'Admin');

ALTER TABLE tickets ADD FOREIGN KEY (cust_id) 
REFERENCES customers(id);
