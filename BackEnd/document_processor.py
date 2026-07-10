# BackEnd/document_processor.py

import io
import uuid
import PyPDF2
from sentence_transformers import SentenceTransformer
from qdrant_client.models import PointStruct
from qdrant_client_setup import qdrant_client, ensure_collection_exists

# Load the local embedding model
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print("Failed to load SentenceTransformer model. Ensure you have run: pip install sentence-transformers")
    model = None

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts all text from a PDF file."""
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def chunk_text(text: str) -> list[str]:
    """Splits text into chunks based on double newlines (paragraphs)."""
    # Split by double newline and filter out empty strings
    raw_chunks = text.split("\n\n")
    chunks = [chunk.strip() for chunk in raw_chunks if chunk.strip()]
    
    # Further processing could happen here (e.g., breaking down very large paragraphs)
    return chunks

async def process_and_store_document(file_bytes: bytes, filename: str, course_name: str, file_type: str = "pdf"):
    """
    Orchestrates extraction, chunking, embedding, and storage to Qdrant.
    The Qdrant collection name will be the course_name (spaces replaced by underscores).
    """
    if model is None:
        raise Exception("Embedding model is not loaded.")
        
    collection_name = course_name.replace(" ", "_").strip()
    ensure_collection_exists(collection_name)
    
    # 1. Extract text
    if file_type.lower() == "pdf":
        text = extract_text_from_pdf(file_bytes)
    else:
        # Assume plain text if not PDF
        text = file_bytes.decode("utf-8")
        
    # 2. Chunk text
    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("No text could be extracted or chunked from the document.")

    # 3. Generate embeddings & Upsert
    points = []
    
    # We can batch embed for efficiency if the document is huge, but doing it in a simple loop here
    # A single batch call to model.encode is faster
    embeddings = model.encode(chunks, convert_to_tensor=False)
    
    for i, chunk in enumerate(chunks):
        point_id = str(uuid.uuid4())
        point = PointStruct(
            id=point_id,
            vector=embeddings[i].tolist(),
            payload={
                "text": chunk,
                "filename": filename,
                "course": course_name,
                "chunk_index": i
            }
        )
        points.append(point)
        
    # Upsert to Qdrant in batches of 100 to avoid request size limits
    batch_size = 100
    for i in range(0, len(points), batch_size):
        qdrant_client.upsert(
            collection_name=collection_name,
            points=points[i:i+batch_size]
        )
        
    return {"message": f"Successfully processed '{filename}'. Stored {len(chunks)} chunks in collection '{collection_name}'."}
