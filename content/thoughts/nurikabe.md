---
title: Nurikabe
---
A [[puzzle]] type.

 You can find lots of nurikabe puzzles [here](https://www.puzzle-nurikabe.com/), as well as a good explanation of the rules [here](https://www.conceptispuzzles.com/index.aspx?uri=puzzle/nurikabe/rules) and common strategies [here](https://www.conceptispuzzles.com/index.aspx?uri=puzzle/nurikabe/techniques).

There's also a very nice automated solver [here](https://github.com/iacgm/nurikabe) that provides justifications for its steps as well.

*Note:* as of writing, there is a bug in this solver that prevents you from making the grid smaller. I've submitted a [pull request](https://github.com/iacgm/nurikabe/pull/1) to fix this, but before that's merged you can just manually copy-paste my change.

Below, I'll run through a sample puzzle and describe the strategies used to solve it.

## Separating islands

![[Pasted image 20260422213445.png|400]]

Here, all shaded cells are necessary in order to separate different islands from one another.

## Forced expansion

There's only one way for the 2 to expand:
![400](https://www.puzzle-nurikabe.com/screenshots/bac0c666027880f040f3c9f6370eebdd69e9a1acde2ad.png)

## Reachability

The two newly shaded cells are not reachable:
![400](https://www.puzzle-nurikabe.com/screenshots/a62488b89fb9d5ec4ec57aeb86a0c74569e9a1f228ee3.png)

Additionally, the new dotted cell must be unshaded, otherwise a whirlpool (2x2) will be formed.

After filling barriers around the 2 and another application of reachability:
![400](https://www.puzzle-nurikabe.com/screenshots/040ce6c958742ef94a12c371c274e88069e9a22a493a6.png)

## Trial

Here, we have a choice: the top-right dotted square can be reached either from the 5 or from the 6. However, if we use the 5, whirlpools are necessarily formed on the left side like so:
![400](https://www.puzzle-nurikabe.com/screenshots/3186d0a83cf3fd982fbc544a6c58d74f69e9a2bd14e97.png)

Therefore, we must use the 6:
![400](https://www.puzzle-nurikabe.com/screenshots/73f708788aeaabb657ae4b08a44271f569e9a2d69ecbb.png)

## Connectivity

![400](https://www.puzzle-nurikabe.com/screenshots/40f73f4e21d6fa56e535373158b05fdc69e9a30ae3460.png)

The newly shaded cell must be filled in, otherwise the shaded cells cannot form a connected component. In particular, there cannot exist any 8-connected cycle of unshaded cells belonging to different islands (or edge-to-edge paths of the same fashion).

From here, the solution is reasonably guessed:
![400](https://www.puzzle-nurikabe.com/screenshots/b2c4f2de8e512d696ec552b4ffcfac6569e9a36f3a82d.png)

There's no shame in guessing Nurikabe puzzles; even the automated solver is unable to solve some of the 7x7 puzzles without guessing!


## Some solves

For writeups, check the backlinks to this page!

![[Screen Recording 2026-05-06 at 8.13.22 PM.mov]]

the core technique in this puzzle is to note that any square not directly adjacent to a 2 can be shaded in ([source](https://puzsq.logicpuzzle.app/puzzle/159765)).

![[Screen Recording 2026-05-06 at 8.17.44 PM.mov]]

[this puzzle](https://puzsq.logicpuzzle.app/puzzle/159955) is quite clever: the core trick is figuring out how to route the 9 in order to avoid a whirlpool.