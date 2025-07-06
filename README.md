# IDSA - Sistema para la identificación de síntomas de consumo de sustancias adictivas

[![Angular](https://img.shields.io/badge/Angular-18.2.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue.svg)](https://www.typescriptlang.org/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-18.0.2-green.svg)](https://www.primefaces.org/primeng/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue.svg)](https://tailwindcss.com/)

## 📋 Descripción

IDSA es un panel administrativo web desarrollado en Angular que permite a tutores y administradores consultar, analizar y gestionar el historial de análisis biométricos y fisiológicos de estudiantes, facilitando la detección temprana de posibles síntomas de consumo de sustancias adictivas. El sistema aprovecha tecnologías IoT, análisis de imágenes, datos fisiológicos y modelos de predicción, integrando toda la información a través de una API central.

El panel es responsable de:

- Visualizar historiales y reportes de análisis biométricos y fisiológicos de estudiantes.
- Consultar el último análisis realizado, incluyendo imágenes, métricas fisiológicas y probabilidad de consumo.
- Gestionar usuarios: estudiantes, tutores y roles.
- Acceder a reportes y estadísticas generales.
- Navegación segura y sencilla con un diseño intuitivo y responsivo.

## 🔄 Flujo de Datos y Arquitectura

1. **Captura y Envío de Datos:**
   - Dispositivos IoT (Raspberry Pi) capturan imágenes y datos fisiológicos al ingreso del estudiante.
   - Los datos se envían vía MQTT en formato JSON a la API.
2. **Recepción y Procesamiento:**
   - La API almacena los datos y, al acumular 10 registros, los envía al modelo de predicción para análisis.
3. **Predicción y Almacenamiento:**
   - El modelo retorna la probabilidad de consumo, métricas fisiológicas y dilatación pupilar.
   - La API almacena los resultados y referencias a las imágenes.
4. **Visualización:**
   - El panel web (Angular) consulta la API para mostrar historiales y reportes a tutores y administradores.

## 🚀 Características Principales

- **Autenticación y Autorización:** Sistema JWT completo
- **Gestión de Usuarios:** CRUD para estudiantes, tutores y roles
- **Gestión Académica:** Campus, generaciones, grados, grupos y especialidades
- **Visualización de Datos Biométricos:** Reportes y análisis detallados
- **Interfaz Moderna:** UI responsiva con PrimeNG y TailwindCSS

## 🛠️ Tecnologías Utilizadas

- **Angular 18.2.0**
- **PrimeNG 18.0.2**
- **TailwindCSS 3.4.17**

## 📁 Estructura del Proyecto

```
idsa/
├── src/
│   ├── app/
│   │   ├── auth/                        # Autenticación y autorización
│   │   │   ├── components/              # Componentes de autenticación (login, recuperación, verificación, etc.)
│   │   │   ├── interceptors/            # Interceptores para manejo de tokens y errores de auth
│   │   │   ├── models/                  # Modelos de datos para autenticación
│   │   │   ├── services/                # Servicios de autenticación
│   │   │   └── auth.routes.ts           # Rutas de autenticación
│   │   ├── core/                        # Servicios y utilidades centrales
│   │   │   ├── config/                  # Configuración global (ej. PrimeNG)
│   │   │   ├── guards/                  # Guards de rutas (auth, roles)
│   │   │   ├── interceptors/            # Interceptores globales (errores, formateo)
│   │   │   ├── models/                  # Modelos base y enums globales
│   │   │   └── services/                # Servicios centrales (ej. token)
│   │   ├── feactures/                   # Módulos de funcionalidades principales
│   │   │   ├── dashboard/               # Dashboard principal
│   │   │   │   ├── components/          # Componentes del dashboard (home, etc.)
│   │   │   │   └── dashboard.routes.ts  # Rutas del dashboard
│   │   │   ├── students/                # Gestión de estudiantes
│   │   │   │   ├── components/          # Componentes de estudiantes (listas, formularios, reportes)
│   │   │   │   ├── models/              # Modelos de estudiantes
│   │   │   │   ├── services/            # Servicios de estudiantes
│   │   │   │   └── students.routes.ts   # Rutas de estudiantes
│   │   │   ├── group-configuration/     # Configuración académica (campus, grados, grupos, etc.)
│   │   │   │   ├── components/          # Componentes de configuración académica
│   │   │   │   ├── models/              # Modelos de configuración académica
│   │   │   │   ├── services/            # Servicios de configuración académica
│   │   │   │   └── group-configuration.routes.ts # Rutas de configuración académica
│   │   │   ├── tutors/                  # Gestión de tutores
│   │   │   │   ├── components/          # Componentes de tutores (listas, formularios)
│   │   │   │   ├── models/              # Modelos de tutores
│   │   │   │   ├── services/            # Servicios de tutores
│   │   │   │   └── tutors.routes.ts     # Rutas de tutores
│   │   │   ├── users/                   # Gestión de usuarios y roles
│   │   │   │   ├── components/          # Componentes de usuarios (listas, formularios)
│   │   │   │   ├── models/              # Modelos de usuarios y roles
│   │   │   │   ├── services/            # Servicios de usuarios y roles
│   │   │   │   └── users.routes.ts      # Rutas de usuarios y roles
│   │   │   ├── profile/                 # Perfil de usuario
│   │   │   │   ├── components/          # Componentes de perfil
│   │   │   │   ├── models/              # Modelos de perfil
│   │   │   │   ├── services/            # Servicios de perfil
│   │   │   │   └── profile.routes.ts    # Rutas de perfil
│   │   │   └── feactures.routes.ts      # Rutas principales de funcionalidades
│   │   ├── layout/                      # Componentes de layout (estructura general)
│   │   │   ├── footer/                  # Footer de la aplicación
│   │   │   ├── sidebar/                 # Sidebar de navegación
│   │   │   ├── topbar/                  # Barra superior
│   │   │   ├── service/                 # Servicios de layout
│   │   │   └── layout.component.ts      # Componente principal de layout
│   │   ├── shared/                      # Componentes y servicios reutilizables
│   │   │   ├── components/              # Inputs, selectores, spinner, etc.
│   │   │   ├── reports/                 # Modelos y servicios de reportes
│   │   │   └── types/                   # Tipos y utilidades compartidas
│   │   ├── utils/                       # Utilidades generales (helpers, utils)
│   │   │   ├── form.utils.ts            # Utilidades para formularios
│   │   │   └── jwt.utils.ts             # Utilidades para JWT
│   │   ├── app.component.ts             # Componente raíz
│   │   ├── app.config.ts                # Configuración principal de la app
│   │   └── app.routes.ts                # Rutas principales de la app
│   ├── assets/                          # Recursos estáticos y estilos
│   │   ├── layout/                      # Estilos y recursos de layout
│   │   └── themes/                      # Temas personalizados
│   ├── environments/                    # Configuración de ambientes (dev, prod)
│   │   ├── environment.ts               # Configuración de producción
│   │   └── environment.development.ts   # Configuración de desarrollo
│   ├── index.html                       # HTML principal
│   ├── main.ts                          # Bootstrap de la app
│   ├── styles.scss                      # Estilos globales
│   └── tailwind.css                     # Estilos de TailwindCSS
├── .editorconfig                        # Configuración de editor
├── .gitignore                           # Configuración de git
├── .prettierignore                      # Configuración de prettier
├── .prettierrc.json                     # Configuración de prettier
├── angular.json                         # Configuración Angular
├── package-lock.json                    # Dependencias y scripts
├── package.json                         # Dependencias y scripts
├── README.md                            # Este archivo
├── tailwind.config.js                   # Configuración de TailwindCSS
├── tsconfig.app.json                    # Configuración de TypeScript
├── tsconfig.json                        # Configuración de TypeScript
└── tsconfig.spec.json                   # Configuración de TypeScript para pruebas
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- Angular CLI 18+
- Acceso a la API de back-end en funcionamiento

### Instalación

```bash
git clone <url-del-repositorio>
cd idsa
npm install
```

### Ejecución en Desarrollo

```bash
ng serve
# Accede a http://localhost:4200
```

### Build para Producción

```bash
ng build
# Los archivos se generan en /dist
```

## 🌐 Ambientes y Perfiles

El proyecto utiliza una arquitectura de configuración modular con perfiles específicos:

- **Desarrollo:** Configuración por defecto, conexión a API de desarrollo. Variables en `/src/environments/environment.development.ts`.
- **Producción:** Configuración optimizada, conexión a la API productiva. Es necesario modificar la URL de la API en `/src/environments/environment.ts` para que apunte al endpoint de producción correspondiente.

Puedes modificar los endpoints y configuraciones según el entorno editando los archivos en `/src/environments/`.

## 🌐 Relación con el Back-End

La aplicación web consume la API REST [(backend-idsa)](https://github.com/Caballero-dev/backend-idsa) desarrollada en Spring Boot, que centraliza la lógica de negocio, almacenamiento y procesamiento de datos biométricos y fisiológicos. Toda la autenticación, consulta de datos y reportes se realiza a través de endpoints protegidos.

---

**IDSA** - Sistema para la identificación de síntomas de consumo de sustancias adictivas
