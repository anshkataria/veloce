# VELOCE

A full-stack automotive commerce platform with a customer storefront, an operations dashboard, and a Spring Boot API. VELOCE demonstrates transactional order processing, role-based access, third-party payments, asynchronous notifications, caching, realtime operations updates, and automated delivery checks.

## Architecture

```text
React storefront (5173) ----+
                            +--> Spring Boot API (8080) --> PostgreSQL
React admin (5174) ---------+             |              --> Redis cache
                                          +--------------> Stripe Checkout
                                          +--------------> SMTP / Mailpit
```

## Engineering Highlights

- JWT authentication with server-enforced `CUSTOMER` and `ADMIN` authorization
- Server-side totals and pessimistic inventory locking to prevent overselling
- Stripe-hosted Checkout sessions with signed webhook payment confirmation
- Redis-backed catalog caching with cache eviction on inventory changes
- Server-Sent Events that refresh the admin order queue in realtime
- Asynchronous welcome and order-confirmation emails
- OpenAPI/Swagger documentation and Actuator health probes
- JUnit 5/Mockito, Vitest/React Testing Library, and Playwright coverage
- GitHub Actions quality gates for linting, tests, builds, and E2E tests
- Multi-stage Docker images and one-command Compose environment

## Stack

| Area | Technology |
| --- | --- |
| Storefront and admin | React 19, Vite, React Router, TanStack Query, Zustand, Tailwind CSS |
| Backend | Java 21, Spring Boot 4, Spring Security, Spring Data JPA |
| Data | PostgreSQL 16, Redis 7 |
| Integrations | Stripe Checkout, SMTP/Mailpit, SSE, OpenAPI |
| Quality | JUnit, Mockito, Vitest, React Testing Library, Playwright, GitHub Actions |

## Run Locally

Docker Compose is the supported full-stack path:

```bash
cp .env.example .env
docker compose up --build
```

- Storefront: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Mailpit inbox: http://localhost:8025
- Health: http://localhost:8080/actuator/health

The seeded local admin is `admin@veloce.in` / `admin123`. These credentials are development-only and must be replaced before deployment.

## Optional Integrations

Email is captured locally by Mailpit. Set `MAIL_ENABLED=true` to deliver registration and order messages to it.

For Stripe sandbox checkout, add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, set `VITE_STRIPE_ENABLED=true`, then forward sandbox events:

```bash
stripe listen --forward-to localhost:8080/api/v1/payments/webhook
```

Without Stripe credentials, checkout remains a working reservation flow and records a pending order.

## Quality Commands

```bash
# storefront
cd apps/storefront && npm ci && npm run lint && npm test && npm run build
npm run test:e2e

# admin
cd apps/admin && npm ci && npm run lint && npm test && npm run build

# backend
cd backend/api && ./mvnw verify
```

## Security Notes

- Prices and roles are never trusted from clients.
- Admin inventory and order endpoints are protected by backend RBAC.
- Stripe webhook signatures are verified before payment state changes.
- Secrets and allowed origins are environment-configured.
- Local JWT and database defaults exist only for developer convenience; use generated secrets and managed credentials in deployment.

## Repository Layout

```text
apps/storefront/  Customer application
apps/admin/       Operations application
backend/api/      Spring Boot REST API
.github/workflows Continuous integration
```
