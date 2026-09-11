"""
transform_animation.py: Animated SVG showing transformations on a number line.

Supports multiple transformation pipelines:
- X -> scale*X (default): 2-stage animation
- X -> X^2 (--squared): 3-stage animation with |X| intermediate

Usage:
    python scripts/figures/transform_animation.py                # Default x-to-2x.svg
    python scripts/figures/transform_animation.py --scale 3.0    # Custom scale
    python scripts/figures/transform_animation.py -o output.svg  # Custom output
    python scripts/figures/transform_animation.py --squared       # X -> X^2 animation
    python scripts/figures/transform_animation.py --squared -o output.svg
"""

import matplotlib
matplotlib.use("svg")

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Sequence
import numpy as np

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import sys
from pathlib import Path as PathlibPath

# Add repo root to path for imports
_repo_root = PathlibPath(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(_repo_root))

# Import reusable components from random_variable module
from scripts.figures.random_variable import (
    RandomVariable,
    draw_number_line,
    postprocess_svg,
    INK,
    ACCENT,
)


def _text_bbox_data(ax, text_artist) -> tuple[float, float, float, float]:
    """
    Get text bounding box in data coordinates using Agg backend for measurements.

    Returns (x0, y0, x1, y1) where (x0,y0) is bottom-left and (x1,y1) is top-right in data space.
    Uses separate Agg-rendered figure for measurement since SVG backend doesn't have proper renderer.
    """
    from matplotlib.backends.backend_agg import FigureCanvasAgg
    from matplotlib.figure import Figure
    
    # Get text properties
    text_str = text_artist.get_text()
    fontsize = text_artist.get_fontsize()
    ha = text_artist.get_ha()
    va = text_artist.get_va()
    x_pos, y_pos = text_artist.get_position()
    
    # Get current figure's axis limits
    xlim = ax.get_xlim()
    ylim = ax.get_ylim()
    
    # Create temporary figure with Agg backend explicitly
    temp_fig = Figure(figsize=(3.5, 0.9))
    temp_canvas = FigureCanvasAgg(temp_fig)
    temp_ax = temp_fig.add_axes([0, 0, 1, 1])
    temp_ax.set_xlim(xlim)
    temp_ax.set_ylim(ylim)
    
    # Recreate text in temp figure
    temp_text = temp_ax.text(
        x_pos,
        y_pos,
        text_str,
        ha=ha,
        va=va,
        fontsize=fontsize,
    )
    
    # Render and measure
    temp_canvas.draw()
    bbox_pixel = temp_text.get_window_extent(renderer=temp_canvas.get_renderer())
    
    # Convert to data coordinates
    inv = temp_ax.transData.inverted()
    x0_data, y0_data = inv.transform((bbox_pixel.x0, bbox_pixel.y0))
    x1_data, y1_data = inv.transform((bbox_pixel.x1, bbox_pixel.y1))
    
    return x0_data, y0_data, x1_data, y1_data


def _build_timeline(n_stages: int, dur: str, hold_weight: float = 1.0, move_weight: float = 2.0) -> tuple[list[int], str, int]:
    """
    Build ping-pong timeline and animation parameters.

    Ping-pongs through stages 0,1,...,n-1,...,1,0 with holds at each position and
    eased motion between positions.

    Returns:
        (path, calc_string, n_keyframes)
        - path: list of stage indices visited in order
        - calc_string: keyTimes, dur, keySplines, etc. as one string
        - n_keyframes: number of keyframes (length of key_times list)
    """
    path = list(range(n_stages)) + list(range(n_stages - 2, -1, -1))  # e.g. [0,1,2,1,0]
    n_visits = len(path)

    # Weights for holds: half-weight at start/end (since they're the same loop-seam position)
    hold_w = [hold_weight / 2] + [hold_weight] * (n_visits - 2) + [hold_weight / 2]
    total = sum(hold_w) + move_weight * (n_visits - 1)
    unit = 1.0 / total

    key_times = [0.0]
    t = 0.0
    for i in range(n_visits):
        t += hold_w[i] * unit
        key_times.append(t)
        if i < n_visits - 1:
            t += move_weight * unit
            key_times.append(t)

    key_times[-1] = 1.0  # avoid float drift
    key_times_str = ";".join(f"{t:.4g}" for t in key_times)

    # Spline alternation: hold (linear) then move (eased)
    n_segments = len(key_times) - 1
    key_splines = ";".join("0 0 1 1" if i % 2 == 0 else "0.42 0 0.58 1" for i in range(n_segments))

    calc = f'keyTimes="{key_times_str}" dur="{dur}" repeatCount="indefinite" calcMode="spline" keySplines="{key_splines}"'

    return path, calc, len(key_times)


