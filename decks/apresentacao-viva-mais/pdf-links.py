import sys

from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Link

vector_path, image_path = sys.argv[1], sys.argv[2]
vector = PdfReader(vector_path)
writer = PdfWriter(clone_from=image_path)

count = 0
for n, (src, dst) in enumerate(zip(vector.pages, writer.pages)):
    sx = float(dst.mediabox.width) / float(src.mediabox.width)
    sy = float(dst.mediabox.height) / float(src.mediabox.height)
    for ref in src.get("/Annots") or []:
        annot = ref.get_object()
        uri = annot.get("/A", {}).get("/URI")
        if annot.get("/Subtype") != "/Link" or not uri:
            continue
        x1, y1, x2, y2 = (float(v) for v in annot["/Rect"])
        link = Link(rect=(x1 * sx, y1 * sy, x2 * sx, y2 * sy), url=str(uri))
        writer.add_annotation(page_number=n, annotation=link)
        count += 1

writer.write(image_path)
print(f"{count} links")
