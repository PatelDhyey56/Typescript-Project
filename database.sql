-- product table
create table Product_Master(
	id SERIAL PRIMARY KEY,
	product_name varchar(45) not null,
	product_type "Estore"."ProductType"  not null
	product_photo text not null,
	deleted boolean default false
)
insert into "Estore"."product_master"(product_name,eat_by,product_type,image)
values('samosha','Vegetarian','spicy','sfadfs'),('vada-pav','Vegetarian','spicy','sfafasdgfsdfs'),('chiken','Non-Vegetarian','spicy','sfadsdfadgfs')

--hotel table
create table "Estore".Hotel(
	id SERIAL PRIMARY KEY,
	name varchar(45) not null,
	hotel_type "Estore"."HotelType" not null,
	place "Estore"."ProductType"  not null,
	deleted boolean default false
)
insert into "Estore"."hotel"(name,hotel_type,place)
values('hotel-sarada','5-star','ahamedabad'),('panjab-da-tadaka','3-star','ahamedabad'),('rameshlal-dabha','stall','ahamedabad')

-- create product table with forign key
create table "Estore".Product(
	id SERIAL PRIMARY KEY,
	hotel_id int,
	product_id int,
	price int not null default 0,
	quantity int not null default 0,
	deleted boolean default false,
	CONSTRAINT fk_hotelproduct FOREIGN KEY(hotel_id) REFERENCES "Estore".hotel(id),
	CONSTRAINT fk_productMaster FOREIGN KEY(product_id) REFERENCES "Estore".product_master(id)
	unique(hotel_id,product_id)
)
insert into "Estore"."product"(hotel_id,product_id,price,quantity)
values(1,2,500,20),(1,3,50,200),(1,4,25,50),(2,2,250,40),(2,3,300,20),(3,3,500,40)

-- order table
create table "Estore".Order(
	id SERIAL PRIMARY KEY,
	user_id int,
	product_id int,
	product jsonb not null, 
	order_time Date  default now() ,
	CONSTRAINT fk_orderuser FOREIGN KEY(user_id) REFERENCES "Estore".User(id),
	CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES "Estore".product(id)
)

--list all product with price and details
create view "Estore"."Product_list"as SELECT p.id,pm.product_name,pm.eat_by,pm.product_type,
p.price product_price,pm.image,h.name hotel_name,h.hotel_type ,h.place 
FROM "Estore"."Product" p
left join "Estore"."Hotel" h on h.id=p.hotel_id
left join "Estore"."Product_Master" pm on pm.id=p.product_id 
ORDER BY p.id ASC 