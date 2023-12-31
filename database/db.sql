CREATE DATABASE dbp_page_movies;

USE dbp_page_movies;

create table tbl_users(
  PKUSU_NCODIGO int not null auto_increment primary key,    
  USU_CNOMBRES_APELLIDOS varchar(255) DEFAULT NULL,
  USU_CUSUARIO varchar(255) DEFAULT NULL,
  USU_CROL varchar(255) DEFAULT NULL,
  USU_CFECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  USU_CFECHA_MODIFICACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  USU_CESTADO varchar(255) DEFAULT NULL    
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

create table tbl_movies(
  PKMOV_NCODIGO int not null auto_increment primary key, 
  FKMOV_USERID INT (11),
  MOV_CTITLE varchar(255) DEFAULT NULL,
  MOV_CDIRECTOR varchar(255) DEFAULT NULL,
  MOV_CYEAR varchar(255) DEFAULT NULL,
  MOV_CRATING INT(1) DEFAULT NULL,
  MOV_CSEEN boolean DEFAULT NULL,
  MOV_CFECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  MOV_CFECHA_MODIFICACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  MOV_CDESCRIPTION TEXT DEFAULT NULL,
  MOV_CESTADO varchar(255) DEFAULT NULL,    
  CONSTRAINT fk_user FOREIGN KEY(FKMOV_USERID) REFERENCES tbl_users(PKUSU_NCODIGO)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

create table tbl_logs(
  PKLOG_NCODIGO int not null auto_increment primary key, 
  FKLOG_USERID INT (11),
  LOG_CACTION varchar(255) DEFAULT NULL,
  LOG_CFECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LOG_CMOVIEID INT(11) DEFAULT NULL,    
  CONSTRAINT fk_log FOREIGN KEY(FKLOG_USERID) REFERENCES tbl_users(PKUSU_NCODIGO)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


--OLD
CREATE DATABASE db_links;

USE db_links;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'john', 'password1', 'John Carter');

SELECT * FROM users;

-- Movies TABLE 
CREATE TABLE links (
  id INT(11) NOT NULL,
  title VARCHAR(150) NOT NULL,
  director VARCHAR(255) NOT NULL,
  year VARCHAR(255) NOT NULL,
  rating INT(1);
  seen boolean;
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE links
  ADD PRIMARY KEY (id);

ALTER TABLE links
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE links;