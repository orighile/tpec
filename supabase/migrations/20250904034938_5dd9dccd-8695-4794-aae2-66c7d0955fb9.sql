-- Seed database with sample vendors for MVP
-- This ensures the marketplace has content immediately

INSERT INTO vendors (name, category, description, location, price_range, contact_email, contact_phone, website, about, verified, owner_user_id) VALUES
('Signature Catering Lagos', 'Catering', 'Premium catering service specializing in Nigerian and continental cuisines', 'Lagos, Nigeria', '₦₦₦', 'info@signaturecatering.ng', '+234-802-123-4567', 'www.signaturecatering.ng', 'We provide exceptional catering services for all types of events with over 10 years of experience in the industry.', true, '00000000-0000-0000-0000-000000000001'),

('EventSpace Lagos', 'Venue', 'Modern event venues with state-of-the-art facilities', 'Victoria Island, Lagos', '₦₦₦₦', 'bookings@eventspace.ng', '+234-803-234-5678', 'www.eventspace.ng', 'Premium venues for weddings, corporate events, and private parties. Our spaces combine elegance with modern amenities.', true, '00000000-0000-0000-0000-000000000002'),

('Perfect Decor Abuja', 'Decoration', 'Creative decoration and event styling services', 'Abuja, Nigeria', '₦₦', 'hello@perfectdecor.ng', '+234-804-345-6789', NULL, 'Transforming spaces with beautiful decorations and creative styling for memorable events.', true, '00000000-0000-0000-0000-000000000003'),

('Rhythm DJs', 'Entertainment', 'Professional DJ services with quality sound equipment', 'Lagos, Nigeria', '₦₦', 'bookings@rhythmdjs.ng', '+234-805-456-7890', 'www.rhythmdjs.ng', 'Top-rated DJs providing entertainment for weddings, parties, and corporate events across Lagos.', true, '00000000-0000-0000-0000-000000000004'),

('Capture Memories Photography', 'Photography', 'Professional photography and videography services', 'Abuja, Nigeria', '₦₦₦', 'contact@capturememories.ng', '+234-806-567-8901', 'www.capturememories.ng', 'Award-winning photographers capturing your special moments with artistic excellence and professional quality.', true, '00000000-0000-0000-0000-000000000005'),

('Divine Cakes & Pastries', 'Cakes & Desserts', 'Custom cake design and dessert catering', 'Port Harcourt, Nigeria', '₦₦', 'orders@divinecakes.ng', '+234-807-678-9012', NULL, 'Creating beautiful and delicious custom cakes for weddings, birthdays, and special celebrations.', true, '00000000-0000-0000-0000-000000000006'),

('Lagos Event Transport', 'Transportation', 'Luxury transportation services for events', 'Lagos, Nigeria', '₦₦₊', 'fleet@lagoseventtransport.ng', '+234-808-789-0123', NULL, 'Premium transportation solutions including luxury cars, buses, and event shuttles for guests.', true, '00000000-0000-0000-0000-000000000007'),

('Elegant Flowers Boutique', 'Flowers', 'Fresh flower arrangements and bridal bouquets', 'Lagos, Nigeria', '₦₦', 'orders@elegantflowers.ng', '+234-809-890-1234', 'www.elegantflowers.ng', 'Specializing in fresh flower arrangements, bridal bouquets, and event decorations with locally sourced flowers.', true, '00000000-0000-0000-0000-000000000008');