def _extract_g_block(text: str, gid: str) -> tuple[int, int, str, str]:
    """
    Extract a <g id="gid">...</g> block by depth counting.

    Returns (block_start, block_end, open_tag, inner_content) for proper handling of
    nested <g> tags. The open_tag contains any hoisted styles from postprocessing.
    """
    open_match = re.search(rf'<g id="{re.escape(gid)}"[^>]*>', text)
    if open_match is None:
        raise ValueError(f"gid {gid!r} not found")

    depth = 1
    pos = open_match.end()
    for m in re.finditer(r'<g[^>]*>|</g>', text[pos:]):
        depth += 1 if m.group(0) != '</g>' else -1
        if depth == 0:
            inner_end = pos + m.start()
            block_end = pos + m.end()
            return open_match.start(), block_end, open_match.group(0), text[pos:inner_end]
    raise ValueError(f"unbalanced <g> for {gid!r}")


def _splice_animations(svg_text: str, stage_count: int, path: list[int], calc: str) -> str:
    """
    Splice SMIL animation into the SVG for N-stage transformation.

    Merges all N sample layers (samples_0, samples_1, ..., samples_{N-1}) into
    a single animated group, and handles label opacity animations.

    Parameters:
        svg_text: SVG content
        stage_count: Number of stages (N)
        path: Ping-pong path through stages (e.g. [0,1,2,1,0])
        calc: Animation parameters string (keyTimes, dur, keySplines, etc.)
    """
    # Extract all N dot layers
    stage_groups = []
    try:
        for i in range(stage_count):
            gid = f"samples_{i}"
            start, end, open_tag, content = _extract_g_block(svg_text, gid)
            stage_groups.append({
                'index': i,
                'start': start,
                'end': end,
                'open_tag': open_tag,
                'content': content,
                'gid': gid
            })
    except ValueError as e:
        raise ValueError(f"Animation splice failed: {e}")

    # Extract common style from first group's opening tag
    style_match = re.search(r'style="([^"]*)"', stage_groups[0]['open_tag'])

    if not style_match:
        # Fallback: look for nested <g style="..."> or <use style="...">
        nested_match = re.search(r'<g[^>]*\bstyle="([^"]*)"', stage_groups[0]['content'])
        if not nested_match:
            use_style_match = re.search(r'<use[^>]*\bstyle="([^"]*)"', stage_groups[0]['content'])
            if not use_style_match:
                raise ValueError(
                    f"No style found on opening tag or nested elements. "
                    f"First group tag: {stage_groups[0]['open_tag'][:100]}"
                )
            common_style = use_style_match.group(1)
        else:
            common_style = nested_match.group(1)
    else:
        common_style = style_match.group(1)

    # Extract all <use> tags from first group
    use_pattern = r'<use[^>]*/>'
    first_uses = re.findall(use_pattern, stage_groups[0]['content'])
    n_dots = len(first_uses)

    # Verify all groups have same number of <use> tags
    for group in stage_groups[1:]:
        group_uses = re.findall(use_pattern, group['content'])
        if len(group_uses) != n_dots:
            raise ValueError(
                f"Mismatch in dot counts: stage 0 has {n_dots}, {group['gid']} has {len(group_uses)}"
            )

    # Extract <defs> from first group
    defs_match = re.search(r'<defs>.*?</defs>', stage_groups[0]['content'], flags=re.DOTALL)
    defs_block = defs_match.group(0) if defs_match else ''

    # Build merged animated group
    uses = []
    for dot_idx in range(n_dots):
        # Collect x-coordinates for this dot across all stages
        positions = {}
        y_ref = None
        href = None

        for stage_idx, group in enumerate(stage_groups):
            uses_in_stage = re.findall(use_pattern, group['content'])
            use_tag = uses_in_stage[dot_idx]
            attrs = dict(re.findall(r'([\w:-]+)="([^"]*)"', use_tag))

            x_val = attrs.get('x', '0')
            y_val = attrs.get('y', '0')
            positions[stage_idx] = x_val

            # Verify y is consistent across stages
            if y_ref is None:
                y_ref = float(y_val)
            else:
                if abs(float(y_val) - y_ref) > 0.02:
                    raise ValueError(
                        f"Y mismatch for dot {dot_idx}: stage 0 has {y_ref}, stage {stage_idx} has {y_val}"
                    )

            if href is None:
                href = attrs.get('xlink:href', '')

        # Build values string: walk path, duplicate each position (hold)
        values_list = []
        for path_idx in path:
            x_val = positions[path_idx]
            values_list.append(x_val)
            values_list.append(x_val)  # duplicate for hold

        values_str = ";".join(values_list)
        n_values = len(values_list)

        # Verify count matches keyframes (should be 2 * len(path))
        expected_count = 2 * len(path)
        if n_values != expected_count:
            raise ValueError(
                f"Value count mismatch for dot {dot_idx}: got {n_values}, expected {expected_count}"
            )

        uses.append(
            f'<use xlink:href="{href}" x="{positions[0]}" y="{y_ref}">'
            f'<animate attributeName="x" values="{values_str}" {calc}/>'
            f'</use>'
        )

    # Include defs block inside merged group
    merged_group = f'<g style="{common_style}">' + defs_block + ''.join(uses) + '</g>'

    # Replace first stage group with merged group, remove remaining groups
    # Remove groups from end to start (reverse order) to keep earlier positions valid
    new_text = svg_text
    for group in reversed(stage_groups[1:]):  # Only remove stage_groups[1], stage_groups[2], ...
        new_text = new_text[:group['start']] + new_text[group['end']:]

    # Now replace stage 0 with the merged group (positions haven't changed since we removed things after it)
    new_text = new_text[:stage_groups[0]['start']] + merged_group + new_text[stage_groups[0]['end']:]

    # Process label animations - for now, remove old label_from/label_to
    # They'll be replaced by generalized label components using proper nesting
    for gid in ["label_from", "label_to"]:
        try:
            _, end, _, _ = _extract_g_block(new_text, gid)
            start = new_text.rfind(f'<g id="{gid}"')
            if start >= 0:
                new_text = new_text[:start] + new_text[end:]
        except ValueError:
            pass  # Group doesn't exist, that's OK

    return new_text


