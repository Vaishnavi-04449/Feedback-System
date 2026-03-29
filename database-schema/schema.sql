-- Global Feedback Management System 
-- MS SQL Server Database Schema

-- 1. Create Tables
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(512) NOT NULL,
    RoleId INT NOT NULL,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

CREATE TABLE Countries (
    CountryId INT PRIMARY KEY IDENTITY(1,1),
    CountryName NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Consultants (
    ConsultantId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    CountryId INT NOT NULL,
    AssignedCUManagerId INT NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Active',
    CONSTRAINT FK_Consultants_Countries FOREIGN KEY (CountryId) REFERENCES Countries(CountryId),
    CONSTRAINT FK_Consultants_Users FOREIGN KEY (AssignedCUManagerId) REFERENCES Users(UserId)
);

CREATE TABLE Feedback (
    FeedbackId INT PRIMARY KEY IDENTITY(1,1),
    ConsultantId INT NOT NULL,
    GTMManagerId INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comments NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Feedback_Consultants FOREIGN KEY (ConsultantId) REFERENCES Consultants(ConsultantId) ON DELETE CASCADE,
    CONSTRAINT FK_Feedback_Users FOREIGN KEY (GTMManagerId) REFERENCES Users(UserId)
);

CREATE TABLE Notifications (
    NotificationId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- 2. Create Indexes
CREATE NONCLUSTERED INDEX IX_Consultants_CountryId ON Consultants(CountryId);
CREATE NONCLUSTERED INDEX IX_Consultants_CUManagerId ON Consultants(AssignedCUManagerId);
CREATE NONCLUSTERED INDEX IX_Feedback_ConsultantId ON Feedback(ConsultantId);
CREATE NONCLUSTERED INDEX IX_Feedback_CreatedAt ON Feedback(CreatedAt DESC);
CREATE NONCLUSTERED INDEX IX_Notifications_UserId_IsRead ON Notifications(UserId, IsRead);

-- 3. Seed Data
INSERT INTO Roles (RoleName) VALUES ('GTM Manager');
INSERT INTO Roles (RoleName) VALUES ('CU Manager');

-- Add Dummy GTM Manager and CU Manager
INSERT INTO Users (Name, Email, PasswordHash, RoleId) VALUES 
('Alice Global', 'alice.gtm@example.com', 'hashed_pwd_here', 1),
('Bob India CU', 'bob.india@example.com', 'hashed_pwd_here', 2),
('Charlie US CU', 'charlie.us@example.com', 'hashed_pwd_here', 2);

-- Add Countries
INSERT INTO Countries (CountryName) VALUES ('India'), ('USA'), ('UK');

-- Add Consultants
INSERT INTO Consultants (Name, CountryId, AssignedCUManagerId) VALUES 
('Ravi Kumar', 1, 2),
('Priya Sharma', 1, 2),
('John Doe', 2, 3),
('Jane Smith', 2, 3);

-- Add sample feedback
INSERT INTO Feedback (ConsultantId, GTMManagerId, Rating, Comments) VALUES 
(1, 1, 4, 'Great performance on the recent Q3 project.'),
(3, 1, 5, 'Exceptional client management skills demonstrated.');

-- 4. Example Queries

-- Q1. Fetching feedback history for a specific consultant:
-- SELECT f.Rating, f.Comments, f.CreatedAt, u.Name AS SubmittedBy
-- FROM Feedback f
-- JOIN Users u ON f.GTMManagerId = u.UserId
-- WHERE f.ConsultantId = 1
-- ORDER BY f.CreatedAt DESC;

-- Q2. Filtering consultants by country (for GTM Dashboard):
-- SELECT c.ConsultantId, c.Name, cy.CountryName, u.Name AS ManagedBy
-- FROM Consultants c
-- JOIN Countries cy ON c.CountryId = cy.CountryId
-- JOIN Users u ON c.AssignedCUManagerId = u.UserId
-- WHERE cy.CountryName = 'India';
