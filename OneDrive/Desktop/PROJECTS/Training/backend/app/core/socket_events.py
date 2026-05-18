from app.core.socket_manager import manager


async def broadcast_event(
    event_type: str,
    data: dict,
):

    await manager.broadcast(
        {
            "event": event_type,
            "data": data,
        }
    )


async def appointment_created(
    appointment: dict,
):

    await broadcast_event(
        "appointment_created",
        appointment,
    )


async def appointment_cancelled(
    appointment: dict,
):

    await broadcast_event(
        "appointment_cancelled",
        appointment,
    )


async def appointment_updated(
    appointment: dict,
):

    await broadcast_event(
        "appointment_updated",
        appointment,
    )