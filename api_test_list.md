# API Test List for Postman

## Base URL: http://localhost:8080

### 1. Stats API
```
GET /api/approvals/stats
```

### 2. Departments API  
```
GET /api/departments
```

### 3. Form Templates API
```
GET /api/form-templates
```

### 4. Pending Tickets API
```
GET /api/approvals/pending
GET /api/approvals/pending?page=0&size=10&sort=assignedAt,desc
```

### 5. Processed Tickets API
```
GET /api/approvals/processed  
GET /api/approvals/processed?page=0&size=10&sort=actedAt,desc
```

### 6. Ticket Details API
```
GET /api/approvals/{ticketId}
Example: GET /api/approvals/1
```

### 7. Priority Levels API (might be needed)
```
GET /api/priorities
```

### 8. Test Authentication (if needed)
```
Check if APIs require authentication headers
```

## Expected Response Formats:

### Stats Response:
```json
{
  "pendingTickets": 0,
  "processedTickets": 0, 
  "approvedTickets": 0,
  "rejectedTickets": 0
}
```

### Departments Response:
```json
[
  {
    "id": 1,
    "name": "Human Resources",
    "description": "...",
    "isActive": true
  }
]
```

### Form Templates Response:
```json
[
  {
    "id": 1,
    "name": "Leave Request",
    "description": "...",
    "formSchema": {...}
  }
]
```
