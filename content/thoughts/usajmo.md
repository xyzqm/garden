---
title: USAJMO
tags:
  - math
---
## 2023 P3

Let's follow where the empty square moves. In every move, it's evident that either the row or the column of the empty square changes by 2. Therefore, the parity of both coordinates is invariant.

We will now proceed to show that for a given position of the empty square, there's only at most one way to move the empty square to that position.

First, we show that each tile can only possibly be in one of two positions.

![[Pasted image 20260306103026.png]]

The red squares are the ones where the hole could possibly be at any time. Therefore, the shown domino will either be in the shown position or shifted by one to the left.

For each tile, we create a node denoting the event that it is shifted from its original position. Then, we draw directed edges representing the dependencies between these events.
![[Pasted image 20260306232040.png]]

One tile has no corresponding node because it's actually impossible to move. 

From here, we can note that there's only at most one way to move the empty square to a given node, which is by following the directed edges starting from that node.