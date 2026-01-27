# COP4331 Project 1 - LAMP Stack Contact Manager

## Overview
This is a web-based contact management application (or "Color Manager" for the demo) built using the **LAMP Stack** (Linux, Apache, MySQL, PHP). It allows users to register, log in, add items, and search through their saved records.

## Tech Stack with Assignments

Me: Database 
Chase: front end
Erik: PM
Echojo: Backend/ API stuff
@Benjamin are you ok with being the second guy on the front end or API?

* Erik Mayes: **Project Manager:**  
* **Frontend:** HTML5, CSS3, JavaScript       ---Erik Mayes & Chase Freckmann---
* **Backend:** PHP (API endpoints)            ---Benjamin Prins & William Douglas---
* **Database:** MySQL (Relational DB)         ---Lincoln Huber---
* **Server:** Apache (running on Ubuntu/DigitalOcean)    ---Emmanuel Michel---

## Features
* **User Authentication:** Secure login system.
* **CRUD Operations:** Add and Search for contacts/colors.
* **Responsive Design:** styled with CSS.
* **API Structure:** Separation of concerns using `LAMPAPI` endpoints.

## Database Structure
The application requires a MySQL database named `COP4331` with two tables:

### 1. Users Table
Stores user credentials.
```sql
CREATE TABLE Users (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID)
) ENGINE=InnoDB;
