# Proyecto de Notas con React, TypeScript y Vite

Este proyecto es una aplicación de notas construida con React, TypeScript y Vite. Incluye autenticación y manejo de notas.

## Requisitos

- Node.js >= 18.0.0
- pnpm >= 7.0.0

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/alonso10/notes-app-frontend.git
    cd notes-app-frontend
    ```

2. Instala las dependencias:
    ```sh
    pnpm install
    ```

3. Crea un archivo  en la raíz del proyecto y configura las variables de entorno necesarias:
    ```env
    API_URL=http://localhost:3000
    ```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `pnpm dev`

Ejecuta la aplicación en modo de desarrollo. Abre [http://localhost:5173](http://localhost:5173) para verla en el navegador.

### `pnpm build`

Construye la aplicación para producción en la carpeta `dist`.

### `pnpm preview`

Sirve la aplicación construida para producción localmente.

## Estructura del Proyecto

```plaintext
.env
.gitignore
.prettierrc.json
eslint.config.js
index.html
package.json
pnpm-lock.yaml
public/
README.md
src/
    App.tsx
    assets/
    components/
        modal/
            ConfirmDeleteNote.tsx
    context/
        AuthContext.tsx
        NotesContext.tsx
    index.css
    layouts/
        AuthLayout.tsx
        MainLayout.tsx
    main.tsx
    pages/
        Dashboard.tsx
        Login.tsx
        NotesForm.tsx
        Register.tsx
    types/
        index.ts
    vite-env.d.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## Configuración de ESLint

Para expandir la configuración de ESLint y habilitar reglas conscientes de tipos, actualiza el archivo eslint.config.js:

```javascript
import tseslint from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
