CREATE DATABASE Prueba;

USE Prueba;

CREATE TABLE ahorro(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ingreso int,
    mes varchar(15),
    referencia varchar(45)
);

DESCRIBE ahorro;