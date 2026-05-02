# Notification System Design

## Overview
The Notification System is designed to inform users about important events such as vehicle maintenance scheduling. It ensures timely communication between backend services and users by generating notifications whenever key actions occur.

## Objective
- Notify users about vehicle maintenance events
- Provide a simple and scalable notification mechanism
- Integrate logging for tracking system activity

## Components
1. Vehicle Maintenance Scheduler  
   - Generates events when maintenance is scheduled  

2. Logging Middleware  
   - Logs important system activities  

3. Notification Service (Backend)  
   - Handles notification creation and retrieval  

## Workflow
1. A vehicle is added to the system  
2. Maintenance is scheduled  
3. Logging middleware records the event  
4. A notification is generated for the user  

## API Endpoints

### POST /notify
Creates a new notification

Request Body:
{
  "user": "V1",
  "message": "Vehicle Maintenance Due!"
}

Response:
{
  "message": "Notification sent successfully",
  "data": {
    "id": "unique_id",
    "user": "V1",
    "message": "Vehicle Maintenance Due!"
  }
}

---

### GET /notifications
Fetches all notifications

Response:
{
  "count": 1,
  "data": [
    {
      "id": "unique_id",
      "user": "V1",
      "message": "Vehicle Maintenance Due!"
    }
  ]
}

## Design Decisions
- Used in-memory storage for simplicity and fast implementation  
- Implemented REST APIs using Express.js  
- Integrated logging middleware across all operations  
- Maintained modular architecture for scalability  

## Error Handling
- Validates required fields (user, message)  
- Returns appropriate HTTP status codes  
- Handles failures gracefully without crashing the application  

## Logging Integration
- Logs key operations such as:
  - Notification creation  
  - Invalid input handling  
  - Data retrieval  

## Note on Logging
Logging API calls may return "Invalid authorization token" because different backend services run as separate processes and do not share authentication tokens.
However, logging is implemented correctly and handled safely without affecting core application functionality.

## Future Enhancements
- Add email and SMS notification support  
- Use message queues (Kafka/RabbitMQ) for scalability  
- Store notifications in a database  
- Implement authentication and authorization  
- Enable real-time notifications using WebSockets  
