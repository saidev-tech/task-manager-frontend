# My Todo Frontend

A modern Vue.js frontend for the Todo application, designed to work with a Java Spring Boot backend.

## Features

- ✅ Create new tasks
- ✏️ Edit existing tasks
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete tasks
- 🔍 Filter tasks (All, Pending, Completed)
- 📱 Responsive design
- 🎨 Modern UI with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Java Spring Boot backend running on `http://localhost:9090`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Backend Requirements

Make sure your Java Spring Boot backend is running and provides the following endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update an existing task
- `DELETE /api/tasks/{id}` - Delete a task

### Expected Task Model

```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/
│   ├── TaskForm.vue      # Form for creating new tasks
│   ├── TaskItem.vue      # Individual task component
│   └── TaskList.vue      # List of tasks with filtering
├── App.vue               # Main application component
└── main.js              # Application entry point
```

## Configuration

The backend URL is currently hardcoded to `http://localhost:9090`. If your backend runs on a different port, update the axios calls in:

- `src/App.vue`
- `src/components/TaskForm.vue`
- `src/components/TaskItem.vue`

## CORS Configuration

Make sure your Spring Boot backend allows CORS from `http://localhost:3000`. You can do this by adding the following to your Spring Boot application:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    // Your controller code
}
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist` directory, ready for deployment.

## Deployment

For AWS deployment, you can:

1. Build the application for production
2. Upload the `dist` folder contents to an S3 bucket configured for static website hosting
3. Configure CloudFront for better performance (optional)
4. Make sure your backend API allows CORS from your frontend domain

## Troubleshooting

### Backend Connection Issues

If you see "Failed to fetch tasks" error:
1. Verify your backend is running on `http://localhost:9090`
2. Check that the `/api/tasks` endpoint is accessible
3. Ensure CORS is properly configured in your backend

### Development Server Issues

If the development server won't start:
1. Make sure Node.js is installed
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Try running `npm run dev` again
