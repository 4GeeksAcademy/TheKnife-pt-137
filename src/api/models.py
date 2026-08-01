from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from decimal import Decimal
from datetime import datetime

db = SQLAlchemy()

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

    # Relationships
    products: Mapped[list["Product"]] = relationship(back_populates="restaurant")
    chef: Mapped["Chef"] = relationship(back_populates="restaurant")
    waiters: Mapped[list["Waiter"]] = relationship(back_populates="restaurant")
    cooks: Mapped[list["Cook"]] = relationship(back_populates="restaurant")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "img_url": self.img_url
        }

## Waiter
class Waiter(db.Model):
    __tablename__ = "waiter"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_waiter_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"))

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="waiters")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "restaurant_id": self.restaurant_id
        }

## Cook
class Cook(db.Model):
    __tablename__ = "cook"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_cook_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"))

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="cooks")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "restaurant_id": self.restaurant_id
        }

## Chef
class Chef(db.Model):
    __tablename__ = "chef"
    __table_args__ = (
        db.UniqueConstraint("email", name="unique_chef_email"),
        db.UniqueConstraint("restaurant_id", name="unique_restaurant_chef"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    # Foreign columns
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"))

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="chef")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "restaurant_id": self.restaurant_id
        }

## Table (mesa)
class Table(db.Model):
    __tablename__ = "table"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[int] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    location: Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "number": self.number,
            "status": self.status,
            "location": self.location,
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
    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"))
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipe.id"), nullable=True)

    # Relationships
    restaurant: Mapped["Restaurant"] = relationship(back_populates="products")
    recipe: Mapped["Recipe"] = relationship(back_populates="product")

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
            "img_url": self.img_url
        }

# Recipe
class Recipe(db.Model):
    __tablename__ = "recipe"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    steps: Mapped[str] = mapped_column(String(300), nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Relationships
    product: Mapped["Product"] = relationship(back_populates="recipe")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "steps": self.steps,
            "img_url": self.img_url
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

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "active": self.active,
            "img_url": self.img_url
        }

## Order
class Order(db.Model):
    __tablename__ = "order"

    id: Mapped[int] = mapped_column(primary_key=True)
    table_id: Mapped[int] = mapped_column() #(ForeignKey("table.id")) AQUÍ HAY QUE AÑADIR ESTAS FOREIGN KEYS CUANDO SE PUEDAN CREAR MESAS PORQUE AHORA MISMO NO PERMITE CREAR COMANDAS AL NO EXISTIR NINGUNA MESA
    waiter_id: Mapped[int] = mapped_column() #(ForeignKey("waiter.id"))
    state: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    date_time: Mapped[datetime] = mapped_column(default=datetime.now)
    people: Mapped[int] = mapped_column(nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "table_id": self.table_id,
            "waiter_id": self.waiter_id,
            "state": self.state,
            "date_time": self.date_time,
            "people": self.people,
        }
