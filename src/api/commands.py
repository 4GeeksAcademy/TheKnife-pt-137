
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
        Creates exactly one demo restaurant, "Casa Pepe" (Spanish cuisine), with
        the same data it currently has live: 1 chef, 1 host, 4 waiters, 3 cooks,
        6 tables, 15 recipes (with their real ingredients/amounts and Cloudinary
        photos), 20 products - 15 dishes + 5 drinks - (with Cloudinary photos and
        real prices) and 7 orders (5 open + 2 closed) with their products
        attached. Any ingredient left unused by this restaurant's recipes is
        deleted, so the ingredient catalogue only ever contains what Casa Pepe
        actually cooks with.
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
        all_tags = {tag.name: tag for tag in db.session.scalars(select(Tag)).all()}
        print("Occasion tags ready.")

        # Real Cloudinary photos uploaded for every ingredient Casa Pepe uses.
        # Copied verbatim from the live database so this command reproduces them.
        ingredient_images = {
            "aceite de girasol": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786872155/ywiq0hxggkeuozgdalwx.jpg",
            "aceite de oliva": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870942/xurj2lbvqhsdslmhisl4.jpg",
            "agua": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786872177/fg9izqcel5z9eeib6v2m.jpg",
            "ajo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870952/zhjwxnjh6dfgqa3rs7zi.jpg",
            "alubias blancas": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871199/thsahsblz2xet5ormq4e.jpg",
            "arroz": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786868571/o6q286t9dqglaajatgud.jpg",
            "atún": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871477/off8cfr7z33eo3gj5p6x.jpg",
            "azafrán": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870922/ugx4exe8aqu9z1lwtmwa.jpg",
            "azúcar": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871044/b9282dwvlnuff1facygj.jpg",
            "bacalao": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871287/mrgojekkpijvpmavf7x2.jpg",
            "calabacín": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871509/urr6nyanqduqmqshk0qe.jpg",
            "calamar": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786869089/dsok3sxbfejp3jpmydus.jpg",
            "caldo de pescado": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870932/gft2wl5nej7lyvibn1pc.jpg",
            "callos": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871253/uhtfogtyo40stib87iho.jpg",
            "cebolla": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870982/kku8y5qqlczx0sjwisex.jpg",
            "chocolate negro": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786872165/n4kwlxxfze6tedwfahpx.jpg",
            "chorizo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871208/k6ferdg6qpbtdlppdsit.jpg",
            "chuletillas de cordero": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871498/pmgwjxiy7vttwxpyqthf.jpg",
            "cochinillo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871167/yvqd0punxaq0lnw8qt9v.jpg",
            "gambas": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786869068/cimzgjkfajq3ktk6du6r.jpg",
            "garbanzos": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871264/godrt6hfr0gwwfihqu5n.jpg",
            "guindilla": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871295/izrb506catynkopriptq.jpg",
            "guisantes": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871469/pvq8oi0pdkeacoyryro3.jpg",
            "harina": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871102/gtgm1zxakh3xttd6v9l5.jpg",
            "huevo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870971/pnoygvqpr9zne5kqdbwz.jpg",
            "jamón ibérico": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871429/u2iu985tqmkokwwdi4vo.jpg",
            "jamón serrano": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871082/jrcuvsfke7rbkhdd1e2j.jpg",
            "laurel": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871245/oqk3zuschqjxqt84uchl.jpg",
            "leche": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871092/vleabr7kuihrfjalpw8u.jpg",
            "manteca de cerdo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871181/qddwdvq87t3upidugord.jpg",
            "mantequilla": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871113/fiefahz4v3mksfv0g76g.jpg",
            "mayonesa": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871489/ldub1fbuesybxer8tkda.jpg",
            "mejillones": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786869077/sdyvim40kt8nxvvq8ass.jpg",
            "morcilla": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871225/ftkhu0in7pbbshivvveo.jpg",
            "pan": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871069/qqqxtbqq0gnzypd3gqmd.jpg",
            "panceta": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871235/gqkpv0iwcdyitiked27y.jpg",
            "pan de cristal": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871458/one5ycniutjvoopd5svs.jpg",
            "pan rallado": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871127/wyzryv4qgydpbtzjeepr.jpg",
            "patata": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870961/lfatht7lkxncttum1hcb.jpg",
            "pepino": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871014/xix1a3w5ak6zwanocgos.jpg",
            "pimentón dulce": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871146/g7capoasbuipfdklr7rl.jpg",
            "pimentón picante": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871276/t4adenuc397d8derq202.jpg",
            "pimiento rojo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786869113/xbvbg4bgvflhyhvpyzzc.jpg",
            "pimiento verde": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871026/hteoimty42e6bglmhprh.jpg",
            "pulpo": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871135/mz8nrpmjimpamfypom1x.jpg",
            "rabo de toro": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871305/gp581obk5asj4px5jlza.jpg",
            "romero": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871189/khrfymsudp2tcwxaggbf.jpg",
            "sal": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786870994/awgkclptypwlpk15o4ak.jpg",
            "sal gorda": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871157/tvqu6jwp7whm9ycam3an.jpg",
            "tomate": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871004/yat6qceizq4udhpztlof.jpg",
            "vinagre de jerez": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871054/sc36j2w39rttgmlopive.jpg",
            "vino tinto": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871322/qzyo1xkncmoau2tdj0qm.jpg",
            "zanahoria": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786871313/qpur9qlbooyvkh8jj28y.jpg",
        }

        ingredient_cache = {}

        def get_or_create_ingredient(name):
            if name in ingredient_cache:
                return ingredient_cache[name]
            ingredient = db.session.scalar(select(Ingredient).where(Ingredient.name == name))
            if not ingredient:
                ingredient = Ingredient(
                    name=name,
                    active=True,
                    img_url=ingredient_images.get(name) or photo_url(name, "ingredient", 400, 300),
                )
                db.session.add(ingredient)
                db.session.flush()
            ingredient_cache[name] = ingredient
            return ingredient

        restaurant_info = {
            "name": "Casa Pepe",
            "email": "info@casapepe.es",
            "phone": "+34611000001",
            "address": "Calle Gran Vía 28, Madrid, España",
            "lat": 40.4200, "lon": -3.7025,
            "description": "Cocina española tradicional en pleno corazón de Gran Vía, con recetas de toda la vida.",
            "food_type": "española",
            "img_url": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813797/yvssasqy8t5qoxqakig3.jpg",
            "tags": ["romántico", "amigos"],
        }

        chef_info = {"name": "Lucas Pérez", "email": "chef_r1@theknife.com"}
        host_info = {"name": "Adrián Soto", "email": "host_r1@theknife.com"}
        waiter_infos = [
            {"name": "Clara", "email": "waiter1_r1@theknife.com"},
            {"name": "Bruno", "email": "waiter2_r1@theknife.com"},
            {"name": "Óscar", "email": "waiter3_r1@theknife.com"},
            {"name": "Jose", "email": "jose@mail.com"},
        ]
        cook_infos = [
            {"name": "Clara", "email": "cook1_r1@theknife.com"},
            {"name": "Alma", "email": "cook2_r1@theknife.com"},
            {"name": "Ana", "email": "cook3_r1@theknife.com"},
        ]
        table_infos = [
            {"number": 1, "location": "salón principal"},
            {"number": 2, "location": "interior"},
            {"number": 3, "location": "terraza"},
            {"number": 4, "location": "salón principal"},
            {"number": 5, "location": "barra"},
            {"number": 6, "location": "terraza"},
        ]

        def steps_for(name, ending="caliente"):
            return (
                f"1. Preparar y organizar los ingredientes de {name}.\n"
                f"2. Cocinar siguiendo la técnica tradicional de la cocina española.\n"
                f"3. Emplatar y servir {ending}."
            )

        # The 15 recipes Casa Pepe actually has, each tied to its "dish" product.
        # Ingredient amounts, photos and prices are copied verbatim from the live
        # database so this command reproduces the exact current menu.
        recipe_infos = [
            {
                "name": "Paella de Mariscos", "calories": 562, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786812567/tshq2m7w0nczwfuypfch.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786815668/mcd13on38txj4pldtlnw.jpg",
                "price": "22.00",
                "ingredients": [
                    ("arroz", 3.71), ("gambas", 1.92), ("mejillones", 3.45), ("calamar", 2.79),
                    ("pimiento rojo", 0.74), ("azafrán", 0.73), ("caldo de pescado", 0.68),
                    ("aceite de oliva", 2.83), ("ajo", 1.06),
                ],
            },
            {
                "name": "Tortilla Española", "calories": 412, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786812831/gaikhrzlntyehlypmewy.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816761/ft9h4nfafxwkte9ydhey.jpg",
                "price": "12.00",
                "ingredients": [
                    ("patata", 4.21), ("huevo", 3.4), ("cebolla", 4.19),
                    ("aceite de oliva", 0.69), ("sal", 3.87),
                ],
            },
            {
                "name": "Gazpacho Andaluz", "calories": 509, "ending": "frío",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786812845/wlwwonh26eyxywdpe9t6.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816743/qnfjoic8i9c9tpgweozy.jpg",
                "price": "6.50",
                "ingredients": [
                    ("tomate", 4.42), ("pepino", 2.65), ("pimiento verde", 2.45), ("cebolla", 2.0),
                    ("ajo", 2.8), ("aceite de oliva", 2.63), ("vinagre de jerez", 3.08), ("pan", 1.15),
                ],
            },
            {
                "name": "Croquetas de Jamón", "calories": 595, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813679/ywqtihsqynz68rm0rqwk.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816828/lqyk3wprknig5acg1bua.jpg",
                "price": "10.80",
                "ingredients": [
                    ("jamón serrano", 3.44), ("leche", 1.85), ("harina", 4.95),
                    ("mantequilla", 0.76), ("huevo", 1.96), ("pan rallado", 3.32),
                ],
            },
            {
                "name": "Pulpo a la Gallega", "calories": 274, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813111/fe8vsryi3brosrxcjenl.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816786/k1zgsstucqyespgtgrki.jpg",
                "price": "22.00",
                "ingredients": [
                    ("pulpo", 1.19), ("patata", 2.59), ("pimentón dulce", 2.32),
                    ("aceite de oliva", 2.18), ("sal gorda", 1.78),
                ],
            },
            {
                "name": "Cochinillo Asado", "calories": 423, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813162/pfcdrihwsoigwru5lkpp.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816774/hfo7ihzqgp8uodgrk0i7.jpg",
                "price": "18.00",
                "ingredients": [
                    ("cochinillo", 3.62), ("manteca de cerdo", 1.19), ("ajo", 3.67),
                    ("romero", 2.47), ("sal", 0.76),
                ],
            },
            {
                "name": "Fabada Asturiana", "calories": 642, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813289/zcweye1i2wcofqjzmeb1.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816796/crkooh9kflz49ajtiei1.jpg",
                "price": "17.00",
                "ingredients": [
                    ("alubias blancas", 1.17), ("chorizo", 4.78), ("morcilla", 2.03),
                    ("panceta", 1.4), ("laurel", 0.74),
                ],
            },
            {
                "name": "Callos a la Madrileña", "calories": 261, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813305/nqln2sou6huf5s49vsux.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816808/yzp1fhotxaprf2tlziiv.jpg",
                "price": "18.00",
                "ingredients": [
                    ("callos", 2.28), ("chorizo", 3.67), ("morcilla", 4.54),
                    ("garbanzos", 4.42), ("pimentón picante", 1.39),
                ],
            },
            {
                "name": "Bacalao al Pil Pil", "calories": 371, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813320/ocsugzfzhzp8cvftkow8.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816838/wugidscoisrrjmro7pur.jpg",
                "price": "20.00",
                "ingredients": [
                    ("bacalao", 2.6), ("aceite de oliva", 1.23), ("ajo", 4.83), ("guindilla", 3.71),
                ],
            },
            {
                "name": "Rabo de Toro", "calories": 216, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813267/vegexeocj9nvgecw09wg.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816865/di4invwgrcbhshhue1wk.jpg",
                "price": "23.00",
                "ingredients": [
                    ("rabo de toro", 1.99), ("cebolla", 0.72), ("zanahoria", 2.93),
                    ("vino tinto", 2.33), ("tomate", 3.74),
                ],
            },
            {
                "name": "Jamón Ibérico con Pan de Cristal", "calories": 249, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813340/q23kjgqnj9atjtezeqzw.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816918/anjgffdmms2ahvs1hjmn.jpg",
                "price": "16.00",
                "ingredients": [
                    ("jamón ibérico", 0.53), ("pan de cristal", 1.6),
                    ("tomate", 3.55), ("aceite de oliva", 2.19),
                ],
            },
            {
                "name": "Ensaladilla Rusa", "calories": 582, "ending": "fría",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813353/cb0wzfzue0oqi6wifgri.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816895/zyjytuq9vmyobcry8dk5.jpg",
                "price": "7.00",
                "ingredients": [
                    ("patata", 4.24), ("zanahoria", 1.45), ("guisantes", 1.01),
                    ("atún", 4.49), ("mayonesa", 1.42), ("huevo", 1.15),
                ],
            },
            {
                "name": "Chuletillas de Cordero", "calories": 499, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813704/evhjtku6wyhfocxkznux.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816852/wsyqwp7l1oolgboipugv.jpg",
                "price": "21.50",
                "ingredients": [
                    ("chuletillas de cordero", 0.72), ("ajo", 4.88),
                    ("romero", 3.98), ("aceite de oliva", 4.95),
                ],
            },
            {
                "name": "Pisto Manchego", "calories": 751, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813383/wntmor5tsvsuxmzbaufh.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816949/czcpelmmscdh5cugfqcn.jpg",
                "price": "9.00",
                "ingredients": [
                    ("calabacín", 1.97), ("pimiento rojo", 3.91), ("pimiento verde", 4.83),
                    ("tomate", 0.98), ("cebolla", 1.43), ("huevo", 1.31),
                ],
            },
            {
                "name": "Churros con Chocolate", "calories": 758, "ending": "caliente",
                "recipe_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813093/jnurhxjao18hx0rz2cbm.jpg",
                "product_img": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786816933/cn44cmxr71lqio10xynf.jpg",
                "price": "4.00",
                "ingredients": [
                    ("harina", 0.78), ("agua", 0.76), ("aceite de girasol", 1.9),
                    ("chocolate negro", 1.14), ("azúcar", 4.94),
                ],
            },
        ]

        # The 5 drinks Casa Pepe currently sells (no recipe attached)
        drink_infos = [
            {
                "name": "Agua con Gas", "price": "1.50",
                "img_url": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786817072/epnmjazfhz2m8zsqjkwj.jpg",
            },
            {
                "name": "Tinto de Verano", "price": "2.50",
                "img_url": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786817159/zwhidjk1hbviizkkspm8.jpg",
            },
            {
                "name": "Agua Mineral", "price": "1.50",
                "img_url": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786817138/w0ttww8ladykjfezt8mc.jpg",
            },
            {
                "name": "Zumo de Naranja", "price": "4.00",
                "img_url": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786817122/tz1gpn25jmvfnzzcn3eu.jpg",
            },
            {
                "name": "Vino Blanco", "price": "4.00",
                "img_url": "https://res.cloudinary.com/r2lk2eps/image/upload/v1786817091/bpujivhaadgp1iag56xx.jpg",
            },
        ]

        # The 7 orders (5 open + 2 closed) Casa Pepe currently has, with the
        # products, amounts and historical unit prices attached to each one.
        order_infos = [
            {
                "table_number": 6, "waiter_email": "waiter1_r1@theknife.com", "state": "done", "people": 1,
                "items": [
                    ("Jamón Ibérico con Pan de Cristal", 3, 11.99), ("Tortilla Española", 2, 18.23),
                    ("Vino Blanco", 1, 5.41), ("Rabo de Toro", 2, 23.00), ("Pulpo a la Gallega", 3, 14.79),
                ],
            },
            {
                "table_number": 5, "waiter_email": "waiter2_r1@theknife.com", "state": "done", "people": 2,
                "items": [
                    ("Agua con Gas", 1, 7.83), ("Churros con Chocolate", 1, 13.07),
                    ("Callos a la Madrileña", 2, 9.54), ("Paella de Mariscos", 3, 8.57),
                    ("Croquetas de Jamón", 1, 10.85),
                ],
            },
            {
                "table_number": 5, "waiter_email": "waiter2_r1@theknife.com", "state": "done", "people": 4,
                "items": [
                    ("Rabo de Toro", 1, 23.00), ("Churros con Chocolate", 2, 13.07),
                    ("Pisto Manchego", 3, 8.95), ("Bacalao al Pil Pil", 2, 11.46),
                    ("Paella de Mariscos", 2, 8.57),
                ],
            },
            {
                "table_number": 3, "waiter_email": "waiter1_r1@theknife.com", "state": "pending", "people": 1,
                "items": [
                    ("Callos a la Madrileña", 1, 9.54), ("Croquetas de Jamón", 1, 10.85),
                    ("Agua con Gas", 1, 7.83), ("Pisto Manchego", 3, 8.95), ("Paella de Mariscos", 2, 8.57),
                ],
            },
            {
                "table_number": 6, "waiter_email": "waiter3_r1@theknife.com", "state": "doing", "people": 2,
                "items": [
                    ("Rabo de Toro", 1, 23.00), ("Churros con Chocolate", 2, 13.07),
                    ("Chuletillas de Cordero", 1, 20.93), ("Gazpacho Andaluz", 2, 20.26),
                    ("Fabada Asturiana", 3, 25.62),
                ],
            },
            {
                "table_number": 6, "waiter_email": "waiter2_r1@theknife.com", "state": "closed", "people": 2,
                "days_ago": 9,
                "items": [
                    ("Tinto de Verano", 2, 2.04), ("Pisto Manchego", 2, 8.95),
                    ("Paella de Mariscos", 3, 8.57), ("Vino Blanco", 3, 5.41),
                ],
            },
            {
                "table_number": 6, "waiter_email": "waiter2_r1@theknife.com", "state": "closed", "people": 3,
                "days_ago": 9,
                "items": [
                    ("Tortilla Española", 3, 18.23), ("Croquetas de Jamón", 1, 10.85),
                ],
            },
        ]

        print("Creating restaurant 'Casa Pepe' with its real menu, staff, tables and orders...")

        restaurant = Restaurant(
            name=restaurant_info["name"],
            email=restaurant_info["email"],
            phone=restaurant_info["phone"],
            address=restaurant_info["address"],
            latitude=restaurant_info["lat"],
            longitude=restaurant_info["lon"],
            description=restaurant_info["description"],
            food_type=restaurant_info["food_type"],
            img_url=restaurant_info["img_url"],
        )
        db.session.add(restaurant)
        db.session.flush()  # assign restaurant.id

        for tag_name in restaurant_info["tags"]:
            if tag_name in all_tags:
                restaurant.tags.append(all_tags[tag_name])

        db.session.add(Chef(
            name=chef_info["name"], email=chef_info["email"],
            password="123456", restaurant_id=restaurant.id,
        ))
        db.session.add(Host(
            name=host_info["name"], email=host_info["email"],
            password="123456", restaurant_id=restaurant.id,
        ))

        waiters_by_email = {}
        for w in waiter_infos:
            waiter = Waiter(
                name=w["name"], email=w["email"],
                password="123456", restaurant_id=restaurant.id,
            )
            db.session.add(waiter)
            waiters_by_email[w["email"]] = waiter

        for c in cook_infos:
            db.session.add(Cook(
                name=c["name"], email=c["email"],
                password="123456", restaurant_id=restaurant.id,
            ))

        tables_by_number = {}
        for t in table_infos:
            table = Table(
                number=t["number"], status="available", location=t["location"],
                active=True, restaurant_id=restaurant.id,
            )
            db.session.add(table)
            tables_by_number[t["number"]] = table

        db.session.flush()  # assign waiter/table ids

        # 15 recipes (with their real ingredients) and their matching "dish" products
        products_by_name = {}
        for info in recipe_infos:
            recipe = Recipe(
                name=info["name"],
                steps=steps_for(info["name"], info["ending"]),
                img_url=info["recipe_img"],
                calories=info["calories"],
                restaurant_id=restaurant.id,
            )
            db.session.add(recipe)
            db.session.flush()  # assign recipe.id

            for ingredient_name, amount in info["ingredients"]:
                ingredient = get_or_create_ingredient(ingredient_name)
                db.session.add(RecipeIngredient(
                    ingredient_id=ingredient.id, recipe_id=recipe.id, amount=amount,
                ))

            product = Product(
                name=info["name"],
                description=f"{info['name']}, receta tradicional de la cocina española.",
                sell_price=Decimal(info["price"]),
                type="dish",
                active=True,
                img_url=info["product_img"],
                restaurant_id=restaurant.id,
                recipe_id=recipe.id,
            )
            db.session.add(product)
            products_by_name[product.name] = product

        # 5 drinks -> "drink" products, no recipe
        for info in drink_infos:
            product = Product(
                name=info["name"],
                description=f"{info['name']}.",
                sell_price=Decimal(info["price"]),
                type="drink",
                active=True,
                img_url=info["img_url"],
                restaurant_id=restaurant.id,
            )
            db.session.add(product)
            products_by_name[product.name] = product

        db.session.flush()  # assign product ids

        # 7 orders (5 open + 2 closed), each with its real products attached
        for info in order_infos:
            order = Order(
                table_id=tables_by_number[info["table_number"]].id,
                waiter_id=waiters_by_email[info["waiter_email"]].id,
                state=info["state"],
                people=info["people"],
            )
            if "days_ago" in info:
                order.date_time = datetime.now() - timedelta(days=info["days_ago"])
            db.session.add(order)
            db.session.flush()
            for product_name, amount, unit_price in info["items"]:
                db.session.add(OrderProduct(
                    order_id=order.id, product_id=products_by_name[product_name].id,
                    amount=amount, unit_price=unit_price,
                ))

        db.session.commit()
        print(
            f"Restaurante '{restaurant.name}' creado: 1 chef, 1 host, {len(waiter_infos)} camareros, "
            f"{len(cook_infos)} cocineros, {len(recipe_infos)} recetas, {len(products_by_name)} productos, "
            f"{len(table_infos)} mesas, {len(order_infos)} comandas."
        )

        # Ingredients not referenced by any recipe (i.e. not used by Casa Pepe,
        # now that it's the only restaurant this command creates) are removed so
        # the catalogue only contains what's actually cooked with.
        unused_ingredients = db.session.scalars(
            select(Ingredient).where(
                ~Ingredient.id.in_(select(RecipeIngredient.ingredient_id))
            )
        ).all()
        for ingredient in unused_ingredients:
            db.session.delete(ingredient)
        db.session.commit()

        print(
            f"All test data created. {len(ingredient_cache)} ingredients used by Casa Pepe kept, "
            f"{len(unused_ingredients)} unused ingredient(s) deleted."
        )