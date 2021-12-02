
-- make sure the websiteuser account is set up and has the correct privileges
CREATE USER IF NOT EXISTS websiteuser IDENTIFIED BY 'websitepassword';
GRANT INSERT, SELECT, UPDATE, DELETE ON website.* TO websiteuser;

DROP TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS accounts (
  id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(25) NOT NULL,
  pass VARCHAR(70) NOT NULL
);

INSERT INTO accounts(user, pass)
	VALUES("doej", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO");


CREATE TABLE news(
  id int NOT null AUTO_INCREMENT,
  title varchar(45),
  brief varchar(255),
  detail longtext,
  userId int,
  imgUrl varchar(255),
  releaseDate date,
  authorized boolean default false,
  PRIMARY KEY (id)
);

-- allow null