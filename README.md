# Lexora (ميزان) - Law Office Management System

<div dir="rtl">

نظام متكامل لإدارة العمليات اليومية لمكاتب المحاماة، مصمم لمساعدة مكاتب المحاماة والمحامين المستقلين على إدارة العملاء، القضايا، الجلسات، المستندات القانونية، المهام، والمدفوعات من منصة مركزية واحدة.

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Modules](#modules)
- [Database](#database)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Lexora is a professional Law Office Management System designed to streamline legal operations. The system provides a centralized platform for managing clients, cases, hearings, legal documents, tasks, payments, and generating comprehensive reports.

**Key Objectives:**
- Organize law office operations efficiently
- Reduce paperwork and manual tracking
- Improve case tracking and document management
- Provide clear visibility into payments and office performance
- Support multi-language interface (Arabic/English)

## ✨ Features

### Core Modules
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Manage users with different roles (Admin, Lawyer, Secretary, Accountant)
- **Client Management**: Complete client profiles with contact information and case history
- **Case Management**: Track legal cases with full timeline, notes, and status updates
- **Hearings Management**: Schedule and track court hearings with reminders
- **Document Management**: Secure upload and management of legal documents
- **Task Management**: Assign and track tasks with due dates and priorities
- **Payment Management**: Track payments, balances, and financial reports
- **Dashboard**: Interactive dashboard with statistics and key metrics
- **Reports**: Generate comprehensive reports for cases, hearings, payments, and staff performance

### Additional Features
- Multi-language support (Arabic/English)
- Audit logging for all sensitive operations
- Real-time notifications
- Responsive web interface
- Clean Architecture principles
- RESTful API design

## 🛠 Tech Stack

### Backend
- **Framework**: ASP.NET Core 10
- **Language**: C#
- **Database**: SQL Server
- **ORM**: Dapper
- **Authentication**: JWT with Refresh Tokens
- **API Documentation**: Scalar (OpenAPI/Swagger)
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Architecture**: Clean Architecture

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Internationalization**: i18next & react-i18next
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: CSS Modules

### Development Tools
- **Version Control**: Git
- **IDE**: Visual Studio / VS Code
- **API Testing**: Postman

## 🏗 Architecture

Lexora follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  (Controllers, API Endpoints, DTOs)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer                │
│  (Use Cases, Services, Validation)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Domain Layer                   │
│  (Entities, Enums, Domain Rules)        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Infrastructure Layer               │
│  (Database, Repositories, External APIs) │
└─────────────────────────────────────────┘
```

### Design Patterns
- Repository Pattern
- Unit of Work Pattern
- Dependency Injection
- CQRS (for complex operations)
- Options Pattern for configuration

## 📁 Project Structure

```
Lexora/
├── Lexora.API/                 # Presentation Layer
│   ├── Controllers/            # API Controllers
│   ├── Middlewares/            # Custom Middlewares
│   └── Properties/             # Configuration Files
├── Lexora.Application/         # Application Layer
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Interfaces/             # Service Interfaces
│   ├── Services/               # Business Logic Services
│   └── Validation/             # FluentValidation Rules
├── Lexora.Domain/              # Domain Layer
│   ├── Entities/               # Domain Entities
│   ├── Enums/                  # Enumerations
│   └── Interfaces/             # Domain Interfaces
├── Lexora.Infrastructure/      # Infrastructure Layer
│   ├── Data/                   # Database Context
│   ├── Repositories/           # Repository Implementations
│   └── Services/               # External Service Implementations
├── lexora-client/              # Frontend React Application
│   ├── src/
│   │   ├── components/         # Reusable Components
│   │   ├── features/           # Feature Modules
│   │   ├── pages/              # Page Components
│   │   ├── services/           # API Services
│   │   ├── locales/            # Translation Files
│   │   └── styles/             # Global Styles
│   └── public/                 # Static Assets
└── DOC/                        # Documentation
    ├── DB/                     # Database Documentation
    ├── INTRO/                  # Project Introduction
    └── UI-UX/                  # UI/UX Documentation
```

## 🚀 Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 18+ and npm
- SQL Server
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahmoud-refaay/Lexora.git
   cd Lexora
   ```

2. **Restore NuGet packages**
   ```bash
   cd Lexora/Lexora.API
   dotnet restore
   ```

3. **Configure database connection**
   - Update connection string in `appsettings.json`
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=LexoraDB;Trusted_Connection=True;"
     }
   }
   ```

4. **Run database migrations**
   ```bash
   dotnet ef database update
   ```

5. **Run the API**
   ```bash
   dotnet run
   ```
   
   The API will be available at `https://localhost:5001`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd lexora-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Update API base URL in `src/services/api.ts`

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## ⚙️ Configuration

