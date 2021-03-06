/*CREAR BASE DE DATOS*/
CREATE DATABASE BD_Usuarios;

USE BD_Usuarios;
/********************************************************************************************/
/*CREAR TABLA PACIENTE*/
CREATE TABLE Paciente(
	IdPac INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(25) NOT NULL,
	Apellido1 VARCHAR(20) NOT NULL,
	Apellido2 VARCHAR(20),
	NSS DECIMAL(14) NOT NULL,
	FechaNacimiento DATE NOT NULL,
	INDEX(IdPac)
);

/*CREAR TABLA VISITANTES*/
CREATE TABLE Visitante(
	IdVis INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	Nombre VARCHAR(25) NOT NULL,
	Apellido1 VARCHAR(20) NOT NULL,
	Apellido2 VARCHAR(20),
	CURP VARCHAR(20) NOT NULL,
	Code BLOB,
	INDEX(IdVis)
); 

/*CREAR TABLA PARENTESCO*/
CREATE TABLE Parentesco(
	IdPar INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	IdPac INT NOT NULL,
	IdVis INT NOT NULL,
	FOREIGN KEY (IdPac) REFERENCES Paciente(IdPac),
	FOREIGN KEY (IdVis) REFERENCES Visitante(IdVis),
	INDEX(IdPar),
	INDEX(IdPac),
	INDEX(IdVis)
);

/*CREAR TABLA ASISTENCIA*/
CREATE TABLE Asistencia(
	IdAsis INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	Entrada TIME NOT NULL,
	Salida TIME,
	Fecha DATE NOT NULL,
	IdPar INT NOT NULL,
	FOREIGN KEY (IdPar) REFERENCES Parentesco(IdPar),
	INDEX(IdAsis)
);