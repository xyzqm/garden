---
title: LS 1
---
A [[light and shadow]] puzzle.

[Here](https://puzsq.logicpuzzle.app/puzzle/169718) is the initial board state:

![[lightshadow.png]]

We can first separate regions of the same color, then extend regions as necessary:
![[Pasted image 20260602112824.png|500]]

Note that the rightmost black 5 can extend downward at most one cell and thus must extend at least twice to the right, which in turn forces the white region above:

![[PNG image 8.png|500]]

Now, here comes the most crucial step. After making the red and blue expansions shown in the image below, we must decide how to route the circled white cell. Note that if we route it up (green path), it suffocates the green 5 region. Therefore, it must be routed to the right, which gives the yellow 5 region barely enough space.

![[PNG image 9.png]]

After several expansions, we arrive here:
![[Pasted image 20260602125927.png|500]]

Now, note that the leftmost black ? must come out to the right, otherwise the solution would not be unique:
![[Pasted image 20260602130159.png|500]]

We now must decide how to route the circled black cell. This time, it can't go up along the red path, so it must come down along the blue path:

![[PNG image 10.png]]

From here, completing the puzzle is easy!

![[Pasted image 20260602130457.png]]