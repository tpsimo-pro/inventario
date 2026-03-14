import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "inventario.db")
conn = sqlite3.connect(db_path, timeout=10)
try:
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM products")
    conn.commit()
    cursor.execute("VACUUM")
    print("Produtos e transações deletados com sucesso do banco de dados.")
except Exception as e:
    print(f"Erro ao deletar: {e}")
finally:
    conn.close()
