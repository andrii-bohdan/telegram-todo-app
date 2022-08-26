FROM mysql/mysql-server

ENV MYSQL_ROOT_PASSWORD root
COPY ./privileges.sql /docker-entrypoint-initdb.d/
