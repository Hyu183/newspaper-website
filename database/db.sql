use newspaperdb;

CREATE TABLE Category (
  id int unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  parent_id int unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (parent_id) REFERENCES category (id) 
    ON DELETE CASCADE ON UPDATE CASCADE
);
insert into Category (title) values ('Kinh doanh');
insert into Category (title) values ('Thể thao');
insert into Category (title) values ('Khoa học');
insert into Category (title) values ('Giáo dục');

insert into Category (title, parent_id) values ('Quốc tế', 1);
insert into Category (title, parent_id) values ('Nông nghiệp', 1);
insert into Category (title, parent_id) values ('Chứng khoán', 1);

insert into Category (title, parent_id) values ('Bóng đá', 2);

create table User_types(
	id int unsigned NOT NULL,
    user_type varchar(50),
    primary key(id)
);


insert into User_types (id, user_type) values (0, 'guess');
insert into User_types (id, user_type) values (1, 'reporter');
insert into User_types (id, user_type) values (2, 'editor');
insert into User_types (id, user_type) values (3, 'admin');


create table Users (
	id int unsigned NOT NULL auto_increment,
    user_name varchar(255) NOT NULL,
    email varchar(80) NOT NULL,
    birthday date NOT NULL,
    password varchar(255) NOT NULL,
    user_type int unsigned NOT NULL,
    PRIMARY KEY (id),
    foreign key (user_type) references User_types(id)
);

insert into Users (user_name, email, birthday, password, user_type) values ('duong', 'duong@gmail.com', '2000-01-01', '123', 0);
insert into Users (user_name, email, birthday, password, user_type) values ('tran', 'dgg@gmail.com', '2004-01-01', '123', 0);
insert into Users (user_name, email, birthday, password, user_type) values ('toan', 'eg@gmail.com', '2005-01-01', '123', 1);
insert into Users (user_name, email, birthday, password, user_type) values ('quan', 'durhong@gmail.com', '2002-01-01', '123', 2);
insert into Users (user_name, email, birthday, password, user_type) values ('tuan', 'tuan@gmail.com', '2001-01-07', '123', 3);

create table Articles(
	id int unsigned NOT NULL auto_increment,
    title tinytext NOT NULL,
    abstract text,
    content mediumtext NOT NULL,
    created_time datetime,
    author_id int unsigned,
    category_id int unsigned,
    thumbnail_image tinytext,
    view_number int,
    primary key (id),
    foreign key (author_id) references Users(id),
    foreign key (category_id) references Category(id)
);

insert into Articles (title, abstract, content, created_time, author_id, category_id, thumbnail_image, view_number)
	values ('MB báo lãi gần 8.000 tỷ đồng', 'MB báo lãi 6 tháng đầu năm tăng 56 lên gần 8.000 tỷ đồng tỷ lệ bao phủ nợ xấu của riêng ngân hàng mẹ tăng mạnh lên 311',
		'MB báo lãi 6 tháng đầu năm tăng 56 lên gần 8.000 tỷ đồng tỷ lệ bao phủ nợ xấu của riêng ngân hàng mẹ tăng mạnh lên 311 MB báo lãi 6 tháng đầu năm tăng 56 lên gần 8.000 tỷ đồng tỷ lệ bao phủ nợ xấu của riêng ngân hàng mẹ tăng mạnh lên 311vxấu MB trích lập dự phòng hơn 3 đồng',
        '2021-07-18 14:17:17', 3, 8, 'https://bstyle.vn/wp-content/uploads/2019/12/ngan-hang-hdbank.jpg', 10);

create table Approval(
	article_id int unsigned,
    editor_id int unsigned,
    is_approved int unsigned,
    reject_reason text,
    published_date date,
    approved_date datetime,
    primary key (article_id, editor_id),
    foreign key (article_id) references Articles(id),
    foreign key (editor_id) references Users(id)
);

insert into Approval (article_id, editor_id, is_approved, published_date, approved_date) values (1, 4, 1, '2021-07-18', '2021-07-14 14:17:17');

create table Comments(
	id int unsigned NOT NULL AUTO_INCREMENT,
	commenter_id int unsigned,
	article_id int unsigned,
	post_time datetime,
    content text,
    primary key (id),
    foreign key (article_id) references Articles(id),
    foreign key (commenter_id) references Users(id)
);

insert into Comments (commenter_id, article_id, post_time, content) values (2, 1, '2021-07-21 18:17:17', 'Hay quá!');

create table Reporters(
	user_id int unsigned,
    pen_name varchar(255),
    primary key (user_id),
    foreign key (user_id) references Users(id)
);

insert into Reporters (user_id, pen_name) values (3, 'Trần Toàn');

create table Tags(
	id int unsigned NOT NULL auto_increment,
    tag_name varchar(255),
    primary key (id)
);

insert into Tags (tag_name) values ('Ngân hàng');
insert into Tags (tag_name) values ('Tiền');
insert into Tags (tag_name) values ('Tài chính');
insert into Tags (tag_name) values ('Lãi xuất');

create table Article_tags(
	article_id int unsigned,
    tag_id int unsigned,
	primary key (article_id, tag_id),
    foreign key (article_id) references Articles(id),
    foreign key (tag_id) references Tags(id)
);

insert into Article_tags (article_id, tag_id) values (1, 1);
insert into Article_tags (article_id, tag_id) values (1, 4);




