"""
random_variable.py: A reusable module and CLI for drawing probability distributions.

This module generates figures that visualize probability distributions across
multiple panels. Each panel shows a LaTeX-rendered title, a probability density
function (PDF) curve, and a number line with samples overlaid as red dots.

Usage:
    python scripts/figures/random_variable.py                          # Default to content/images/continuous-rv-pdfs.svg
    python scripts/figures/random_variable.py --no-pdf                  # Omit PDF curves
    python scripts/figures/random_variable.py -o custom_path.svg        # Write to custom path

The module is designed to be extended with new distributions by instantiating
RandomVariable dataclasses with custom pdf and sample functions.
"""

import matplotlib
matplotlib.use("svg")

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Sequence

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# Color scheme
INK = "#111111"
ACCENT = "#e03131"


@dataclass
class RandomVariable:
    """Specification of a continuous random variable for visualization."""
    name: str                                   # LaTeX body, e.g. r"\mathcal{N}(0,1)"
    pdf: Callable[[np.ndarray], np.ndarray]    # pdf(x: ndarray) -> ndarray of same shape
    sample: Callable[[np.random.Generator, int], np.ndarray]  # sample(rng, n) -> ndarray of n samples
    xlim: tuple[float, float]                  # (x_min, x_max) for the number line and PDF plot
    ticks: Sequence[float] = ()                # Values to mark on the number line
    tick_labels: Sequence[str] | None = None   # Custom labels; if None, format ticks compactly


def _format_tick_label(value: float) -> str:
    """Format a single tick value as a compact label."""
    if value == int(value):
        return f"${int(value)}$"
    else:
        return f"${value}$"


def draw_number_line(ax, rv: RandomVariable, *, ink: str = INK) -> None:
    """
    Draw a number line with arrow, tick marks, and labels.

    Draws at y=0 from xlim[0] to xlim[1], with rightward arrow and tick marks.
    Does NOT set axis_off or ylim; caller is responsible for those.
    """
    x_min, x_max = rv.xlim

    # Draw number line (y=0, spanning xlim)
    ax.plot([x_min, x_max], [0, 0], color=ink, linewidth=1.5, clip_on=False)

    # Draw arrowhead on the right end
    arrow_length = 0.02 * (x_max - x_min)
    arrow = patches.FancyArrowPatch(
        (x_max - arrow_length, 0),
        (x_max, 0),
        arrowstyle="->",
        mutation_scale=15,
        fc=ink,
        ec=ink,
        linewidth=1.5,
        clip_on=False
    )
    ax.add_patch(arrow)

    # Draw tick marks and labels
    tick_values = rv.ticks if rv.ticks else ()
    if rv.tick_labels is not None:
        tick_labels = rv.tick_labels
    else:
        tick_labels = [_format_tick_label(t) for t in tick_values]

    tick_height = 0.08
    for tick_val, tick_label in zip(tick_values, tick_labels):
        # Tick mark
        ax.plot([tick_val, tick_val], [0, tick_height], color=ink, linewidth=1, clip_on=False)
        # Tick label
        ax.text(
            tick_val,
            -0.15,
            tick_label,
            ha="center",
            va="top",
            fontsize=9,
            color=ink,
            clip_on=False
        )


def draw_random_variable(
    ax,
    rv: RandomVariable,
    *,
    show_pdf: bool = True,
    n_samples: int = 300,
    rng: np.random.Generator | None = None,
    dot_alpha: float = 0.12,
    dot_size: float = 5.0,
    jitter: float = 0.0,
    pdf_fill: bool = False,
    ink: str = INK,
    accent: str = ACCENT
) -> None:
    """
    Draw a single random variable panel.

    Draws (top to bottom):
    1. LaTeX title if show_pdf=True
    2. PDF curve floating above the number line (if show_pdf=True)
    3. Number line with samples as red dots with vertical jitter

    Parameters:
        ax: matplotlib Axes to draw on
        rv: RandomVariable dataclass specifying the distribution
        show_pdf: Whether to show the PDF curve and title
        n_samples: Number of samples to draw on the number line
        rng: numpy Generator; if None, creates one with seed=0
        dot_alpha: Alpha (opacity) for sample dots
        dot_size: Size of sample dots (diameter in points for plot markers)
        jitter: Half-height of vertical jitter band in data units
        pdf_fill: Whether to fill under the PDF curve
        ink: Color for axis/text elements
        accent: Color for sample dots
    """
    if rng is None:
        rng = np.random.default_rng(0)

    x_min, x_max = rv.xlim

    # Turn off spines and ticks
    ax.set_axis_off()

    # Set data limits (adjusted for tighter proportions)
    if show_pdf:
        ax.set_xlim(x_min, x_max)
        ax.set_ylim(-0.25, 1.85)
    else:
        ax.set_xlim(x_min, x_max)
        ax.set_ylim(-0.25, 0.3)

    # Draw number line with ticks and labels
    draw_number_line(ax, rv, ink=ink)

    # Draw PDF curve if requested
    if show_pdf:
        # Sample PDF densely
        x_pdf = np.linspace(x_min, x_max, 1000)
        y_pdf = rv.pdf(x_pdf)

        # Find maximum to normalize
        y_max = np.max(np.abs(y_pdf))
        if y_max > 0:
            y_pdf_normalized = y_pdf / y_max
        else:
            y_pdf_normalized = y_pdf

        # Shift PDF so baseline is at 0.4 and peak at 1.4
        y_pdf_plot = 0.4 + y_pdf_normalized

        # Plot PDF curve
        ax.plot(x_pdf, y_pdf_plot, color=ink, linewidth=1.5, clip_on=False)

        # Optionally fill under curve
        if pdf_fill:
            ax.fill_between(x_pdf, 0.4, y_pdf_plot, alpha=0.1, color=ink, clip_on=False)

        # Draw title (moved down from 1.95 to 1.75)
        title_y = 1.75
        ax.text(
            (x_min + x_max) / 2,
            title_y,
            f"${rv.name}$",
            ha="center",
            va="center",
            fontsize=11,
            color=ink,
            clip_on=False
        )

    else:
        # When no PDF, draw title just above the number line
        title_y = 0.12
        ax.text(
            (x_min + x_max) / 2,
            title_y,
            f"${rv.name}$",
            ha="center",
            va="bottom",
            fontsize=11,
            color=ink,
            clip_on=False
        )

    # Draw samples as low-opacity red dots on the number line
    samples = rv.sample(rng, n_samples)
    # Drop out-of-range samples (don't clip them to boundaries)
    mask = (samples >= x_min) & (samples <= x_max)
    samples = samples[mask]

    # Add vertical jitter to prevent saturation/overlap
    y_offsets = rng.uniform(-jitter, jitter, size=len(samples))

    ax.plot(
        samples,
        y_offsets,
        "o",
        color=accent,
        alpha=dot_alpha,
        markersize=dot_size,
        markeredgecolor="none",
        clip_on=False
    )


