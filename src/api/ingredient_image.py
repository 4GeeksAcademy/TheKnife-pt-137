import json
import urllib.error
import urllib.parse
import urllib.request
import anthropic
import cloudinary.uploader

THEMEALDB_INGREDIENT_IMAGE = "https://www.themealdb.com/images/ingredients/{}.png"
THEMEALDB_INGREDIENT_LIST = "https://www.themealdb.com/api/json/v1/1/list.php?i=list"

# El cliente lee la variable de entorno ANTHROPIC_API_KEY automáticamente
client = anthropic.Anthropic()

TRANSLATION_SCHEMA = {
    "type": "object",
    "properties": {
        "translated_name": {
            "type": "string",
            "description": "El nombre del ingrediente traducido al inglés, en singular y sin artículos, tal y como aparecería en una receta"
        }
    },
    "required": ["translated_name"],
    "additionalProperties": False
}


def build_themealdb_image_url(ingredient_name):
    # TheMealDB matches ingredient names using an underscore for any spaces
    normalized_name = ingredient_name.strip().replace(" ", "_")
    return THEMEALDB_INGREDIENT_IMAGE.format(urllib.parse.quote(normalized_name))


def _remote_image_exists(url):
    head_request = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(head_request, timeout=5) as response:
            return response.status == 200
    except urllib.error.URLError:
        return False


_themealdb_names_cache = None


def _get_themealdb_ingredient_names():
    global _themealdb_names_cache
    if _themealdb_names_cache is not None:
        return _themealdb_names_cache
    try:
        with urllib.request.urlopen(THEMEALDB_INGREDIENT_LIST, timeout=5) as response:
            data = json.loads(response.read())
    except Exception:
        return []
    names = [meal["strIngredient"] for meal in (data.get("meals") or []) if meal.get("strIngredient")]
    _themealdb_names_cache = names
    return names


# TheMealDB no indexa muchos ingredientes crudos por su nombre simple (por ejemplo
# no tiene "Plum", pero sí "Plum Sauce" o "Plum Tomatoes"). Si la traducción exacta
# no encuentra imagen, buscamos en su catálogo completo un nombre que la contenga
# como palabra completa y usamos esa imagen como aproximación.
def _find_partial_match(translated_name):
    target = translated_name.strip().lower()
    for name in _get_themealdb_ingredient_names():
        if target in name.lower().split():
            return name
    return None


# TheMealDB solo tiene su catálogo de ingredientes en inglés. Si el nombre tal
# cual no encuentra imagen, le pedimos a Claude que lo traduzca para reintentar.
def _translate_to_english(ingredient_name):
    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=100,
            thinking={"type": "disabled"},
            output_config={"format": {"type": "json_schema", "schema": TRANSLATION_SCHEMA}},
            messages=[{
                "role": "user",
                "content": f"Traduce este ingrediente de cocina al inglés: {ingredient_name}"
            }]
        )
    except Exception:
        return None
    if response.stop_reason == "refusal":
        return None
    return json.loads(response.content[0].text)["translated_name"]


def generate_ingredient_image_url(ingredient_name):
    themealdb_url = build_themealdb_image_url(ingredient_name)
    if not _remote_image_exists(themealdb_url):
        translated_name = _translate_to_english(ingredient_name)
        if not translated_name:
            return None
        themealdb_url = build_themealdb_image_url(translated_name)
        if not _remote_image_exists(themealdb_url):
            partial_match = _find_partial_match(translated_name)
            if not partial_match:
                return None
            themealdb_url = build_themealdb_image_url(partial_match)
            if not _remote_image_exists(themealdb_url):
                return None
    try:
        upload_result = cloudinary.uploader.upload(themealdb_url, folder="cocinapp_ingredients")
    except Exception:
        # Credenciales sin configurar, Cloudinary caído, etc: no debe romper la
        # vista del ingrediente, simplemente se queda sin imagen esta vez.
        return None
    return upload_result["secure_url"]
