"""
Inventory Management System Implementation

This system demonstrates the use of three design patterns:
1. Factory Pattern (Creational) - For creating different types of inventory items
2. Observer Pattern (Behavioral) - For notifications on inventory changes
3. Singleton Pattern (Creational) - For database connection management

Key components:
- Item Factory: Creates different types of inventory items
- Inventory Observer: Monitors inventory changes
- Inventory Manager: Manages database operations (Singleton)
"""

# Implementation details in the rest of the file

# ... (Observer, Factory, Singleton patterns)
# InventoryManager class manages SQLite connection and inventory logic

import sqlite3
import asyncio
from abc import ABC, abstractmethod

# Observer Pattern
class Observer(ABC):
    @abstractmethod
    def update(self, message: str):
        pass

class InventoryObserver(Observer):
    def update(self, message: str):
        print(f"Notification: {message}")


# Factory Pattern
class Item(ABC):
    def __init__(self, name, category, quantity):
        self.name = name
        self.category = category
        self.quantity = quantity

    def __str__(self):
        return f"{self.name} ({self.category}): {self.quantity}"

class Computer(Item):
    def __init__(self, name, quantity):
        super().__init__(name, "Computer", quantity)

class Phone(Item):
    def __init__(self, name, quantity):
        super().__init__(name, "Phone", quantity)

class Printer(Item):
    def __init__(self, name, quantity):
        super().__init__(name, "Printer", quantity)

class ItemFactory:
    from functools import lru_cache

    @staticmethod
    @lru_cache(maxsize=None)
    def create_item(item_type, name, quantity):
        item_classes = {
            "Computer": Computer,
            "Phone": Phone,
            "Printer": Printer
        }
        if item_type in item_classes:
            return item_classes[item_type](name, quantity)
        else:
            raise ValueError("Invalid item type")


# Singleton Pattern with SQLite Integration
class InventoryManager:
    _instance = None
    _db_path = None
    _connection = None
    _cursor = None
    _observers = []

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_database()
        return cls._instance

    def _initialize_database(self):
        import os
        db_dir = os.path.join(os.path.dirname(__file__), 'db')
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
        self._db_path = os.path.join(db_dir, 'inventory.db')
        self._connection = sqlite3.connect(self._db_path)
        self._cursor = self._connection.cursor()
        
        # Ensure schema is loaded if db is empty
        if not os.path.exists(self._db_path) or os.path.getsize(self._db_path) == 0:
            schema_path = os.path.join(db_dir, 'schema.sql')
            if not os.path.exists(schema_path):
                raise FileNotFoundError(f"Schema file not found at {schema_path}")
            with open(schema_path, 'r') as f:
                self._connection.executescript(f.read())
        self._connection.commit()

    def add_observer(self, observer: Observer):
        self._observers.append(observer)

    async def _notify_observer(self, observer, message: str):
        await asyncio.to_thread(observer.update, message)

    def notify_observers(self, message: str):
        asyncio.run(self._notify_all_observers(message))

    async def _notify_all_observers(self, message: str):
        tasks = [self._notify_observer(observer, message) for observer in self._observers]
        await asyncio.gather(*tasks)

    # Add a new device and assign to employee
    def add_device_assignment(self, device_name, device_type, device_desc, employee_id, notes=None):
        # Insert device
        self._cursor.execute(
            "INSERT INTO devices (name, description, device_type) VALUES (?, ?, ?)",
            (device_name, device_desc, device_type)
        )
        device_id = self._cursor.lastrowid
        # Assign device to employee in inventory
        self._cursor.execute(
            "INSERT INTO inventory (device_id, employee_id, notes) VALUES (?, ?, ?)",
            (device_id, employee_id, notes)
        )
        self._connection.commit()
        self.notify_observers(f"Inventory Update: Assigned {device_name} to Employee {employee_id}")

    def remove_device_assignment(self, inventory_id: int):
        self._cursor.execute("DELETE FROM inventory WHERE inventory_id = ?", (inventory_id,))
        self._connection.commit()
        if self._cursor.rowcount > 0:
            self.notify_observers(f"Inventory Update: Removed assignment for Inventory ID {inventory_id}")
        else:
            import logging
            logging.warning(f"Assignment not found for Inventory ID {inventory_id}!")

    def update_inventory_status(self, inventory_id: int, status: str, notes: str = ""):
        self._cursor.execute(
            "UPDATE inventory SET status = ?, notes = ? WHERE inventory_id = ?",
            (status, notes or "", inventory_id)
        )
        self._connection.commit()
        if self._cursor.rowcount > 0:
            self.notify_observers(f"Inventory Update: Status updated for Inventory ID {inventory_id}")
        else:
            import logging
            logging.warning(f"Inventory ID {inventory_id} not found!")

    def search_devices(self, employee_name=None, department_name=None, device_type=None):
        query, params = self._build_search_query(employee_name, department_name, device_type)
        self._cursor.execute(query, tuple(params))
        results = self._cursor.fetchall()
        columns = [desc[0] for desc in self._cursor.description]
        return [dict(zip(columns, row)) for row in results]

    def _build_search_query(self, employee_name=None, department_name=None, device_type=None):
        base_query = '''
            SELECT
                i.inventory_id,
                e.name AS employee_name,
                d.name AS device_name,
                d.device_type,
                d.description,
                i.assigned_date,
                i.status,
                i.notes,
                dep.name AS department_name
            FROM inventory i
            JOIN employees e ON i.employee_id = e.employee_id
            JOIN devices d ON i.device_id = d.device_id
            JOIN departments dep ON e.department_id = dep.department_id
            WHERE 1=1
        '''
        params = []
        if employee_name:
            base_query += " AND e.name = ?"
            params.append(employee_name)
        if department_name:
            base_query += " AND dep.name = ?"
            params.append(department_name)
        if device_type:
            base_query += " AND d.device_type = ?"
            params.append(device_type)
        return base_query, params

    def display_inventory(self):
        self._cursor.execute('''
            SELECT
                i.inventory_id,
                e.name AS employee_name,
                d.name AS device_name,
                d.device_type,
                d.description,
                i.assigned_date,
                i.status,
                i.notes,
                dep.name AS department_name
            FROM inventory i
            JOIN employees e ON i.employee_id = e.employee_id
            JOIN devices d ON i.device_id = d.device_id
            JOIN departments dep ON e.department_id = dep.department_id
        ''')
        results = self._cursor.fetchall()
        columns = [desc[0] for desc in self._cursor.description]
        if not results:
            print("Inventory is empty!")
            return []
        else:
            return [dict(zip(columns, row)) for row in results]

    def close_connection(self):
        if self._connection:
            self._connection.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close_connection()

    def __del__(self):
        if hasattr(self, '_connection') and self._connection:
            self._connection.close()