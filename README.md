# **Project Plan: Full-Stack Tournament Management System**

## **1\. Project Overview**

This project is a web-based application called **Pro-League** designed to be a comprehensive tournament management system. It will allow users to create and manage tournaments, register players and teams, track matches and results, and handle bracket generation and standings. The system will be built with a decoupled architecture, where a single backend API serves data to a modern frontend, allowing for potential future integrations with other applications.

## **2\. Core Features**

The application will be built around the following key functionalities:

### **User Management**

* **Authentication:** Users can sign up, log in, and securely manage their accounts.  
* **Authorization:** Implement roles for different user types (e.g., Administrator, Tournament Organizer, Player) to control access to various parts of the system.

### **Tournament Management**

* **CRUD Operations:** Users can create, view, update, and delete tournaments.  
* **Tournament Details:** Each tournament will include a name, description, game/sport type, start and end dates, format (single elimination, double elimination, round-robin, etc.), and status (e.g., "Registration Open," "In Progress," "Completed").
* **Tournament Settings:** Configure maximum participants, entry requirements, prizes, and rules.

### **Player & Team Management**

* **Registration:** Players and teams can register for tournaments.
* **Player Profiles:** View profiles for each player, including their tournament history, statistics, and achievements.
* **Team Management:** Create and manage teams, invite members, and assign team roles.

### **Match & Bracket Management**

* **Bracket Generation:** Automatically generate tournament brackets based on the selected format and number of participants.
* **Match Scheduling:** Schedule matches with dates, times, and locations.
* **Score Entry:** Record match results and scores, with validation and dispute resolution features.
* **Live Updates:** Real-time updates of match results and bracket progression.

### **Standings & Statistics**

* **Leaderboards:** Display current standings and rankings for ongoing tournaments.
* **Statistics Dashboard:** View detailed statistics including win/loss records, head-to-head results, and performance metrics.
* **Tournament History:** Archive of completed tournaments with full results and statistics.

### **Dashboard & Notifications**

* **Home Dashboard:** A personalized dashboard for each user showing their upcoming matches, tournaments they're participating in, and recent results.
* **Notifications:** Real-time notifications for match schedules, results, and tournament updates.

## **3\. Technical Stack**

The application will use a modern, robust, and scalable technology stack.

* **Frontend:** **Next.js**  
  * A React framework for building the user interface, providing Server-Side Rendering (SSR) and a great developer experience.  
  * **React-Query:** Will be used for managing server-side data fetching, caching, and state management, reducing the need for complex global state libraries.  
  * **Mantine:** A modern React component library that provides accessible, customizable UI components plus built-in form utilities and hooks (e.g., useForm). Mantine will handle component styling, theming, and form handling (replacing the previous use of Chakra UI and React-Hook-Form), simplifying form validation and UI consistency across the app.  
* **Backend:** **AdonisJS**  
  * A robust Node.js framework that offers a complete solution for building a backend API.  
  * It includes built-in features like a powerful ORM (**Lucid ORM**), authentication, and a clear project structure, similar to the Laravel framework you prefer.  
  * Will handle all API endpoints for the frontend.  
* **Database:** A relational database like **MySQL** will be used for data persistence. This is a good fit for the structured relational data in this project, including tournaments, players, teams, matches, and results.  
* **Containerization:** **Docker** will be used to containerize the application for consistent development and deployment environments.

## **4\. Monorepo and Deployment Strategy**

The project will be managed within a single repository, known as a **monorepo**. This approach simplifies dependency management and ensures a unified development workflow. The services will be containerized and orchestrated using Docker, which is crucial for a consistent development experience and future scalability.

### **Monorepo Structure**

The project directory will be organized as follows. Note the addition of individual Dockerfiles for each service.

/project-root  
├── /backend/ \# All AdonisJS code  
│ ├── /app/  
│ ├── /config/  
│ ├── /database/  
│ ├── Dockerfile \# Dockerfile for the backend service  
│ ├── package.json  
│ └── tsconfig.json  
├── /frontend/ \# All Next.js code  
│ ├── /app/  
│ ├── /public/  
│ ├── Dockerfile \# Dockerfile for the frontend service  
│ ├── package.json  
│ └── tsconfig.json  
├── docker-compose.yml \# Single file to orchestrate all services  
├── .gitignore  
└── README.md

### **Docker Deployment**

Instead of building a single, monolithic image, each service will have its own dedicated **Dockerfile**. This is the **decoupled approach**, which provides greater flexibility.

* **backend/Dockerfile**: This file will contain all the necessary instructions to build a production-ready AdonisJS image. It will install dependencies, build the TypeScript code, and configure the container to serve the backend API. It will not be concerned with the frontend.  
* **frontend/Dockerfile**: This file will be responsible for building the Next.js application. It will install its dependencies, run the production build process, and set up a lightweight server to serve the static and server-rendered assets.  
* **docker-compose.yml**: This single file is the "master plan." It defines the entire application stack as a set of services. It will configure:  
  1. A **database service** (PostgreSQL) to handle data persistence.  
  2. A **backend service** that uses the backend/Dockerfile.  
  3. A **frontend service** that uses the frontend/Dockerfile.

This setup allows you to run a single command (docker-compose up) to start your entire application stack. Each service will run in its own container, completely isolated from the others. This is a powerful and scalable way to manage your project.

## **5\. Shared Package for Common Code**

To maintain consistency and avoid code duplication between the frontend and backend services, the project will include a dedicated shared package: @pro-league/shared. This package will be housed in a separate directory at the root of the monorepo.

The primary purpose of this package is to centralize **TypeScript interfaces, types, and enums** that are used by both the frontend and the backend. This includes data models for tournaments, matches, players, teams, and users. The package will be structured with dedicated subdirectories for clarity, such as /src/interfaces and /src/enums.

The folder structure will look like this:

/shared  
├── src  
│   ├── interfaces  
│   │   ├── ITournament.ts  
│   │   ├── IMatch.ts  
│   │   ├── IPlayer.ts  
│   │   └── ITeam.ts  
│   └── enums  
│       ├── TournamentStatus.ts  
│       └── TournamentFormat.ts  
├── package.json  
└── tsconfig.json

A key part of this strategy is the use of a "barrel" index.ts file within the shared package. This file will export all necessary components, allowing for clean and simple imports from other services in the monorepo, such as import { ITournament } from '@pro-league/shared';. This approach ensures that any change to a data model is reflected in both the frontend and backend, reducing the risk of bugs and making the development process more efficient.
