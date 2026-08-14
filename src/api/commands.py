
import random
import re
from decimal import Decimal
from datetime import datetime, timedelta
import click
from api.models import (
    db, Restaurant, Chef, Waiter, Cook, Host, Product, Recipe, Tag,
    Table, Order, OrderProduct, Ingredient, RecipeIngredient,
)
from sqlalchemy import select

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

    @app.cli.command("seed-tags")
    def seed_tags():
        """
        Seeds the fixed catalogue of occasion tags used by the "search by occasion"
        feature. Idempotent: only inserts the tags that don't already exist.
        Run with: $ flask seed-tags
        """
        occasion_tags = [
            "romántico", "negocios", "amigos",
            "despedida de soltera", "experiencia", "pet friendly",
        ]
        created = 0
        for name in occasion_tags:
            existing = db.session.scalar(select(Tag).where(Tag.name == name))
            if not existing:
                db.session.add(Tag(name=name))
                created += 1
        db.session.commit()
        print(f"Occasion tags seeded. Created {created} new tag(s), {len(occasion_tags) - created} already existed.")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        """
        Creates 10 invented restaurants spread across Madrid (3 spanish, 3 italian,
        2 mexican and 2 french), each with: description, photo, random occasion tags,
        phone, name and email; 20 products on the menu (15 dishes + 5 drinks) built
        with cuisine-appropriate logic; at least 15 recipes tied to the "dish"
        products (with photo); 3 waiters, 3 cooks, 1 host and 1 chef; a handful of
        tables; and 5 open orders + 2 closed orders with products attached.
        All the ingredients required by the recipes of the whole restaurant set are
        created once (shared/deduplicated) with their own photo.
        Run with: $ flask insert-test-data
        """

        def slugify_keyword(text):
            accents = str.maketrans("áéíóúüñ", "aeiouun")
            normalized = text.lower().translate(accents)
            slug = re.sub(r"[^a-z0-9]+", ",", normalized).strip(",")
            return slug or "food"

        def photo_url(keyword, extra, width=640, height=480):
            return f"https://loremflickr.com/{width}/{height}/{slugify_keyword(keyword)},{extra}"

        # Seed the fixed occasion tags first (idempotent)
        occasion_tag_names = [
            "romántico", "negocios", "amigos",
            "despedida de soltera", "experiencia", "pet friendly",
        ]
        for name in occasion_tag_names:
            if not db.session.scalar(select(Tag).where(Tag.name == name)):
                db.session.add(Tag(name=name))
        db.session.commit()
        all_tags = db.session.scalars(select(Tag)).all()
        print("Occasion tags ready.")

        ingredient_cache = {}

        def get_or_create_ingredient(name):
            if name in ingredient_cache:
                return ingredient_cache[name]
            ingredient = db.session.scalar(select(Ingredient).where(Ingredient.name == name))
            if not ingredient:
                ingredient = Ingredient(
                    name=name,
                    active=True,
                    img_url=photo_url(name, "ingredient", 400, 300),
                )
                db.session.add(ingredient)
                db.session.flush()
            ingredient_cache[name] = ingredient
            return ingredient

        # 10 Madrid locations (address, latitude, longitude) spread across different
        # neighbourhoods of the city
        madrid_restaurants = [
            {
                "name": "Casa Pepe", "cuisine": "española", "slug": "casapepe",
                "address": "Calle Gran Vía 28, Madrid, España", "lat": 40.4200, "lon": -3.7025,
                "description": "Cocina española tradicional en pleno corazón de Gran Vía, con recetas de toda la vida.",
            },
            {
                "name": "El Rincón Manchego", "cuisine": "española", "slug": "rinconmanchego",
                "address": "Calle del Pez 14, Madrid, España", "lat": 40.4250, "lon": -3.7038,
                "description": "Sabores de La Mancha en el barrio de Malasaña, con productos de proximidad.",
            },
            {
                "name": "Taberna La Latina", "cuisine": "española", "slug": "tabernalalatina",
                "address": "Plaza de la Cebada 9, Madrid, España", "lat": 40.4095, "lon": -3.7101,
                "description": "Taberna castiza junto a la Plaza de la Cebada, especializada en tapas y raciones.",
            },
            {
                "name": "Osteria Salamanca", "cuisine": "italiana", "slug": "osteriasalamanca",
                "address": "Calle de Serrano 45, Madrid, España", "lat": 40.4300, "lon": -3.6835,
                "description": "Auténtica trattoria italiana en el barrio de Salamanca, con pasta fresca artesanal.",
            },
            {
                "name": "La Trattoria di Chamberí", "cuisine": "italiana", "slug": "trattoriachamberi",
                "address": "Calle de Fuencarral 88, Madrid, España", "lat": 40.4350, "lon": -3.7038,
                "description": "Trattoria familiar en Chamberí con recetas del norte y sur de Italia.",
            },
            {
                "name": "Il Piccolo Forno", "cuisine": "italiana", "slug": "ilpiccoloforno",
                "address": "Calle de Hortaleza 62, Madrid, España", "lat": 40.4220, "lon": -3.6975,
                "description": "Pizzería y horno de leña en el corazón de Chueca.",
            },
            {
                "name": "El Azteca", "cuisine": "mexicana", "slug": "elazteca",
                "address": "Calle de Argumosa 17, Madrid, España", "lat": 40.4080, "lon": -3.7020,
                "description": "Cocina mexicana picante y colorida en el barrio de Lavapiés.",
            },
            {
                "name": "Cantina Jalisco", "cuisine": "mexicana", "slug": "cantinajalisco",
                "address": "Calle de Alcalá 130, Madrid, España", "lat": 40.4150, "lon": -3.6825,
                "description": "Cantina mexicana junto al Retiro, con mezcal y platos tradicionales.",
            },
            {
                "name": "Le Bistrot Parisien", "cuisine": "francesa", "slug": "lebistrotparisien",
                "address": "Calle de Alberto Aguilera 22, Madrid, España", "lat": 40.4315, "lon": -3.7195,
                "description": "Bistrot de inspiración parisina en Argüelles, con carta de temporada.",
            },
            {
                "name": "La Petite Brasserie", "cuisine": "francesa", "slug": "lapetitebrasserie",
                "address": "Paseo de la Castellana 180, Madrid, España", "lat": 40.4650, "lon": -3.6770,
                "description": "Brasserie francesa moderna en Chamartín, con repostería propia.",
            },
        ]

        # 15 cuisine-appropriate dishes per cuisine, each with its own ingredients
        cuisine_dishes = {
            "española": [
                ("Paella de Mariscos", ["arroz", "gambas", "mejillones", "calamar", "pimiento rojo", "azafrán", "caldo de pescado", "aceite de oliva", "ajo"]),
                ("Tortilla Española", ["patata", "huevo", "cebolla", "aceite de oliva", "sal"]),
                ("Gazpacho Andaluz", ["tomate", "pepino", "pimiento verde", "cebolla", "ajo", "aceite de oliva", "vinagre de jerez", "pan"]),
                ("Croquetas de Jamón", ["jamón serrano", "leche", "harina", "mantequilla", "huevo", "pan rallado"]),
                ("Pulpo a la Gallega", ["pulpo", "patata", "pimentón dulce", "aceite de oliva", "sal gorda"]),
                ("Cochinillo Asado", ["cochinillo", "manteca de cerdo", "ajo", "romero", "sal"]),
                ("Fabada Asturiana", ["alubias blancas", "chorizo", "morcilla", "panceta", "laurel"]),
                ("Callos a la Madrileña", ["callos", "chorizo", "morcilla", "garbanzos", "pimentón"]),
                ("Bacalao al Pil Pil", ["bacalao", "aceite de oliva", "ajo", "guindilla"]),
                ("Rabo de Toro", ["rabo de toro", "cebolla", "zanahoria", "vino tinto", "tomate"]),
                ("Jamón Ibérico con Pan de Cristal", ["jamón ibérico", "pan de cristal", "tomate", "aceite de oliva"]),
                ("Ensaladilla Rusa", ["patata", "zanahoria", "guisantes", "atún", "mayonesa", "huevo"]),
                ("Chuletillas de Cordero", ["chuletillas de cordero", "ajo", "romero", "aceite de oliva"]),
                ("Pisto Manchego", ["calabacín", "pimiento rojo", "pimiento verde", "tomate", "cebolla", "huevo"]),
                ("Churros con Chocolate", ["harina", "agua", "aceite de girasol", "chocolate negro", "azúcar"]),
            ],
            "italiana": [
                ("Pasta Carbonara", ["espagueti", "huevo", "panceta", "queso pecorino", "pimienta negra"]),
                ("Risotto de Setas", ["arroz arborio", "setas", "caldo de verduras", "mantequilla", "queso parmesano", "cebolla"]),
                ("Pizza Margarita", ["masa de pizza", "tomate triturado", "mozzarella", "albahaca", "aceite de oliva"]),
                ("Lasaña Boloñesa", ["pasta de lasaña", "carne picada", "tomate", "bechamel", "queso parmesano"]),
                ("Osso Buco", ["jarrete de ternera", "vino blanco", "zanahoria", "apio", "tomate"]),
                ("Tiramisú", ["queso mascarpone", "café espresso", "bizcochos de soletilla", "cacao en polvo", "huevo"]),
                ("Bruschetta", ["pan", "tomate", "ajo", "albahaca", "aceite de oliva"]),
                ("Gnocchi al Pesto", ["patata", "harina", "albahaca", "piñones", "queso parmesano"]),
                ("Saltimbocca alla Romana", ["ternera", "jamón serrano", "salvia", "vino blanco", "mantequilla"]),
                ("Vitello Tonnato", ["ternera", "atún", "alcaparras", "mayonesa"]),
                ("Minestrone", ["alubias blancas", "pasta", "tomate", "zanahoria", "apio", "calabacín"]),
                ("Pasta al Pomodoro", ["espagueti", "tomate", "albahaca", "ajo", "aceite de oliva"]),
                ("Panna Cotta", ["nata", "azúcar", "vainilla", "gelatina", "frutos rojos"]),
                ("Melanzane alla Parmigiana", ["berenjena", "tomate", "mozzarella", "queso parmesano", "albahaca"]),
                ("Focaccia", ["harina", "aceite de oliva", "romero", "sal", "levadura"]),
            ],
            "mexicana": [
                ("Tacos al Pastor", ["tortilla de maíz", "carne de cerdo", "piña", "cebolla", "cilantro", "achiote"]),
                ("Guacamole", ["aguacate", "tomate", "cebolla", "cilantro", "lima", "chile jalapeño"]),
                ("Enchiladas Verdes", ["tortilla de maíz", "pollo", "tomatillo", "queso fresco", "crema", "cilantro"]),
                ("Chiles Rellenos", ["chile poblano", "queso fresco", "huevo", "harina", "tomate"]),
                ("Mole Poblano", ["chile ancho", "chocolate negro", "pollo", "tomate", "almendra", "sésamo"]),
                ("Pozole Rojo", ["maíz cacahuazintle", "carne de cerdo", "chile guajillo", "lechuga", "rábano"]),
                ("Quesadillas", ["tortilla de maíz", "queso oaxaca", "epazote"]),
                ("Ceviche de Camarón", ["camarón", "lima", "tomate", "cebolla morada", "cilantro", "chile serrano"]),
                ("Tamales", ["masa de maíz", "manteca de cerdo", "hoja de maíz", "chile rojo", "pollo"]),
                ("Cochinita Pibil", ["carne de cerdo", "achiote", "naranja agria", "hoja de plátano", "cebolla morada"]),
                ("Chilaquiles", ["tortilla de maíz", "salsa verde", "queso fresco", "crema", "cebolla"]),
                ("Sopa de Tortilla", ["tortilla de maíz", "tomate", "chile pasilla", "aguacate", "queso fresco"]),
                ("Elote Asado", ["maíz", "mayonesa", "queso cotija", "chile en polvo", "lima"]),
                ("Flan de Cajeta", ["leche condensada", "huevo", "cajeta", "vainilla"]),
                ("Churros Mexicanos", ["harina", "canela", "azúcar", "aceite de girasol"]),
            ],
            "francesa": [
                ("Coq au Vin", ["pollo", "vino tinto", "champiñones", "panceta", "cebolla perla"]),
                ("Ratatouille", ["berenjena", "calabacín", "pimiento rojo", "tomate", "cebolla", "ajo"]),
                ("Boeuf Bourguignon", ["ternera", "vino tinto", "zanahoria", "cebolla", "champiñones"]),
                ("Sopa de Cebolla Francesa", ["cebolla", "caldo de ternera", "pan", "queso gruyère"]),
                ("Quiche Lorraine", ["masa quebrada", "huevo", "nata", "panceta", "queso gruyère"]),
                ("Crème Brûlée", ["nata", "yema de huevo", "vainilla", "azúcar"]),
                ("Croissant", ["harina", "mantequilla", "levadura", "leche", "azúcar"]),
                ("Escargots à la Bourguignonne", ["caracoles", "mantequilla", "ajo", "perejil"]),
                ("Confit de Pato", ["muslo de pato", "grasa de pato", "ajo", "tomillo"]),
                ("Bouillabaisse", ["pescado variado", "marisco", "hinojo", "tomate", "azafrán"]),
                ("Tarte Tatin", ["manzana", "mantequilla", "azúcar", "masa quebrada"]),
                ("Salade Niçoise", ["atún", "huevo", "judía verde", "patata", "aceituna negra", "tomate"]),
                ("Soufflé de Queso", ["huevo", "queso gruyère", "mantequilla", "harina", "leche"]),
                ("Duck à l'Orange", ["pechuga de pato", "naranja", "azúcar", "vinagre"]),
                ("Macarons", ["harina de almendra", "azúcar glas", "clara de huevo", "colorante alimentario"]),
            ],
        }

        drink_names = [
            "Sangría", "Tinto de Verano", "Vino Tinto Reserva", "Vino Blanco", "Cava Brut",
            "Cerveza Artesanal", "Agua Mineral", "Agua con Gas", "Café Espresso", "Té Verde",
            "Zumo de Naranja", "Limonada Natural", "Refresco de Cola", "Mojito",
        ]

        chef_names = [
            "Lucas Pérez", "Sofía Ruiz", "Mateo Díaz", "Elena Torres", "Hugo Romero",
            "Marta Flores", "Pablo Vidal", "Laura Ortiz", "Diego Rubio", "Carla Vega",
        ]
        host_names = [
            "Adrián Soto", "Nora Silva", "Iván Castro", "Alba Reyes", "Marco Ibáñez",
            "Julia Prat", "Leo Duarte", "Vera Molina", "Bruno Cano", "Nina Peña",
        ]
        staff_names = [
            "Ana", "Luis", "Eva", "Iker", "Nora", "Bruno", "Sara", "Alex", "Rita",
            "Iván", "Tomás", "Alma", "Vera", "Marco", "Nina", "Óscar", "Clara",
        ]
        table_locations = ["interior", "terraza", "ventana", "barra", "salón principal"]

        print("Creating 10 Madrid restaurants with menus, recipes, ingredients, staff, tables and orders...")

        for i, r in enumerate(madrid_restaurants, start=1):
            cuisine = r["cuisine"]

            restaurant = Restaurant(
                name=r["name"],
                email=f"info@{r['slug']}.es",
                phone=f"+346{11000000 + i}",
                address=r["address"],
                latitude=r["lat"],
                longitude=r["lon"],
                description=r["description"],
                food_type=cuisine,
                img_url=photo_url(cuisine, "restaurant,madrid", 800, 600),
            )
            db.session.add(restaurant)
            db.session.flush()  # assign restaurant.id

            for tag in random.sample(all_tags, k=min(len(all_tags), random.randint(2, 3))):
                restaurant.tags.append(tag)

            db.session.add(Chef(
                name=chef_names[i - 1], email=f"chef_r{i}@cocinapp.com",
                password="123456", restaurant_id=restaurant.id,
            ))
            db.session.add(Host(
                name=host_names[i - 1], email=f"host_r{i}@cocinapp.com",
                password="123456", restaurant_id=restaurant.id,
            ))

            waiters = []
            for w in range(1, 4):
                waiter = Waiter(
                    name=random.choice(staff_names), email=f"waiter{w}_r{i}@cocinapp.com",
                    password="123456", restaurant_id=restaurant.id,
                )
                db.session.add(waiter)
                waiters.append(waiter)

            for c in range(1, 4):
                db.session.add(Cook(
                    name=random.choice(staff_names), email=f"cook{c}_r{i}@cocinapp.com",
                    password="123456", restaurant_id=restaurant.id,
                ))

            tables = []
            for t in range(1, 7):
                table = Table(
                    number=t, status="available", location=random.choice(table_locations),
                    active=True, restaurant_id=restaurant.id,
                )
                db.session.add(table)
                tables.append(table)

            db.session.flush()  # assign waiter/table ids

            # 15 dishes -> a recipe (with ingredients) and a "dish" product for each
            products = []
            for dish_name, ingredient_names in cuisine_dishes[cuisine]:
                recipe = Recipe(
                    name=dish_name,
                    steps=(
                        f"1. Preparar y organizar los ingredientes de {dish_name}.\n"
                        f"2. Cocinar siguiendo la técnica tradicional de la cocina {cuisine}.\n"
                        f"3. Emplatar y servir caliente."
                    ),
                    img_url=photo_url(dish_name, "food", 640, 480),
                    calories=random.randint(200, 900),
                    restaurant_id=restaurant.id,
                )
                db.session.add(recipe)
                db.session.flush()  # assign recipe.id

                for ingredient_name in ingredient_names:
                    ingredient = get_or_create_ingredient(ingredient_name)
                    db.session.add(RecipeIngredient(
                        ingredient_id=ingredient.id, recipe_id=recipe.id,
                        amount=round(random.uniform(0.5, 5.0), 2),
                    ))

                product = Product(
                    name=dish_name,
                    description=f"{dish_name}, receta tradicional de la cocina {cuisine}.",
                    sell_price=Decimal(str(round(random.uniform(8.5, 27.0), 2))),
                    type="dish",
                    active=True,
                    img_url=recipe.img_url,
                    restaurant_id=restaurant.id,
                    recipe_id=recipe.id,
                )
                db.session.add(product)
                products.append(product)

            # 5 drinks -> "drink" products, no recipe
            for drink_name in random.sample(drink_names, 5):
                product = Product(
                    name=drink_name,
                    description=f"{drink_name}.",
                    sell_price=Decimal(str(round(random.uniform(2.0, 9.0), 2))),
                    type="drink",
                    active=True,
                    img_url=photo_url(drink_name, "drink", 640, 480),
                    restaurant_id=restaurant.id,
                )
                db.session.add(product)
                products.append(product)

            db.session.flush()  # assign product ids

            # 5 open orders + 2 closed orders, each with products attached
            for _ in range(5):
                order = Order(
                    table_id=random.choice(tables).id, waiter_id=random.choice(waiters).id,
                    state=random.choice(["pending", "doing", "done"]), people=random.randint(1, 6),
                )
                db.session.add(order)
                db.session.flush()
                for product in random.sample(products, k=random.randint(2, 5)):
                    db.session.add(OrderProduct(
                        order_id=order.id, product_id=product.id,
                        amount=random.randint(1, 3), unit_price=float(product.sell_price),
                    ))

            for _ in range(2):
                order = Order(
                    table_id=random.choice(tables).id, waiter_id=random.choice(waiters).id,
                    state="closed", people=random.randint(1, 6),
                    date_time=datetime.now() - timedelta(days=random.randint(1, 10)),
                )
                db.session.add(order)
                db.session.flush()
                for product in random.sample(products, k=random.randint(2, 5)):
                    db.session.add(OrderProduct(
                        order_id=order.id, product_id=product.id,
                        amount=random.randint(1, 3), unit_price=float(product.sell_price),
                    ))

            db.session.commit()
            print(
                f"Restaurante '{restaurant.name}' ({cuisine}) creado: 1 chef, 1 host, 3 camareros, "
                f"3 cocineros, {len(cuisine_dishes[cuisine])} recetas, {len(products)} productos, "
                f"{len(tables)} mesas, 7 comandas."
            )

        print(f"All test data created. {len(ingredient_cache)} unique ingredients seeded.")