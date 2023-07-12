from werk24 import Hook, W24TechreadClient, W24AskVariantMeasures

async def read_measures_from_drawing(document_bytes:bytes) -> None:

    # define what you want to learn about the drawing, and what function
    # should be called when a response arrives
    hooks = [Hook(ask=W24AskVariantMeasures(), function=print)]

    # make the call
    client = W24TechreadClient.make_from_env()
    async with client as session:
        await session.read_drawing_with_hooks(document_bytes,hooks)


read_measures_from_drawing('/')