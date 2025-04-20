# 📦 New Orders Page – Component Architecture

This document outlines the structure, data model, and component hierarchy for the **New Orders Page** in the FreightFox frontend app.

---

## 🔧 Overview

- Built using **React + TypeScript**
- Mobile-first layout wrapped with `AppShell`
- Modular component-based UI with loading state, data cards, and action handlers
- Uses `react-router-dom` for routing and `sonner` for toast notifications

---

## 🌐 1. Architecture (App Structure + Navigation)

```mermaid

graph TD

%% App Entry
A[App.tsx] --> B[BrowserRouter]
B --> C[Routes]
C --> D[New-orders → NewOrderPage]
C --> E[Active-trips → ActiveTripsPage]
C --> F[My-orders → MyOrdersPage]
C --> G[Default Redirect to /New-orders]

D --> H[AppShell]
E --> H
F --> H

%% AppShell Layout
H --> H1[HeaderNav]
H1 --> H1a[Avatar with fallback T]
H1 --> H1b[User Greeting : Good Morning]
H1 --> H1c[Company Name: Triple MMM Logysmart Pvt Ltd]

H --> H2[Outlet → Page Content]
H --> H3[BottomNav]
H3 --> H3a[Tab: New Orders]
H3 --> H3b[Tab: Active Trips]
H3 --> H3c[Tab: My Orders]

H --> H4[Toaster]

%% NewOrderPage structure
H2 --> N[NewOrderPage]
N --> N1[useEffect → Simulated API]
N --> N2[State: loading, error, orders]
N --> N3[LoadingDots]
N --> N4[Conditionally render cards]

N4 --> N5[RequestCard x N]
N4 --> N6[SkeletonRequestCard x N]
N4 --> N7[Error message]

%% RequestCard decomposition
N5 --> RC[RequestCard]
RC --> RC1[Header: PO, Material, MoreSelection]
RC --> RC2[Separator]
RC --> RC3[Product Info: Name, Quantity, Rate]
RC --> RC4[PickupDropInfo]
RC --> RC5[Confirm Button]

RC1 --> MS[MoreSelection]
MS --> MS1[Popover Menu]
MS1 --> MS2[Reject CTA + showToast]

RC4 --> PD[PickupDropInfo]
PD --> PD1[Pickup Address + Badge]
PD --> PD2[Drop Address + Badge]

%% Skeleton
N6 --> SK[SkeletonRequestCard]
SK --> SK1[Fake PO Header]
SK --> SK2[Fake Product Info]
SK --> SK3[Fake Pickup/Drop Info]
SK --> SK4[Fake Confirm Button]

```

---

## 🧭 1. Page-to-Component Structure

```mermaid
graph TD
  NewOrderPage --> RequestCard
  NewOrderPage --> SkeletonRequestCard
  RequestCard --> MoreSelection
  RequestCard --> PickupDropInfo
  AppShell --> HeaderNav
  AppShell --> BottomNav
  AppShell --> Outlet[Outlet → NewOrderPage]
```

#### Explanation:

- `NewOrderPage` orchestrates data fetching and renders child UI components
- `RequestCard` is the core UI unit rendered per order
- `AppShell wraps` the entire layout with consistent header and bottom navigation

---

## 📦 2. Shared Data Model

```mermaid
graph TD
  OrderType[Order Type: poNumber, material, productName, etc.]

  OrderType --> NewOrderPage
  OrderType --> RequestCard
  OrderType --> PickupDropInfo
  OrderType --> MoreSelection
```

#### Order Object Shape:

```ts
type Order = {
  poNumber: string
  material: string
  productName: string
  quantity: string
  rate: string
  pickupAddress: string
  dropAddress: string
}
```
#### Usage:
- Shared across `NewOrderPage` and all its child components
- Passed via props to maintain stateless component design

---

## 🔌 3. Component Interfaces (Props)

```mermaid
classDiagram

class RequestCard {
  +string poNumber
  +string material
  +string productName
  +string quantity
  +string rate
  +string pickupAddress
  +string dropAddress
  +onReject(): void
  +onConfirm(): void
}

class MoreSelection {
  +string poNumber
  +string dropAddress
  +onReject(): void
}

class PickupDropInfo {
  +string pickupAddress
  +string dropAddress
}

class BottomNav {
  +string activePath
}

class HeaderNav {
  ~ No props required
}


```
---

### ✅ Highlights
- ⛓️ Fully modular and reusable component structure
- 📦 Data-driven architecture with shared `Order` type
- 🔄 Seamless UX with loading state and toast feedback
- 🧼 Easy to extend with PO detail view, filter, or pagination

---

### 🚀 Suggested Improvements (Future Roadmap)
 - Integrate real API via `fetchOrders` hook or TanStack Query
 - Add `Empty State` when `orders.length === 0`
 - Navigate to PO Detail Page on confirm
 - Swipe-to-Reject or Pull-to-Refresh for mobile
 - Add tags instead of single product string


