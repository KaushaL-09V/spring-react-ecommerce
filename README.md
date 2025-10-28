# Spring + React E-Commerce (SpringEcom)

Full-stack example e-commerce application.

This repository contains two main parts:

- `SpringEcom-backend` — a Spring Boot (Java/Maven) backend providing REST APIs for products and orders.
- `ecom-frontend` — a Vite + React frontend (Tailwind, Bootstrap) that consumes the backend APIs.

## Quick summary

- Backend: Java 17+/Maven, typical dev port 8080. See `SpringEcom-backend/src/main/java/com/kaushal/SpringEcom/controller` for controllers.
- Frontend: React (Vite), dev server uses Vite (default port 5173). See `ecom-frontend/src` for components and `axios.jsx` for API base configuration.

## Prerequisites

- Java 17+ (or the version configured in the backend POM)
- Maven (or use the provided Maven wrapper `mvnw` / `mvnw.cmd`)
- Node.js 18+ and npm

## Run the backend (development)

Open a PowerShell terminal and run:

```powershell
cd SpringEcom-backend
\.\mvnw.cmd spring-boot:run
```

Or if you have Maven installed system-wide:

```powershell
mvn -f SpringEcom-backend spring-boot:run
```

The backend will start (by default) on port 8080. API controllers live under:

`SpringEcom-backend/src/main/java/com/kaushal/SpringEcom/controller`

To build a runnable JAR:

```powershell
cd SpringEcom-backend
\.\mvnw.cmd package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

## Run the frontend (development)

Open a PowerShell terminal and run:

```powershell
cd ecom-frontend
npm install
npm run dev
```

This uses Vite's dev server (see `ecom-frontend/package.json` scripts). Default port is usually 5173.

Available frontend scripts (from `ecom-frontend/package.json`):

- `dev` — start Vite dev server
- `build` — build production assets
- `preview` — locally preview the production build

To build and preview the production frontend:

```powershell
cd ecom-frontend
npm run build
npm run preview
```

## Environment / API base URL

The frontend includes a `.env` file in `ecom-frontend` (if present). Configure the backend base URL there (for example `VITE_API_BASE_URL=http://localhost:8080`). The frontend code uses `axios` (see `ecom-frontend/src/axios.jsx`) — update the base URL if your backend runs on a different host/port.

## Project structure (top-level)

```
README.md
ecom-frontend/        # React + Vite frontend
SpringEcom-backend/   # Spring Boot backend (Maven)
```

Key backend locations:

## Frontend code overview

High-level flow:

- The React app loads product data from the backend using the axios wrapper in `ecom-frontend/src/axios.jsx`. The default `baseURL` points at `http://localhost:8085/api` (update via `VITE_BASE_URL` or the file if needed).
- App-wide state for products and the shopping cart lives in the Context provider `ecom-frontend/src/Context/Context.jsx` (exported as `AppProvider`). The context exposes: `data`, `isError`, `cart`, `addToCart`, `removeFromCart`, `refreshData`, and `clearCart`.
- Pages/components read from context and render UI. Key UI components:
  - `Home.jsx` — landing page, featured product grid, uses `refreshData()` from context and shows product cards (converts image base64 or URL to data URIs).
  - `Product.jsx` — product detail page: fetches single product by id, shows image, allows update/delete and add-to-cart.
  - `Cart.jsx` — shopping cart UI, quantity controls and checkout flow that updates product stock via PUT to `/api/product/{id}`.
  - `AddProduct.jsx` and `UpdateProduct.jsx` — forms for creating/updating products. They submit multipart/form-data: a `product` JSON part and an `imageFile` part.

Image handling and uploads:

- The frontend frequently uses either base64 `imageData` or an image endpoint. For product images the UI either reads `imageData` (base64) or requests the image via `GET /api/product/{id}/image` and creates an object URL for display.
- Adding/updating a product uses a FormData with `imageFile` and a `product` blob (JSON), matching the backend controller which expects `@RequestPart Product product, @RequestPart MultipartFile imageFile`.

Where to change frontend behaviour:

- API base URL: `ecom-frontend/src/axios.jsx` or environment variable `VITE_BASE_URL` used across components.
- Context logic (fetching products, cart persistence): `ecom-frontend/src/Context/Context.jsx`.
- UI and interactions: `ecom-frontend/src/components/*` (Home, Product, Cart, AddProduct, UpdateProduct, etc.).

Key frontend locations:

- Components: `ecom-frontend/src/components`
- Context: `ecom-frontend/src/Context`
- API/axios wrapper: `ecom-frontend/src/axios.jsx`

## Backend code overview

API surface (representative)

- GET `/api/products` — returns all products (see `ProductController#getProduct`).
- GET `/api/product/{id}` — returns a single product by id.
- POST `/api/product` — create a product. Expects multipart form with `product` JSON part and `imageFile` part.
- PUT `/api/product/{id}` — update a product (also expects `product` and `imageFile`).
- DELETE `/api/product/{id}` — delete a product.
- GET `/api/product/{productId}/image` — returns raw image bytes for the product.
- GET `/api/products/search?keyword=...` — search products by keyword.
- POST `/api/orders/place` — submit an order (see `OrderController#placeOrder`).
- GET `/api/orders` — list orders.

Data models (important fields)

- Product (`SpringEcom-backend/src/main/java/com/kaushal/SpringEcom/model/Product.java`):
  - id, name, description, brand, price (BigDecimal), category, releaseDate, productAvailable (boolean), stockQuantity (int)
  - imageName, imageType, imageData (byte[] with `@Lob`) — used by the image endpoint and for inline base64 payloads.
- Order (`SpringEcom-backend/src/main/java/com/kaushal/SpringEcom/model/Order.java`) and `OrderItem` — each order contains order items, orderId, customerName, email, status and orderDate. The controllers use DTOs under `model/dto` (for request/response shapes).

Service & persistence

- Business logic is implemented in `service` classes (e.g., `ProductService`, `OrderService`) and persistence uses Spring Data JPA repositories under `repo`.
- Image upload and storage: controller receives `MultipartFile` and the service writes image bytes into `Product.imageData` and metadata (`imageName`, `imageType`). The image endpoint serves raw bytes.

Notes for contributors

- When changing the API resource names or request/response DTOs, update the frontend requests (search for `.get(`, `.post(` etc. in `ecom-frontend/src/components`).
- Backend controllers are annotated with `@CrossOrigin` to allow the frontend dev server to call APIs. If CORS issues appear, double-check the annotation or global CORS config.

## Notes & troubleshooting

- CORS: If the frontend cannot contact the backend due to CORS, enable CORS in the Spring Boot backend (e.g., using `@CrossOrigin` on controllers or a global CORS configuration).
- Ports: Backend default `8080`, frontend Vite `5173` — adjust the frontend API base URL if ports differ.
- If you change the backend port or host, update `ecom-frontend/.env` (or `axios.jsx`) accordingly.

## Helpful commands (Windows PowerShell)

Start backend (dev):

```powershell
cd SpringEcom-backend; .\mvnw.cmd spring-boot:run
```

Start frontend (dev):

```powershell
cd ecom-frontend; npm install; npm run dev
```

Build backend and frontend for production:

```powershell
cd SpringEcom-backend; .\mvnw.cmd package
cd ..\ecom-frontend; npm run build
```

## Where to look for more details

- Backend README/help: `SpringEcom-backend/HELP.md`
- Frontend README: `ecom-frontend/README.md` (if present)

## Contact / License

See project metadata or contact the repository owner for licensing and contribution details.

---

Generated: consolidated project README for developer usage.
