# Types Links Service - Ejemplos de Uso

## Endpoints Disponibles

### 1. Crear un nuevo tipo de link
```http
POST /types-links
Content-Type: application/json

{
  "name": "Angular"
}
```

**Respuesta exitosa:**
```json
{
  "type_id": "232ddds23-1234-5678-9abc-def012345678",
  "name": "Angular",
  "links": []
}
```

### 2. Obtener todos los tipos de links
```http
GET /types-links
```

**Respuesta:**
```json
[
  {
    "type_id": "232ddds23-1234-5678-9abc-def012345678",
    "name": "Angular",
    "links": [
      {
        "id_link": "link-uuid-1",
        "link": "https://angular.io",
        "type_id": "232ddds23-1234-5678-9abc-def012345678"
      }
    ]
  },
  {
    "type_id": "456eeef45-5678-9abc-def0-123456789012",
    "name": "React",
    "links": []
  }
]
```

### 3. Obtener un tipo específico por ID
```http
GET /types-links/232ddds23-1234-5678-9abc-def012345678
```

### 4. Actualizar un tipo de link
```http
PATCH /types-links/232ddds23-1234-5678-9abc-def012345678
Content-Type: application/json

{
  "name": "Angular Framework"
}
```

### 5. Eliminar un tipo de link
```http
DELETE /types-links/232ddds23-1234-5678-9abc-def012345678
```

**Respuesta:**
```json
{
  "message": "Type with ID 232ddds23-1234-5678-9abc-def012345678 has been successfully deleted"
}
```

### 6. Buscar tipo por nombre
```http
GET /types-links/search/by-name?name=Angular
```

### 7. Obtener estadísticas con conteo de links
```http
GET /types-links/stats/with-link-count
```

**Respuesta:**
```json
[
  {
    "typesLink_type_id": "232ddds23-1234-5678-9abc-def012345678",
    "typesLink_name": "Angular",
    "linkCount": "3"
  },
  {
    "typesLink_type_id": "456eeef45-5678-9abc-def0-123456789012",
    "typesLink_name": "React",
    "linkCount": "1"
  }
]
```

### 8. Obtener tipos de links para un proyecto específico
```http
GET /types-links/for-project/project-uuid-123
```

## Características del Servicio

- ✅ **Validación**: Los nombres son únicos y requeridos
- ✅ **Relaciones**: Incluye automáticamente los links asociados
- ✅ **Ordenamiento**: Los resultados se ordenan alfabéticamente por nombre
- ✅ **Protección**: No se puede eliminar un tipo que tenga links asociados
- ✅ **Búsqueda**: Permite buscar por nombre
- ✅ **Estadísticas**: Proporciona conteo de links por tipo
- ✅ **Manejo de errores**: Respuestas claras para errores comunes

## Ejemplos de Tipos de Links Comunes

```json
[
  { "name": "GitHub" },
  { "name": "Demo" },
  { "name": "Documentation" },
  { "name": "Live Site" },
  { "name": "Angular" },
  { "name": "React" },
  { "name": "Vue.js" },
  { "name": "Node.js" },
  { "name": "API" },
  { "name": "Database" }
]
```