def _hoist_use_styles(svg_text: str) -> str:
    """
    Hoist identical style attributes from <use> children to parent <g> tags.

    For each <g>...</g> block containing only <use .../> elements with identical
    style attributes, move the style to the <g> tag and remove it from children.
    """
    # Match <g>...</g> blocks where content is only <use .../> elements
    g_pattern = r'<g[^>]*>((?:\s*<use[^>]*/>)+)\s*</g>'

    def process_group(match):
        group_tag = match.group(0)[:match.group(0).find('>') + 1]  # Extract opening <g...>
        group_content = match.group(1)

        # Extract all <use> tags and their styles
        use_pattern = r'<use[^>]*style="([^"]*)"[^>]*/>'
        use_tags = re.findall(r'<use[^>]*/>', group_content)
        use_styles = re.findall(use_pattern, group_content)

        # Check if all styles are identical
        if use_styles and all(s == use_styles[0] for s in use_styles):
            # Hoist the style to <g>
            style_attr = f' style="{use_styles[0]}"'
            g_opening = group_tag.rstrip('>')
            if 'style=' not in g_opening:
                g_opening += style_attr
            g_opening += '>'

            # Remove styles from <use> children
            new_content = re.sub(r'\s*style="[^"]*"', '', group_content)

            return g_opening + new_content + '</g>'

        return match.group(0)

    return re.sub(g_pattern, process_group, svg_text)


def _round_use_coordinates(svg_text: str) -> str:
    """Round x and y coordinates on <use> elements to 2 decimal places."""
    def round_coord(match):
        use_tag = match.group(0)
        use_tag = re.sub(r'x="(\d+\.\d{3,})"', lambda m: f'x="{float(m.group(1)):.2f}"', use_tag)
        use_tag = re.sub(r'y="(\d+\.\d{3,})"', lambda m: f'y="{float(m.group(1)):.2f}"', use_tag)
        return use_tag

    return re.sub(r'<use[^>]*/>', round_coord, svg_text)


def postprocess_svg(out_path: Path) -> None:
    """
    Post-process an SVG file for dark mode support and optimization.

    Performs: color variable substitution, stylesheet injection, metadata stripping,
    style hoisting, and coordinate rounding.
    """
    svg_text = out_path.read_text()

    # Replace color literals with CSS variables
    svg_text = svg_text.replace("#111111", "var(--ink, #111111)")
    svg_text = svg_text.replace("#e03131", "var(--accent, #e03131)")

    # Inject stylesheet after opening <svg> tag
    svg_open_pattern = r"(<svg[^>]*>)"
    stylesheet = """<style>
  svg { color-scheme: light dark; }
  :root { --ink: #111111; --accent: #e03131; }
  @media (prefers-color-scheme: dark) {
    :root { --ink: #e8e6e3; --accent: #ff6b6b; }
  }
</style>"""
    svg_text = re.sub(svg_open_pattern, r"\1" + stylesheet, svg_text, count=1)

    # Strip metadata block
    svg_text = re.sub(r"<metadata>.*?</metadata>", "", svg_text, flags=re.DOTALL)

    # Optimize: hoist identical use element styles to parent <g> tags
    svg_text = _hoist_use_styles(svg_text)

    # Optimize: round coordinate precision on <use> elements to 2 decimal places
    svg_text = _round_use_coordinates(svg_text)

    out_path.write_text(svg_text)


