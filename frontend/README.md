## Guía de Ejecución

El proyecto sigue una arquitectura **Feature-First** para añadir, modificar o eliminar funciones completas facilmente y reducir la navegación excesiva entre carpetas.

Se debe tener el backend corriendo en Docker o local en el puerto `8080`

### Instalación de dependencias

```bash
cd frontend
npm install
```

### Ejecutar el entorno de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`. Las peticiones `/api/*` se redirigen automáticamente al backend en `http://localhost:8080`

### Ejecutar pruebas automatizadas

```bash
npm run test
```

### Validar compilación

```bash
npm run build
```

---

## Respuestas a las Preguntas

### 4.a: Manejo de Grandes Volúmenes de Datos (Dataset sin paginar en backend)

Ya que el endpoint retorna todos los registros en una sola respuesta sin paginación desde el backend el principal problema es saber renderizar los elementos en pantalla sin sobrecargarlo, ya que actualmente causaria recalculos masivos y un excesivo consumo en memoria.

Para mitigar este problema sin alterar el backend se tienen los siguientes enfoques:

#### 1. Paginación en Cliente

Consiste en almacenar el dataset completo en memoria y segmentarlo en subconjuntos mediante `useMemo` y `array.slice(startIndex, startIndex + pageSize)`.

- **Ventajas:**
  - **Baja complejidad:** Implementación directa con React y hooks nativos, sin dependencias externas (como en `useClientPagination`).
  - **Accesibilidad y semántica:** Mantiene la estructura nativa de tablas HTML.
  - **Consistencia:** Fácil sincronización de estado, ya que permite reiniciar a la página 1 al renderizar cuando cambian los filtros (sin usar `useEffect` redundantes).
- **Desventajas:**
  - **UX segmentada:** El usuario debe interactuar con controles de paginación en lugar de una navegación continua.
  - **Memoria:** El cliente retiene la lista completa en RAM (sobre los 10.000 registros comienzan a haber problemas de rendimiento).

#### 2. Virtualización de Listas (Virtual Scrolling / Windowing)

Consiste en renderizar únicamente las filas visibles en la vista del usuario y un pequeño buffer superior e inferior, recalculando de forma dinamica qué elementos montar según la posición del scroll (`scrollTop`) mediante librerías como `@tanstack/react-virtual` o `react-window`.

- **Ventajas:**
  - **Buena Escalabilidad:** La cantidad de nodos montados permanece constante $O(1)$ sin importar la cantidad de elementos en memoria.
  - **Experiencia de usuario:** Permite scroll continuo fluido sin interrupciones por saltos de página.
- **Desventajas:**
  - **Alta complejidad:** Requiere contenedores con alturas fijas, cálculo de offsets y manejo complejo de alturas de fila dinámicas o responsivas.
  - **Accesibilidad:** Rompe la búsqueda nativa del navegador (`Ctrl + F`) para elementos fuera del límite visual.

Detalle adicional: En ambos enfoques el filtro se aplicaria antes de la paginación sobre el dataset en memoria utilizando `useMemo`. Se recomienda utilizar `debouncing` en el input de busqueda junto a `useTransition`o `useDeferredValue` para no perder eficiencia.

---

#### Justificación de la Solución Adoptada

Se seleccionó la **Paginación en Cliente** por las siguientes razones:

1. **Relación costo/beneficio y mantenibilidad:** Resuelve de raíz del problema manteniendo un número fijo y reducido de filas en pantalla, evitando dependencias externas.
2. **Semántica:** Mantiene compatibilidad con elementos de tabla HTML nativos y diseño responsivo.
3. **Control de filtros:** Permite un flujo predecible donde el filtrado y ordenamiento ocurren de forma instantánea en memoria y sin latencia o desfases de scroll.

---

#### Plus: Paginación en Cliente vs. Paginación en Servidor

| Criterio               | Paginación en Cliente (Implementada)                           | Paginación en Servidor                                               |
| :--------------------- | :------------------------------------------------------------- | :------------------------------------------------------------------- |
| **Carga inicial**      | Mayor: requiere descargar todo el JSON en la primera petición. | Mínima: transfiere únicamente los registros de la página solicitada. |
| **Ancho de banda**     | Ineficiente si el usuario no consume el dataset completo.      | Óptimo: transfiere únicamente la carga visible.                      |
| **Interactividad**     | Instantánea para cambios de página, filtros y ordenamiento.    | Requiere una petición HTTP (latencia de red) por cada interacción.   |
| **Memoria en cliente** | Proporcional al dataset completo.                              | Constante y mínima, independiente del volumen de datos en backend.   |
| **Carga en servidor**  | Una sola consulta pesada, pero el servidor queda libre luego.  | Múltiples consultas concurrentes según la navegación del usuario.    |

