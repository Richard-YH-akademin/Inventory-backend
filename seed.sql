-- Rensa befintlig data (i rätt ordning pga foreign keys)
TRUNCATE TABLE products, users RESTART IDENTITY CASCADE;

-- Users
INSERT INTO users (first_name, last_name, email) VALUES
('Anna',   'Andersson', 'anna@example.com'),
('Thomas', 'Eriksson',  'thomas@example.com'),
('Maria',  'Johansson', 'maria@example.com'),
('Erik',   'Svensson',  'erik@example.com'),
('Sara',   'Lindqvist', 'sara@example.com');

-- Products (status_id: 1=active, 2=inactive, 3=decommissioned)
-- (category_id: 1=IT_equipment, 2=Phone, 3=CPR, 4=Furnishings, 5=Wellness, 6=Other)
INSERT INTO products (equipment_id, article, make, model, status_id, warranty_start, warranty_end, inventory_age_days, purchase_value, arrived_from, purchased_to_user_id, notes, category_id, user_id) VALUES
('RV908GT5462', 'Mobiltelefon',   'Samsung',     'Galaxy S23',      1, '2023-01-01', '2025-01-01', 800,  8500,  'Lager',      2, '',                         2, 1),
('AB123XY789',  'Laptop',         'Apple',        'MacBook Pro 14', 1, '2023-03-15', '2026-03-15', 540,  24000, 'Lager',      3, 'Ny anställd',              1, 2),
('CD456ZW012',  'Laptop',         'Lenovo',       'ThinkPad X1',    2, '2022-06-01', '2025-06-01', 950,  18000, 'Leverantör', 3, '',                         1, 3),
('EF789VU345',  'Mobiltelefon',   'Apple',        'iPhone 14',      1, '2023-09-01', '2025-09-01', 550,  11000, 'Lager',      4, '',                         2, 4),
('GH012ST678',  'Headset',        'Jabra',        'Evolve2 55',     1, '2023-02-10', '2025-02-10', 760,  4500,  'Lager',      1, '',                         1, 1),
('IJ345QR901',  'Skrivbordsstol', 'Kinnarps',     'Plus 8',         1, '2021-05-20', '2024-05-20', 1400, 12000, 'Leverantör', 2, 'Ergonomisk',               4, 2),
('KL678OP234',  'HLR-docka',      'Laerdal',      'Little Anne',    2, '2022-11-01', '2025-11-01', 850,  6000,  'Lager',      3, 'Utbildningsmaterial',      3, 3),
('MN901MN567',  'Träningscykel',  'Life Fitness', 'C3',             3, '2020-01-01', '2023-01-01', 1800, 15000, 'Leverantör', 5, 'Avslutat sin anställning', 5, 5),
('OP234KL890',  'Surfplatta',     'Apple',        'iPad Pro 12.9',  1, '2023-07-01', '2025-07-01', 610,  13000, 'Lager',      4, '',                         1, 4),
('QR567IJ123',  'Bildskärm',      'Dell',         'UltraSharp 27',  1, '2022-08-15', '2025-08-15', 930,  7500,  'Leverantör', 2, '',                         1, 1),
('ST890GH456',  'Tangentbord',    'Logitech',     'MX Keys',        1, '2023-04-01', '2025-04-01', 700,  1500,  'Lager',      3, '',                         1, 3),
('UV123EF789',  'Mobiltelefon',   'Samsung',      'Galaxy S22',     3, '2022-02-01', '2024-02-01', 1100, 9000,  'Lager',      5, 'Avslutat sin anställning', 2, 5),
('WX456CD012',  'Skrivbordslampa','Ergolite',     'Pro 500',        2, '2023-01-15', '2026-01-15', 780,  800,   'Leverantör', 2, '',                         4, 2),
('YZ789AB345',  'Mus',            'Logitech',     'MX Master 3',    1, '2023-05-10', '2025-05-10', 660,  1200,  'Lager',      1, '',                         1, 4),
('AA012YZ678',  'HLR-tränare',    'Laerdal',      'Resusci Anne',   1, '2023-10-01', '2026-10-01', 500,  22000, 'Leverantör', 3, 'Certifierad utrustning',   3, 1);
