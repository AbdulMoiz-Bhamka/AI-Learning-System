# BackEnd/qdrant_client_setup.py

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

# Connect to Qdrant running in Docker
qdrant_client = QdrantClient(url="http://localhost:6333")

def ensure_collection_exists(collection_name: str, vector_size: int = 384):
    """
    Ensure a collection exists in Qdrant. If not, create it.
    Default vector size is 384 (for all-MiniLM-L6-v2 model).
    """
    try:
        collections = qdrant_client.get_collections().collections
        exists = any(c.name == collection_name for c in collections)
        
        if not exists:
            qdrant_client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
            )
            print(f"Collection '{collection_name}' created successfully.")
        else:
            print(f"Collection '{collection_name}' already exists.")
    except Exception as e:
        print(f"Error checking/creating collection '{collection_name}': {e}")
        raise e
