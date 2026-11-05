/**
 * Contenido de /primeros-pasos. El `código entre comillas invertidas` se dibuja como código en la página.
 * Al cambiar N8N_VERSION, prueba antes la guía desde cero: una prueba exige que coincida con algún sello de plantilla.
 */

export const N8N_VERSION = '2.43.5'

export const COMPOSE = `services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      - GENERIC_TIMEZONE=America/Bogota
      - TZ=America/Bogota
      - N8N_ENCRYPTION_KEY=\${N8N_ENCRYPTION_KEY:?Falta N8N_ENCRYPTION_KEY en el archivo .env}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
`

export interface Enlace {
  texto: string
  /** Ruta interna del sitio («/plantillas») o URL externa */
  a: string
}

export interface Paso {
  id: string
  titulo: string
  texto: string[]
  bloques?: { etiqueta?: string; codigo: string }[]
  /** Advertencia que no se puede pasar por alto */
  aviso?: string
  enlaces?: Enlace[]
  verificar: string
}

export interface Tropiezo {
  id: string
  titulo: string
  sintoma: string
  causa: string
  queHacer: string
  enlaces?: Enlace[]
}

export const DOCKER_URL = 'https://docs.docker.com/get-started/get-docker/'

export const pasosDesdeCero: Paso[] = [
  {
    id: 'carpeta',
    titulo: 'Crea una carpeta para n8n',
    texto: ['Abre una terminal y entra a una carpeta nueva. Todos los comandos siguientes se ejecutan desde ahí.'],
    bloques: [{ codigo: 'mkdir n8n-local\ncd n8n-local' }],
    verificar: 'La terminal está dentro de `n8n-local`, y la carpeta está vacía.',
  },
  {
    id: 'compose',
    titulo: 'Crea el archivo docker-compose.yml',
    texto: [
      'Crea en esa carpeta un archivo llamado exactamente `docker-compose.yml` y pega esto:',
      `**Versión fija.** Las plantillas con sello se probaron en una versión concreta, y una plantilla probada en una versión no está probada en todas. Con \`latest\`, la versión puede cambiar sin que te enteres la próxima vez que bajes la imagen.`,
      '**Zona horaria.** Cambia `America/Bogota` por la tuya en las dos líneas. Sin `GENERIC_TIMEZONE`, n8n usa `America/New_York`, y un Schedule Trigger de las 8:00 dispara a las 8:00 de Nueva York.',
      '**Volumen.** `n8n_data` guarda tus flujos, credenciales y cuenta fuera del contenedor. Sin él, se pierden al recrearlo.',
      '**Puerto.** `127.0.0.1` hace que n8n solo responda en tu equipo.',
    ],
    bloques: [{ etiqueta: 'docker-compose.yml', codigo: COMPOSE }],
    enlaces: [{ texto: 'Lista de zonas horarias', a: 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones' }],
    verificar: 'La carpeta tiene un archivo `docker-compose.yml`. Si lo creaste en el Bloc de notas, revisa que no se llame `docker-compose.yml.txt`.',
  },
  {
    id: 'clave',
    titulo: 'Crea la clave de cifrado',
    texto: [
      'n8n cifra con esta clave las credenciales que guardas. Este comando la genera y la deja en un archivo `.env`, junto al compose. Usa el de tu sistema:',
    ],
    bloques: [
      { etiqueta: 'Mac o Linux', codigo: 'echo "N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)" > .env' },
      {
        etiqueta: 'Windows (PowerShell)',
        codigo:
          "$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); \"N8N_ENCRYPTION_KEY=\" + (($b | ForEach-Object { $_.ToString('x2') }) -join '') | Set-Content -Encoding ascii .env",
      },
      { etiqueta: 'Comprobar', codigo: 'docker compose config --quiet' },
    ],
    aviso:
      'Si pierdes esta clave, las credenciales guardadas no se recuperan: tendrás que crearlas todas de nuevo. Guarda una copia en tu gestor de contraseñas. El archivo `.env` nunca se sube a un repositorio: si esta carpeta está en uno, agrega `.env` a tu `.gitignore` antes del primer commit.',
    verificar: 'La comprobación no muestra nada: ni mensajes ni errores. Si dice que falta la clave, mira el tropiezo «Falta la clave».',
  },
  {
    id: 'levantar',
    titulo: 'Levanta n8n',
    texto: ['La primera vez descarga la imagen, así que puede tardar unos minutos.'],
    bloques: [{ codigo: 'docker compose up -d\ndocker compose ps' }],
    enlaces: [{ texto: 'Abrir n8n', a: 'http://localhost:5678' }],
    verificar: 'En `docker compose ps`, el estado de n8n empieza por `Up`, no por `Restarting`. Al abrir `http://localhost:5678` aparece un formulario para crear la cuenta de propietario.',
  },
  {
    id: 'cuenta',
    titulo: 'Crea tu cuenta de propietario',
    texto: ['Es una cuenta local de esta instalación, no una cuenta en n8n.io. Guarda la contraseña: la necesitas cada vez que entres.'],
    verificar: 'Entraste a n8n y ves el panel de flujos.',
  },
  {
    id: 'comprobar-volumen',
    titulo: 'Comprueba que el volumen funciona',
    texto: [
      'Este paso es el que más caro sale saltarse: si el volumen está mal, no lo descubres hasta que pierdes tus flujos.',
      'Crea un flujo cualquiera, ponle de nombre «Prueba del volumen» y guárdalo. Después baja el contenedor y vuelve a levantarlo:',
    ],
    bloques: [{ codigo: 'docker compose down\ndocker compose up -d' }],
    aviso: 'No uses `docker compose down -v` para reiniciar: la `-v` borra el volumen, con todos tus flujos y credenciales.',
    verificar: 'Recargas `http://localhost:5678`, entras, y «Prueba del volumen» sigue ahí. Si no sigue, el volumen está mal: revisa que el compose esté igual al del paso 2 antes de crear nada más.',
  },
  {
    id: 'comprobar-hora',
    titulo: 'Comprueba la zona horaria',
    texto: ['Crea un flujo con un nodo Manual Trigger y un nodo Code con este código, y pulsa «Execute workflow»:'],
    bloques: [{ etiqueta: 'Nodo Code', codigo: "return [{ json: { ahora: $now.toFormat('yyyy-MM-dd HH:mm'), zona: $now.zoneName } }]" }],
    verificar: 'La salida muestra tu hora y tu zona. Si sale `America/New_York`, mira el tropiezo «La hora está equivocada». Listo: ya puedes importar una plantilla.',
  },
]

export const pasosImportar: Paso[] = [
  {
    id: 'copiar',
    titulo: 'Copia la plantilla',
    texto: ['Abre la plantilla que quieres usar y pulsa «Copiar flujo».'],
    enlaces: [{ texto: 'Ver las plantillas', a: '/plantillas' }],
    verificar: 'El botón cambia a «¡Copiado!».',
  },
  {
    id: 'pegar',
    titulo: 'Pégala en n8n',
    texto: ['En n8n, crea un flujo nuevo, haz clic en el lienzo vacío y pega con `Ctrl + V` (`Cmd + V` en Mac).'],
    verificar: 'Aparecen los nodos ya conectados, con una nota que explica qué configurar antes de activarla.',
  },
  {
    id: 'credenciales',
    titulo: 'Conecta tus credenciales',
    texto: [
      'Las plantillas no traen credenciales. Abre cada nodo que marque un aviso y elige o crea la tuya. Los datos que faltan, como la URL de una hoja, están en los pasos de la ficha de la plantilla.',
    ],
    verificar: 'Ningún nodo muestra un aviso de credenciales.',
  },
  {
    id: 'probar',
    titulo: 'Pruébala con datos ficticios',
    texto: [
      'Pulsa «Execute workflow» con datos de prueba, nunca con datos reales la primera vez. La ficha dice en qué versión de n8n se probó: si la tuya es otra, la plantilla puede necesitar ajustes.',
    ],
    verificar: 'Los nodos terminan en verde y el resultado llega donde debe. Si algo falla, busca el mensaje en «Esto me pasó», más abajo.',
  },
]

export const noLevanta: Tropiezo[] = [
  {
    id: 'docker-apagado',
    titulo: 'Docker no está abierto',
    sintoma: '`failed to connect to the docker API`, o un mensaje parecido, en cualquier comando de `docker compose`.',
    causa: 'El comando `docker` está instalado, pero el motor de Docker no está corriendo.',
    queHacer: 'Abre Docker Desktop, espera a que diga que está listo y repite el comando.',
  },
  {
    id: 'falta-clave',
    titulo: 'Falta la clave',
    sintoma: '`required variable N8N_ENCRYPTION_KEY is missing a value`.',
    causa: 'No existe el archivo `.env`, no está junto al `docker-compose.yml`, o no tiene esa línea.',
    queHacer: 'Revisa que estés en la carpeta correcta y repite el paso 3. Si n8n ya tenía credenciales guardadas, usa la clave de tu copia, no una nueva.',
  },
  {
    id: 'puerto-ocupado',
    titulo: 'El puerto está ocupado',
    sintoma: '`port is already allocated` u `only one usage of each socket address` al levantar.',
    causa: 'Otro programa, u otro n8n, ya usa el puerto 5678 de tu equipo.',
    queHacer:
      'En `docker-compose.yml`, cambia solo el primer número: `"127.0.0.1:5679:5678"`. Vuelve a ejecutar `docker compose up -d` y abre `http://localhost:5679`.',
  },
  {
    id: 'contenedor-se-reinicia',
    titulo: 'El contenedor se reinicia solo',
    sintoma: '`docker compose ps` muestra `Restarting`, y `http://localhost:5678` no abre.',
    causa: 'n8n arranca, falla y Docker lo vuelve a intentar. El motivo está en los registros. El más común es `Mismatching encryption keys`: el `.env` tiene una clave distinta a la que usó ese volumen.',
    queHacer:
      'Ejecuta `docker compose logs n8n --tail 50` y lee el último error. Si es el de la clave, recupera la original de tu copia y ponla en el `.env`.',
  },
]

export const estoMePaso: Tropiezo[] = [
  {
    id: 'flujos-de-error-manual',
    titulo: 'La alerta de error nunca llega',
    sintoma: 'Ejecuto con «Execute workflow» un flujo que falla, la alerta no llega y parece que el flujo de alertas está roto.',
    causa: 'n8n solo dispara el flujo de errores en ejecuciones automáticas. Una ejecución con «Execute workflow» no cuenta.',
    queHacer: 'Publica el flujo vigilado y espera a que falle en una ejecución automática, o usa el flujo de prueba de la plantilla de alertas.',
    enlaces: [{ texto: 'Plantilla de alertas de errores', a: '/plantillas/alertas-de-errores-n8n' }],
  },
  {
    id: 'credenciales-google-7-dias',
    titulo: 'Las credenciales de Google dejan de funcionar a los 7 días',
    sintoma: 'Gmail, Sheets o Drive funcionaban, y una semana después piden volver a conectar la cuenta.',
    causa: 'La app OAuth de Google Cloud está en modo de prueba («Testing»), y en ese modo los permisos caducan a los 7 días.',
    queHacer: 'En Google Cloud Console, pasa la app a producción y vuelve a conectar la credencial en n8n. Al autorizar, Google puede avisar de que la app no está verificada; es tu propia app.',
    enlaces: [{ texto: 'Google: caducidad de los tokens', a: 'https://developers.google.com/identity/protocols/oauth2' }],
  },
  {
    id: 'slack-not-in-channel',
    titulo: 'Slack responde not_in_channel',
    sintoma: 'El nodo de Slack falla con `not_in_channel`, aunque la credencial está bien.',
    causa: 'El bot existe, pero nadie lo ha invitado a ese canal.',
    queHacer: 'Entra al canal en Slack y escribe `/invite @tu-bot`. Repítelo en cada canal que use el flujo.',
  },
  {
    id: 'sheets-xlsx',
    titulo: 'Google Sheets rechaza el archivo',
    sintoma: '`This operation is not supported for this document. The document must not be an Office file`.',
    causa: 'La hoja es un archivo `.xlsx` subido a Drive, no una hoja nativa de Google.',
    queHacer: 'Ábrela, usa Archivo → Guardar como hoja de cálculo de Google y pega en el nodo la URL de la copia.',
  },
  {
    id: 'sheets-sin-encabezados',
    titulo: 'n8n no encuentra las columnas de la hoja',
    sintoma: '`No columns found`, o `At least one value has to be added under \'Values to Send\'`.',
    causa: 'La pestaña no tiene en la primera fila los encabezados que espera la plantilla.',
    queHacer: 'Escribe los encabezados exactos de los requisitos de la plantilla en la primera fila y pulsa Retry en el mapeo de columnas.',
  },
  {
    id: 'formulario-url-de-prueba',
    titulo: 'El formulario deja de funcionar',
    sintoma: 'El formulario abre con la URL de prueba, pero no con la que compartí, o deja de responder.',
    causa: 'La «Test URL» solo escucha mientras el editor espera una prueba.',
    queHacer: 'Publica el flujo y comparte la «Production URL».',
  },
  {
    id: 'gmail-execute-un-correo',
    titulo: 'Solo llega un correo',
    sintoma: 'Con «Execute workflow» solo llega un correo, aunque varios tienen la etiqueta.',
    causa: 'En una ejecución manual, el trigger de Gmail trae solo el correo más reciente, como muestra.',
    queHacer: 'Para probar varios, publica el flujo y envía los correos después de activarlo. Despublícalo al terminar.',
  },
  {
    id: 'gmail-correo-a-mi-mismo',
    titulo: 'El flujo no detecta mi correo de prueba',
    sintoma: 'Me envié un correo de prueba y el flujo no lo toma.',
    causa: 'Cuando te envías un correo a ti mismo, el filtro de Gmail a veces no aplica la etiqueta.',
    queHacer: 'Ponle la etiqueta a mano y vuelve a ejecutar.',
  },
  {
    id: 'gemini-modelo-no-disponible',
    titulo: 'Gemini dice que el modelo no está disponible',
    sintoma: 'El nodo de IA falla porque el modelo no está disponible, aunque antes funcionaba o aparece en la documentación.',
    causa: 'Google retira modelos con frecuencia.',
    queHacer: 'Usa un alias «latest», como «Gemini Flash-Lite Latest», o elige otro modelo de la lista del nodo.',
  },
  {
    id: 'hora-equivocada',
    titulo: 'La hora está equivocada',
    sintoma: 'Un flujo programado dispara a otra hora, o una reunión aparece a otra hora.',
    causa: 'n8n usa `America/New_York` si no le indicas otra zona, y cada flujo puede tener la suya.',
    queHacer: 'Revisa `GENERIC_TIMEZONE` en el compose y vuelve a ejecutar `docker compose up -d`. Después revisa ⋯ → Settings → Timezone en el flujo.',
  },
]