def _apply_label_animations(svg_text: str, label_components: list[dict], path: list[int], calc: str) -> str:
    """
    Apply opacity animations to label components.

    Parameters:
        svg_text: SVG content
        label_components: List of dicts with keys:
            - gid: group id
            - visible_stages: set of stage indices where visible (None = always visible)
        path: Ping-pong path through stages
        calc: Animation parameters string
    """
    for component in label_components:
        gid = component['gid']
        visible_stages = component.get('visible_stages')

        if visible_stages is None:
            # Always visible - don't animate
            continue

        # Build opacity values: walk path, duplicate (hold)
        opacity_list = []
        for path_idx in path:
            opacity = '1' if path_idx in visible_stages else '0'
            opacity_list.append(opacity)
            opacity_list.append(opacity)  # duplicate for hold

        opacity_str = ";".join(opacity_list)

        # Find and animate this label component
        pattern = rf'(<g id="{re.escape(gid)}"[^>]*>)'
        replacement = rf'\1<animate attributeName="opacity" values="{opacity_str}" {calc}/>'
        svg_text = re.sub(pattern, replacement, svg_text, count=1)

    return svg_text


def render_animation(
    out_path: Path,
    stage_functions: list[Callable[[np.ndarray], np.ndarray]],
    rv: RandomVariable,
    filter_fn: Callable[[np.ndarray], np.ndarray],
    dur: str = "6s",
    label_builder: Callable[[plt.Figure, plt.Axes, RandomVariable], list[dict]] | None = None,
) -> None:
    """
    Render a generalized animated transformation figure.

    Parameters:
        out_path: Output SVG file path
        stage_functions: List of functions to apply at each stage (e.g. [lambda x: x, lambda x: 2*x])
        rv: RandomVariable specifying the distribution
        filter_fn: Function to filter samples (takes sample array, returns boolean mask)
        dur: Animation duration (e.g. "6s", "9s")
        label_builder: Custom function that draws labels and returns component specs
    """
    n_stages = len(stage_functions)

    # Set up matplotlib rendering parameters for determinism
    import matplotlib
    matplotlib.rcParams["svg.hashsalt"] = "transform-animation"
    matplotlib.rcParams["svg.fonttype"] = "path"
    matplotlib.rcParams["mathtext.fontset"] = "cm"

    # Create figure
    fig = plt.figure(figsize=(3.5, 0.9))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_axis_off()
    ax.set_xlim(rv.xlim[0], rv.xlim[1])
    ax.set_ylim(-0.2, 0.25)

    # Draw the number line
    draw_number_line(ax, rv, ink=INK)

    # Generate and filter samples
    rng = np.random.default_rng(seed=0)
    n_samples = 300
    samples = rv.sample(rng, n_samples)

    # Apply filter
    mask = filter_fn(samples)
    samples_filtered = samples[mask]

    # All dots sit on the number line (y=0)
    y_offsets = np.zeros_like(samples_filtered)

    # Draw dot layers for each stage
    for stage_idx, stage_fn in enumerate(stage_functions):
        stage_positions = stage_fn(samples_filtered)

        line = ax.plot(
            stage_positions,
            y_offsets,
            "o",
            color=ACCENT,
            alpha=0.12,
            markersize=5.0,
            markeredgecolor="none",
            clip_on=False
        )
        line[0].set_gid(f"samples_{stage_idx}")

    # Draw labels using custom builder if provided
    if label_builder is not None:
        label_components = label_builder(fig, ax, rv)

    # Save as SVG
    fig.savefig(out_path, format="svg", transparent=True, metadata={"Date": None})
    plt.close(fig)

    # Post-process SVG
    postprocess_svg(out_path)

    # Build animation timeline and splice
    path, calc, n_keyframes = _build_timeline(n_stages, dur)

    svg_text = out_path.read_text()
    svg_text = _splice_animations(svg_text, n_stages, path, calc)

    # Apply label animations
    if label_components:
        svg_text = _apply_label_animations(svg_text, label_components, path, calc)

    out_path.write_text(svg_text)


