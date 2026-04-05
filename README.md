# VELOCE

A full-stack premium car commerce project.

VELOCE is not a basic generic store. It is a luxury-focused platform with:

- a customer storefront,
- an admin dashboard,
- and a secure backend API.

The project shows real-world skills like authentication, protected admin routes, API integration, state management, and custom branding.

## Live Project Idea

**Storefront:** users browse cars, view details, add to cart, and place orders.  
**Admin:** admin can manage products, track orders, and monitor business stats.

## Main Features

### Storefront

- Home page with featured cars from API
- Category browsing (Supercars, Sportscars, Luxury cars)
- Product listing with filters and sorting
- Product detail page with related cars
- Cart and checkout flow
- Login/Register with backend authentication
- Order history page for users

### Admin Dashboard

- Secure admin login
- Dashboard cards and revenue chart
- Recent orders table
- Product management (create, update, delete)
- Order status management
- Light/Dark mode

### Backend API

- Spring Boot REST API
- JWT authentication
- Role-based security rules
- PostgreSQL database
- Seeded data (admin + sample cars)

## Tech Stack

### Frontend

- React + Vite
- React Router
- TanStack Query
- Zustand
- Axios
- Tailwind CSS + custom CSS variables

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT

## Project Structure

```text
veloce/
  apps/
    storefront/   # Customer app (React + Vite)
    admin/        # Admin app (React + Vite)
  backend/
    api/          # Spring Boot API
```

## Getting Started

## 1) Clone and open

```bash
git clone <your-repo-url>
cd veloce
```

## 2) Backend setup (PostgreSQL + API)

Create a PostgreSQL database and user that match:

- DB: `veloce_db`
- User: `veloce_user`
- Password: `veloce123`

These values are in `backend/api/src/main/resources/application.yml`.

Run backend:

```bash
cd backend/api
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`

## 3) Run Storefront

```bash
cd apps/storefront
npm install
npm run dev
```

Storefront runs on Vite default port (usually `http://localhost:5173`).

## 4) Run Admin

Open another terminal:

```bash
cd apps/admin
npm install
npm run dev
```

Admin runs on another Vite port (usually `http://localhost:5174`).

## Docker (Run Everything)

You can run the full stack (PostgreSQL + Spring Boot API + Storefront + Admin) with Docker Compose.

From the project root:

```bash
docker compose up --build
```

Services:

- Storefront: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

Run in detached mode:

```bash
docker compose up -d --build
```

Stop everything:

```bash
docker compose down
```

Stop and remove database volume too:

```bash
docker compose down -v
```

## Demo Credentials

### Admin

- Email: `admin@veloce.in`
- Password: `admin123`

Admin user is seeded by backend in:
`backend/api/src/main/java/com/veloce/api/config/DataSeeder.java`

## Future Improvements

- Add payment gateway integration

---
