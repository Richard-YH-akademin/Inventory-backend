# Inventory-backend

# inventory-database-v2 – Database Schema

## Tables

### `users`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | Auto-generated ID |
| `first_name` | VARCHAR(100) | First name |
| `last_name` | VARCHAR(100) | Last name |
| `email` | VARCHAR(255) UNIQUE | Email address |

---

### `statuses`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | Auto-generated ID |
| `name` | VARCHAR(50) UNIQUE | Status name |

**Values:** `1` = active · `2` = inactive · `3` = decommissioned

---

### `categories`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | Auto-generated ID |
| `name` | VARCHAR(100) UNIQUE | Category name |

**Values:** `1` = IT_equipment · `2` = Phone · `3` = CPR · `4` = Furnishings · `5` = Wellness · `6` = Other

---

### `products`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PK | Auto-generated ID |
| `equipment_id` | VARCHAR(50) UNIQUE | Unique equipment ID |
| `article` | VARCHAR(100) | Article name |
| `make` | VARCHAR(100) | Manufacturer |
| `model` | VARCHAR(100) | Model |
| `status_id` | INTEGER FK | → `statuses.id` |
| `warranty_start` | DATE | Warranty start date |
| `warranty_end` | DATE | Warranty end date |
| `inventory_age_days` | INTEGER | Age in days |
| `purchase_value` | NUMERIC(10,2) | Purchase value (SEK) |
| `arrived_from` | VARCHAR(100) | Source (e.g. Warehouse, Supplier) |
| `purchased_to_user_id` | INTEGER FK | → `users.id` (purchased for) |
| `notes` | TEXT | Notes |
| `category_id` | INTEGER FK | → `categories.id` |
| `user_id` | INTEGER FK | → `users.id` (assigned to) |

---

## Relationships

```
users ──────────────< products (user_id)
users ──────────────< products (purchased_to_user_id)
statuses ───────────< products (status_id)
categories ─────────< products (category_id)
```

> `products` has two separate relationships to `users` — `user_id` for the user the product is assigned to, and `purchased_to_user_id` for the user it was originally purchased for.
