/********** Agregar Trabajador *******************************************/
INSERT INTO Trabajador VALUES (0,"Jose Eduardo","Hernandez","de la Cruz",2172002687, AES_ENCRYPT("eduardo112233","key_secret_pc_2022_uam") );
INSERT INTO Trabajador VALUES (0,"Arturo","Reyes","Santa",2172001212, AES_ENCRYPT("arturo112233","key_secret_pc_2022_uam") );
INSERT INTO Trabajador VALUES (0,"Mayra","Cortes","",2172001414, AES_ENCRYPT("mayra112233","key_secret_pc_2022_uam") );
INSERT INTO Trabajador VALUES (0,"Dulce","Macias","Salinas",2172002323, AES_ENCRYPT("dulce112233","key_secret_pc_2022_uam") );

/********** Agregar Seccion *******************************************/
INSERT INTO Seccion VALUES (0,"Paciente");
INSERT INTO Seccion VALUES (0,"Visitante");
INSERT INTO Seccion VALUES (0,"Entrada");
INSERT INTO Seccion VALUES (0,"Salida");
INSERT INTO Seccion VALUES (0,"Registro");

/********** Agregar Seccion al Trabajador *******************************************/
INSERT INTO TrabajadorSeccion VALUES (0,1,1);
INSERT INTO TrabajadorSeccion VALUES (0,1,2);
INSERT INTO TrabajadorSeccion VALUES (0,1,3);
INSERT INTO TrabajadorSeccion VALUES (0,1,4);
INSERT INTO TrabajadorSeccion VALUES (0,1,5);

INSERT INTO TrabajadorSeccion VALUES (0,2,1);
INSERT INTO TrabajadorSeccion VALUES (0,2,2);
INSERT INTO TrabajadorSeccion VALUES (0,2,3);

INSERT INTO TrabajadorSeccion VALUES (0,3,4);
INSERT INTO TrabajadorSeccion VALUES (0,3,5);

/*********** Agregar Avisos ****************************************************/
INSERT INTO Aviso VALUES (0,"Este es un Aviso para los Trabajadores de la Seccion Paciente");
INSERT INTO Aviso VALUES (0,"Este es un Aviso para los Trabajadores de la Seccion Visitante");
INSERT INTO Aviso VALUES (0,"Este es un Aviso para los Trabajadores de la Seccion Entrada");
INSERT INTO Aviso VALUES (0,"Este es un Aviso para los Trabajadores de la Seccion Salida");
INSERT INTO Aviso VALUES (0,"Este es un Aviso para los Trabajadores de la Seccion Registro");
INSERT INTO Aviso VALUES (0,"Este es un Aviso para los Trabajadores de la Seccion Administrador");

/*********** Agregar Aviso en cada Seccion ****************************************************/
INSERT INTO SeccionAviso VALUES (0,1,1);
INSERT INTO SeccionAviso VALUES (0,2,2);
INSERT INTO SeccionAviso VALUES (0,3,3);
INSERT INTO SeccionAviso VALUES (0,4,4);
INSERT INTO SeccionAviso VALUES (0,5,5);




