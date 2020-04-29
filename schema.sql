-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS users;
-- Creates the "blogger" database --
CREATE DATABASE users;

-- WHATS GOING IN HERE --
CREATE TABLE workouts (
    -- id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(250),
    duration INT (200),
    reps INT (40),
    sets INT (10),
);

-- Insert set of records
INSERT INTO workouts (category,duration,reps,sets)
VALUES ("Chest",45,16,4);

INSERT INTO workouts (category,duration,reps,sets)
VALUES ("arms",35,16,4);

INSERT INTO workouts (category,duration,reps,sets)
VALUES ("Lower Body",45,16,4);

INSERT INTO workouts (category,duration,reps,sets)
VALUES ("Back",20,16,4);


-- this database will hold recipes the user chooses from 
-- the database provided by edamam api
-- in order for this to happen we need the user to make a request to edamam api in form of search
-- so we need edamam api to post these recipes to our site matching the user's
-- search of food types, ingredients
-- then we need edamam api to send us back a list of related recipes
-- then we want the user to be able to choose a desired recipe and our system will post that
-- to a saved recipes box
-- there will be a table of users, and each user will have their own subtable in which 
-- they can save their food preferences and what recipes they have chosen
-- in order to do this they have to create an account and log in to the website
-- user table parameters: Email, password, dietary restrictions, favorite foods, favorite cuisines,
-- saved recipes, saved workouts
-- 