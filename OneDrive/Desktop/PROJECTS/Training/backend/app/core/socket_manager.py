from fastapi import WebSocket

from typing import List


class ConnectionManager:

    def __init__(self):

        self.active_connections: List[
            WebSocket
        ] = []

    # =====================================================
    # CONNECT
    # =====================================================
    async def connect(
        self,
        websocket: WebSocket,
    ):

        await websocket.accept()

        self.active_connections.append(
            websocket
        )

        print(
            "\n"
            "=====================================\n"
            f"✅ WebSocket connected\n"
            f"👥 Total Connections: "
            f"{len(self.active_connections)}\n"
            "=====================================\n"
        )

    # =====================================================
    # DISCONNECT
    # =====================================================
    def disconnect(
        self,
        websocket: WebSocket,
    ):

        if websocket in self.active_connections:

            self.active_connections.remove(
                websocket
            )

        print(
            "\n"
            "=====================================\n"
            f"❌ WebSocket disconnected\n"
            f"👥 Total Connections: "
            f"{len(self.active_connections)}\n"
            "=====================================\n"
        )

    # =====================================================
    # PERSONAL MESSAGE
    # =====================================================
    async def send_personal_message(
        self,
        message: dict,
        websocket: WebSocket,
    ):

        try:

            await websocket.send_json(
                message
            )

            print(
                "📩 Personal message sent:",
                message
            )

        except Exception as e:

            print(
                "❌ Personal message error:",
                e
            )

    # =====================================================
    # GLOBAL BROADCAST
    # =====================================================
    async def broadcast(
        self,
        message: dict,
    ):

        print(
            "\n"
            "=====================================\n"
            "📡 BROADCAST EVENT\n"
            f"📦 Payload: {message}\n"
            f"👥 Active Connections: "
            f"{len(self.active_connections)}\n"
            "=====================================\n"
        )

        disconnected = []

        for connection in self.active_connections:

            try:

                await connection.send_json(
                    message
                )

                print(
                    "✅ Message delivered"
                )

            except Exception as e:

                print(
                    "❌ Broadcast delivery failed:",
                    e
                )

                disconnected.append(
                    connection
                )

        # =================================================
        # CLEAN DEAD CONNECTIONS
        # =================================================
        for connection in disconnected:

            self.disconnect(
                connection
            )


manager = ConnectionManager()