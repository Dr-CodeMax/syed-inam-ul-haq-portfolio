# =========================================================
# FILE: app/main.py
# FULLY UPDATED + FIXED VERSION
# =========================================================

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.requests import Request
from fastapi.responses import JSONResponse

from fastapi.exceptions import RequestValidationError

from starlette.status import (
    HTTP_422_UNPROCESSABLE_ENTITY
)

# =========================================================
# ROUTES
# =========================================================

from app.routes import (
    auth_routes,
    doctor_routes,
    appointment_routes,
    availability_routes,
    socket_routes,
    payment_routes,
    payment_webhook,
    admin_routes,
    dashboard_routes,
)

# =========================================================
# DATABASE INIT
# =========================================================

from app.db.init_db import init_db


# =========================================================
# APPLICATION LIFESPAN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("\n🚀 Starting application...\n")

    try:

        init_db()

        print(
            "✅ Database initialized successfully"
        )

    except Exception as e:

        print(
            f"❌ Database init failed: {e}"
        )

    yield

    print(
        "\n🛑 Shutting down application...\n"
    )


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Doctor Appointment API",
    version="1.0.0",
    description="Backend API for Doctor Booking System",
    lifespan=lifespan,
)


# =========================================================
# CORS CONFIG
# =========================================================

origins = [

    "http://localhost:5173",

    "http://127.0.0.1:5173",

    "http://localhost:3000",

    "http://127.0.0.1:3000",
]

app.add_middleware(

    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

    expose_headers=["*"],
)


# =========================================================
# GLOBAL VALIDATION ERROR HANDLER
# =========================================================

@app.exception_handler(
    RequestValidationError
)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):

    print("\n❌ VALIDATION ERROR\n")

    print(
        "URL:",
        request.url
    )

    print(
        "METHOD:",
        request.method
    )

    print(
        "ERRORS:",
        exc.errors()
    )

    try:

        body = await request.json()

        print(
            "BODY:",
            body
        )

    except Exception:

        print(
            "BODY: Could not parse body"
        )

    return JSONResponse(

        status_code=
            HTTP_422_UNPROCESSABLE_ENTITY,

        content={

            "success": False,

            "message":
                "Validation Error",

            "detail":
                exc.errors(),
        },
    )


# =========================================================
# GLOBAL ERROR HANDLER
# =========================================================

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    print("\n❌ GLOBAL SERVER ERROR\n")

    print(
        "URL:",
        request.url
    )

    print(
        "METHOD:",
        request.method
    )

    print(
        "ERROR:",
        str(exc)
    )

    return JSONResponse(

        status_code=500,

        content={

            "success": False,

            "message":
                "Internal server error",

            "error":
                str(exc),
        },
    )


# =========================================================
# ROOT ROUTE
# =========================================================

@app.get("/")
async def root():

    return {

        "success": True,

        "message":
            "API Running 🚀",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health_check():

    return {

        "success": True,

        "status":
            "healthy",
    }


# =========================================================
# REGISTER ROUTES
# =========================================================

app.include_router(
    auth_routes.router
)

app.include_router(
    doctor_routes.router
)

app.include_router(
    appointment_routes.router
)

app.include_router(
    availability_routes.router
)

app.include_router(
    socket_routes.router
)

app.include_router(
    payment_routes.router
)

app.include_router(
    payment_webhook.router
)

app.include_router(
    admin_routes.router
)

app.include_router(
    dashboard_routes.router
)


# =========================================================
# CUSTOM OPENAPI
# =========================================================

def custom_openapi():

    if app.openapi_schema:

        return app.openapi_schema

    openapi_schema = get_openapi(

            title=
                "Doctor Appointment API",

            version=
                "1.0.0",

            description=
                "Backend API for Doctor Booking System",

            routes=
                app.routes,
        )

    openapi_schema[
        "components"
    ][
        "securitySchemes"
    ] = {

        "BearerAuth": {

            "type": "http",

            "scheme": "bearer",

            "bearerFormat": "JWT",
        }
    }

    openapi_schema[
        "security"
    ] = [
        {
            "BearerAuth": []
        }
    ]

    app.openapi_schema = openapi_schema

    return app.openapi_schema


app.openapi = custom_openapi