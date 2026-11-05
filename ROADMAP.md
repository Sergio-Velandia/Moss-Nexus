# Hoja de ruta

Pendientes de Moss Nexus. Lo hecho se registra en el [CHANGELOG](./CHANGELOG.md). La librería ya no crece por fases: se actualiza con plantillas sueltas, correcciones y nuevos sellos «Probado».

## Corregir

- **Estado del proyecto: estable, no «mantenimiento».** El CHANGELOG de la v1.0.0 («El proyecto pasa a mantenimiento») y el `CLAUDE.md` («Desde aquí el proyecto está en mantenimiento») usan un estado que no corresponde. Según los estados del ECOSISTEMA, Nexus es **estable**: una versión completa que sigue creciendo con plantillas. «En mantenimiento» significa solo correcciones. Cambiar la línea del `CLAUDE.md` y aclararlo en la próxima entrada del CHANGELOG (la de la v1.0.0 no se reescribe).

- **Mismo nombre para el botón de n8n.** `alertas-de-errores-n8n` dice «Execute» y las demás, «Execute workflow». En n8n 2.43.5, el botón dice «Execute workflow» con un Manual Trigger y solo «Execute» con otros disparadores, así que ninguna está mal del todo. Al unificarlas, usar la misma forma que el tropiezo `flujos-de-error-manual` de Primeros pasos («Execute workflow» o «Execute»): si la plantilla dice una cosa y el tropiezo enlazado dice otra, quien llegue por el enlace dudará de si está en el sitio correcto.

## Plantillas

- Probar en una instancia real las 4 que siguen «Sin probar»: **aprobacion-de-gastos**, **pagos-stripe-idempotentes**, **leads-a-hubspot-sin-duplicados** y **whatsapp-a-sheets**.
- Repetir la prueba corta de **facturas-gmail-a-drive**: su flujo cambió en la v0.8.3 y el sello conserva la fecha anterior hasta entonces.
