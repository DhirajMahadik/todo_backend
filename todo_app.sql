create database todo_app;

create table users(
id int  primary key auto_increment, 
email varchar(80), 
password varchar(8000)
);

create table tasks(
task_id int  primary key auto_increment, 
task varchar(1000), 
user_id int,
foreign key(user_id) references users(id)
);


create table completed_tasks(
task_id int  primary key auto_increment, 
task varchar(1000), 
user_id int
);

