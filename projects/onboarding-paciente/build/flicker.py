import sys
import numpy as np
from collections import Counter

W, H, FPS = 54, 96, 30
path = sys.argv[1]
a = np.fromfile(path, dtype=np.uint8).reshape(-1, H, W).astype(np.float32)
n = len(a)
gx, gy = 6, 8
tw, th = W // gx, H // gy
t = a[:, : gy * th, : gx * tw].reshape(n, gy, th, gx, tw).mean(axis=(2, 4))

# A blink: a region swings away and comes back to where it started within 8 frames.
hits = []
for y in range(gy):
    for x in range(gx):
        s = t[:, y, x]
        i = 0
        while i < n - 10:
            for k in range(2, 9):
                j = i + k
                mid = np.abs(s[i + 1 : j] - s[i]).max()
                if mid > 18 and abs(s[j] - s[i]) < 0.25 * mid:
                    hits.append((i / FPS, k, x, y, float(mid)))
                    i = j
                    break
            else:
                i += 1

full = 0
for i in range(1, n - 1):
    p = np.abs(a[i - 1] - a[i]).mean()
    q = np.abs(a[i] - a[i + 1]).mean()
    r = np.abs(a[i - 1] - a[i + 1]).mean()
    if p > 4 and q > 4 and r < 0.5 * min(p, q):
        full += 1

print(f"frames {n}  region blinks {len(hits)}  full-frame flashes {full}")
per = Counter(int(h[0]) for h in hits)
print("worst seconds:", sorted(per.items(), key=lambda kv: -kv[1])[:12])
