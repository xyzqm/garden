---
title: Topology
draft: true
---
In this writeup, I hope to give an intuitive introduction to some important topological concepts. The central question we will answer is the following: *why is it impossible to define a function from a circle to the real numbers that is both injective and continuous?*

Recall that "injective" means that different points on the circle must be mapped to different numbers.

To get a sense for why this task is impossible, feel free to try some examples! For instance, if we define the following function where every point on the circle is mapped to its angle in radians:

![[Pasted image 20260707222432.png|400]]

The section highlighted in red is discontinuous because it jumps from $2pi$ to $0$.

> [!note] Exercise
> Note that the injectivity condition is important. What are some simple continuous, non-injective functions from a circle to the real numbers?

> [!tip]- Answer
> One function maps every point on the circle to $0$, but a less trivial function can assign $|2pi - theta|$ to the point at angle $theta$ like so:
> ![[Pasted image 20260707222927.png|300]]

As an aside, you may be used to visualizing $RR -> RR$ functions like this:

![[Pasted image 20260707224939.png|400]]

*A typical illustration of the function $f(x) = x^2$.*

However, when considering functions in topology, it's often more helpful to draw the input and output spaces separately, like so:

![[Pasted image 20260707225532.png]]

*How I prefer to visualize $f(x) = x^2$. You can also illustrate the input and output spaces in more creative ways to highlight certain relationships: for instance, by bending the input line at $0$, we highlight the symmetry between $x$ and $-x$.*

Now, we can move on to give a more proper definition of what it means for a function to be continuous.

## Continuity and open sets

If we have a function $f : M -> N$ and both $M$ and $N$ are [[metric spaces]], we have the following notion of continuity:
> For all $x in M$, if we allow $f(x)$ to vary a little in all directions, $x$ should be allowed to vary a little in all directions as well.

> [!note]- Formal definition: $delta-epsilon$
> For every $x in M$ and $epsilon > 0$, there must exist some $delta > 0$ such that
> $$
> d_M (x, y) < delta => d_N (f(x), f(y)) < epsilon.
> $$

For instance, taking $f(x) = x^2$ and $x = 2$:

![[Pasted image 20260707230341.png|500]]

If we allow $f(x) = 4$ to either increase a little or decrease a little, the input $x = 2$ should be allowed to increase or decrease a little as well.

Now, consider the discontinuous function $f(x) = floor(x)$. 
