"""Draw a restrained three-part signal orbit for the shared site background."""

from math import cos, pi, sin
from pathlib import Path


SAMPLES = 2400
ELEMENTS = 14
CENTER = 400
STEPS = ((-38, "pine"), (-4, "iris"), (29, "rose"))


def orbit(steering: float, scale: float = 1.0) -> str:
    angle = steering * pi / 180
    points = []
    for index in range(SAMPLES + 1):
        theta = -pi + 2 * pi * index / SAMPLES
        phase = pi * (sin(theta) - sin(angle))
        denominator = ELEMENTS * sin(phase / 2)
        amplitude = (
            1.0
            if abs(denominator) < 1e-10
            else abs(sin(ELEMENTS * phase / 2) / denominator)
        )
        radius = 70 + 285 * min(amplitude, 1.0) ** 0.55 * scale
        # A small rotation gives the composition an oblique, less diagrammatic axis.
        direction = theta - 0.24
        points.append(
            f"{CENTER + radius * cos(direction):.2f},"
            f"{CENTER + radius * sin(direction):.2f}"
        )
    return "M" + " L".join(points) + " Z"


def main() -> None:
    paths = []
    for steering, color in STEPS:
        for scale, width, opacity in ((1.0, 1.25, 0.56), (0.92, 0.7, 0.17), (0.83, 0.65, 0.12)):
            paths.append(
                f'<path d="{orbit(steering, scale)}" '
                f'stroke="var(--orbit-{color})" stroke-width="{width}" '
                f'opacity="{opacity}"/>'
            )
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" '
        'fill="none" aria-hidden="true" focusable="false">\n'
        '<g stroke-linecap="round" stroke-linejoin="round">\n'
        + "\n".join(paths)
        + '\n</g>\n</svg>\n'
    )
    output = Path(__file__).resolve().parents[1] / "layouts/partials/orbit.html"
    output.write_text(svg)


if __name__ == "__main__":
    main()
