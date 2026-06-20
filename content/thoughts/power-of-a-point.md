---
title: Power of a point
---
Here's a simple proof:
Let $arrow(alpha)$ be a unit vector denoting the direction of our chord, and $arrow(P)$ be our position. Then, the desired lengths are the _signed_ values of $t$ such that $||P + t alpha|| = r$. Expanding, we get that
$$
P^2 + 2 t (P dot alpha) + t^2 = r^2
$$
By Vieta's, the products of the roots of this equation are just $P^2 -  r^2$, which, importantly, is independent of $alpha$. This quite elegantly proves Power of a Point without needing to resort to casework.