def _build_labels_scale(fig: plt.Figure, ax: plt.Axes, rv: RandomVariable) -> list[dict]:
    """
    Build labels for X -> 2X animation with measured kerning.

    Returns list of label component dicts for animation.
    """
    x_min, x_max = rv.xlim
    x_center = (x_min + x_max) / 2
    label_y = 0.08

    # Draw "X" - always visible, never animated
    text_X = ax.text(
        x_center,
        label_y,
        "$X$",
        ha="center",
        va="bottom",
        fontsize=11,
        color=INK,
        clip_on=False
    )
    text_X.set_gid("label_x")

    # Measure X's bounding box to position "2" exactly
    x0_X, y0_X, x1_X, y1_X = _text_bbox_data(ax, text_X)

    # Draw "2" to the left of X, with measured kerning (ha="right" at X's left edge)
    text_2 = ax.text(
        x0_X,
        label_y,
        "$2$",
        ha="right",
        va="bottom",
        fontsize=11,
        color=INK,
        clip_on=False
    )
    text_2.set_gid("label_2")

    # Return label component specs
    return [
        {'gid': 'label_x', 'visible_stages': None},  # always visible
        {'gid': 'label_2', 'visible_stages': {1}},    # visible only in stage 1 (2X)
    ]


def render_scale_animation(out_path: Path, scale: float = 2.0) -> None:
    """
    Render X -> scale*X animation.
    """
    def mixture_pdf(x: np.ndarray) -> np.ndarray:
        """PDF for 0.6*N(1.0, 0.28^2) + 0.4*N(2.6, 0.55^2)"""
        mu1, sig1 = 1.0, 0.28
        mu2, sig2 = 2.6, 0.55
        norm_factor = 1.0 / np.sqrt(2 * np.pi)
        pdf1 = 0.6 * norm_factor / sig1 * np.exp(-0.5 * ((x - mu1) / sig1) ** 2)
        pdf2 = 0.4 * norm_factor / sig2 * np.exp(-0.5 * ((x - mu2) / sig2) ** 2)
        return pdf1 + pdf2

    def mixture_sample(rng: np.random.Generator, n: int) -> np.ndarray:
        component = rng.random(n) < 0.6
        samples = np.empty(n)
        samples[component] = rng.normal(1.0, 0.28, component.sum())
        samples[~component] = rng.normal(2.6, 0.55, (~component).sum())
        return samples

    rv = RandomVariable(
        name=r"X",
        pdf=mixture_pdf,
        sample=mixture_sample,
        xlim=(-0.25, 8.2),
        ticks=(0, 1, 2, 3, 4, 5, 6, 7)
    )

    # Filter for scale animation
    x_min, x_max = rv.xlim
    FILTER_MAX = 3.75
    def filter_scale(samples):
        return (samples >= x_min) & (samples <= FILTER_MAX) & (
            (samples * scale >= x_min) & (samples * scale <= FILTER_MAX * scale)
        )

    stage_functions = [lambda x: x, lambda x: scale * x]

    def label_builder(fig, ax, rv):
        return _build_labels_scale(fig, ax, rv)

    render_animation(
        out_path,
        stage_functions=stage_functions,
        rv=rv,
        filter_fn=filter_scale,
        dur="6s",
        label_builder=label_builder
    )