#### Cuándo usar Paginación en Cliente

- Datasets acotados o medianos (menores a 1.000 – 3.000 registros).
- Aplicaciones offline-first o PWAs.
- Tableros donde los usuarios necesitan filtrado, ordenamiento y búsqueda en texto instantánea.
- APIs legacy o de terceros que no soportan paginación en backend.

#### Cuándo usar Paginación en Servidor

- Datasets masivos (> 5.000 – 10.000+ registros, como logs, transacciones, setc).
- Datos altamente concurrentes (donde los datos en el cliente quedarían desactualizados rápidamente).
- Entornos móviles o dispositivos de baja gama con memoria RAM y CPU limitadas.
- Conexiones lentas donde la descarga inicial del JSON sería un problema.

---

#### Enfoque Óptimo

En un entorno productivo con millones de registros la arquitectura ideal combinaría ambos enfoques:

1. **Backend (Keyset / Cursor Pagination):**  
   Usar consultas indexadas basadas en cursor (ej. `WHERE id > last_seen_id LIMIT N`). Esto garantiza consultas en tiempo constante $O(1)$.
2. **Frontend (Virtualización + Infinite Query):**  
   Integrar un hook de paginación infinita (como `useInfiniteQuery`) junto con **Virtual Scrolling**. A medida que el usuario hace scroll, se montan solo las filas visibles y se solicitan páginas adicionales al servidor en segundo plano antes de alcanzar el final del contenedor.

---

### 4.b: Estrategia de Polling Robusto (Generación Asíncrona de Reportes)

Además de las situaciones mencionadas en el enunciado, hay que considerar que también se debe evitar que se envíe una nueva petición sin esperar a que la anterior termine (latencia).

La solución robusta consiste en:

1. Frecuencia y Estrategia de Intervalo:

- **Intervalo inicial:** Consultas cada **2 segundos** durante los primeros intentos, ya que el reporte puede tardar pocos segundos.
- **Backoff progresivo (Opcional):** Si el reporte supera los 10 segundos en `Processing` se incrementa gradualmente el intervalo (ej. 2s $\to$ 3s $\to$ 5s) con un tope máximo de 5 segundos. Esto reduce la carga sobre el backend en jobs pesados sin degradar la percepción de respuesta del usuario.
- **`setTimeout` recursivo vs `setInterval`:** Se utiliza `setTimeout` luego de recibir la respuesta de la petición anterior en lugar de `setInterval`. Esto para garantizar que **nunca existan dos peticiones de estado solapadas** si la red presenta latencia o el servidor tarda en responder.

2. `AbortController`:
   - Cada llamada a `reportApi.getReportStatus` y `reportApi.generateReport` recibe un `AbortSignal`.
   - En la función de limpieza (`cleanup`) del `useEffect` al cerrarse el modal o se cancela la generación:
     1. Se invoca `abortController.abort()`, cancelando la petición.
     2. Se invoca `clearTimeout`, apagando cualquier temporizador pendiente.
     3. Se descartan errores provocados por cancelaciones intencionadas (`axios.isCancel`).

3. **Límite máximo de tiempo:**

- Establecer un maximo de intentos o tiempo de espera (25 intentos o 50 seg).
- Si el backend no finaliza en ese tiempo, el hook aborta de forma controlada y cambia el estado a `Timeout`, mostrando una alerta al usuario con la posibilidad de reintentar.

Consideraciones extra:

- En caso de errores el backend debe informar para evitar consultar nuevamente
- Considerar uso de eventos para la comunicación asíncrona, notificando constantemente al usuario el estado y sin obligarle a permanecer en la pestaña esperando.

#### 4. Herramientas en React para el Ciclo de Vida

- **Solución anterior:** Hook personalizado (`useReportPolling`) encapsulado con `useEffect` + `setTimeout` recursivo + `AbortController`, ideal para no sobrecargar el proyecto con dependencias externas y tener control milimétrico del flujo.

- **Alternativa:**  
  Utilizar `useQuery` aprovechando la propiedad `refetchInterval` dinámico:

  ```typescript
  const { data } = useQuery({
    queryKey: ["reportStatus", executionId],
    queryFn: ({ signal }) => reportApi.getReportStatus(executionId, { signal }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "Completed" || status === "Failed" ? false : 2000;
    },
    refetchIntervalInBackground: false,
  });
  ```
