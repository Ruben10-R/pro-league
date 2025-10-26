# **Project Plan: Full-Stack Tournament Management System**

## **1. Project Overview**

This project is a web-based application called **Pro-League** designed to be a comprehensive tournament management system. It will allow users to create and manage tournaments, register players and teams, track matches and results, and handle bracket generation and standings. The system will be built with a decoupled architecture, where a single backend API serves data to a modern frontend, allowing for potential future integrations with other applications.

## **2. Core Features**

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

## **3. Technical Stack**

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

## **4. Monorepo and Deployment Strategy**

The project will be managed within a single repository, known as a **monorepo**. This approach simplifies dependency management and ensures a unified development workflow. The services will be containerized and orchestrated using Docker, which is crucial for a consistent development experience and future scalability.

### **Monorepo Structure**

The project directory will be organized as follows. Note the addition of individual Dockerfiles for each service.

```
/project-root
├── /backend/             # All AdonisJS code
│   ├── /app/
│   ├── /config/
│   ├── /database/
│   ├── Dockerfile        # Dockerfile for the backend service
│   ├── package.json
│   └── tsconfig.json
├── /frontend/            # All Next.js code
│   ├── /app/
│   ├── /public/
│   ├── Dockerfile        # Dockerfile for the frontend service
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml    # Single file to orchestrate all services
├── .gitignore
└── README.md
```

### **Docker Deployment**

Instead of building a single, monolithic image, each service will have its own dedicated **Dockerfile**. This is the **decoupled approach**, which provides greater flexibility.

* **backend/Dockerfile**: This file will contain all the necessary instructions to build a production-ready AdonisJS image. It will install dependencies, build the TypeScript code, and configure the container to serve the backend API. It will not be concerned with the frontend.
* **frontend/Dockerfile**: This file will be responsible for building the Next.js application. It will install its dependencies, run the production build process, and set up a lightweight server to serve the static and server-rendered assets.
* **docker-compose.yml**: This single file is the "master plan." It defines the entire application stack as a set of services. It will configure:
  1. A **database service** (MySQL) to handle data persistence.
  2. A **backend service** that uses the backend/Dockerfile.
  3. A **frontend service** that uses the frontend/Dockerfile.

This setup allows you to run a single command (docker-compose up) to start your entire application stack. Each service will run in its own container, completely isolated from the others. This is a powerful and scalable way to manage your project.

## **5. Shared Package for Common Code**

To maintain consistency and avoid code duplication between the frontend and backend services, the project will include a dedicated shared package: @pro-league/shared. This package will be housed in a separate directory at the root of the monorepo.

The primary purpose of this package is to centralize **TypeScript interfaces, types, and enums** that are used by both the frontend and the backend. This includes data models for tournaments, matches, players, teams, and users. The package will be structured with dedicated subdirectories for clarity, such as /src/interfaces and /src/enums.

The folder structure will look like this:

```
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
```

A key part of this strategy is the use of a "barrel" index.ts file within the shared package. This file will export all necessary components, allowing for clean and simple imports from other services in the monorepo, such as `import { ITournament } from '@pro-league/shared';`. This approach ensures that any change to a data model is reflected in both the frontend and backend, reducing the risk of bugs and making the development process more efficient.

## **6. Getting Started**

For detailed setup instructions, see [docs/QUICKSTART.md](docs/QUICKSTART.md).

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd pro-league

# Install dependencies
npm ci

# Start all services with Docker
docker-compose up

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3333
# - Database: localhost:3306
```

### Development

```bash
# Start backend in dev mode
npm run dev:backend

# Start frontend in dev mode
npm run dev:frontend

# Run tests
npm run test:backend
npm run lint
```

## **7. Current Implementation Status**

### ✅ Completed Features

#### Authentication System
- User registration with email and password
- User login with JWT tokens
- Session management (logout)
- Password hashing with bcrypt
- User profile endpoints

#### Internationalization (i18n)
- Multi-language support (English and Dutch)
- Backend returns localized error/success messages
- Frontend uses next-intl for translations
- Locale-based routing (/en/*, /nl/*)

#### User Profile
- View user profile
- Update full name
- Change password with validation

#### Infrastructure
- Docker containerization for all services
- MySQL database with migrations
- Comprehensive test suite (unit + functional)
- CI/CD pipeline with GitHub Actions
- ESLint and Prettier for code quality

### 🚧 In Progress

- Tournament management features
- Team management features
- Match and bracket system

## **8. Documentation**

- [Quickstart Guide](docs/QUICKSTART.md) - Setup and running the application
- [AI Agent Guidelines](ai.md) - How to work with AI agents on this project
- [CI/CD Setup](.github/TEST_SECRET_SETUP.md) - GitHub Actions configuration
- [Coding Guidelines](.ai/coding-guidelines.md) - Code standards and best practices
- [Test Database Setup](docs/TEST_DATABASE.md) - How the test database is configured

## **9. Database Access**

The project uses MySQL with two databases on the same server:

**Development Database:**
- Host: localhost
- Port: 3306
- Database: pro_league
- User: pro_league_user
- Password: pro_league_password

**Test Database:**
- Host: localhost
- Port: 3306
- Database: pro_league_test
- User: pro_league_user
- Password: pro_league_password

Both databases are automatically created when you start the application. See [Test Database Setup](docs/TEST_DATABASE.md) for details on how testing works.

### Connecting with DBeaver

1. Create a new MySQL connection
2. Enter the connection details above
3. Click "Test Connection" - if you get "Public Key Retrieval is not allowed":
   - Go to "Driver properties" tab
   - Add property: `allowPublicKeyRetrieval` = `true`
4. Click "Finish"

## **10. Contributing**

When working on this project, please follow the agent-based workflow defined in [ai.md](ai.md). Use the appropriate specialized agents for backend, frontend, or review tasks.

