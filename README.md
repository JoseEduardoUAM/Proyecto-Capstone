# Sistema de Control de acceso y videoconferencia #
Este repositorio contiene todos lo necesario para la realización de un sistema de video conferencias , el cual por medio de algunas herramientas de desarrollo de software y el uso de una tarjeta Raspberry Pi 3+ se desarrollo un sistema de videocoferencia que ayudara a los visitantes de cualquier hospital de la Cuidad en poder tener contacto con sus familiares que estan recluidos en el área covid.
 # Introducción #
 Sistema de Control de acceso y videoconferencia 

Imaginemos un escenario donde un día despiertas en un lugar con personas desconocidas, te encuentras acostado con poco o nulo espacio para moverte y no puedes tener una comunicación con las personas en tu alrededor, ya que, tu o algunos de ellos, se encuentra intubado para recibir asistencia ventilatoria, llevas más de dos semanas aislado del mundo exterior sin poder hablar y ver a tus familiares y amigos, además, te encuentras enfermo y no sabes si volverás a ver a estas personas. Ahora, imaginemos otro escenario donde un familiar o amigo tuyo se encuentra aislado en algún lugar, sabes que esta persona se encuentra enferma, pero, no sabes su estado de salud y en cualquier momento puedes recibir la noticia de que ya está muerto.

En los dos escenarios ¿Qué sensación tienes al no poder expresar tus sentimientos a tu familiar o amigo?, pero, estos dos escenarios, no hay que imaginarlos, se puede observar en todos los hospitales en la actual pandemia, ya que, durante la emergencia sanitaria generada por el COVID 19, los hospitales recurrieron a la necesidad de crear medidas sanitarias para prevenir un evento que origine riesgos que afecten la salud de la población, uno de ellos, fue la limitación de las visitas hospitalarias e inclusive la suspensión del acceso a familiares para prevenir la transmisión nosocomial [1].

Ante este problema, ¿Cómo se podría ayudar a estas personas a comunicarse?, Tal vez estés pensando, solo se necesita realizar una llamada telefónica o utilizar una aplicación de videoconferencia de alguna empresa privada, pero, para estas opciones, se necesita de un proveedor de servicios de telefonía o servicios de internet, y es necesario alquilar estos servicios. Entonces, ¿Cuánto presupuesto se debe tener para que todos los pacientes se puedan comunicar con sus familiares por medio de una llamada telefónica?, ¿Crees que el hospital tiene la infraestructura de comunicaciones para realizar videollamadas?, Tal vez para un hospital privado, no tenga algún problema estas cuestiones, pero, para un hospital público, son cosas que debe considerar.

Aunque los hospitales cuenten con medidas sanitarias y se restringa el acceso a los visitantes, estos acuden al hospital para informarse del estado de salud del paciente aun sabiendo que existe un riesgo a contagiarse. 

La ansiedad, la falta de comunicación e información provoca en las personas acudir al hospital, es por ello, que los hospitales toman medidas sanitarias para los visitantes que deseen acudir al hospital, como usar cubrebocas, gel antibacterial, respetar una distancia entre visitantes, tomar la temperatura corporal y tener un número máximo de personas dentro del hospital.

Pero ¿Alguna vez has realizado una visita hospitalaria?, si la respuesta es sí, tal vez recuerdes que es necesario registrar tu entrada y la salida, para realizar esto, se debe tomar una pluma y escribir en la bitácora tu nombre, dirección, fecha de entrada, hora de entrada y entre otros datos, pero ¿No crees que sea riesgoso tocar los objetos del hospital?, tal vez al utilizar estos objetos sea muy probable que puedas quedar contagia con covid 19 o sus variantes.

Además, ¿Qué sucede si aun con estas medidas un familiar que se encuentre con síntomas de covid 19 o sus variantes acude al hospital e ingresa?, ¿Cómo se podría saber que personas acudieron al hospital y convivieron con esta persona contagiada?
Este proyecto pretende ayudar a estas personas a comunicarse utilizando dispositivos móviles, ¿Y cómo se logrará?, Utilizando un sistema web en tiempo real, ¿Qué es esto?, es una manera de comunicación basada en la web que utiliza tecnologías y prácticas que permiten a los usuarios recibir información tan pronto como es publicada por sus autores, en vez de ser requerida por los usuarios [2].

Este sistema funciona en una red local (LAN) en donde los dispositivos móviles se conectan a un modem/router e intercambian información de audio, video y texto sin la necesidad de utilizar internet, entonces, cuando un familiar o amigo visite al paciente podrá comunicarse mediante una videollamada.

Tal vez estes pensando ¿No es riesgoso realizar esto para la gran cantidad de personas que visiten el hospital?, la respuesta es sí, pero, este sistema no solo servirá para comunicar al visitante con un paciente, sino, también permitirá controlar el acceso a los visitantes limitando el número de personas en el hospital, además, se utilizará un código QR personal para cada visitante que servirá para registrar su entrada, su salida y poder utilizar el sistema de videollamada.

