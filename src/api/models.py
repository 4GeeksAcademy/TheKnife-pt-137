from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Numeric, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from decimal import Decimal
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

db = SQLAlchemy()

# The app has no multi-timezone concept (single restaurant, all times entered as plain
# wall-clock by whoever's browser). reservation_time is stored naive, as the restaurant's
# own local time — but the server process itself may run in a different OS timezone (e.g.
# UTC on most cloud hosts). Comparing it against a naive datetime.now() would silently use
# the server's clock instead, which is wrong whenever the two differ. This computes "now"
# in the restaurant's timezone explicitly, regardless of what timezone the server runs in.
RESTAURANT_TZ = ZoneInfo("Europe/Madrid")


def restaurant_now():
    return datetime.now(RESTAURANT_TZ).replace(tzinfo=None)

# Association table: a restaurant can have many occasion tags and viceversa
restaurant_tag = db.Table(
    "restaurant_tag",
    db.Column("restaurant_id", ForeignKey("restaurant.id", ondelete="CASCADE"), primary_key=True),
    db.Column("tag_id", ForeignKey("tag.id", ondelete="CASCADE"), primary_key=True),
)

# Restaurant
class Restaurant(db.Model):
    __tablename__ = "restaurant"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_restaurant_email"),
        db.UniqueConstraint("phone", name="unique_restaurant_phone"),
        db.UniqueConstraint("address", name="unique_restaurant_address"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    address: Mapped[str] = mapped_column(String(100), nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    latitude: Mapped[float] = mapped_column(nullable=True)
    longitude: Mapped[float] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    food_type: Mapped[str] = mapped_column(String(50), nullable=True)

    # Relationships
    tags: Mapped[list["Tag"]] = relationship(secondary=restaurant_tag, back_populates="restaurants")
    products: Mapped[list["Product"]] = relationship(
        back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    chef: Mapped["Chef"] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    host: Mapped["Host"] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    waiters: Mapped[list["Waiter"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    cooks: Mapped[list["Cook"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    tables: Mapped[list["Table"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    recipes: Mapped[list["Recipe"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan", passive_deletes=True)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "img_url": self.img_url,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "description": self.description,
            "food_type": self.food_type,
            "tags": [tag.serialize() for tag in self.tags]
        }

# Tag (occasion label: romantic, business, pet friendly...)
class Tag(db.Model):
    __tablename__ = "tag"
    __table_args__ = (
        db.UniqueConstraint("name", name="unique_tag_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)

    # Relationships
    restaurants: Mapped[list["Restaurant"]] = relationship(secondary=restaurant_tag, back_populates="tags")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name


        }

# Manager
class Manager(db.Model):
    __tablename__ = "manager"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_manager_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


# Client (cliente global de la app, no pertenece a un restaurante; se relaciona con sus reservas)
class Client(db.Model):
    __tablename__ = "client"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_client_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)

    # Relationships
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="client")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone
        }

# Waiter
class Waiter(db.Model):
    __tablename__ = "waiter"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_waiter_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="CASCADE"))

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="waiters")
    orders: Mapped[list["Order"]] = relationship(back_populates="waiter")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "img_url": self.img_url,
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name
        }

# Cook
class Cook(db.Model):
    __tablename__ = "cook"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_cook_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="CASCADE"))

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="cooks")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "img_url": self.img_url,
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name
        }

# Chef
class Chef(db.Model):
    __tablename__ = "chef"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_chef_email"),
        db.UniqueConstraint("restaurant_id", name="unique_restaurant_chef"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    # Foreign columns
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="chef")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name if self.restaurant else None
        }

# Host (anfitrión / recepción de reservas)
class Host(db.Model):
    __tablename__ = "host"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_host_email"),
        db.UniqueConstraint("restaurant_id", name="unique_restaurant_host"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    # Foreign columns
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="host")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "img_url": self.img_url,
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name if self.restaurant else None
        }

# Table (mesa)
class Table(db.Model):
    __tablename__ = "table"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[int] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    location: Mapped[str] = mapped_column(nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)
    # Foreign keys
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="tables")
    orders: Mapped[list["Order"]] = relationship(back_populates="table")
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="table")

    # How far ahead of its reservation_time a table starts showing as "reserved" to the waiter.
    # A reservation made days in advance shouldn't sit a table out of walk-in use until then.
    RESERVATION_HEADS_UP = timedelta(hours=1)

    def serialize(self):
        # Soonest reservation for this table that's due within the heads-up window (not yet seated,
        # not overdue), so the waiter board can flag a "free" table that's about to be claimed
        # without blocking walk-ins on tables reserved days out. A reservation whose time has
        # already passed no longer counts as "upcoming" — it's on the host to seat it or mark it
        # cancelled/completed.
        now = restaurant_now()
        upcoming_reservations = sorted(
            (r for r in self.reservations
             if r.status in ("waiting", "confirmed") and r.reservation_time
             and now <= r.reservation_time <= now + self.RESERVATION_HEADS_UP),
            key=lambda r: r.reservation_time
        )
        next_reservation = upcoming_reservations[0] if upcoming_reservations else None
        # The reservation that got this table seated (host already knows the party size from
        # booking time), so the waiter doesn't have to ask the guests again when opening the order.
        seated_reservations = sorted(
            (r for r in self.reservations if r.status == "seated"),
            key=lambda r: r.created_at, reverse=True
        )
        seated_reservation = seated_reservations[0] if seated_reservations else None
        return {
            "id": self.id,
            "number": self.number,
            "status": self.status,
            "location": self.location,
            "active": self.active,
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name,
            "current_order_id": next((o.id for o in self.orders if o.state != "closed"), None),
            "next_reservation": {
                "id": next_reservation.id,
                "customer_name": next_reservation.customer_name,
                "party_size": next_reservation.party_size,
                "reservation_time": next_reservation.reservation_time,
                "status": next_reservation.status
            } if next_reservation else None,
            "seated_reservation": {
                "id": seated_reservation.id,
                "customer_name": seated_reservation.customer_name,
                "party_size": seated_reservation.party_size
            } if seated_reservation else None
        }