def _build_labels_squared(fig: plt.Figure, ax: plt.Axes, rv: RandomVariable) -> list[dict]:
    """
    Build labels for X -> |X| -> X^2 animation with measured positioning.

    Labels: X (always), | | (stage 1 only), ² (stage 2 only)
    Returns list of label component dicts for animation.
    """
    x_min, x_max = rv.xlim
    x_center = (x_min + x_max) / 2
    label_y = 0.08

    # Draw "X" - always visible, never animated
    text_X = ax.text(
        x_center,
        label_y,
        "$X$",
        ha="center",
        va="bottom",
        fontsize=11,
        color=INK,
        clip_on=False
    )
    text_X.set_gid("label_x")

    # Measure X's bounding box
    x0_X, y0_X, x1_X, y1_X = _text_bbox_data(ax, text_X)

    # Draw left bar "|" - ha="right" at X's left edge
    text_bar_left = ax.text(
        x0_X,
        label_y,
        "$|$",
        ha="right",
        va="bottom",
        fontsize=11,
        color=INK,
        clip_on=False
    )
    text_bar_left.set_gid("label_bar_left")

    # Draw right bar "|" - ha="left" at X's right edge
    text_bar_right = ax.text(
        x1_X,
        label_y,
        "$|$",
        ha="left",
        va="bottom",
        fontsize=11,
        color=INK,
        clip_on=False
    )
    text_bar_right.set_gid("label_bar_right")

    # Draw superscript "²" - positioned at X's right edge and raised by ~45-50% of cap height
    # Correct placement: baseline raised above X's baseline (not X's top)
    cap_height = y1_X - label_y
    superscript_y = label_y + 0.475 * cap_height
    text_squared = ax.text(
        x1_X,
        superscript_y,
        "$^{2}$",
        ha="left",
        va="bottom",
        fontsize=7.5,
        color=INK,
        clip_on=False
    )
    text_squared.set_gid("label_squared")

    return [
        {'gid': 'label_x', 'visible_stages': None},        # always visible
        {'gid': 'label_bar_left', 'visible_stages': {1}},   # visible in fold stage
        {'gid': 'label_bar_right', 'visible_stages': {1}},  # visible in fold stage
        {'gid': 'label_squared', 'visible_stages': {2}},    # visible in squared stage
    ]