### Environment Variables

Create `.env` files for both backend and frontend:

**Backend (.env):**
```env
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=https://localhost:5001
JWT_Secret=your-secret-key
JWT_RefreshTokenSecret=your-refresh-secret
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://localhost:5001
```

## 📚 API Documentation

The API documentation is available via Scalar/OpenAPI:

- **Development**: `https://localhost:5001/scalar/v1`
- **Production**: `https://your-domain.com/scalar/v1`

### Main API Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Clients**: `/api/clients/*`
- **Cases**: `/api/cases/*`
- **Hearings**: `/api/hearings/*`
- **Documents**: `/api/documents/*`
- **Tasks**: `/api/tasks/*`
- **Payments**: `/api/payments/*`
- **Reports**: `/api/reports/*`

## 👥 User Roles

### Admin
- Full system access
- User and role management
- System settings configuration
- View all reports and audit logs

### Lawyer
- Manage assigned clients and cases
- Schedule hearings
- Manage legal documents
- View case reports

### Secretary
- Add and update clients
- Schedule hearings and appointments
- Upload documents
- Create tasks

### Accountant
- Manage payments
- View financial reports
- Track outstanding balances

## 📦 Modules

### Authentication Module
- User registration and login
- JWT token generation and validation
- Refresh token management
- Password reset functionality
- Account locking after failed attempts

### Client Module
- Client CRUD operations
- Client search and filtering
- Client notes and history
- Related cases view

### Case Module
- Case creation and management
- Case status tracking
- Case timeline
- Case notes and attachments
- Lawyer assignment

### Hearing Module
- Hearing scheduling
- Hearing reminders
- Hearing result tracking
- Hearing history per case

### Document Module
- Secure file upload
- Document metadata management
- Document search and filtering
- Document versioning

### Task Module
- Task creation and assignment
- Task status tracking
- Due date management
- Task reminders

### Payment Module
- Payment recording
- Payment history
- Balance tracking
- Financial reports

## 🗄 Database

### Database Technology
- **SQL Server** as the primary database
- **Dapper ORM** for data access
- **Stored Procedures** for complex operations

### Key Tables
- Users
- Roles
- Permissions
- Clients
- Cases
- Hearings
- Documents
- Tasks
- Payments
- Notifications
- AuditLogs

### Database Principles
- Soft delete for important records
- Created/Updated metadata on main tables
- Indexes on searchable fields
- Audit logs append-only

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- Refresh token mechanism
- Role-based authorization (RBAC)
- Policy-based authorization
- Password hashing (BCrypt)

### Security Measures
- Input validation with FluentValidation
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection
- Secure file upload validation
- Audit logging for sensitive operations

### Best Practices
- Never store plain text passwords
- Use HTTPS in production
- Implement rate limiting
- Regular security updates
- Principle of least privilege

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow C# coding conventions
- Use meaningful variable and function names
- Add XML documentation for public APIs
- Write unit tests for new features
- Keep functions small and focused

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Mahmoud Ahmed Refaay**
- GitHub: [@mahmoud-refaay](https://github.com/mahmoud-refaay)
- LinkedIn: [mahmoud-ahmed-refaay](https://linkedin.com/in/mahmoud-ahmed-refaay)
- Email: mahmoudahmedkhalfallah@gmail.com

## 🙏 Acknowledgments

- Eng. Abu Hadhoud for the comprehensive programming roadmap
- The open-source community for the amazing tools and libraries

---

<div dir="rtl">

**ميزان (Lexora)** - نظام إدارة مكتب محاماة احترافي

</div>
