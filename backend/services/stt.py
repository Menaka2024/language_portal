import speech_recognition as sr
import io

def extract_text_from_audio(file_bytes: bytes) -> str:
    recognizer = sr.Recognizer()
    audio_file  = io.BytesIO(file_bytes)
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return ""
    except sr.RequestError as e:
        raise RuntimeError(f"STT error: {e}")