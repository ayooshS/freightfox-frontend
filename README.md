# 📦 FreightFox Frontend

Frontend for FreightFox — a lightweight Transporter Management System (TMS) built with React, TypeScript, and Vite.

## Overview

This repo is structured as an MVP-first development system.  
Each feature or flow lives in its own feature branch with its own README.

## Tech Stack

- React + Vite  
- TypeScript  
- Tailwind CSS + ShadCN UI

## MVP Branches (In Progress)

- `mvp/feature/auth-flow` → phone number + OTP login  
📚 Feature Docs: - [Auth Flow](https://github.com/ayooshS/freightfox-frontend/blob/mvp/feature/auth-flow/README.auth-flow.md)

- `mvp/feature/dashboard` → transporter shipment overview


## High-Level User flow

```mermaid
flowchart TD
 subgraph Legend["🗂️ Legend"]
    direction LR
        Legend1["🟪 New order page"]
        Legend2["⬛ Hidden/detail pages"]
        Legend3["🟦 Active Trips"]
        Legend4["🟨 My Orders page"]
        Legend6["⬜ Sub-pages of detail page"]
  end
    A["WhatsApp Link"] --> B["Sign-in Page"]
    B --> C["New Orders"]
    E["My Orders"] --> F["Statuses of Order"]
    F ---> H["Order Detail Page (for selected PO)"]
    C --> G["Request Orders Card: Accept / Reject"]
    G --> H
    G -. "Creates order for transporter<br>Fulfilled Qty = 0MT" .-> E
    H --> I["Schedule Delivery"]
    I --> J["Add Vehicle Details"]
    J --> K["Place Vehicle"]
    K --> D["Active Trips"]
    K -. "Updates order status<br>Fulfilled Qty = X MT" .-> E
    H -.-> L["View Orders"]
    L -.-> M["PO / DELIVERY / DISPATCH PLAN Details"]
    D --> N["Status of All Shipments"]
    N --> R["Shipment Detail\n(map, statuses)"]
    R -- can go back to order detail page --> H

     Legend1:::Class_03
     Legend2:::Class_01
     Legend3:::Sky
     Legend4:::Aqua
     Legend6:::Ash
     C:::Rose
     C:::Ash
     C:::Class_03
     C:::Class_03
     E:::Aqua
     F:::Aqua
     H:::Class_01
     G:::Ash
     G:::Class_03
     I:::Class_02
     J:::Class_02
     K:::Class_02
     D:::Sky
     L:::Class_02
     M:::Class_02
     N:::Sky
     R:::Class_01
    classDef Rose stroke-width:1px, stroke-dasharray:none, stroke:#FF5978, fill:#FFDFE5, color:#8E2236
    classDef Ash stroke-width:1px, stroke-dasharray:none, stroke:#999999, fill:#EEEEEE, color:#000000
    classDef Class_02 fill:#616161
    classDef Sky stroke-width:1px, stroke-dasharray:none, stroke:#374D7C, fill:#E2EBFF, color:#374D7C
    classDef Aqua stroke-width:1px, stroke-dasharray:none, stroke:#46EDC8, fill:#DEFFF8, color:#378E7A
    classDef Class_03 fill:#AA00FF, color:#FFFFFF
    classDef Class_01 color:#FFFFFF, fill:#000000
    style I color:#FFFFFF
    style J color:#FFFFFF
    style K color:#FFFFFF
    style L color:#FFFFFF
    style M color:#FFFFFF
    linkStyle 3 stroke:#00C853,fill:none
    linkStyle 4 stroke:#AA00FF,fill:none
    linkStyle 5 stroke:#AA00FF,fill:none
    linkStyle 6 stroke:#AA00FF,fill:none
    linkStyle 10 stroke:#2962FF,fill:none
    linkStyle 14 stroke:#2962FF,fill:none
    linkStyle 15 stroke:#2962FF,fill:none
```