Con este proyecto y con las medidas sanitarias para ingresar al hospital se logrará comunicar a un paciente con su familiar y se logrará cuidar lo mayor posible la salud del visitante.

# Justificación # 

Debido a la emergencia sanitaria generada por el COVID 19, los pacientes que presentan síntomas graves de esta enfermedad y acuden a un hospital o centro de salud, deben ser aislados para ayudarlos en su recuperación y prevenir contagios a la población, por lo que no es posible la comunicación con sus familiares.
En la actualidad existen aplicaciones como Zoom, Meet o Skype que permiten realizar una videollamada, pero, para utilizarlas, en algunas de ellas se necesita instalar una aplicación en los dispositivos móviles, implica que se necesite memoria para instalarlas y utilizarlas, la cual, no todos los dispositivos móviles cuentan con la suficiente.

Además, para realizar una videollamada como por ejemplo Zoom en una calidad de 720p, se requiere de 1.2 Mbps [3], si se necesita al menos de 20 minutos para realizar la videollamada, se requiere de 180 MB por dispositivo, para la comunicación 1 a 1, se necesitan de 360 MB, en cada dispositivo, se requiere un plan con algún proveer de servicios como por ejemplo Telcel, el cual, para este ejemplo, costaría 199 pesos MXN para cada dispositivo [4] y en total 389 pesos MXN. Para una videollamada esto podría ser suficiente, pero, un hospital atiende a 157 pacientes COVID [5] y utilizar estas aplicaciones es un costo monetario elevado.
Si estas aplicaciones se utilizan en la red de comunicaciones del hospital, se verían afectadas las comunicaciones o el servicio de internet, para ello, se necesitaría ampliar la infraestructura de comunicaciones del hospital.

También se debe considerar que hay aplicaciones como Zoom que limitan el tiempo para la videollamada o se debe tener una cuenta de correo electrónico como en Meet para utilizarlas.

El proyecto que se propone permitiría realizar una videollamada privada entre paciente y familiar sin la necesidad de contar con un proveedor de acceso a internet, sin la necesidad de depender de una aplicación de terceros y permitiendo tener un sistema de comunicación de bajos recursos que pueda utilizar dispositivos móviles, tales como smartphone, tabletas o computadoras sin interferir con la infraestructura de comunicaciones del hospital.

# Objetivo general #
Crear un sistema de control de acceso para un hospital utilizando códigos QR y un sistema de videollamadas para uso de visitantes-pacientes.

# Objetivo Especificos #

-	Instalar y configurar un servidor que permita proveer las páginas de cada módulo y la conexión con la base de datos.
-	Diseñar e implementar un módulo que registre la entrada de un visitante mediante el uso de un código QR
-	Diseñar e implementar un módulo que registre la salida de un visitante mediante el uso de un código QR.
-	Diseñar e implementar un módulo que permita crear una sala de videollamada privada con los datos del paciente y del familiar mediante el uso de un código QR.
-	Diseñar e implementar un módulo que permita registrar a un paciente y al visitante en la Base de Datos.
-	Diseñar e implementar un módulo para proporcionar el PDF con los datos del paciente, visitante y código QR generado por el servidor.
-	Diseñar una Base de Datos para registrar los datos del paciente y del visitante.




# Bibliografía #
[1] V. M. Torres Mesa, “Publirreportaje”, Personal médico y covid 19, No. 3, pp. 22-24, julio-septiembre 2020, [En línea], Disponible en: https://salud.edomex.gob.mx/cevece/documentos/revistas/rcercati/revista20_3.pdf 

[2] Fazt, “Real Time Web | Aplicaciones Web en tiempo Real, Websockets, WebRTC, Ajax, Polling, Long Polling”, YouTube , 20 de marzo del 2018, [Video en línea]: https://www.youtube.com/watch?v=2FSr-Ezbf1w&ab_channel=FaztFaztVerificada 

[3] “Requisitos del sistema Windows, macOS y Linux”, Zoom centro de Ayuda, 15 de septiembre del 2020, [En línea], Disponible en: https://support.zoom.us/hc/es/articles/201362023-Requisitos-del-sistema-para-Windows-macOS-y-Linux#:~:text=%20600%%2020kbps%20%20%20(subida%2Fbajada),8%20Mbps%20(subida%2Fbajada) 
[4] Telcel, [En línea], Disponible en: https://www.telcel.com/personas/telefonia/planes-de-renta/tarifas-y-opciones 

[5] “HGZ No. 32 tiene disponibilidad de camas para atender pacientes con covid 19”, IMSS, 16 de diciembre del 2020, [En línea], Disponible en: http://www.imss.gob.mx/prensa/archivo/202012/836 

