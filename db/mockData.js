const users = [
  { user_id: 1, name: "Anna", email: "anna@example.com" },
  { user_id: 2, name: "Thomas", email: "thomas@example.com" }
];

const categories = [
  { category_id: 1, name: "Telefoni" },
  { category_id: 2, name: "IT-utrustning" },
  { category_id: 3, name: "Friskvård/Rehab" },
  { category_id: 4, name: "HLR" },
  { category_id: 5, name: "Inredning" },
  { category_id: 6, name: "Övrigt" }
];

const products = [
  {
    product_id: 1,
    equipment_id: "RV908GT5462",
    article: "Mobiltelefon",
    make: "Samsung",
    model: "Galaxy",
    quantity: 1,
    status: "I drift",
    warranty_start: "2023-01-01",
    warranty_end: "2025-01-01",
    age_inventory_days: 400,
    purchase_value: 8500,
    arrived_from: "Lager",
    purchased_to: "Anna",
    notes: "",
    category_id: 1,
    user_id: 1
  },
];

export { users, categories, products };