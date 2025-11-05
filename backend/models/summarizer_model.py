import os
from transformers import pipeline
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "facebook/bart-large-cnn"

summarizer = pipeline(
    "summarization",
    model = MODEL_ID,
    token = HF_TOKEN
)

def split_text_into_chunks(text, chunk_size=3000, overlap=500):
    """Split text into overlapping chunks"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        
        # Move start position with overlap
        start = end - overlap
        if start >= len(text):
            break
    
    return chunks

def summarize_chunks_parallel(chunks, max_length, min_length):
    """Summarize multiple chunks in parallel"""
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = []
        for chunk in chunks:
            future = executor.submit(summarize_with_bart, chunk, max_length, min_length)
            futures.append(future)
        
        summaries = []
        for future in futures:
            summary = future.result()
            if summary:
                summaries.append(summary)
    
    return summaries

def summarize_with_bart(text, max_length, min_length):
    """Summarize using BART model"""
    try:
        summary = summarizer(
            text,
            max_length=max_length,
            min_length=min_length,
            truncation=True
        )
        return summary[0]["summary_text"]
    except Exception as e:
        error_msg = f"BART Summarization Failed: {e}"
        print(error_msg)

        if "CUDA" in str(e) or "GPU" in str(e):
            return f"GPU/CUDA error during summarization: {e}"
        elif "memory" in str(e).lower():
            return f"Insufficient memory for summarization: {e}"
        elif "token" in str(e).lower():
            return f"Token limit exceeded during summarization: {e}"
        else:
            return f"Summarization model error: {e}"

def summarize_text(text, max_length, min_length):
    if not text or not text.strip():
        return "No text provided for summarization"
    
    try:
        # For short texts, use direct summarization
        if len(text) <= 3500:
            result = summarize_with_bart(text, max_length, min_length)
            if result is None:
                return "Failed to generate summary - model error occurred"
            return result
        
        # For long texts, use chunking
        chunks = split_text_into_chunks(text)
        print(f"Split into {len(chunks)} chunks")
        
        # Summarize chunks in parallel
        chunk_summaries = summarize_chunks_parallel(chunks, max_length, min_length)
        
        if not chunk_summaries:
            return "Failed to summarize chunks - all chunk processing failed"
        
        # Combine and summarize again
        combined_summaries = " ".join(chunk_summaries)
        print(f"Combined summaries length: {len(combined_summaries)} chars")
        
        final_summary = summarize_with_bart(combined_summaries, max_length, min_length)
        if final_summary is None:
            return "Failed to generate final summary from combined chunks"
        return final_summary
        
    except Exception as e:
        error_msg = f"Unexpected error during summarization: {e}"
        print(error_msg)
        return error_msg