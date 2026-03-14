import requests

# Criar um produto primeiro
r = requests.post(
    "http://127.0.0.1:8000/produtos",
    json={
        "nome": "Prod Teste",
        "sku": "PROD-XXX",
        "categoria_id": 1,
        "preco_venda": 100,
    },
)
print("Create:", r.status_code, r.text)
if r.status_code == 201:
    pid = r.json().get("id")
    # Tentar apagar
    r2 = requests.delete(f"http://127.0.0.1:8000/produtos/{pid}")
    print("Delete:", r2.status_code, r2.text)
