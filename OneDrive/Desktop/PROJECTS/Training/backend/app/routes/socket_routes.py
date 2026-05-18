from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
)

from app.core.socket_manager import (
    manager,
)

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
):

    print(
        "\n🔌 Incoming WebSocket connection..."
    )

    await manager.connect(
        websocket
    )

    try:

        while True:

            # =============================================
            # KEEP CONNECTION ALIVE
            # =============================================
            data = await websocket.receive_text()

            print(
                "\n"
                "=====================================\n"
                f"📨 Client Message Received\n"
                f"📦 Data: {data}\n"
                "=====================================\n"
            )

    except WebSocketDisconnect:

        print(
            "\n❌ Client disconnected"
        )

        manager.disconnect(
            websocket
        )

    except Exception as e:

        print(
            "\n"
            "=====================================\n"
            "❌ WebSocket Runtime Error\n"
            f"📦 Error: {e}\n"
            "=====================================\n"
        )

        manager.disconnect(
            websocket
        )