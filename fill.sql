-- All the passwords are "password"

-- Inserting a customer account
INSERT INTO customers (name, email, password) VALUES ('John Doe', 'johndoe@example.com', '0ef63c08ee775e75a46150c87ad0a491');

-- Inserting a team member
INSERT INTO team (name, email, password, role) VALUES ('Jane Doe', 'janedoe@example.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');

-- Inserting a ticket
INSERT INTO tickets (title, msg, cust_id) VALUES ('Website is down', 'The website is not accessible from my location.', 2);

-- Inserting a comment on the ticket
INSERT INTO tickets_comments (ticket_id, comment, owner, role) VALUES (1, 'We are investigating the issue.', 'Jane Doe', 'Developer');




INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (3, 'Jane Doe','janedoe@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (4, 'Mark Smith','marksmith@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (5, 'Sarah Johnson','sarahjohnson@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Admin');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (6, 'David Lee','davidlee@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (7, 'Maria Rodriguez','mariarodriguez@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (8, 'Robert Brown','robertbrown@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (9, 'Olivia Davis','oliviadavis@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Admin');
INSERT INTO `team` (`id`, `name`,`email`, `password`,`role`) VALUES (10, 'William Thomas','williamthomas@email.com', '0ef63c08ee775e75a46150c87ad0a491', 'Developer');




INSERT INTO customers (name, email, password) VALUES ('John Smith', 'johnsmith@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Jane Doe', 'janedoe@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Alice Cooper', 'alicecooper@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Bob Johnson', 'bobjohnson@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Eva Green', 'evagreen@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Alex Brown', 'alexbrown@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Sara Lee', 'saralee@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Peter Parker', 'peterparker@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Mary Jane', 'maryjane@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO customers (name, email, password) VALUES ('Tony Stark', 'tonystark@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');


INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Issue with payment gateway', 'I am unable to complete payment for my order', 9, '2023-05-07 10:30:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Unable to login', 'I am unable to login to my account', 2, '2023-05-06 14:15:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Delivery delayed', 'My order was supposed to be delivered today but it has been delayed', 9, '2023-05-05 16:45:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Product damaged', 'The product I received is damaged and I would like a replacement', 4, '2023-05-04 09:00:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Incorrect item delivered', 'I received the wrong item in my order', 5, '2023-05-03 11:30:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Request for refund', 'I would like to request a refund for my order', 6, '2023-05-02 13:45:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Query regarding product', 'I have a query regarding the product I want to order', 7, '2023-05-01 17:30:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Change in order details', 'I would like to make changes to my order details', 8, '2023-04-30 10:00:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Complaint regarding service', 'I have a complaint regarding the service provided', 9, '2023-04-29 15:00:00', 'open');
INSERT INTO `tickets` (`title`, `msg`, `cust_id`, `created`, `status`) VALUES ('Enquiry regarding delivery', 'I would like to enquire about the delivery of my order', 7, '2023-04-28 12:30:00', 'open');




INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (5, 'Thank you for contacting us! Our team will be with you shortly.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (5, 'I see that you are having trouble with our product. Can you please provide more details?', 'Developer1', 'Developer');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (5, 'We apologize for any inconvenience. Our team is actively working to resolve this issue.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (5, 'We have identified the issue and are working on a fix. Thank you for your patience.', 'Developer2', 'Developer');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (5, 'Thank you for bringing this to our attention. We will investigate and get back to you as soon as possible.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (6, 'Hello! How can we assist you today?', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (7, 'I am sorry to hear that you are experiencing issues. Let me gather more information to assist you.', 'Developer1', 'Developer');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (8, 'We appreciate your patience while we investigate the issue.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (6, 'We have identified the issue and are working to resolve it as quickly as possible.', 'Developer2', 'Developer');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (6, 'Thank you for your understanding.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (3, 'Hi there! Can you please provide more details about the issue you are experiencing?', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (3, 'I apologize for any frustration this has caused. Let me see if I can find a solution for you.', 'Developer1', 'Developer');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (3, 'Thank you for bringing this to our attention. We will do our best to resolve this issue as quickly as possible.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (3, 'We have identified the issue and are actively working to fix it. Thank you for your patience.', 'Developer2', 'Developer');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (3, 'If you have any further questions or concerns, please do not hesitate to contact us.', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (4, 'Hello! How may we assist you today?', 'Customer Support', 'Admin');

INSERT INTO tickets_comments (ticket_id, comment, owner, role)
VALUES (4, 'I'm sorry to hear that you are experiencing issues. Let me see what I can do to help.', 'Developer1', 'Developer');