def render(
    rvs: list[RandomVariable],
    out_path: str | Path,
    *,
    show_pdf: bool = True,
    n_samples: int = 300,
    seed: int = 0,
    panel_width: float = 3.5
) -> None:
    """
    Render multiple random variables as side-by-side panels to an SVG file.

    Panels are separated by thin vertical rule lines.

    Parameters:
        rvs: List of RandomVariable objects to render
        out_path: Output file path (SVG)
        show_pdf: Whether to show PDF curves
        n_samples: Number of samples per distribution
        seed: Random seed for reproducibility
        panel_width: Width of each panel in inches
    """
    rng = np.random.default_rng(seed)

    n_panels = len(rvs)
    # Account for panel widths and separator lines
    # Each panel is panel_width wide; separators are thin
    separator_width = 0.1  # inches
    trailing_margin = separator_width  # Reserve space for rightmost arrowhead
    total_width = n_panels * panel_width + (n_panels - 1) * separator_width + trailing_margin

    # Determine figure height based on content
    if show_pdf:
        panel_height = 4.0  # inches
    else:
        panel_height = 1.2  # inches

    fig = plt.figure(figsize=(total_width, panel_height))

    # Set up matplotlib rendering parameters for determinism and typography
    matplotlib.rcParams["svg.hashsalt"] = "random-variable"
    matplotlib.rcParams["svg.fonttype"] = "path"
    matplotlib.rcParams["mathtext.fontset"] = "cm"

    axes = []
    for i in range(n_panels):
        # Position each panel
        left = (i * (panel_width + separator_width)) / total_width
        width = panel_width / total_width

        ax = fig.add_axes([left, 0, width, 1])
        axes.append(ax)

        # Draw the distribution
        draw_random_variable(
            ax,
            rvs[i],
            show_pdf=show_pdf,
            n_samples=n_samples,
            rng=rng,
            ink=INK,
            accent=ACCENT
        )

    # Draw vertical separator lines between panels
    for i in range(n_panels - 1):
        x_sep = ((i + 1) * (panel_width + separator_width) - separator_width / 2) / total_width
        fig.add_artist(
            plt.Line2D(
                [x_sep, x_sep],
                [0, 1],
                transform=fig.transFigure,
                color=INK,
                linewidth=0.5,
                clip_on=False
            )
        )

    # Save to file (dispatch on format)
    out_path = Path(out_path)

    if out_path.suffix.lower() == ".png":
        # Raster output: save as PNG without post-processing
        fig.savefig(out_path, format="png", dpi=200, transparent=True, metadata={"Date": None})
    else:
        # Default to SVG: save and post-process for dark mode support
        fig.savefig(out_path, format="svg", transparent=True, metadata={"Date": None})
        postprocess_svg(out_path)

    plt.close(fig)


def _default_rvs() -> list[RandomVariable]:
    """Create the three default random variables."""
    # U(0,1): Uniform on [0,1]
    def uniform_pdf(x):
        return np.where((x >= 0) & (x <= 1), 1.0, 0.0)

    def uniform_sample(rng, n):
        return rng.uniform(0, 1, n)

    rv_uniform = RandomVariable(
        name=r"U(0,1)",
        pdf=uniform_pdf,
        sample=uniform_sample,
        xlim=(-0.18, 1.18),
        ticks=(0, 1)
    )

    # N(0,1): Standard normal
    def normal_pdf(x):
        return (1.0 / np.sqrt(2 * np.pi)) * np.exp(-x**2 / 2)

    def normal_sample(rng, n):
        return rng.standard_normal(n)

    rv_normal = RandomVariable(
        name=r"\mathcal{N}(0,1)",
        pdf=normal_pdf,
        sample=normal_sample,
        xlim=(-3.6, 3.6),
        ticks=(0,)
    )

    # Exp(1): Exponential with rate 1
    def exp_pdf(x):
        return np.where(x >= 0, np.exp(-x), 0.0)

    def exp_sample(rng, n):
        return rng.exponential(1.0, n)

    rv_exp = RandomVariable(
        name=r"\mathrm{Exp}(1)",
        pdf=exp_pdf,
        sample=exp_sample,
        xlim=(-0.3, 4.2),
        ticks=(0,)
    )

    return [rv_uniform, rv_normal, rv_exp]


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Generate a figure showing probability distributions."
    )
    parser.add_argument(
        "--no-pdf",
        action="store_true",
        help="Omit PDF curves (show only number lines and samples)"
    )
    parser.add_argument(
        "-o", "--out",
        type=str,
        help="Output file path (default: content/images/continuous-rv-pdfs.svg)"
    )
    args = parser.parse_args()

    # Determine output path
    if args.out:
        out_path = args.out
    else:
        # Compute path relative to repo root
        repo_root = Path(__file__).resolve().parent.parent.parent
        out_path = repo_root / "content" / "images" / "continuous-rv-pdfs.svg"

    # Generate and render
    rvs = _default_rvs()
    render(rvs, out_path, show_pdf=not args.no_pdf)
    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
