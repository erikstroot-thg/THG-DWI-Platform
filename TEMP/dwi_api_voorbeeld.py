"""
THG DWI Generator — API Implementatie Voorbeeld
=================================================
Dit script laat zien hoe je de DWI system prompt gebruikt
in een Claude API-call om hoogwaardige werkinstructies te genereren.

Vereisten:
  pip install anthropic

Gebruik:
  1. Zet je API-key als environment variable: export ANTHROPIC_API_KEY=sk-ant-...
  2. Pas de user_message aan met je DWI-input
  3. Run: python dwi_api_voorbeeld.py
"""

import anthropic
from pathlib import Path


# ============================================================
# STAP 1: Laad de system prompt uit het skill-bestand
# ============================================================
# In productie: laad dit bestand één keer bij het opstarten
# van je applicatie, niet bij elke request.

SKILL_FILE = Path("THG-DWI-SKILL-SYSTEM-PROMPT.md")

def load_system_prompt() -> str:
    """Laad de DWI system prompt uit het skill-bestand."""
    return SKILL_FILE.read_text(encoding="utf-8")


# ============================================================
# STAP 2: Genereer een DWI via de Claude API
# ============================================================

def genereer_dwi(
    user_input: str,
    model: str = "claude-sonnet-4-20250514",
    max_tokens: int = 16000,
) -> str:
    """
    Genereer een Digitale Werkinstructie op basis van user input.

    Args:
        user_input: De beschrijving van het proces (tekst, WhatsApp-stijl, etc.)
        model: Het Claude model. Aanbevolen:
               - "claude-sonnet-4-20250514" voor goede balans kwaliteit/kosten
               - "claude-opus-4-20250514" voor maximale kwaliteit
               - NIET haiku — te weinig kwaliteit voor DWI's
        max_tokens: Maximum output tokens. DWI's zijn 800-2000 tokens.
                    Zet op 16000 voor veilige marge.

    Returns:
        Volledig HTML-bestand als string.
    """
    client = anthropic.Anthropic()  # Pakt ANTHROPIC_API_KEY uit environment

    system_prompt = load_system_prompt()

    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system_prompt,  # <-- HIER GAAT DE SKILL IN
        messages=[
            {
                "role": "user",
                "content": user_input
            }
        ]
    )

    # De response is het volledige HTML-bestand
    return message.content[0].text


# ============================================================
# STAP 3: Variant met foto's (vision / multimodal)
# ============================================================

import base64

def genereer_dwi_met_fotos(
    tekst: str,
    foto_paden: list[str],
    model: str = "claude-sonnet-4-20250514",
    max_tokens: int = 16000,
) -> str:
    """
    Genereer een DWI met zowel tekst als foto's van machines/schermen.

    Args:
        tekst: Procesbeschrijving (kan informeel/WhatsApp-stijl zijn)
        foto_paden: Lijst met paden naar foto's (JPG/PNG)
        model: Claude model
        max_tokens: Maximum output tokens

    Returns:
        Volledig HTML-bestand als string.
    """
    client = anthropic.Anthropic()
    system_prompt = load_system_prompt()

    # Bouw de content-array op met tekst + afbeeldingen
    content = []

    # Voeg eerst de tekst toe
    content.append({
        "type": "text",
        "text": tekst
    })

    # Voeg foto's toe als base64
    for foto_pad in foto_paden:
        foto_path = Path(foto_pad)
        if foto_path.exists():
            foto_bytes = foto_path.read_bytes()
            foto_b64 = base64.standard_b64encode(foto_bytes).decode("utf-8")

            # Bepaal media type
            suffix = foto_path.suffix.lower()
            media_type = {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".webp": "image/webp",
                ".gif": "image/gif",
            }.get(suffix, "image/jpeg")

            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": foto_b64,
                }
            })

    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": content
            }
        ]
    )

    return message.content[0].text


# ============================================================
# STAP 4: Sla het resultaat op als HTML
# ============================================================

def sla_dwi_op(html_content: str, bestandsnaam: str) -> Path:
    """Sla de gegenereerde DWI op als HTML-bestand."""
    output_path = Path(bestandsnaam)
    output_path.write_text(html_content, encoding="utf-8")
    print(f"DWI opgeslagen: {output_path.absolute()}")
    return output_path


# ============================================================
# VOORBEELD: Zo gebruik je het
# ============================================================

if __name__ == "__main__":

    # --- Voorbeeld 1: Alleen tekst ---
    user_message = """
    Maak een DWI voor het wisselen van snijwieltjes op de snijlijn.

    Station: Snijlijn (station 2)
    Machine: Intermac Genius LM

    Het proces:
    - Eerst sticker controleren op het nieuwe snijwieltje (moet kloppen met glastype)
    - Dan software openen op de PC
    - Kapje van de snijkop verwijderen
    - Oud wieltje eruit halen
    - Nieuw wieltje plaatsen, let op richting!
    - Kapje weer monteren
    - Code invoeren in de software (staat op de sticker)
    - Testsnede maken op reststuk glas

    Belangrijk: verkeerd wieltje = slechte snijkwaliteit
    KPI: maximaal 5 minuten per wissel
    """

    print("DWI genereren (alleen tekst)...")
    html = genereer_dwi(user_message)
    sla_dwi_op(html, "DWI-SNI-003_Snijwieltje_Wisselen.html")

    # --- Voorbeeld 2: Tekst + foto's ---
    # (uncomment als je foto's hebt)
    #
    # html = genereer_dwi_met_fotos(
    #     tekst="Maak een DWI voor het opstarten van de wasstraat...",
    #     foto_paden=[
    #         "fotos/wasstraat_panel.jpg",
    #         "fotos/wasstraat_knoppen.jpg",
    #         "fotos/wasstraat_scherm.jpg",
    #     ]
    # )
    # sla_dwi_op(html, "DWI-WAS-001_Wasstraat_Opstarten.html")
