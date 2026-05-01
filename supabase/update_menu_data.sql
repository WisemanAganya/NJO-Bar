-- Clear existing products
DELETE FROM public.products;

-- Insert Gin
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Gilbeys (Tot)', 'Classic dry gin, crisp and refreshing.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 200, 50, true),
('Gilbeys (Bottle)', 'Full 750ml bottle of Gilbeys Gin.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 3000, 20, false),
('Gordons Clear (Tot)', 'London Dry Gin with juniper notes.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 300, 50, false),
('Gordons Clear (Bottle)', 'Full bottle of Gordons Clear Gin.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 4500, 15, false),
('Gordons Pink (Tot)', 'Fruity gin with raspberry and redcurrant.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 300, 50, false),
('Gordons Pink (Bottle)', 'Full bottle of Gordons Pink Gin.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 4500, 15, false),
('Tanqueray (Tot)', 'Premium distilled gin with botanical balance.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 350, 40, true),
('Tanqueray (Bottle)', 'Full bottle of premium Tanqueray Gin.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\gin_premium_selection_1777285956069.png', 'Gin', 5500, 10, false);

-- Insert Tequila
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Jose Cuervo Gold (Tot)', 'Golden tequila with agave sweetness.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 350, 40, false),
('Jose Cuervo Gold (Bottle)', 'Full bottle of Jose Cuervo Gold.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 5000, 12, false),
('Jose Cuervo Silver (Tot)', 'Pure and clear silver tequila.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 350, 40, false),
('Jose Cuervo Silver (Bottle)', 'Full bottle of Jose Cuervo Silver.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 5000, 12, false),
('Don Julio Reposado (Tot)', 'Aged tequila with smooth finish.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 500, 30, true),
('Don Julio Reposado (Bottle)', 'Ultra-premium Don Julio Reposado bottle.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 13000, 5, true),
('Don Julio Blanco (Tot)', 'Crisp and clean premium blanco tequila.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 500, 30, false),
('Don Julio Blanco (Bottle)', 'Full bottle of Don Julio Blanco.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\tequila_premium_selection_1777285978936.png', 'Tequila', 12000, 5, false);

-- Insert Whiskey
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Jameson (Tot)', 'Smooth Irish whiskey.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\whiskey_premium_selection_1777286024279.png', 'Whiskey', 300, 60, true),
('Jameson (Bottle)', 'Full bottle of Jameson Irish Whiskey.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\whiskey_premium_selection_1777286024279.png', 'Whiskey', 5000, 20, false),
('Johnnie Walker Black (Tot)', 'Rich and smoky blended Scotch.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\whiskey_premium_selection_1777286024279.png', 'Whiskey', 350, 50, true),
('Johnnie Walker Black (Bottle)', 'Iconic Johnnie Walker Black Label bottle.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\whiskey_premium_selection_1777286024279.png', 'Whiskey', 6000, 15, false),
('JW Double Black (Tot)', 'Intense and smoky whiskey experience.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\whiskey_premium_selection_1777286024279.png', 'Whiskey', 350, 40, false),
('JW Double Black (Bottle)', 'Full bottle of Johnnie Walker Double Black.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\whiskey_premium_selection_1777286024279.png', 'Whiskey', 7500, 10, false);

-- Insert Liquors, Vodka, Rum (using Whiskey image as placeholder for now)
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Jaegermeister (Tot)', 'Herbal liqueur with 56 botanicals.', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=1200', 'Liquors', 350, 40, false),
('Jaegermeister (Bottle)', 'Full bottle of Jaegermeister.', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=1200', 'Liquors', 5000, 12, false),
('Smirnoff Red (Tot)', 'Triple distilled pure vodka.', 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=1200', 'Vodka', 300, 50, false),
('Smirnoff Red (Bottle)', 'Full bottle of Smirnoff Red Vodka.', 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=1200', 'Vodka', 3000, 20, false),
('Captain Morgan Spiced (Tot)', 'Smooth rum with spice notes.', 'https://images.unsplash.com/photo-1620677368269-e7061f1847ec?auto=format&fit=crop&q=80&w=1200', 'Rum', 300, 50, true),
('Captain Morgan Spiced (Bottle)', 'Full bottle of Captain Morgan Spiced Rum.', 'https://images.unsplash.com/photo-1620677368269-e7061f1847ec?auto=format&fit=crop&q=80&w=1200', 'Rum', 4000, 15, false);

-- Insert Wine
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Frontera Cabernet Sauvignon (Glass)', 'Rich red wine with dark fruit notes.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 700, 30, false),
('Frontera Cabernet Sauvignon (Bottle)', 'Full bottle of Frontera Cabernet Sauvignon.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 3500, 15, false),
('Frontera Sauvignon Blanc (Glass)', 'Crisp white wine with citrus notes.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 700, 30, false),
('Frontera Sauvignon Blanc (Bottle)', 'Full bottle of Frontera Sauvignon Blanc.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 3500, 15, false),
('Bruce Jack Sauvignon Blanc (Glass)', 'Premium South African white wine.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 700, 20, true),
('Bruce Jack Sauvignon Blanc (Bottle)', 'Full bottle of Bruce Jack Sauvignon Blanc.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 3500, 10, false),
('Bruce Cabernet Sauvignon (Glass)', 'Elegant red wine with smooth finish.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 700, 20, false),
('Bruce Cabernet Sauvignon (Bottle)', 'Full bottle of Bruce Cabernet Sauvignon.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\wine_premium_selection_1777286058238.png', 'Wine', 3500, 10, false);

-- Insert Beer
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Tusker Larger', 'Iconic Kenyan lager.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 100, true),
('Tusker Cider', 'Crisp apple cider from Tusker.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 80, false),
('Tusker Lite', 'Low calorie Tusker beer.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 80, false),
('Whitecap', 'Crisp and clean lager.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 60, false),
('Malt', 'Premium non-alcoholic malt beverage.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 50, false),
('Guinness', 'Rich and smooth stout.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 60, true),
('Balozi', 'Pure and natural lager.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 50, false),
('Smirnoff Pineapple', 'Fruity vodka-based beverage.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 40, false),
('Smirnoff Black Ice', 'Refreshing vodka-based beverage.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 40, false),
('Savannah', 'Premium dry cider.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 40, false),
('Bilashaka', 'Craft beer selection.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\beer_premium_selection_1777286076852.png', 'Beer', 400, 30, false);

-- Insert Soft Drinks
INSERT INTO public.products (name, description, image_url, category, price, stock, featured) VALUES
('Redbull', 'Energy drink for long nights.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\soft_drinks_premium_selection_1777286212043.png', 'Soft Drink', 350, 100, true),
('Soda', 'Various soft drink options.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\soft_drinks_premium_selection_1777286212043.png', 'Soft Drink', 150, 200, false),
('Water', 'Still mineral water.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\soft_drinks_premium_selection_1777286212043.png', 'Soft Drink', 150, 300, false),
('Sparkling water', 'Refreshing sparkling mineral water.', 'C:\Users\1012 G2\.gemini\antigravity\brain\cdd24119-931f-4c1f-a37a-f6f16c24c516\soft_drinks_premium_selection_1777286212043.png', 'Soft Drink', 200, 100, false);
