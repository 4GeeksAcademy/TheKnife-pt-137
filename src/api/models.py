from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from decimal import Decimal

db = SQLAlchemy()

## Restaurant
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

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address
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

## Product
class Product(db.Model):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(String(120), nullable=True)
    sell_price: Mapped[Decimal] = mapped_column(Numeric(10,2), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "sell_price": self.sell_price,
            "type": self.type,
            "active": self.active,
        }

## Recipe
class Recipe(db.Model):
    __tablename__="recipe"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    steps: Mapped[str] = mapped_column(String(300), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "steps": self.steps,
            }