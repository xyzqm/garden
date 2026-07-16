---
title: Topology
draft: false
---
In this writeup, I hope to give an intuitive introduction to some important topological concepts. The central question we will answer is the following: *what differentiates a circle from a line?* 

We will discover that this problem reduces to the following: *why is it impossible to define a continuous, bijective function from a circle to a line?*

Recall that "bijective" essentially means that we must "pair up" points on the circle and line such that each point belongs to exactly one pair.

To get a sense for why this task is impossible, feel free to try some examples! For instance, if we define the following function between the circle and the interval $[0, 2pi)$ where every point on the circle is mapped to its angle in radians:

![[Pasted image 20260707222432.png|400]]

The section highlighted in red is discontinuous because it jumps from $2pi$ to $0$ i.e. it jumps from the tail of the line to its head.

> [!note] Exercise
> Note that the bijective condition is important. What are some simple continuous, non-bijective functions from a circle to a line?

> [!tip]- Answer
> One function maps every point on the circle to $0$, but a less trivial function can assign $|2pi - theta|$ to the point at angle $theta$ like so:
> ![[Pasted image 20260707222927.png|300]]

You'll see that the problem essentially becomes the following:
> How can I prove that it's impossible to "continuously deform" a circle into a line?

We'll make this notion of continuous deformation rigorous later with the idea of a **homeomorphism,** but we need to define continuity first!

---

As an aside, you may be used to visualizing $RR -> RR$ functions like this:

![[Pasted image 20260707224939.png|400]]

*A typical illustration of the function $f(x) = x^2$.*

However, when considering functions in topology, it's often more helpful to draw the input and output spaces separately, like so:

![[Pasted image 20260707225532.png]]

*How I prefer to visualize $f(x) = x^2$. You can also illustrate the input and output spaces in more creative ways to highlight certain relationships: for instance, by bending the input line at $0$, we highlight the symmetry between $x$ and $-x$.*

Now, we can move on to give a more proper definition of what it means for a function to be continuous.

## Continuity and open sets

If we have a continuous function $f : M -> N$ and both $M$ and $N$ are [[metric spaces]], we have the following notion of continuity:
> For all $x in M$, if we allow $f(x)$ to vary a little in all directions, $x$ should be allowed to vary a little in all directions as well.

> [!info]- Formal definition: $delta-epsilon$
> For every $x in M$ and $epsilon > 0$, there must exist some $delta > 0$ such that
> $$
> d_M (x, y) < delta => d_N (f(x), f(y)) < epsilon.
> $$

^epsilon-delta

For instance, taking $f(x) = x^2$ and $x = 2$:

![[Pasted image 20260707230341.png|500]]

If we allow $f(x) = 4$ to either increase a little or decrease a little, the input $x = 2$ should be allowed to increase or decrease a little as well.

Now, consider the discontinuous function $f(x) = floor(x)$. 
![[Pasted image 20260709213741.png|500]]

For the input-output pair $(0, 0)$, varying the output around $0$ only allows the input to vary around $0$ **in one direction**. Therefore, the floor function is discontinuous.

We now introduce the notion of an **open set** as a set of points such that each point within the set can vary a little in all directions while still staying in the set. For instance, the interval $(0, 1)$ on the real line is an open set, but $[0, 1)$ and $[0, 1]$ are not.

> [!info]- Formal definition: open set
> An open set $S$ is a set such that for all $x in S$, there exists some $epsilon > 0$ such that
> $$
> d(x, y) < epsilon => y in S.
> $$

Then, we can rewrite our continuity condition as the following:
> If $f : M -> N$ is continuous, the pre-image of any open set in $N$ under $f$ must be an open set in $M$.

Recall that the *pre-image* of a set $S$ in the output space is the set of input points that map to some element in $S$. For instance, taking $f(x) = x^2$, the pre-image of $(0, 1) union (4, 9)$ is $(-3, -2) union (-1, 0) union (0, 1) union (2, 3)$. Both sets are open, so this satisfies our continuity condition.

A fun way I like to think about this condition:
> If we specify an output space where every point has some "room to breathe", every point in the input space must have some "room to breathe" as well.

> [!note] Exercise
> Prove that this is equivalent to the [[#^epsilon-delta|epsilon-delta]] definition of continuity.

> [!note] Exercise
> Why can't we instead define a continuous function as a function that maps open sets to open sets? To see why not, find a function (or multiple) that is really continuous, but wouldn't be under this modified definition.
>
> For some more fun, also find a function that is continuous under this definition but really isn't. You may have to get a bit creative with choosing input and output spaces!

## Discarding the metric

Importantly, note that our new definition of continuity depends only on the *open sets* in each metric space, not the underlying distances. Therefore, instead of defining a topological space as $(X, d)$, we define it as $(X, tau)$, where $tau$ is the set of open sets on $X$. Note that $emptyset$ and $X$ must both be open by definition. Additionally, we can show that open sets must satisfy two additional properties:
1. The union of several (potentially infinite) open sets is still an open set.
2. The intersection of **finitely many** open sets is also an open set.

> [!note] Exercise
> Can you find an infinite collection of open sets on $RR$ whose intersection is ${0}$, and therefore not an open set?

A fun topological space to think about is the *discrete space*, in which every subset of $X$ is an open set.

> [!note] Exercise
> Can you construct a metric consistent with this topological space?

## Homeomorphisms

With this definition of topological spaces, we can now speak about one of the most important concepts in topology: **homeomorphisms.** An intuitive definition of homeomorphism:
> Two topological spaces are homeomorphic if they can be "continuously deformed" into one another.

Some classic examples: a circle is homeomorphic to a square, the real line is homeomorphic to $(0, 1)$, and a coffee mug is homeomorphic to a donut. Here's a fun visual from Wikipedia:
![500](https://upload.wikimedia.org/wikipedia/commons/2/26/Mug_and_Torus_morph.gif)

More rigorously:
> Two topological spaces $X$ and $Y$ are homeomorphic if there exists a continuous bijection between them.

> [!note] Exercise
> Using this definition, how can we show that the real line is homeomorphic to $(0, 1)$?

Finally, using our open set definition of continuity, we can say:
> Two topological spaces are homeomorphic iff there exists a **bijection** between their open sets.

## Compactness

**Compactness** is a way to capture some aspects of finiteness when dealing with continuous spaces. For instance, a finite set of real numbers always has a maximum; this is not true for an infinite set. Similarly, a continuous function from a compact space to $RR$ always has a maximum; this is not true in general.

A prototypical example of this is the fact that $[0, 1]$ is compact, while $(0, 1)$ is not.

> [!note] Exercise
> Find a function on $(0, 1)$ that has no maximum.

