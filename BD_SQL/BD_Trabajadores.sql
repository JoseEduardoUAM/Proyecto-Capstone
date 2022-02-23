﻿/*CREAR BASE DE DATOS*/
CREATE DATABASE BD_Trabajadores;

USE BD_Trabajadores;

/*CREAR TABLA TRABAJADOR*/
CREATE TABLE Trabajador(
	IdTra INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(25) NOT NULL,
	Apellido1 VARCHAR(20) NOT NULL,
	Apellido2 VARCHAR(20),
	Matricula DECIMAL(10),
	Password BLOB,
	INDEX(IdTra)
); 

/*CREAR TABLA SECCION*/
CREATE TABLE Seccion(
	IdSec INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(15) NOT NULL,
	INDEX(IdSec)
); 

/*CREAR TABLA TRABAJADOR_SECCION*/
CREATE TABLE TrabajadorSeccion(
	IdTC INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	IdTra INT NOT NULL,
	IdSec INT NOT NULL,
	FOREIGN KEY (IdTra) REFERENCES Trabajador(IdTra),
	FOREIGN KEY (IdSec) REFERENCES Seccion(IdSec),
	INDEX(IdTC),
	INDEX(IdTra),
	INDEX(IdSec)
);

/*CREAR TABLA AVISO*/
CREATE TABLE Aviso(
	IdAvi INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	Descripcion VARCHAR(300) NOT NULL,
	INDEX(IdAvi)
); 

/*CREAR TABLA PARA AGREGAR AVISOS A LAS SECCIONES*/
CREATE TABLE SeccionAviso(
	IdSA INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	IdAvi INT NOT NULL,
	IdSec INT NOT NULL,
	FOREIGN KEY (IdAvi) REFERENCES Aviso(IdAvi),
	FOREIGN KEY (IdSec) REFERENCES Seccion(IdSec),
	INDEX(IdSA),
	INDEX(IdAvi),
	INDEX(IdSec)
); 

/*CREAR TABLA ADMINISTRADOR*/
CREATE TABLE Administrador(
	IdAdm INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	IdTra INT NOT NULL UNIQUE,
	FOREIGN KEY (IdTra) REFERENCES Trabajador(IdTra),
	INDEX(IdAdm),
	INDEX(IdTra)
); 