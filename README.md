# Instalacion de MariaDB
```
sudo apt update
sudo apt upgrade
sudo apt install mariadb-server
```

# Configuracion de Acceso root

```
sudo mysql_secure_installation
```

1. Presionar enter
2. Colocar Y o S
3. Colocar una contraseña
4. Colocar Y o S
5. Colocar Y o S
6. Colocar Y o S

# Conectarse al usuario root
```
mysql -u root -p
```

# Configuracion para conexiones remotas
```
sudo sed -i 's/bind-address = 127.0.0.1/bind-address = 0.0.0.0/g' /etc/mysql/mariadb.conf.d/50-server.cnf
systemctl restart mariadb
sudo mysqld --print-defaults
```
# Verificar configuracion de conexion remota
```
netstat -tap | grep -i mysql
```
# Agregar Cliente Remoto
```
mysql -u root -p
SELECT User, Host FROM mysql.user WHERE Host <> 'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.109.133' IDENTIFIED BY 'password123' WITH GRANT OPTION;
```
# Importar base de datos
```
mysql -u username -p new_database < data-dump.sql
```
