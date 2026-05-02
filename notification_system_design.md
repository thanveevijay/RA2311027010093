# Notification System Design

---

## Stage 1: API Design

### Core Features
- Send notification
- Get user notifications
- Mark notification as read

---

### 1. Send Notification

POST /notify

Request:
{
  "userId": "123",
  "message": "Vehicle Maintenance Due!"
}

Response:
{
  "message": "Notification sent",
  "data": {
    "id": "notif123",
    "userId": "123",
    "message": "Vehicle Maintenance Due!"
  }
}

---

### 2. Get Notifications

GET /notifications/:userId

Response:
{
  "notifications": [
    {
      "id": "notif123",
      "message": "Vehicle Maintenance Due!",
      "isRead": false
    }
  ]
}

---

### 3. Mark as Read

PUT /notifications/:id/read

Response:
{
  "message": "Marked as read"
}

---

### Real-Time Mechanism
- WebSockets OR Firebase Cloud Messaging (FCM)

---

## Stage 2: Database Design

### DB Choice
- MongoDB (NoSQL)

### Schema

notifications:
{
  _id,
  userId,
  message,
  isRead,
  createdAt
}

### Queries

Insert:
db.notifications.insertOne({...})

Fetch:
db.notifications.find({ userId: "123", isRead: false })

---

## Stage 3: Performance Issue Fix

Problem:
- Slow query due to full scan

Solution:
- Add Index

db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 })

---

## Stage 4: Scalability Improvements

Problems:
- DB overload

Solutions:
- Pagination (limit 10)
- Caching (Redis)
- Lazy loading

Tradeoffs:
- Cache = faster but memory usage
- Pagination = less load but partial data

---

## Stage 5: Reliable Notification System

### Problems
- Email failure
- No retry
- Tight coupling

---

### Improved Design
- Use Queue (RabbitMQ / Kafka)
- Retry mechanism
- Separate services

---

### Updated Pseudocode

function notify_all(student_ids, message):
    for id in student_ids:
        queue.push({ id, message })

worker:
    process(queue):
        send_email()
        save_db()
        push_app()

---

## Stage 6: Top N Notifications (Priority Logic)

### Logic
Priority = Impact + Recency

---

### Code (JavaScript)

function getTopNotifications(notifications, n=10) {
    return notifications
        .sort((a, b) => {
            return (b.impact + b.time) - (a.impact + a.time);
        })
        .slice(0, n);
}

---

### Handling New Notifications
- Use Min Heap (size = 10)
- Replace lowest priority when new arrives

---

### API Used
GET http://20.207.122.201/evaluation-service/notifications

---

## Conclusion

- Designed scalable notification system
- Optimized DB queries
- Added real-time support
- Ensured reliability with queues
- Efficient top-N selection implemented
