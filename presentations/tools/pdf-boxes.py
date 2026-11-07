import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

path, width_mm, height_mm, bleed_mm = sys.argv[1], *map(float, sys.argv[2:5])
pt = 72 / 25.4
w, h, b = (width_mm + 2 * bleed_mm) * pt, (height_mm + 2 * bleed_mm) * pt, bleed_mm * pt

reader = PdfReader(path)
writer = PdfWriter()
for page in reader.pages:
    # Chrome rounds the page up; layout starts top-left, so keep the top-left corner and trim the excess.
    top = float(page.mediabox.top)
    media = RectangleObject([0, top - h, w, top])
    page.mediabox = media
    page.cropbox = media
    page.bleedbox = media
    page.trimbox = RectangleObject([b, top - h + b, w - b, top - b])
    writer.add_page(page)
with open(path, "wb") as f:
    writer.write(f)
