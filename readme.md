# 📂 Role-Based Folder Permission System

_A secure access control system built with **AdonisJS, Inertia.js, React, and Tailwind CSS**._  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **User Authentication** (Session-based)
- **Role Management** (Admin)
- **Folder Permission Granularity** (Read/Write/Delete)
- **Real-Time Updates** (SSE via Redis)
- **Background Tasks** (Adonis Resque Scheduler)
- **Responsive UI** (Tailwind CSS)

---

## 🛠 Tech Stack

| Category      | Technology                       |
| ------------- | -------------------------------- |
| **Backend**   | AdonisJS 6 (Node.js)             |
| **Frontend**  | React + Inertia.js               |
| **Styling**   | Tailwind CSS                     |
| **Database**  | MySQL (RDBMS)                    |
| **Realtime**  | Server-Sent Events (SSE) + Redis |
| **Scheduler** | Adonis Resque (Redis-backed)     |

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- MySQL 5.7+
- Redis (for SSE & Resque)

## 🔐 Default Test Credentials

### Admin Access (Full Permissions)

```json
{
  "username": "admin",
  "code": "admin"
}
```

### Tree

folder_access
├── .editorconfig
├── .env
├── .env.production
├── .github
│ └── workflows
│ └── ci-cd.yml
├── .gitignore
├── ace.js
├── adonisrc.ts
├── app
│ ├── abilities
│ │ ├── admin_content.ts
│ │ └── fetch_folders.ts
│ ├── controllers
│ │ ├── auth_controller.ts
│ │ ├── files_controller.ts
│ │ ├── pages_controller.ts
│ │ ├── permissions_controller.ts
│ │ ├── roles_controller.ts
│ │ └── users_controller.ts
│ ├── exceptions
│ │ └── handler.ts
│ ├── jobs
│ │ └── refresh_database.ts
│ ├── mail
│ │ └── create_user_mail.ts
│ ├── middleware
│ │ ├── auth_middleware.ts
│ │ ├── container_bindings_middleware.ts
│ │ ├── file_max_middleware.ts
│ │ ├── guest_middleware.ts
│ │ ├── initialize_bouncer_middleware.ts
│ │ └── silent_auth_middleware.ts
│ ├── models
│ │ ├── folder_permission.ts
│ │ ├── role.ts
│ │ └── user.ts
│ ├── policies
│ │ └── main.ts
│ ├── services
│ │ ├── authorization.ts
│ │ ├── get_folder_qs.ts
│ │ ├── get_higher_level_access.ts
│ │ └── get_permissions.ts
│ ├── types
│ │ └── files.type.ts
│ └── validator
│ ├── auth.schema.ts
│ ├── file.schema.ts
│ ├── permission.schema.ts
│ ├── role.schema.ts
│ └── user.schema.ts
├── bin
│ ├── console.ts
│ ├── server.ts
│ └── test.ts
├── config
│ ├── app.ts
│ ├── auth.ts
│ ├── bodyparser.ts
│ ├── cors.ts
│ ├── database.ts
│ ├── drive.ts
│ ├── hash.ts
│ ├── inertia.ts
│ ├── logger.ts
│ ├── mail.ts
│ ├── redis.ts
│ ├── resque.ts
│ ├── session.ts
│ ├── shield.ts
│ ├── static.ts
│ ├── transmit.ts
│ └── vite.ts
├── database
│ └── migrations
│ ├── 1create_roles_table.ts
│ ├── 2create_users_table.ts
│ └── 3create_folder_permissions_table.ts
├── ecosystem.config.cjs
├── eslint.config.js
├── inertia
│ ├── app
│ │ ├── app.tsx
│ │ └── ssr.tsx
│ ├── components
│ │ ├── add_folder.tsx
│ │ ├── add_path.tsx
│ │ ├── add_role.tsx
│ │ ├── edit_file.tsx
│ │ ├── file_explore.tsx
│ │ ├── footer.tsx
│ │ ├── header.tsx
│ │ ├── manage_user.tsx
│ │ └── settings
│ │ ├── permission.tsx
│ │ └── role.tsx
│ ├── css
│ │ └── app.css
│ ├── hooks
│ │ └── use_debounc.tsx
│ ├── pages
│ │ ├── dashboard.tsx
│ │ ├── errors
│ │ │ ├── not_found.tsx
│ │ │ └── server_error.tsx
│ │ ├── file.tsx
│ │ ├── home.tsx
│ │ ├── layout.tsx
│ │ ├── login.tsx
│ │ ├── settings.tsx
│ │ └── users.tsx
│ ├── provider
│ │ └── transmit.tsx
│ ├── tsconfig.json
│ └── types
│ └── folder_permission.tsx
├── package.json
├── pnpm-lock.yaml
├── readme.md
├── resources
│ └── views
│ ├── email
│ │ └── send_credentials.edge
│ └── inertia_layout.edge
├── start
│ ├── env.ts
│ ├── kernel.ts
│ └── routes.ts
├── tests
│ └── bootstrap.ts
├── tsconfig.json
└── vite.config.ts

```

```