def render_squared_animation(out_path: Path) -> None:
    """
    Render X -> |X| -> X^2 animation.
    """
    def mixture_pdf(x: np.ndarray) -> np.ndarray:
        """PDF for 0.6*N(-1.5, 0.3^2) + 0.4*N(0.7, 0.35^2)"""
        mu1, sig1 = -1.5, 0.3
        mu2, sig2 = 0.7, 0.35
        norm_factor = 1.0 / np.sqrt(2 * np.pi)
        pdf1 = 0.6 * norm_factor / sig1 * np.exp(-0.5 * ((x - mu1) / sig1) ** 2)
        pdf2 = 0.4 * norm_factor / sig2 * np.exp(-0.5 * ((x - mu2) / sig2) ** 2)
        return pdf1 + pdf2

    def mixture_sample(rng: np.random.Generator, n: int) -> np.ndarray:
        component = rng.random(n) < 0.6
        samples = np.empty(n)
        samples[component] = rng.normal(-1.5, 0.3, component.sum())
        samples[~component] = rng.normal(0.7, 0.35, (~component).sum())
        return samples

    rv = RandomVariable(
        name=r"X",
        pdf=mixture_pdf,
        sample=mixture_sample,
        xlim=(-2.5, 5.0),
        ticks=tuple(range(-2, 5))  # -2 through 4
    )

    # Simple absolute filter for squared animation
    def filter_squared(samples):
        return np.abs(samples) <= 2.2

    stage_functions = [lambda x: x, lambda x: np.abs(x), lambda x: x**2]

    def label_builder(fig, ax, rv):
        return _build_labels_squared(fig, ax, rv)

    render_animation(
        out_path,
        stage_functions=stage_functions,
        rv=rv,
        filter_fn=filter_squared,
        dur="9s",
        label_builder=label_builder
    )


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Generate animated SVG showing variable transformations."
    )
    parser.add_argument(
        "-o", "--out",
        type=str,
        help="Output file path (default depends on mode)"
    )
    parser.add_argument(
        "--scale",
        type=float,
        default=2.0,
        help="Scale factor for X -> scale*X mode (default: 2.0)"
    )
    parser.add_argument(
        "--squared",
        action="store_true",
        help="Generate X -> X^2 animation instead of default X -> scale*X"
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent.parent

    if args.squared:
        if args.out:
            out_path = Path(args.out)
        else:
            out_path = repo_root / "content" / "images" / "x-to-x-squared.svg"
        render_squared_animation(out_path)
    else:
        if args.out:
            out_path = Path(args.out)
        else:
            out_path = repo_root / "content" / "images" / "x-to-2x.svg"
        render_scale_animation(out_path, scale=args.scale)

    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
