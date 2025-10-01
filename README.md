# React + TypeScript + Vite


# pgApp - Productos de Cocina

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)
![Testing](https://img.shields.io/badge/Testing-Jest%20%26%20React%20Testing%20Library-yellow)

## Descripción

`pgApp` es una aplicación web desarrollada en **React y TypeScript** para mostrar productos de cocina con las siguientes funcionalidades:

- **Búsqueda con debounce**: Filtra productos mientras escribes.
- **Paginación/cursor**: Muestra los productos en páginas de 8 elementos.
- **Favoritos persistentes**: Guarda tus productos favoritos en `localStorage`.
- **Modal**: Muestra información del producto en un modal.
- **Estado vacío y de error**: Mensajes de carga, error o sin resultados.
- **Cierre de modal con Escape**: Se puede cerrar el modal con la tecla `Escape`.

## Tecnologías

- React 18 + TypeScript
- CSS puro
- Jest + React Testing Library para pruebas unitarias
- LocalStorage para favoritos persistentes
- Mock de `fetch` para pruebas locales

## Estructura del proyecto


## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/pgApp.git
cd pgApp
npm install
npm start
npm run dev 
http://localhost:3000
npm test


Para pruebas se usa un mock de fetch que simula la respuesta de /api/item.json
Favoritos- Guardados en localStorage.
Debounce en búsqueda: 300ms para reducir renders innecesarios.
Modal Controlado con estado y useRef para restaurar focus.
Para la verfiicacion- Abrir Chrome DevTools > Lighthouse > Performance > Metrics.


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