# Product
class Product(db.Model):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(String(120), nullable=True)
    sell_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    # Foreign keys
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="CASCADE"))
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipe.id"), nullable=True)

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="products")
    recipe: Mapped["Recipe"] = relationship(back_populates="product")
    order_products: Mapped[list["OrderProduct"]] = relationship(back_populates="product")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "sell_price": self.sell_price,
            "type": self.type,
            "active": self.active,
            "restaurant_id": self.restaurant_id,
            "recipe_id": self.recipe_id,
            "ingredients_count": len(self.recipe.recipe_ingredients) if self.recipe else None,
            "img_url": self.img_url,
            "restaurant_name": self.restaurant.name
        }

# Recipe
class Recipe(db.Model):
    __tablename__ = "recipe"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    steps: Mapped[str] = mapped_column(Text, nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    calories: Mapped[int] = mapped_column(nullable=True)
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="CASCADE"))

    # Relationships
    product: Mapped["Product"] = relationship(back_populates="recipe")
    recipe_ingredients: Mapped[list["RecipeIngredient"]] = relationship(back_populates="recipe")
    restaurant: Mapped["Restaurant"] = relationship(back_populates="recipes")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "steps": self.steps,
            "img_url": self.img_url,
            "calories": self.calories,
            "ingredients_count": len(self.recipe_ingredients),
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name
        }

# Ingredients
class Ingredient(db.Model):
    __tablename__ = "ingredient"
    __table_args__ = (
        db.UniqueConstraint("name", name="unique_ingredient_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Relationships
    recipe_ingredients: Mapped[list["RecipeIngredient"]] = relationship(back_populates="ingredient")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "active": self.active,
            "img_url": self.img_url
        }

# Order
class Order(db.Model):
    __tablename__ = "order"

    id: Mapped[int] = mapped_column(primary_key=True)
    # (ForeignKey("table.id")) AQUÍ HAY QUE AÑADIR ESTAS FOREIGN KEYS CUANDO SE PUEDAN CREAR MESAS PORQUE AHORA MISMO NO PERMITE CREAR COMANDAS AL NO EXISTIR NINGUNA MESA
    table_id: Mapped[int] = mapped_column(ForeignKey("table.id"))
    waiter_id: Mapped[int] = mapped_column(ForeignKey("waiter.id", ondelete="SET NULL"), nullable=True)  
    state: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    date_time: Mapped[datetime] = mapped_column(default=datetime.now)
    people: Mapped[int] = mapped_column(nullable=False)
    # Relationships
    order_products: Mapped[list["OrderProduct"]] = relationship(back_populates="order")
    table: Mapped["Table"] = relationship(back_populates="orders")
    waiter: Mapped["Waiter"] = relationship(back_populates="orders")

    def serialize(self):
        return {
            "id": self.id,
            "table_id": self.table_id,
            "table_number": self.table.number if self.table else None,
            "waiter_id": self.waiter_id,
            "waiter_name": self.waiter.name if self.waiter else None,
            "state": self.state,
            "date_time": self.date_time,
            "people": self.people,
        }

# Reservation
class Reservation(db.Model):
    __tablename__ = "reservation"

    id: Mapped[int] = mapped_column(primary_key=True)
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id", ondelete="CASCADE"), nullable=False)
    table_id: Mapped[int] = mapped_column(ForeignKey("table.id", ondelete="SET NULL"), nullable=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("client.id", ondelete="SET NULL"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String(60), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    party_size: Mapped[int] = mapped_column(nullable=False)
    reservation_time: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="waiting")
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="reservations")
    table: Mapped["Table"] = relationship(back_populates="reservations")
    client: Mapped["Client"] = relationship(back_populates="reservations")

    def serialize(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "restaurant_name": self.restaurant.name,
            "table_id": self.table_id,
            "table_number": self.table.number if self.table else None,
            "client_id": self.client_id,
            "client_name": self.client.name if self.client else None,
            "customer_name": self.customer_name,
            "phone": self.phone,
            "party_size": self.party_size,
            "reservation_time": self.reservation_time,
            "status": self.status,
            "created_at": self.created_at
        }

# Order-product


class OrderProduct(db.Model):
    __tablename__ = "order_product"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("order.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"))
    amount: Mapped[int] = mapped_column(nullable=False, default=1)
    unit_price: Mapped[float] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(String(120), nullable=True)

    # Relationships
    product: Mapped["Product"] = relationship(back_populates="order_products")
    order: Mapped["Order"] = relationship(back_populates="order_products")

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "amount": self.amount,
            "unit_price": self.unit_price,
            "comment": self.comment,
            "product_name": self.product.name,
            "product_type": self.product.type
        }

# RecipeIngredient


class RecipeIngredient(db.Model):
    __tablename__ = "recipe_ingredient"

    id: Mapped[int] = mapped_column(primary_key=True)
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredient.id"), nullable=False)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipe.id"), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)

    # Relationships
    ingredient: Mapped["Ingredient"] = relationship(back_populates="recipe_ingredients")
    recipe: Mapped["Recipe"] = relationship(back_populates="recipe_ingredients")

    def serialize(self):
        return {
            "id": self.id,
            "ingredient_id": self.ingredient_id,
            "recipe_id": self.recipe_id,
            "amount": self.amount,
            "ingredient_name": self.ingredient.name,
            "ingredient_img_url": self.ingredient.img_url
        }
