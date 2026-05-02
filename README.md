Car Maintenance Scheduler and Tracking System
1. Introduction

The Car Maintenance Scheduler and Tracking System is a backend-focused solution designed to optimize vehicle servicing operations. It intelligently schedules maintenance tasks based on constraints such as available time and service impact.

The system demonstrates real-world backend engineering concepts including centralized logging, fault-tolerant API integration, and algorithm-based optimization using the 0/1 Knapsack approach.

2. System Objectives

The main goals of this system are:

Optimize vehicle maintenance scheduling
Ensure reliable backend processing under unstable external APIs
Implement centralized logging for monitoring and debugging
Demonstrate scalable and modular backend design practices
3. Key Features
3.1 Centralized Logging System
Uses a reusable logging middleware
Logs all backend operations, errors, and API calls
Supports token-based authentication with auto-renewal
3.2 Backend API (Express.js)
Built using Node.js and Express
Provides endpoints for scheduling and tracking
Handles validation, processing, and responses
3.3 Optimization Algorithm
Implements the 0/1 Knapsack algorithm
Selects vehicles for maintenance based on:
Time constraints (mechanic hours)
Task duration
Impact value
Ensures maximum total impact within given limits
3.4 External API Integration
Connects to external services (e.g., depots and vehicles APIs)
Handles unreliable API behavior through:
Retry mechanisms
Graceful error handling
Fallback to mock data
4. Project Structure
your-roll-number/
│
├── logging_middleware/
│   └── log.js
│
├── notification_app_be/
│   ├── server.js
│   ├── api.js
│   └── scheduler.js
│
├── notification_system_design.md
├── README.md
├── package.json
└── .gitignore

5. System Workflow
  Client sends a request to the backend API
  API validates input and triggers scheduling logic
  External APIs are called to fetch depot and vehicle data
  If APIs fail, fallback mock data is used
  Knapsack algorithm computes optimal schedule
  Results are returned to the client
  All actions are logged via centralized middleware

7. Setup and Execution
  Step 1: Install Dependencies
  npm install
  Step 2: Start the Server
  node notification_app_be/server.js
  Step 3: Test the API

Access:
http://localhost:3000/schedule
7. Sample Output
[
  {
    "depotId": "D1",
    "maxImpact": 16,
    "totalDuration": 8,
    "selectedVehicles": [
      { "ID": "V1", "Duration": 5, "Impact": 10 },
      { "ID": "V3", "Duration": 3, "Impact": 6 }
    ]
  }
]
8. Problem Statement & Solution
Problem: Efficiently assign maintenance tasks to depots given:
  Limited mechanic hours
  Multiple vehicles with different service durations
  Different impact values
  Solution Approach
  Modeled as a 0/1 Knapsack problem
Objective: Maximize total impact within time constraints
Output: Optimal selection of vehicles for servicing

9. Handling External API Issues
Challenges Faced
  Unstable APIs (/depots, /vehicles)

Common errors:
  ECONNRESET
  401 Unauthorized
  SSL certificate issues
  Solutions Implemented
  Retry logic for failed requests
  Graceful degradation
  Fallback to mock datasets

Outcome
  Improved system reliability
  Continuous execution even during failures
  Better demonstration of core logic
  
11. Technology Stack
  Node.js – Backend runtime
  Express.js – API framework
  Axios – API communication
  JavaScript – Core programming language

13. Engineering Highlights
  Modular and clean code structure
  Fault-tolerant API design
  Centralized logging system
  Real-world optimization problem implementation

15. Conclusion
This project effectively combines backend engineering principles with algorithmic problem-solving. It showcases how real-world systems can remain robust even under unreliable conditions while maintaining performance and scalability.
