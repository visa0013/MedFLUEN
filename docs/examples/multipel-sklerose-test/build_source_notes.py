"""Build the explicitly labelled, four-page source compilation for the MS fixture."""
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak


HERE = Path(__file__).resolve().parent
OUTPUT = HERE / "multipel-sklerose-kildenoter.pdf"
INK = colors.HexColor("#173136")
TEAL = colors.HexColor("#087C69")
MUTED = colors.HexColor("#587077")

STYLES = {
    "kicker": ParagraphStyle("kicker", fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=TEAL, spaceAfter=18),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=24, leading=29, textColor=INK, spaceAfter=18),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=16, textColor=INK, spaceAfter=12),
    "label": ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=8, leading=12, textColor=MUTED, spaceBefore=10, spaceAfter=7),
    "source": ParagraphStyle("source", fontName="Helvetica", fontSize=8, leading=12, textColor=MUTED, alignment=TA_LEFT, spaceAfter=9, splitLongWords=True),
}

PAGES = [
    (
        "Epidemiologi\nog risiko",
        [
            "MS begynder oftest i 20-40-årsalderen og rammer hyppigere kvinder.",
            "Tidligere Epstein-Barr-virusinfektion, rygning og en nær slægtning med MS er forbundet med øget risiko. En risikofaktor er ikke en sikker forudsigelse for den enkelte.",
        ],
        [("NIH / MedlinePlus - Multiple Sclerosis", "https://medlineplus.gov/multiplesclerosis.html", "What causes multiple sclerosis? Opdateret 17. september 2026.")],
    ),
    (
        "Mekanisme\nog forløb",
        [
            "MS rammer centralnervesystemet: hjernen og rygmarven. Immunsystemets angreb på myelin, nervefibrenes beskyttende skede, kan forsinke eller blokere signaloverførsel.",
            "Attakvis MS (RRMS) veksler mellem attakker og bedring. Sekundær progressiv MS følger et tidligere attakvist forløb med gradvis forværring. Primær progressiv MS (PPMS) forværres gradvist fra begyndelsen uden tydelige attakker.",
        ],
        [
            ("NIH / NCCIH - Multiple Sclerosis", "https://www.nccih.nih.gov/health/multiple-sclerosis", "Indledning om mekanisme. November 2019; gamle prævalenstal anvendes ikke."),
            ("MedlinePlus Medical Encyclopedia - Multiple sclerosis", "https://medlineplus.gov/ency/article/000737.htm", "Causes; Exams and Tests. Lægefagligt revideret 27. januar 2026."),
        ],
    ),
    (
        "Fra symptomer\ntil diagnose",
        [
            "Typiske symptombilleder er smertefuld synsnedsættelse på ét øje, dobbeltsyn og opadstigende føleforstyrrelser eller kraftnedsættelse.",
            "Diagnosen kræver samlet vurdering af sygehistorie, neurologisk undersøgelse, MR og relevante laboratoriefund samt udelukkelse af andre forklaringer. MR kan vise forandringer i hjernen og rygmarven.",
            "NICE anbefaler de reviderede McDonald-kriterier fra 2024, ikke alene kriterierne fra 2017.",
        ],
        [
            ("NICE NG220 - Recommendations", "https://www.nice.org.uk/guidance/ng220/chapter/Recommendations", "1.1.1; 1.1.6. Opdateret 3. juni 2026."),
            ("NIH / MedlinePlus - Multiple Sclerosis", "https://medlineplus.gov/multiplesclerosis.html", "How is multiple sclerosis diagnosed?"),
        ],
    ),
    (
        "Attak og\nbehandling",
        [
            "NICE definerer et attak ved nye eller forværrede symptomer over 24 timer, uden infektion eller anden årsag, efter mindst én stabil måned. Behandlingsbehovet vurderes særskilt.",
            "Langsigtet behandling kan begrænse sygdomsaktivitet, lindre symptomer og støtte daglig funktion. Sygdomsmodificerende medicin, symptomrettet medicin samt fysio- og ergoterapi har forskellige mål.",
        ],
        [
            ("NICE NG220 - Recommendations", "https://www.nice.org.uk/guidance/ng220/chapter/Recommendations", "1.7.1; 1.7.2; 1.7.6."),
            ("NIH / MedlinePlus - Multiple Sclerosis", "https://medlineplus.gov/multiplesclerosis.html", "What are the treatments for multiple sclerosis?"),
        ],
    ),
]


def footer(canvas, doc):
    canvas.saveState()
    width, _ = A5
    canvas.setStrokeColor(colors.HexColor("#C8D6D3"))
    canvas.line(34, 35, width - 34, 35)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(34, 23, "Lokale kildenoter - kontrolleret 1. oktober 2026")
    canvas.drawRightString(width - 34, 23, f"{doc.page} / 4")
    canvas.restoreState()


story = []
for index, (title, paragraphs, sources) in enumerate(PAGES, start=1):
    story.append(Paragraph(f"MEDFLUEN / MS-TESTPAKKE / {index:02}", STYLES["kicker"]))
    story.append(Paragraph(escape(title).replace("\n", "<br/>"), STYLES["title"]))
    for paragraph in paragraphs:
        story.append(Paragraph(escape(paragraph), STYLES["body"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("KILDEGRUNDLAG", STYLES["label"]))
    for label, url, locator in sources:
        story.append(Paragraph(f"<b>{escape(label)}</b><br/>{escape(locator)}<br/><link href='{url}' color='#087C69'>{url}</link>", STYLES["source"]))
    story.append(Paragraph("Lokalt forfattet sammenfatning, ikke officielle slides. Sidehenvisningerne i kortene gælder dette dokument.", STYLES["source"]))
    if index == 4:
        story.append(Paragraph("MCQ-scenariet er lokalt skrevet uden patientdata. Testpakken er ikke individuel behandlingsvejledning.", STYLES["source"]))
    if index < len(PAGES):
        story.append(PageBreak())

SimpleDocTemplate(str(OUTPUT), pagesize=A5, leftMargin=34, rightMargin=34, topMargin=34, bottomMargin=48, title="Multipel sklerose - kildenoter til testpakke", author="MedFLUEN - lokalt forfattet sammenfatning").build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
