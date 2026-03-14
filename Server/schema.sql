CREATE DATABASE upBeat;

SHOW DATABASES;

USE upBeat;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE exercises(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    muscle_group ENUM(
        'chest',
        'back',
        'legs',
        'shoulders',
        'biceps',
        'triceps',
        'core',
        'glutes',
        'full_body',
        'cardio'
    ) NOT NULL,
    description TEXT,
    duration_minutes INT UNSIGNED,
    difficulty ENUM(
        'EASY',
        'MEDIUM',
        'HARD'
    ) NOT NULL
);

CREATE TABLE routines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE routine_exercise (
    routine_id INT NOT NULL,
    exercise_id INT NOT NULL,
    PRIMARY KEY (routine_id, exercise_id),
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE timers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_seconds INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE active_routine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    routine_id INT NOT NULL,
    timer_id INT NOT NULL,
    status ENUM('IN_PROGRESS', 'COMPLETED','PAUSED', 'CANCELLED') NOT NULL DEFAULT 'IN_PROGRESS',
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
    FOREIGN KEY (timer_id) REFERENCES timers(id) ON DELETE CASCADE
);


