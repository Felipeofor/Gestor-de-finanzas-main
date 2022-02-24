CREATE DATABASE Prueba;

USE Prueba;

CREATE TABLE ahorro(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ingreso int,
    sueldoReal int,
    mes varchar(15),
    referencia varchar(45),
    paraTodaLaVida int,
    sueldoReal int,
    gastosBasicos int,
    gustosCortoPlazo int,
    gustosLargoPlazo int,
    emergencias int,
    editar boolean,
);



DESCRIBE ahorro;