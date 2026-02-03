# COP4331 Project 1 - LAMP Stack Contact Manager

## Overview
This is a web-based contact management application (or "Contacts Manager" for the demo) built using the **LAMP Stack** (Linux, Apache, MySQL, PHP). It allows users to register, log in, add items, and search through their saved records.

## Tech Stack with Assignments


* **Project Manager:**                                    ---Erik Mayes---
* **Frontend:** HTML5, CSS3, JavaScript                   ---Erik Mayes & Chase Freckmann & Benjamin Prins---
* **Backend:** PHP (API endpoints)                        ---Emmanuel Michel & William Douglass---
* **Database:** MySQL (Relational DB)                     ---Lincoln Huber---

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
