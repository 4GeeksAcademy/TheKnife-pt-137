
import random
from decimal import Decimal
import click
from api.models import db, Restaurant, Chef, Waiter, Cook, Product, Recipe

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        """
        Creates 20 chefs, each with their own restaurant (random European address),
        10 products and 10 recipes per restaurant, and 3 waiters + 3 cooks per restaurant.
        Run with: $ flask insert-test-data
        """
        # (address, city, country, latitude, longitude)
        locations = [
            ("Calle Gran Vía 12", "Madrid", "España", 40.4168, -3.7038),
            ("Carrer de Balmes 45", "Barcelona", "España", 41.3851, 2.1734),
            ("Rua Augusta 88", "Lisboa", "Portugal", 38.7223, -9.1393),
            ("Rue de Rivoli 21", "París", "Francia", 48.8566, 2.3522),
            ("Alexanderplatz 5", "Berlín", "Alemania", 52.5200, 13.4050),
            ("Via del Corso 100", "Roma", "Italia", 41.9028, 12.4964),
            ("Corso Buenos Aires 33", "Milán", "Italia", 45.4642, 9.1900),
            ("Damrak 60", "Ámsterdam", "Países Bajos", 52.3676, 4.9041),
            ("Rue Neuve 15", "Bruselas", "Bélgica", 50.8503, 4.3517),
            ("Kärntner Straße 27", "Viena", "Austria", 48.2082, 16.3738),
            ("Wenceslas Square 8", "Praga", "Chequia", 50.0755, 14.4378),
            ("Nowy Świat 19", "Varsovia", "Polonia", 52.2297, 21.0122),
            ("Váci utca 10", "Budapest", "Hungría", 47.4979, 19.0402),
            ("Grafton Street 3", "Dublín", "Irlanda", 53.3498, -6.2603),
            ("Strøget 44", "Copenhague", "Dinamarca", 55.6761, 12.5683),
            ("Drottninggatan 17", "Estocolmo", "Suecia", 59.3293, 18.0686),
            ("Karl Johans gate 22", "Oslo", "Noruega", 59.9139, 10.7522),
            ("Aleksanterinkatu 9", "Helsinki", "Finlandia", 60.1699, 24.9384),
            ("Ermou Street 50", "Atenas", "Grecia", 37.9838, 23.7275),
            ("Bahnhofstrasse 30", "Zúrich", "Suiza", 47.3769, 8.5417),
        ]

        restaurant_templates = [
            "El Rincón", "La Terraza", "Sabores", "Casa", "El Jardín",
            "La Cocina", "El Fogón", "La Mesa", "El Sabor", "La Brasa",
        ]

        chef_names = [
            "Lucas Pérez", "Sofía Ruiz", "Mateo Díaz", "Elena Torres", "Hugo Romero",
            "Marta Flores", "Pablo Vidal", "Laura Ortiz", "Diego Rubio", "Carla Vega",
            "Adrián Soto", "Nora Silva", "Iván Castro", "Alba Reyes", "Marco Ibáñez",
            "Julia Prat", "Leo Duarte", "Vera Molina", "Bruno Cano", "Nina Peña",
        ]

        staff_names = [
            "Ana", "Luis", "Eva", "Iker", "Nora", "Bruno", "Sara", "Alex", "Rita",
            "Iván", "Tomás", "Alma", "Vera", "Marco", "Nina", "Óscar", "Clara",
            "Hugo", "Julia", "Diego", "Carla", "Adrián", "Leo", "Marta", "Pablo",
        ]

        dish_names = [
            "Paella de Mariscos", "Tortilla Española", "Pasta Carbonara", "Risotto de Setas",
            "Solomillo a la Pimienta", "Ensalada César", "Pizza Margarita", "Lasaña Boloñesa",
            "Bacalao al Pil Pil", "Cordero Asado", "Ceviche de Corvina", "Ratatouille",
            "Goulash Húngaro", "Moussaka Griega", "Fish and Chips",
        ]

        drink_names = [
            "Sangría", "Mojito", "Vino Tinto Reserva", "Cerveza Artesanal", "Limonada Natural",
            "Agua con Gas", "Café Espresso", "Té Verde", "Zumo de Naranja", "Cóctel Margarita",
            "Refresco de Cola", "Vino Blanco",
        ]

        print("Creating 20 chefs with their restaurants, products, recipes, waiters and cooks...")

        for i in range(1, 21):
            street, city, country, lat, lon = locations[i - 1]
            template = restaurant_templates[(i - 1) % len(restaurant_templates)]

            restaurant = Restaurant(
                name=f"{template} de {city}",
                email=f"restaurant{i}@cocinapp.com",
                phone=f"+34{600000000 + i}",
                address=f"{street}, {city}, {country}",
                latitude=lat,
                longitude=lon,
            )
            db.session.add(restaurant)
            db.session.flush()  # assign restaurant.id

            chef = Chef(
                name=chef_names[i - 1],
                email=f"chef{i}@cocinapp.com",
                password="123456",
                restaurant_id=restaurant.id,
            )
            db.session.add(chef)

            for w in range(1, 4):
                db.session.add(Waiter(
                    name=random.choice(staff_names),
                    email=f"waiter{w}_r{i}@cocinapp.com",
                    password="123456",
                    restaurant_id=restaurant.id,
                ))

            for c in range(1, 4):
                db.session.add(Cook(
                    name=random.choice(staff_names),
                    email=f"cook{c}_r{i}@cocinapp.com",
                    password="123456",
                    restaurant_id=restaurant.id,
                ))

            for r_name in random.sample(dish_names + drink_names, 10):
                db.session.add(Recipe(
                    name=r_name,
                    steps="1. Preparar los ingredientes.\n2. Cocinar a fuego medio.\n3. Emplatar y servir.",
                    calories=random.randint(150, 900),
                    restaurant_id=restaurant.id,
                ))

            for d_name in random.sample(dish_names, 6):
                db.session.add(Product(
                    name=d_name,
                    sell_price=Decimal(str(round(random.uniform(7.5, 25.0), 2))),
                    type="dish",
                    restaurant_id=restaurant.id,
                ))

            for dr_name in random.sample(drink_names, 4):
                db.session.add(Product(
                    name=dr_name,
                    sell_price=Decimal(str(round(random.uniform(1.5, 9.0), 2))),
                    type="drink",
                    restaurant_id=restaurant.id,
                ))

            db.session.commit()
            print(f"Restaurant '{restaurant.name}' ({city}) created with chef, 3 waiters, 3 cooks, 10 recipes and 10 products.")

        print("All test data created.")