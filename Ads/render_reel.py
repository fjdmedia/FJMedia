"""
FJMedia Reel Renderer
=====================
Records an animated HTML slide as a high-quality MP4 using
frame-by-frame screenshots + FFmpeg stitching.

Usage:
    python render_reel.py "Day 14/slide_reel.html"
    python render_reel.py "Day 14/slide_reel.html" --duration 7
    python render_reel.py "Day 14/slide_reel.html" --size 1080
    python render_reel.py "Day 14/slide_reel.html" --fps 30

Output: MP4 in the same folder as the HTML file.
"""

import sys
import os
import time
import shutil
import pathlib
import subprocess
from playwright.sync_api import sync_playwright


def find_ffmpeg():
    """Find ffmpeg — check PATH first, then common WinGet location."""
    ff = shutil.which("ffmpeg")
    if ff:
        return ff
    # WinGet install location — scan one level deep to avoid broken paths
    local = pathlib.Path(os.environ.get("LOCALAPPDATA", ""))
    winget_dir = local / "Microsoft" / "WinGet" / "Packages"
    if winget_dir.exists():
        for pkg in winget_dir.iterdir():
            if "FFmpeg" in pkg.name:
                for bindir in pkg.rglob("bin"):
                    candidate = bindir / "ffmpeg.exe"
                    if candidate.exists():
                        return str(candidate)
    return None


def render_reel(html_path: str, duration: float = 7.0, size: int = 1080, fps: int = 30):
    html_file = pathlib.Path(html_path).resolve()
    if not html_file.exists():
        print(f"File not found: {html_file}")
        sys.exit(1)

    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("FFmpeg not found. Install with: winget install --id Gyan.FFmpeg")
        sys.exit(1)

    output_dir = html_file.parent
    output_name = html_file.stem
    frames_dir = output_dir / "_frames"
    frames_dir.mkdir(exist_ok=True)

    total_frames = int(duration * fps)
    frame_interval = 1000.0 / fps  # ms between frames

    print(f"Recording: {html_file.name}")
    print(f"Duration:  {duration}s @ {fps}fps = {total_frames} frames")
    print(f"Size:      {size}x{size}")
    print(f"FFmpeg:    {ffmpeg}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": size, "height": size},
            device_scale_factor=1,
        )
        page = context.new_page()

        # Load and let fonts settle
        page.goto(html_file.as_uri())
        page.wait_for_load_state("networkidle")
        time.sleep(0.3)

        # Reload to capture animations from the start
        page.reload()
        page.wait_for_load_state("networkidle")

        # Capture frames
        print(f"Capturing {total_frames} frames...")
        for i in range(total_frames):
            frame_path = frames_dir / f"frame_{i:05d}.png"
            page.screenshot(path=str(frame_path), type="png")

            # Advance time by one frame interval
            page.evaluate(f"() => new Promise(r => setTimeout(r, {frame_interval}))")

            # Progress
            if (i + 1) % fps == 0 or i == total_frames - 1:
                print(f"  {i + 1}/{total_frames} frames", end="\r")

        context.close()
        browser.close()

    print(f"\n  Captured {total_frames} frames")

    # Stitch with FFmpeg — high quality
    mp4_path = output_dir / f"{output_name}.mp4"
    input_args = ["-framerate", str(fps), "-i", str(frames_dir / "frame_%05d.png")]
    encode_args = [
        "-c:v", "libx264",
        "-b:v", "5000k",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
    ]

    # Pass 1 — analysis
    print("Encoding MP4 (pass 1/2)...")
    pass1 = [ffmpeg, "-y"] + input_args + encode_args + [
        "-pass", "1", "-f", "null",
        "NUL" if os.name == "nt" else "/dev/null",
    ]
    r1 = subprocess.run(pass1, capture_output=True, text=True, cwd=str(output_dir))
    if r1.returncode != 0:
        print(f"Pass 1 error:\n{r1.stderr[-500:]}")
        sys.exit(1)

    # Pass 2 — encode
    print("Encoding MP4 (pass 2/2)...")
    pass2 = [ffmpeg, "-y"] + input_args + encode_args + [
        "-pass", "2", str(mp4_path),
    ]
    r2 = subprocess.run(pass2, capture_output=True, text=True, cwd=str(output_dir))
    if r2.returncode != 0:
        print(f"Pass 2 error:\n{r2.stderr[-500:]}")
        sys.exit(1)

    # Clean up 2-pass log files
    for f in output_dir.glob("ffmpeg2pass-*"):
        f.unlink(missing_ok=True)

    # Clean up frames
    shutil.rmtree(frames_dir, ignore_errors=True)

    # Also clean up old WebM if it exists
    webm_path = output_dir / f"{output_name}.webm"
    if webm_path.exists():
        webm_path.unlink()

    file_size = mp4_path.stat().st_size
    size_str = f"{file_size / 1024:.0f}KB" if file_size < 1024 * 1024 else f"{file_size / (1024 * 1024):.1f}MB"

    print(f"\nDone: {mp4_path}")
    print(f"Size: {size_str}")

    return mp4_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python render_reel.py <path-to-animated-html> [--duration N] [--size N] [--fps N]")
        sys.exit(1)

    html = sys.argv[1]
    duration = 7.0
    size = 1080
    fps = 30

    args = sys.argv[2:]
    for i, arg in enumerate(args):
        if arg == "--duration" and i + 1 < len(args):
            duration = float(args[i + 1])
        if arg == "--size" and i + 1 < len(args):
            size = int(args[i + 1])
        if arg == "--fps" and i + 1 < len(args):
            fps = int(args[i + 1])

    render_reel(html, duration, size, fps)
